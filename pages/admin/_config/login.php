<?php
require '_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);

    // Fetch plain text password
    $stmt = $mysqli->prepare("SELECT admin_pass FROM acc_admin WHERE admin_email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($storedPassword);
        $stmt->fetch();

        // Directly compare passwords
        if ($password === $storedPassword) {
            session_start();
            $_SESSION["admin_email"] = $email; // Store email in session

            // Redirect to dashboard
            header("Location: ../dashboard.php");
            exit();
        } else {
            echo "<script>alert('Invalid email or password'); window.location.href='../_index.php';</script>";
        }
    } else {
        echo "<script>alert('Invalid email or password'); window.location.href='../_index.php';</script>";
    }

    $stmt->close();
    $mysqli->close();
}
?>
