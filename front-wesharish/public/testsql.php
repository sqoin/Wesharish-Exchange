<?php
    $connection = pg_connect ("host=localhost dbname=userfrosting user=postgres password=postgres");
    if($connection) {
       echo 'connected';
    } else {
        echo 'there has been an error connecting';
    } 
?>
