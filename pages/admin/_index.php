<?php
require '_config/_connection.php';

if ($mysqli->connect_error) {
    echo "<script>console.error('Connection failed: " . addslashes($mysqli->connect_error) . "');</script>";
} else {
    echo "<script>console.log('Connected successfully!');</script>";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!----======== CSS ======== -->
    <link rel="stylesheet" href="css/style.css">
    <!----===== Boxicons CSS ===== -->
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <title>MotoCruz</title>
</head>
<body>
    <div class="wrapper">
        <div class="form-header">
            <div class="titles">
                <div class="title-login">Login</div>
                <div class="title-register">Register</div>
            </div>
        </div>

        <!-- Login Form -->
        <form action="./_config/login.php" method="POST" class="login-form" autocomplete="off">
            <input type="text" name="fake-user" style="display: none;" autocomplete="username">
            <input type="password" name="fake-pass" style="display: none;" autocomplete="new-password">

            <div class="input-box">
                <input type="text" class="input-field" id="log-email" name="email" required>
                <label for="log-email" class="label">Email</label>
                <i class='bx bx-envelope icon'></i>
            </div>
            <div class="input-box">
                <input type="password" class="input-field" id="log-pass" name="password" required>
                <label for="log-pass" class="label">Password</label>
                <i class='bx bx-lock-alt icon'></i>
            </div>
            <div class="form-cols">
                <div class="col-1"></div>
                <div class="col-2">
                    <a href="#">Forgot password?</a>
                </div>
            </div>
            <div class="input-box">
                <button type="submit" class="btn-submit">Sign In <i class='bx bx-log-in'></i></button>
            </div>
            <div class="switch-form">
                <span>Don't have an account? <a href="#" onclick="registerFunction()">Register</a></span>
            </div>
        </form>

        <!-- Registration Form -->
        <form action="./_config/register.php" method="POST" class="register-form" autocomplete="off">
            <input type="text" name="fake-user" style="display: none;" autocomplete="username">
            <input type="password" name="fake-pass" style="display: none;" autocomplete="new-password">

            <div class="input-box">
                <input type="text" class="input-field" id="reg-name" name="username" required>
                <label for="reg-name" class="label">Username</label>
                <i class='bx bx-user icon'></i>
            </div>
            <div class="input-box">
                <input type="text" class="input-field" id="reg-email" name="email" required>
                <label for="reg-email" class="label">Email</label>
                <i class='bx bx-envelope icon'></i>
            </div>
            <div class="input-box">
                <input type="password" class="input-field" id="reg-pass" name="password" required>
                <label for="reg-pass" class="label">Password</label>
                <i class='bx bx-lock-alt icon'></i>
            </div>
            <div class="form-cols">
                <div class="col-1">
                    <input type="checkbox" id="agree" required>
                    <label for="agree"> I agree to <a href="tos.html" target="_blank">terms & conditions</a></label>
                </div>
                <div class="col-2"></div>
            </div>
            <div class="input-box">
                <button type="submit" class="btn-submit">Sign Up <i class='bx bx-user-plus'></i></button>
            </div>
            <div class="switch-form">
                <span>Already have an account? <a href="#" onclick="loginFunction()">Login</a></span>
            </div>
        </form>
    </div>

    <script src="js/script.js"></script>
</body>
</html>