<?php
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $username =  $_POST['username'];
  $password =  $_POST['password'];
  $sql = "SELECT * FROM  user_admin where username = '$username'  and password = '$password'  ;" ;
  $query = pg_query($conn,$sql);
  $objResult = pg_fetch_all($query);
  $json = json_encode($objResult);
  header('Content-Type: application/json');
  echo $json;
}

?>