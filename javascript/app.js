function setCookie(cname,cvalue,exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
var user ;
function checkCookie() {
    user = getCookie("username");
    if (user == 'admin') {
        $('#add_csv').show()
        $('#add_kml').show()
        $('#report').show()
        document.getElementById("search").classList.remove("show");
        document.getElementById("login-panel").classList.remove("show");
        document.getElementById('login-btn').innerHTML = '<button class="btn btn-block btn-primary mb-1" data-toggle="collapse" onclick="logout()">ออกจากระบบ</button>'
    }else{
        $('#add_csv').hide()
        $('#add_kml').hide()
        $('#report').hide()
        $('#search').addClass('show')
        document.getElementById('login-btn').innerHTML = '<button class="btn btn-block btn-primary mb-1" data-toggle="collapse" data-target="#login-panel">เข้าสู่ระบบ</button>'
    }
}
function login(){
    let username =  document.getElementById('username').value
    let password =  document.getElementById('password').value
      $.ajax({
          type: "POST",
          url: "service/login.php",
          data: {
              username: username,
              password:password
          },
          success: function(data){
              if (!data) {
                  Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                    })
              }else{
                  setCookie("username", username, 1);
                  checkCookie()
                  get_layers()
                  Swal.fire(
                      'Login!',
                      'success'
                    )
              }
          }
      });  
  }
function logout(){
    Swal.fire(
        'Log out!',
        'success'
    )
    setCookie("username", '', 999);
    checkCookie()
    get_layers()
}

var layer_kml = [] , pin_data = [] ;
var map = L.map('map', {
    attributionControl: false,
    zoomControl: false
}).setView([15.013713, 102.624093], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})
var CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 25
});

var lon_lng_current;
map.locate()
.on('locationfound', function(e){
    lon_lng_current = [e.latitude, e.longitude]
})
.on('locationerror', function(e){
});

L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', { maxZoom: 19, attribution: 'Google Hybrid' }).addTo(map);

var blue_icon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
var red_icon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.control.zoom({
    position: 'topright'
}).addTo(map);

var preview_layer = [],marker_layer = []
for (let i = 0; i < 100; i++) {
    preview_layer[i] = L.layerGroup()
    marker_layer[i] = L.markerClusterGroup().addTo(map)
}


markerClusterGroup = L.markerClusterGroup().addTo(map)

var geojson_kml,name_layer,name_layer_csv;

get_layers()
read_csv_file()


function view_kml(){
    var reader = new FileReader();
    reader.onload = function (e) {
        var xmlDoc = $.parseXML(e.target.result);
        geojson_kml = toGeoJSON.kml(xmlDoc);
        let map_geojson = L.geoJson(geojson_kml).addTo(preview_layer[99]).addTo(map)
        map.fitBounds(map_geojson.getBounds())
    }
    name_layer = $("#fileUpload")[0].files[0].name;
    reader.readAsText($("#fileUpload")[0].files[0]);
}

$("#upload_kml").bind("click", function () {
    Swal.fire({
        title: 'ยืนยันการบันทึกข้อมูลเข้าฐานข้อมูล',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        denyButtonText: `ไม่บันทึก`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          add_data_kml(geojson_kml.features)
          Swal.fire('Saved!', '', 'success')
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      })

    function add_data_kml(geojson){
        $.ajax({
            type: "POST",
            url: "service/insert_kml.php",
            data: {
                type: 'add_layer',
                name_layer: name_layer
            },
            success: function(msg){
                get_layers()
                preview_layer[99].clearLayers();
                let layer_id = msg[0].id
                let no = 1;
                geojson.forEach(e => {
                    $.ajax({
                        type: "POST",
                        url: "service/insert_kml.php",
                        data: {
                            type: 'add_geojson',
                            layer_id : layer_id,
                            properties: JSON.stringify(e.properties), 
                            geom: JSON.stringify(e.geometry)
                        },
                        success: function(msg){
                            document.getElementById('count_kml').innerHTML = 'กำลังอัพโหลดข้อมูล : ' + no + ' แปลง <br> <small> ห้ามปิดหน้าจอขณะอัพโหลดยังไม่นิ่ง </small> '    
                            no++
                        }
                    });
                });
            }
        });
    }
});

