
<?php
include 'config.php';

$date = date("Y-m-d");
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if ($_POST['type'] == 'add_layer') {
        $name_layer = $_POST['name_layer'];
        $sql = "INSERT INTO layers(
            name_layer,
            date,
            type_data
        ) VALUES
        ( 
            '$name_layer',
            '$date',
            'csv'
        )";   
        $result = pg_query($conn, $sql);
        if ($result) {
            $query = pg_query($conn,"SELECT * FROM layers order by id desc limit 1;");
            $objResult = pg_fetch_all($query);
            $json = json_encode($objResult);

            // Output the JSON response
            header('Content-Type: application/json');
            echo $json;
        }
    }


    if ($_POST['type'] == 'add_geojson') {
        

        $owner_buil = $_POST['owner_buil'];
        $address = $_POST['address'];
        $road = $_POST['road'];
        $dis_1 = $_POST['dis_1'];
        $dis_2 = $_POST['dis_2'];
        $province = $_POST['province'];
        $number = $_POST['number'];
        $no = $_POST['no'];
        $date = $_POST['date'];
        $building = $_POST['building'];
        $cont = $_POST['cont'];
        $use = $_POST['use'];
        $annual = $_POST['annual'];
        $let_number = $_POST['let_number'];
        $let_no = $_POST['let_no'];
        $let_date = $_POST['let_date'];
        $let_building = $_POST['let_building'];
        $let_cont = $_POST['let_cont'];
        $let_use = $_POST['let_use'];
        $jpg1 = $_POST['jpg1'];
        $jpg2 = $_POST['jpg2'];
        $jpg3 = $_POST['jpg3'];
        $jpg4 = $_POST['jpg4'];
        $latitude = $_POST['latitude'];
        $longitude = $_POST['longitude'];
        $geom = $_POST['geom'];
        $layer_id = $_POST['layer_id'];
        $sql = "INSERT INTO build_occupant (
            owner_buil,
            address,
            road,
            dis_1,
            dis_2,
            province,
            number,
            no,
            date,
            building,
            cont,
            use,
            annual,
            let_number,
            let_no,
            let_date,
            let_building,
            let_cont,
            let_use,
            jpg1,
            jpg2,
            jpg3,
            jpg4,
            latitude,
            longitude,
            geom,
            layer_id
        ) VALUES(
            '$owner_buil',
            '$address',
            '$road',
            '$dis_1',
            '$dis_2',
            '$province',
            '$number',
            '$no',
            '$date',
            '$building',
            '$cont',
            '$use',
            '$annual',
            '$let_number',
            '$let_no',
            '$let_date',
            '$let_building',
            '$let_cont',
            '$let_use',
            '$jpg1',
            '$jpg2',
            '$jpg3',
            '$jpg4',
            '$latitude',
            '$longitude',
            ST_GeomFromGeoJSON('$geom'),
            '$layer_id'
            
        )  ; ";
        // echo  $sql;
        $result = pg_query($conn, $sql);
    }
  }


?>