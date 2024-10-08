<!DOCTYPE html>
<html lang="en">



<head>
    <title>แผนที่ใบอนุญาตสิ่งปลูกสร้าง กองช่างฯ</title>
    <meta charset="utf-8">
    

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="author" content="Teerayoot Injun | Teerayoot5056@gmail.com">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src='https://unpkg.com/@turf/turf/turf.min.js'></script>
    <link rel="stylesheet" href="https://leaflet.github.io/Leaflet.markercluster/dist/MarkerCluster.css" />
    <link rel="stylesheet" href="https://leaflet.github.io/Leaflet.markercluster/dist/MarkerCluster.Default.css" />
    <script src="https://leaflet.github.io/Leaflet.markercluster/dist/leaflet.markercluster-src.js"></script>
    <!-- <script src="./L.KML.js"></script> -->
   <script src="https://harrywood.co.uk/maps/examples/leaflet/leaflet-plugins/layer/vector/KML.js"></script>  
   <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
   <script src='javascript/togeojson.js'></script>
    
    
    <link rel="stylesheet" href="css/style.css">
    
</head>

<body  onload="checkCookie()">
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <img src="img/logo.png" class="logo" alt="">
          </li>
          <li class="nav-item pl-3 pr-5">
            <h3 class="header">เทศบาลนครตรัง</h3>
            <p class="sub-title">แผนที่ใบอนุญาตสิ่งปลูกสร้าง  กองช่างฯ</p>
          </li>
        
          <li>
            <form class="form-inline" id="form_query">
                <input class="form-control mr-sm-2" type="text" placeholder="Search" id="owner_navbar">
                <button class="btn btn-success" type="submit" onclick="search_bar()">Search</button>
              </form>
          </li>
        </ul>
      </nav>
    <div class="container-fluid">
        <div class="row content">
            <div class="sidenav" id="sidenav">
                <div id="btn-close">
                    <button class="close-button" onclick="hide_show_menu('hide')"><i class="fa fa-chevron-left" aria-hidden="true"></i></button>
                </div>
                <div id="menu_bar">
                    <h4 class=" text-center"><i class="fa fa-file-text" aria-hidden="true"></i> IMPORT CSV/KML </h4>
                    <hr>
                    <button class="btn btn-block btn-success mb-1"  data-toggle="collapse" data-target="#search" aria-expanded="false" aria-controls="collapseExample">ค้นหาข้อมูล</button>
                        <div id="search" class="collapse  collapse-bg p-3">
                                <fieldset>
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">ชื่อ</label>
                                        <input type="text" class="form-control" name="owner" id="owner">
                                    </div>
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">ประเภท</label>
                                        <input type="text" class="form-control" name="place" id="place">
                                    </div>
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">จังหวัด</label>
                                        <input type="text" class="form-control" name="road" id="road">
                                    </div>
                                    <button type="submit" class="btn btn-block btn-success  mt-3" onclick="search_pin()">ค้นหาข้อมูล</button>
                                </fieldset>
                        </div>

                     
                   <button class="btn btn-block btn-success mb-1 display-none" data-toggle="collapse" data-target="#import_csv" id="add_csv">นำเข้าข้อมูล CSV</button>
                        <div id="import_csv" class="collapse collapse-bg p-3">
                            <small> <i class="fa fa-upload" aria-hidden="true"></i>
                                กด upload file CSV </small>
                            <div class="input-group">
                                <input type="file" class="form-control" accept=".tsv" name="file_csv" id="csv" >
                                <button onclick="save_csv_data()" class="btn btn-block btn-success  mt-3">บันทึกข้อมูล</button>
                                <br>
                                <small id="check_insert"></small>
                            </div>
                            <p id="count_csv"></p>
                        </div>
                     
                        <button class="btn btn-block btn-success mb-1 display-none" data-toggle="collapse" data-target="#import_kml" id="add_kml">นำเข้าข้อมูล KML</button>
                            <div id="import_kml" class="collapse collapse-bg p-3">
                                <small> 
                                    <i class="fa fa-upload" aria-hidden="true"></i>
                                    กด upload file KML 
                                </small>
                                <div class="input-group">
                                    <input type="file" id="fileUpload" accept=".KML" onchange="view_kml()"/>
                                    <button id="upload_kml" value="Upload" class="btn btn-block btn-success mt-3">บันทึกข้อมูล</button>
                                    <br>
                                    <small id="check_insert"></small>
                                </div>
                                <p id="count_kml"></p>
                            </div>
                     
                            
                        <button class="btn btn-block btn-success mb-1 display-none" data-toggle="collapse" data-target="#report_viewer" id="report" onclick="get_list_build()">พิมพ์ Report</button>
                        <div id="report_viewer" class="collapse ">
                            <ul class="list-group" id="list_owner">
                            </ul>
                        </div>
                        
                    <div  id="login-btn">
                        <button class="btn btn-block btn-primary mb-1" data-toggle="collapse" data-target="#login-panel">เข้าสู่ระบบ</button>
                    </div>
                    <div id="login-panel" class="collapse collapse-bg p-3">
                            <fieldset>
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Username</label>
                                    <input type="text" class="form-control" name="username" id="username">
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Password</label>
                                    <input type="password" class="form-control" name="password" id="password"> 
                                </div>
                                <button type="submit" class="btn btn-block btn-primary  mt-3" onclick="login()">เข้าสู่ระบบ</button>
                            </fieldset>
                    </div>
                  
                </div>
            </div>

            <div class="col-sm-12 map-body">
                <div class="btn-layer">
                    <button class="btn btn-layer btn-success mb-1 btn-border" data-toggle="collapse" data-target="#layer">
                      <i class='fa fa-search'></i>
                    </button>
                   <div id="layer" class="collapse p-3">
                    <div class="card card-layer">
                        <h5 class="p-3 bg-green" >รายการชั้นข้อมูล</h5>
                        <ul class="list-group">
                            <div class="panel-group" id="accordion">
                                <div id="layers"> </div>
                              </div>
                          </ul>
                    </div>
                   </div>
                </div>
                <div class="container" >
                    <div class="jumbotron">
                        <p id="iframe_report"></p>
                      <button type="button" class="btn btn-default mb-3" onclick="close_report()">ปิด</button>
                      <button type="button" class="btn btn-success mb-3" onclick="print_f()">พิมพ์</button>
                    </div>
                  </div>
                
                <div id="map"></div>
            </div>
        </div>
    </div>

    
</body>

</html>
<script src="javascript/app.js"> </script>
