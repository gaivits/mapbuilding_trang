<!DOCTYPE html>
<html lang="en">
<head>
  <title>Bootstrap Example</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js" integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=" crossorigin=""></script>
</head>
<body>
<?php
include 'config.php';
    $id = $_GET['id'];
    $query = pg_query($conn,"SELECT * FROM build_occupant where id=1;");
    $objResult = pg_fetch_array($query);
?>

<div class="container">
    <div class="row">
        <div class="col-xs-5">
            <div id="map" style="width: 100%; height: 400px;"></div>
        </div>
        <div class="col-xs-7">
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
                        ชื่อเจ้าของอาคาร / ผู้ครอบครอง .. <?php echo $objResult['owner_buil']; ?> .. <br>
                        อยู่บ้านเลขที่ ..<?php echo $objResult['address']; ?>.. ถนน ..<?php echo $objResult['road']; ?>.. ตำบล ..<?php echo $objResult['dis_1']; ?>..  <br>
                        อำเภอ ..<?php echo $objResult['dis_2']; ?>.. จังหวัด ..<?php echo $objResult['province']; ?>..
                    </td>
                </tr>
                <tr>
                    <th colspan="2">ข้อมูลการได้รับอนุญาต</th>
                </tr>
                <tr>
                    <td>2.</td>
                    <td>
                        -ได้รับใบอนุญาตก่อสร้างอาคาร / ดัดแปลงอาคาร / เคลื่อนย้าย
                        อาคาร เลขที่ ..<?php echo $objResult['number']; ?>/<?php echo $objResult['no']; ?>.. ออกให้ ณ วันที่ ..<?php echo $objResult['date']; ?>.. <br>
                        ชนิดอาคาร ..<?php echo $objResult['building']; ?>.. จำนวน ..<?php echo $objResult['cont']; ?>.. เพื่อใช้เป็น ..<?php echo $objResult['use']; ?>.. <br>
                        - ภาพใบอนุญาตฯ
                    </td>
                </tr>
                <tr>
                    <th colspan="2">ข้อมูลการได้ใบรับรองการตรวจสอบอาคาร ตามมาตรา 32 ทวิ</th>
                </tr>
                <tr>
                    <td>3.</td>
                    <td>
                        -ได้รับใบรับรองการตรวจสอบอาคาร (แบบ ร1) ประจำปี ..<?php echo $objResult['annual']; ?>.. <br>
                        เลขที่ ..<?php echo $objResult['let_number']; ?>/<?php echo $objResult['let_no']; ?>.. ออกให้ ณ วันที่ ..<?php echo $objResult['let_date']; ?>.. <br>
                        ชนิดอาคาร ..<?php echo $objResult['let_building']; ?>.. จำนวน ..<?php echo $objResult['let_cont']; ?>.. เพื่อใช้เป็น..<?php echo $objResult['let_use']; ?>..
                        - ภาพใบรับรองการตรวจสอบอาคาร (แบบ ร1)
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        
        <div class="col-xs-12">
             <table class="table table-bordered">
                <tbody>
                <tr>
                    <td> <img width="100%" src="../img/<?php echo $objResult['jpg1']; ?>" alt=""></td>
                    <td> <img width="100%" src="../img/<?php echo $objResult['jpg2']; ?>" alt=""></td>
                    <td> <img width="100%" src="../img/<?php echo $objResult['jpg3']; ?>" alt=""></td>
                </tr>
                </tbody>
            </table>
               
        </div>
    </div>
  
</div>
<script>

	const map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', { maxZoom: 19, attribution: 'Google Hybrid' }).addTo(map);
    var marker = L.marker([<?php echo $objResult['latitude']; ?>, <?php echo $objResult['longitude']; ?>]).addTo(map);
    map.setView([<?php echo $objResult['latitude']; ?>, <?php echo $objResult['longitude']; ?>], 18);

</script>
</body>
</html>