var collection_point
function read_csv_file(){
    result = [];
    var fileInput = document.getElementById("csv"),
        readFile = function () {
            name_layer_csv = $("#csv")[0].files[0].name;
            var reader = new FileReader();
            reader.onload = function () {
                var fixedstring = decodeURIComponent(escape(reader.result));
                var lines = fixedstring.toString().split("\n");
                var headers = lines[0].split(/\r?\t/);
                for (var i = 1; i < lines.length; i++) {
                    var obj = {};
                    var currentline = lines[i].split("\t");
                    for (var j = 0; j < headers.length; j++) {
                        obj[headers[j]] = currentline[j];
                    }
                    result.push(obj);
                }
                var points = []
                result.forEach(e => {
                    if (e.latitude != null && e.longitude  != '') {
                        var lat = e.latitude
                        var lng = e.longitude
                        var point = turf.point([lng, lat]);
                        point.properties = e
                        points.push(point)
                        L.marker([lat, lng], { icon: red_icon })
                        .bindPopup(`<div class="row">
                        <div class="col-4">
                            <img style='width:150px' src='img/`+ e.jpg1 + `'>
                            <img style='width:150px' src='img/`+ e.jpg2 + `'>
                            <img style='width:150px' src='img/`+ e.jpg3 + `'>
                            <img style='width:150px' src='img/`+ e.jpg4 + `'>
                        </div>
                        <div class="col-8">
                            <table class="table table-bordered">
                            <thead>
                            <tr>
                                <th colspan="2">ข้อมูลเจ้าของอาคาร / ผู้ครอบครองอาคาร</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td width="8%">1.</td>
                                <td>
                                    ชื่อเจ้าของอาคาร / ผู้ครอบครอง ..`+ e.owner_buil + `.. <br>
                                    อยู่บ้านเลขที่ ..`+ e.address + `.. ถนน ..`+ e.road + `.. ตำบล .`+ e.dis_1 + ` 
                                    อำเภอ ..`+ e.dis_2 + `.. จังหวัด ...`+ e.province + `..
                                </td>
                            </tr>
                            <tr>
                                <th colspan="2">ข้อมูลการได้รับอนุญาต</th>
                            </tr>
                            <tr>
                                <td>2.</td>
                                <td>
                                    -ได้รับใบอนุญาตก่อสร้างอาคาร / ดัดแปลงอาคาร / เคลื่อนย้าย
                                    อาคาร เลขที่ ..`+ e.number + `/`+ e.no + `.. ออกให้ ณ วันที่ ..`+ e.date + `..
                                    ชนิดอาคาร ..`+ e.building + `.. จำนวน .`+ e.cont + `. เพื่อใช้เป็น .`+ e.use + `
                                    - ภาพใบอนุญาตฯ
                                </td>
                            </tr>
                            <tr>
                                <th colspan="2">ข้อมูลการได้ใบรับรองการตรวจสอบอาคาร ตามมาตรา 32 ทวิ</th>
                            </tr>
                            <tr>
                                <td>3.</td>
                                <td>
                                    -ได้รับใบรับรองการตรวจสอบอาคาร (แบบ ร1) ประจำปี ..`+ e.annual + `..
                                    เลขที่ ...`+ e.let_number + `/ `+ e.let_no + `.. ออกให้ ณ วันที่ ..`+ e.let_date + `...
                                    ชนิดอาคาร ..`+ e.let_building + `.. จำนวน ..`+ e.let_cont + `.. เพื่อใช้เป็น ..`+ e.let_use + `..
                                    - ภาพใบรับรองการตรวจสอบอาคาร (แบบ ร1)
                                </td>
                            </tr>
                            </tbody>
                        </table>
                                    
                                    <a type='button' class='btn btn-block btn-success btn-xs text-white' href='http://maps.google.com/maps?q=&layer=c&cbll=` + lat +`,`+ lng +`' target='_blank'> Street View </a>
                                    <a type='button' class='btn btn-block btn-success btn-xs text-white' href='https://www.google.co.th/maps/dir/` + lat +`,`+ lng +`/`+lon_lng_current[0]+`,`+lon_lng_current[1]+`' target='_blank'> ค้นหาเส้นทาง </a>
                                    <a type='button' class='btn btn-block btn-success btn-xs text-white' onclick="window.print()"> พิมพ์ </a>
                        </div>
                    </div> `
                        ,{
                        maxWidth: 560
                      } )
                            .addTo(markerClusterGroup)
                    }
                });
                collection_point = turf.featureCollection(points);
                var setview = L.geoJson(collection_point)
                 map.fitBounds(setview.getBounds())
            };
            reader.readAsBinaryString(fileInput.files[0]);
        };
    fileInput.addEventListener('change', readFile);
}

