<?php
include 'config.php';


if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if ($_POST['type'] == 'drop_layer') {
       $layer_id = $_POST['layer_id'];

       $query = pg_query($conn, "DELETE from layers where id = '$layer_id'  ");
       $query = pg_query($conn, "DELETE from kml_parcel where layer_id = '$layer_id'  ");
       $query = pg_query($conn, "DELETE from build_occupant where layer_id = '$layer_id'  ");
    }

}

?>