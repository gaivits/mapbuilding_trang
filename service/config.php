<?php ini_set('display_errors', 1); ?>
<?php
// $servername = "150.95.80.69";
// $username = "ltax2";
// $password = "Ltax!@1234";
// $dbname = "ltax2";
// $port = 33011;
// $servername = "containers-us-west-17.railway.app";
// $username = "postgres";
// $password = "eTsjHbGjwQ2enmZ6GiCA";
// $dbname = "railway";
// $port = 5487;
// $servername = "localhost";
// $username = "postgres";
// $password = "123456";
// $dbname = "railway";
// $port = 5432;
$servername = "35.213.147.91";
$username = "postgres";
$password = "123456";
$dbname = "railway";
$port = 46333;

header('Content-Type: text/html; charset=utf-8');
header("Access-Control-Allow-Origin: *");

$conn = pg_connect("host=$servername port=$port dbname=$dbname user=$username password=$password") or die('Error: ' . pg_last_error());
// $conn = pg_connect("host=$servername port=$port dbname=$dbname user=$username password=$password");
?>