function save_csv_data() {
    if (collection_point != undefined) {
    Swal.fire({
        title: 'ยืนยันการบันทึกข้อมูลเข้าฐานข้อมูล',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        denyButtonText: `ไม่บันทึก`,
        }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            add_data_csv(collection_point.features)
            Swal.fire('Saved!', '', 'success')
        } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info')
        }
        })
    }
    function add_data_csv(geojson){
        $.ajax({
            type: "POST",
            url: "service/insert_csv.php",
            data: {
                type: 'add_layer',
                name_layer: name_layer_csv
            },
            success: function(msg){
                markerClusterGroup.clearLayers();
                let layer_id = msg[0].id
                let no = 1;
                geojson.forEach(e => {
                    e.properties.layer_id = layer_id
                    e.properties.geom = JSON.stringify(e.geometry)
                    e.properties.type =  'add_geojson'
                    $.ajax({
                        type: "POST",
                        url: "service/insert_csv.php",
                        data: e.properties,
                        success: function(msg){
                            document.getElementById('count_csv').innerHTML = 'กำลังอัพโหลดข้อมูล : ' + no + ' แปลง <br> <small> ห้ามปิดหน้าจอขณะอัพโหลดยังไม่นิ่ง </small> '    
                            no++
                        }
                    });
                });
            }
        });
    }
}

$("#form_query").submit(function (event) {
    event.preventDefault();
})

function search_pin(){
    let owner =  document.getElementById('owner').value
    let place =  document.getElementById('place').value
    let road =  document.getElementById('road').value
    let collection = []
    if (owner != '' || place != '' || road != '') {
        layer_kml.forEach(e => {
            e.eachLayer(function (layer) {
                l = layer.feature.properties
                if (l.owner_buil != undefined) {
                    if (l.owner_buil.match(owner) && l.let_use.match(place) && l.province.match(road)) {
                        setTimeout(() => {
                            layer.openPopup();
                        }, 500);
                        collection.push(layer.feature)
                    }
                }
            });
        });
        var collections = turf.featureCollection(collection);
       let view_search = L.geoJson(collections)
       map.fitBounds(view_search.getBounds())
       hide_show_menu('hide')
    }
}

function search_bar(){
    let owner_navbar =  document.getElementById('owner_navbar').value
    let collection = []
    layer_kml.forEach(e => {
        e.eachLayer(function (layer) {
            l = layer.feature.properties
            if (l.owner_buil != undefined) {
                if (l.owner_buil.match(owner_navbar)) {
                    setTimeout(() => {
                        layer.openPopup();
                    }, 500);
                    collection.push(layer.feature)
                }
            }
        });
    });
    var collections = turf.featureCollection(collection);
   let view_search = L.geoJson(collections)
   map.fitBounds(view_search.getBounds())
   hide_show_menu('hide')
}

