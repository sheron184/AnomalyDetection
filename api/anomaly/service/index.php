<?php

require_once "/usr/share/centreon/www/class/centreonDB.class.php";


$method = $_SERVER['REQUEST_METHOD'];
$request = $_REQUEST;


// Initialize a new database connection
$db = new CentreonDB();
$method = "POST";
switch ($method) {
    case 'POST':
        $resData = [];
        $jsonData = file_get_contents('php://input');
        $data = json_decode($jsonData, true);
        $query = sprintf('SELECT service_name, service_id FROM anoma_metrics  WHERE host_id = %d', $data["value"]);
        try {
            $resp = $db->query($query);
            while ($row = $resp->fetchRow()) {
                // Preparing dataset suitable for the autocomplete component
                $resData[] = [
                    "label" => $row["service_name"],
                    "value" => $row["service_id"]
                ];
            }
        } catch (Exception $e) {
            header('HTTP/1.1 500 Internal Server Error');
            header('Content-Type: text/plain');
            echo 'Something went wrong';
            exit;
        }
        header('Content-Type: application/json');
        $json = json_encode($resData);
        echo $json;
        break;
    case 'GET':
    case "PUT":
    case "PATCH":
    case "DELETE":
    default :
        header('HTTP/1.1 405 Method Not Allowed');
        header('Allow: POST');
        echo 'Only POST requests are allowed';

}

