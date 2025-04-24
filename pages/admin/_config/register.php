<?php
require '_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST["username"]);
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]); // Store password as plain text

    // Check if email already exists
    $checkEmail = $mysqli->prepare("SELECT admin_email FROM acc_admin WHERE admin_email = ?");
    $checkEmail->bind_param("s", $email);
    $checkEmail->execute();
    $checkEmail->store_result();

    if ($checkEmail->num_rows > 0) {
        echo "<script>alert('Email already exists. Please try another.'); window.location.href = '../_index.php';</script>";
    } else {
        $stmt = $mysqli->prepare("INSERT INTO acc_admin (admin_uname, admin_email, admin_pass) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $username, $email, $password);

        if ($stmt->execute()) {
            header("Location: ../_index.php");
            exit();
        } else {
            echo "<script>alert('Registration failed. Please try again.'); window.location.href = '../_index.php';</script>";
        }

        $stmt->close();
    }
    $checkEmail->close();
    $mysqli->close();
}
?>