function hide_show_menu(type){
    if (type == 'hide') {
        $('#menu_bar').hide()
        document.getElementById("sidenav").classList.add("sidenav_hide");
        document.getElementById("sidenav").classList.remove("sidenav");
        document.getElementById("btn-close").innerHTML = '<button class="close-button"  onclick="hide_show_menu(`show`)" id="close"><i class="fa fa-chevron-right" aria-hidden="true"></i></button>'
        document.getElementById("close").classList.add("close-button_hide");
        document.getElementById("close").classList.remove("close-button");
    }else{
        $('#menu_bar').show()
        document.getElementById("sidenav").classList.remove("sidenav_hide");
        document.getElementById("sidenav").classList.add("sidenav");
        document.getElementById("btn-close").innerHTML = '<button class="close-button"  onclick="hide_show_menu(`hide`)" id="close"><i class="fa fa-chevron-left" aria-hidden="true"></i></button>'
        document.getElementById("close").classList.remove("close-button_hide");
        document.getElementById("close").classList.add("close-button");
    }
}

function get_layers(){
    document.getElementById('layers').innerHTML = ''
    for (let i = 0; i < 100; i++) {
        preview_layer[i].clearLayers()
        marker_layer[i].clearLayers()
    }
    let check_user = getCookie("username");
    if (check_user == 'admin') {
        check_user = ''
    }else{
        check_user = 'display-none'
    }
    $.ajax({
        type: "POST",
        url: "service/get_layers.php",
        data: {
            type: 'all_layers'
        },
        success: function(data){
            if (data != false) {
                data.forEach((e , i) => {
                    if (e.type_data == 'kml') {
                        $.ajax({
                            type: "POST",
                            url: "service/get_geojson.php",
                            data: {
                                type: 'get_geojson_by_kml',
                                layer_id: e.id
                            },
                            success: function(data){
                                preview_layer[i].clearLayers()
                                document.getElementById('layers').innerHTML += `<div class="panel panel-default">
                                <div class="panel-heading">
                                  <label>
                                  <input type="checkbox" id="layer_`+i+`" data-toggle="collapse" checked  onclick="show_hide_layer(`+i+`)"> `
                                    +e.name_layer+ 
                                  `</label>
                                </div>
                                <div class="panel-collapse  text-center">
                                  <div class="btn-group special">
                                      <button type="button" class="btn btn-primary btn-xs" onclick="zoom_to_layer(`+i+`)">
                                      <i class="fa fa-search" aria-hidden="true"></i> Zoom</button>
                                      <button type="button" class="btn btn-warning btn-xs `+check_user+`"   data-toggle="collapse" data-target="#edit_`+i+`"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Edit</button>
                                      <button type="button" class="btn btn-danger btn-xs `+check_user+`" onclick="delete_layer(`+e.id+` , `+i+`)"><i class="fa fa-trash" aria-hidden="true"></i> Delete</button>
                                    </div>
                                    <div id="edit_`+i+`" class="collapse p-4">
                                        <input type="color" id="color_`+e.id+`"
                                            value="#e66465">
                                        <label for="color_`+e.id+`"> สีพื้นหลัง</label>
                                        <br>
                                        <input type="color" id="stroke_`+e.id+`" 
                                            value="#e66465">
                                        <label for="stroke_`+e.id+`"> เส้นขอบ</label>
                                        <br>
                                        <input type="range" id="opacity_`+e.id+`"
                                                min="0" max="10">
                                        <label for="opacity_`+e.id+`">ความโปร่งแสง</label>
                                        <br>
                                        <button class="btn btn-success btn-xs" onclick="save_style(`+e.id+`)">save</button>
                                    </div>
                                </div>
                              </div>`
                            
                                style = data.features[0].properties.style
                                layer_kml[i] = L.geoJson(data,
                                    {
                                        style: style,
                                        onEachFeature: onEachFeature
                                    }
                                    ).addTo(preview_layer[i]).addTo(map)
                                map.fitBounds(layer_kml[i].getBounds())
                            }
                        })
                        
                        function onEachFeature(feature, layer) {
                            e = feature.properties;
                                if (e.data_properties != null && e.data_properties.Parcel != undefined) {
                                    L.marker(layer.getBounds().getCenter(), {
                                      icon: L.divIcon({
                                        className: 'label',
                                        html: e.data_properties.Parcel,
                                        iconSize: [100, 40]
                                      })
                                    }).addTo(preview_layer[i]).addTo(map)

                                    layer.bindPopup(`<table class='table'>
                                            <tr>
                                                <td>เลขที่ดิน</td>
                                                <td>`+ e.data_properties.Parcel+ `</td>
                                            </tr>
                                            <tr>
                                                <td>ระวาง</td>\
                                                <td>`+ e.data_properties.ระวาง + `</td>
                                            </tr>
                                        </table>`
                                    ,{
                                    maxWidth: 560
                                  } )
                                }
                        }
                    }else{
                        $.ajax({
                            type: "POST",
                            url: "service/get_geojson.php",
                            data: {
                                type: 'get_geojson_by_csv',
                                layer_id: e.id
                            },
                            success: function(data){
                                pin_data.push(data)
                                preview_layer[i].clearLayers()
                                document.getElementById('layers').innerHTML += `<div class="panel panel-default">
                                <div class="panel-heading">
                                  <label>
                                  <input type="checkbox" id="layer_`+i+`" data-toggle="collapse" checked  onclick="show_hide_layer(`+i+`)"> `
                                    +e.name_layer+ 
                                  `</label>
                                </div>
                                <div class="panel-collapse  text-center">
                                  <div class="btn-group special">
                                      <button type="button" class="btn btn-primary btn-xs" onclick="zoom_to_layer(`+i+`)">
                                      <i class="fa fa-search" aria-hidden="true"></i> Zoom</button>
                                      <button type="button" class="btn btn-danger btn-xs `+check_user+`" onclick="delete_layer(`+e.id+` , `+i+`)"><i class="fa fa-trash" aria-hidden="true"></i> Delete</button>
                                    </div>
                                </div>
                              </div>`
                            
                                layer_kml[i] = L.geoJson(data,{
                                    pointToLayer: function (f, latlng) {
                                        return L.marker(latlng, {
                                            icon: blue_icon
                                        });
                                    },
                                    onEachFeature: onEachFeature
                                }).addTo(marker_layer[i])
                                function onEachFeature(e, layer) {
                                    e = e.properties
                                    var lat = e.latitude
                                    var lng = e.longitude
                                    layer.bindPopup(`<div class="row">
                                        <div class="col-4">
                                            <img style='width:150px' src='img/`+ e.jpg1 + `'>
                                            <img style='width:150px' src='img/`+ e.jpg2 + `'>
                                            <img style='width:150px' src='img/`+ e.jpg3 + `'>
                                            <img style='width:150px' src='img/`+ e.jpg4 + `'>
                                        </div>
                                        <div class="col-8">
                                            <table class="table table-bordered">
                                            <thead>
                                            <tr>
                                                <th colspan="2">ข้อมูลเจ้าของอาคาร / ผู้ครอบครองอาคาร</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td width="8%">1.</td>
                                                <td>
                                                    ชื่อเจ้าของอาคาร / ผู้ครอบครอง ..`+ e.owner_buil + `.. <br>
                                                    อยู่บ้านเลขที่ ..`+ e.address + `.. ถนน ..`+ e.road + `.. ตำบล .`+ e.dis_1 + ` 
                                                    อำเภอ ..`+ e.dis_2 + `.. จังหวัด ...`+ e.province + `..
                                                </td>
                                            </tr>
                                            <tr>
                                                <th colspan="2">ข้อมูลการได้รับอนุญาต</th>
                                            </tr>
                                            <tr>
                                                <td>2.</td>
                                                <td>
                                                    -ได้รับใบอนุญาตก่อสร้างอาคาร / ดัดแปลงอาคาร / เคลื่อนย้าย
                                                    อาคาร เลขที่ ..`+ e.number + `/`+ e.no + `.. ออกให้ ณ วันที่ ..`+ e.date + `..
                                                    ชนิดอาคาร ..`+ e.building + `.. จำนวน .`+ e.cont + `. เพื่อใช้เป็น .`+ e.use + `
                                                    - ภาพใบอนุญาตฯ
                                                </td>
                                            </tr>
                                            <tr>
                                                <th colspan="2">ข้อมูลการได้ใบรับรองการตรวจสอบอาคาร ตามมาตรา 32 ทวิ</th>
                                            </tr>
                                            <tr>
                                                <td>3.</td>
                                                <td>
                                                    -ได้รับใบรับรองการตรวจสอบอาคาร (แบบ ร1) ประจำปี ..`+ e.annual + `..
                                                    เลขที่ ...`+ e.let_number + `/ `+ e.let_no + `.. ออกให้ ณ วันที่ ..`+ e.let_date + `...
                                                    ชนิดอาคาร ..`+ e.let_building + `.. จำนวน ..`+ e.let_cont + `.. เพื่อใช้เป็น ..`+ e.let_use + `..
                                                    - ภาพใบรับรองการตรวจสอบอาคาร (แบบ ร1)
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                                    
                                                    <a type='button' class='btn btn-block btn-success btn-xs text-white' href='http://maps.google.com/maps?q=&layer=c&cbll=` + lat +`,`+ lng +`' target='_blank'> Street View </a>
                                                    <a type='button' class='btn btn-block btn-success btn-xs text-white' href='https://www.google.co.th/maps/dir/` + lat +`,`+ lng +`/`+lon_lng_current[0]+`,`+lon_lng_current[1]+`' target='_blank'> ค้นหาเส้นทาง </a>
                                                    <a type='button' class='btn btn-block btn-success btn-xs text-white' onclick="view_report(`+ e.gid + `)"> พิมพ์ </a>
                                        </div>
                                    </div> `
                                        ,{
                                        maxWidth: 560
                                    } );
                                }
                            }
                        })
                    }
                });
            }
        }
    });


}

