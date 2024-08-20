<?php
include 'config.php';


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if ($_POST['type'] == 'all_layers') {
        $query = pg_query($conn,"SELECT * FROM layers order by id;");
        $objResult = pg_fetch_all($query);
        $json = json_encode($objResult);
        header('Content-Type: application/json');
        echo $json;
    }
};


?>