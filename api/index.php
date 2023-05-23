<?php
require_once "/usr/share/centreon/www/class/centreonDB.class.php";


$method = $_SERVER['REQUEST_METHOD'];
$request = $_REQUEST;


// Initialize a new database connection
$db = new CentreonDB();


switch ($method) {
    case 'GET':
        $resData = [];
        $query = 'SELECT * FROM anoma_metrics' ;
        if(isset($_GET['id'])){
            $query .= ' WHERE id = '.$_GET["id"];
        }
        try {
            $resp = $db->query($query);
            while ($row = $resp->fetchRow()) {
                $resData[] = $row;
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
    case 'POST':
        try {
            $resData = [];
            $jsonData = file_get_contents('php://input');
            $data = json_decode($jsonData, true);
            $query = 'INSERT INTO anoma_metrics(
                          name,
                          unit,
                          comment,
                          contact_id,
                          contact_group_id,
                          host_id,
                          host_name,
                          service_id,
                          service_name,
                          metric_id,
                          metric_name,
                          notification_status,
                          status
                    )  values (?,?, ?, ?,?, ?,?, ?, ?, ?, ?, ?, ?);' ;
            $db->prepare($query);
            $resp = $db->execute($query, [
                $data['name'], $data['unit'],$data['comment'],
                implode("_",array_map(function($v){
                    return  $v["value"];
            }, $data['contact'])), implode("_", array_map(function($v){ return $v["value"];},$data['cgroup'])),
                $data['host']["value"], $data['host']["label"],
                $data['service']["value"], $data['service']["label"],
                $data['metric']["value"], $data['metric']["label"],
                (string) $data['notification'], (string) $data['status']
            ]);
            if($resp !== 1){
                header('HTTP/1.1 500 Internal Server Error');
                header('Content-Type: text/plain');
                echo 'Something went wrong[code:response]';
                exit;
            }

        } catch (Exception $e) {
            header('HTTP/1.1 500 Internal Server Error');
            header('Content-Type: text/plain');
            echo 'Something went wrong';
            exit;
        }
        header('Content-Type: application/json');
        $json = json_encode(["message"=> "ok"]);
        echo $json;
        break;

    case "PUT":
        try {
            $resData = [];
            $jsonData = file_get_contents('php://input');
            $data = json_decode($jsonData, true);
            if(!isset($_GET['id'])){
                throw new Exception('Id is required');
            }

            $query = 'UPDATE anoma_metrics SET
                          name = ?,
                          comment = ?,
                          contact_id = ?,
                          contact_group_id = ?,
                          host_id = ?,
                          host_name = ?,
                          service_id = ?,
                          service_name = ?,
                          metric_id = ?,
                          metric_name = ?,
                          notification_status = ?,
                          status = ?
                     WHERE id = ?' ;
            $db->prepare($query);
            $resp = $db->execute($query, [
                $data['name'], $data['comment'],
                implode("_",array_map(function($v){
                    return  $v["value"];
                }, $data['contact'])), implode("_", array_map(function($v){ return $v["value"];},$data['cgroup'])),
                $data['host']["value"], $data['host']["label"],
                $data['service']["value"], $data['service']["label"],
                $data['metric']["value"], $data['metric']["label"],
                (string) $data['notification'], (string) $data['status'],
                $_GET['id']
            ]);
            if($resp !== 1){
                header('HTTP/1.1 500 Internal Server Error');
                header('Content-Type: text/plain');
                echo 'Something went wrong';
                exit;
            }

        } catch (Exception $e) {
            header('HTTP/1.1 500 Internal Server Error');
            header('Content-Type: text/plain');
            echo 'Something went wrong';
            exit;
        }
        header('Content-Type: application/json');
        $json = json_encode(["message"=> "ok"]);
        echo $json;
        break;

    case "PATCH":
    case "DELETE":
        try {
            if(!isset($_GET["id"])){
                throw new Exception("Metric Id is required");
            }
            $query = sprintf('DELETE  FROM anoma_metrics where id=%s', $_GET["id"]) ;
            $resp = $db->query($query);
        } catch (Exception $e) {
            header('HTTP/1.1 500 Internal Server Error');
            header('Content-Type: text/plain');
            echo 'Something went wrong';
            exit;
        }
        header('Content-Type: application/json');
        $json = json_encode(["data"=> $_GET]);
        echo $json;
        break;
    default :
        header('HTTP/1.1 405 Method Not Allowed');
        header('Allow: POST');
        echo 'Only GET requests are allowed';

}