function show_hide_layer(id){
    let check = document.querySelector('#layer_'+id).checked
    if (check) {
        map.addLayer(layer_kml[id]);
        marker_layer[id].addTo(map)
    }else{
        map.removeLayer(layer_kml[id]);
        marker_layer[id].clearLayers()
    }
}

function zoom_to_layer(no){
    map.fitBounds(layer_kml[no].getBounds())
}

function clearLayers_kml(no){
    layer_kml[no].clearLayers();
}

function delete_layer(no , layer_id){
    layer_kml[layer_id].clearLayers();
    $.ajax({
        type: "POST",
        url: "service/delete_layer.php",
        data: {
            type: 'drop_layer',
            layer_id: no
        },
        success: function(data){
            document.getElementById('layers').innerHTML = ''
            get_layers()
        }
    })
}

function save_style(id){
    let style = {
        fillColor: document.getElementById('color_'+id).value,
        color: document.getElementById('stroke_'+id).value,
        opacity: document.getElementById('opacity_'+id).value/10
    }
    $.ajax({
        type: "POST",
        url: "service/insert_kml.php",
        data: {
            type: 'save_style',
            layer_id: id,
            style: JSON.stringify(style)
        },
        success: function(data){
            get_layers()
        }
    })
}


function get_list_build(){
    var inner_list_owner = ''
    pin_data.forEach(e => {
        e.features.forEach(f => {
            data = f.properties
            inner_list_owner += `<li class="list-group-item">`+data.owner_buil +` <span class="badge"> <button class="btn btn-xs btn-success" onclick="view_report(`+data.gid+`)">พิมพ์</button> </span></li>`
        });
    });
    document.getElementById('list_owner').innerHTML = inner_list_owner
}


