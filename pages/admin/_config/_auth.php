<?php
    session_start();

    header("Cache-Control: no-cache, no-store, must-revalidate");
    header("Pragma: no-cache");
    header("Expires: 0");

    if (!isset($_SESSION["admin_email"])) {

        header("Location: _index.php");
        exit();
    }
?>
