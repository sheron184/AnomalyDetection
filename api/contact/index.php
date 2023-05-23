<?php
require_once "/usr/share/centreon/www/class/centreonDB.class.php";


$method = $_SERVER['REQUEST_METHOD'];
$request = $_REQUEST;


// Initialize a new database connection
$db = new CentreonDB();

switch ($method) {
    case 'GET':

        $data = [];
        $query = 'SELECT contact_name, contact_id FROM contact where contact_register = "1"';
        try {
            $resp = $db->query($query);
            while ($row = $resp->fetchRow()) {
                // Preparing dataset suitable for the autocomplete component
                $data[] = [
                    "label" => $row["contact_name"],
                    "value" => $row["contact_id"]
                ];
            }
        } catch (Exception $e) {
            header('HTTP/1.1 500 Internal Server Error');
            header('Content-Type: text/plain');
            echo 'Something went wrong';
            exit;
        }
        header('Content-Type: application/json');
        $json = json_encode($data);
        echo $json;
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