function onEachFeature(e, layer) {
    e = e.properties
    var lat = e.latitude
    var lng = e.longitude
    layer.bindPopup(`<div class="row">
    <div class="col-4">
        <img style='width:150px' src='img/`+ e.jpg1 + `'>
        <img style='width:150px' src='img/`+ e.jpg2 + `'>
        <img style='width:150px' src='img/`+ e.jpg3 + `'>
        <img style='width:150px' src='img/`+ e.jpg4 + `'>
    </div>
    <div class="col-8">
        <table class="table table-bordered">
        <thead>
        <tr>
            <th colspan="2">ข้อมูลเจ้าของอาคาร / ผู้ครอบครองอาคาร</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td width="8%">1.</td>
            <td>
                ชื่อเจ้าของอาคาร / ผู้ครอบครอง ..`+ e.owner_buil + `.. <br>
                อยู่บ้านเลขที่ ..`+ e.address + `.. ถนน ..`+ e.road + `.. ตำบล .`+ e.dis_1 + ` 
                อำเภอ ..`+ e.dis_2 + `.. จังหวัด ...`+ e.province + `..
            </td>
        </tr>
        <tr>
            <th colspan="2">ข้อมูลการได้รับอนุญาต</th>
        </tr>
        <tr>
            <td>2.</td>
            <td>
                -ได้รับใบอนุญาตก่อสร้างอาคาร / ดัดแปลงอาคาร / เคลื่อนย้าย
                อาคาร เลขที่ ..`+ e.number + `/`+ e.no + `.. ออกให้ ณ วันที่ ..`+ e.date + `..
                ชนิดอาคาร ..`+ e.building + `.. จำนวน .`+ e.cont + `. เพื่อใช้เป็น .`+ e.use + `
                - ภาพใบอนุญาตฯ
            </td>
        </tr>
        <tr>
            <th colspan="2">ข้อมูลการได้ใบรับรองการตรวจสอบอาคาร ตามมาตรา 32 ทวิ</th>
        </tr>
        <tr>
            <td>3.</td>
            <td>
                -ได้รับใบรับรองการตรวจสอบอาคาร (แบบ ร1) ประจำปี ..`+ e.annual + `..
                เลขที่ ...`+ e.let_number + `/ `+ e.let_no + `.. ออกให้ ณ วันที่ ..`+ e.let_date + `...
                ชนิดอาคาร ..`+ e.let_building + `.. จำนวน ..`+ e.let_cont + `.. เพื่อใช้เป็น ..`+ e.let_use + `..
                - ภาพใบรับรองการตรวจสอบอาคาร (แบบ ร1)
            </td>
        </tr>
        </tbody>
    </table>
                
                <a type='button' class='btn btn-block btn-success btn-xs text-white' href='http://maps.google.com/maps?q=&layer=c&cbll=` + lat +`,`+ lng +`' target='_blank'> Street View </a>
                <a type='button' class='btn btn-block btn-success btn-xs text-white' href='https://www.google.co.th/maps/dir/` + lat +`,`+ lng +`/`+lon_lng_current[0]+`,`+lon_lng_current[1]+`' target='_blank'> ค้นหาเส้นทาง </a>
                <a type='button' class='btn btn-block btn-success btn-xs text-white' onclick="view_report(`+ e.gid + `)"> พิมพ์ </a>
    </div>
</div> `
        ,{
        maxWidth: 560
    } ).openPopup();
}

function view_report(id){
    $('.container').show()
    document.getElementById('iframe_report').innerHTML = '<iframe src="service/report.php?id='+id+'" width="100%" height="650px" frameborder="0" id="printf" name="printf"></iframe>'
}

function close_report(){
    $('.container').hide()
}

function print_f(){
    window.frames["printf"].focus();
    window.frames["printf"].print();
}