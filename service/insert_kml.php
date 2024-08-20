
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
            'kml'
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
        $geom = $_POST['geom'];
        $layer_id = $_POST['layer_id'];
        $properties = $_POST['properties'];
    
        $sql = "INSERT INTO kml_parcel(
                layer_id,
                data_properties,
                geom 
            ) VALUES
            ( 
                '$layer_id',
                '$properties',
                ST_GeomFromGeoJSON('$geom')
            )";   
            
        $result = pg_query($conn, $sql);
    }

    if ($_POST['type'] == 'save_style') {
        $style = $_POST['style'];
        $layer_id = $_POST['layer_id'];
    
        $sql = "UPDATE kml_parcel set style = '$style' where layer_id = '$layer_id'  ;";   
            
        $result = pg_query($conn, $sql);
    }




  }


?>