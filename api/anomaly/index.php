<?php
require_once "/usr/share/centreon/www/class/centreonDB.class.php";


$method = $_SERVER['REQUEST_METHOD'];
$request = $_REQUEST;


// Initialize a new database connection
$db = new CentreonDB();


switch ($method) {
    case 'GET':
        $resData = "";
        $jsonData = file_get_contents('php://input');
        $data = json_decode($jsonData, true);
        $query_string = http_build_query($_GET);


        try {
            $crl = curl_init('http://172.16.255.147:3000'."?".$query_string);
            curl_setopt($crl, CURLOPT_HEADER, 0);
            curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
            $resData = curl_exec($crl);
        } catch (Exception $e) {
            header('HTTP/1.1 500 Internal Server Error');
            header('Content-Type: text/plain');
            echo 'Something went wrong';
            exit;
        }
        header('Content-Type: application/json');

        echo json_encode(json_decode($resData));
        break;
    case 'POST':
    case "PUT":
    case "PATCH":
    case "DELETE":
    default :
        header('HTTP/1.1 405 Method Not Allowed');
        header('Allow: POST');
        echo 'Only GET requests are allowed';

}

