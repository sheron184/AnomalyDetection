<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


require_once  "./class/centreon.class.php";
require_once  "./class/centreonSession.class.php";
require_once "./class/centreonDB.class.php";
require_once "./class/centreonWidget.class.php";




if (!isset($_SESSION['centreon']) ) {
    exit;
}

?>
<html>
<style type="text/css">
    body{ margin:0; padding:1px 0 0 0;}
    div#actionBar { position:absolute; top:0; left:0; width:100%; height:25px; background-color: #FF00FF; }
    @media screen { body>div#actionBar { position: fixed; } }
    * html body { overflow:hidden; }
    * html div#hgMonitoringTable { height:100%; overflow:auto; }
</style>

<head>
    <title> Anomaly Monitoring</title>

</head>
<body>
<div id="module-monitoring"></div>
<!--<script src="modules/AnomalyDetection/src/prototype.js"></script>-->
<script src="modules/AnomalyDetection/static/index.js"></script>
</body>
</html>
