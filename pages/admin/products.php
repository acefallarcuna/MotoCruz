<?php
    require '_config/_auth.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!----======== CSS ======== -->
    <link rel="stylesheet" href="css/product.css">
    <link rel="stylesheet" href="css/_navbar.css">
    <link rel="stylesheet" href="css/_sidenav.css">
    <!----===== Boxicons CSS ===== -->
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>

    <title>Products</title>
</head>
<body>
    <?php require_once 'partials/_sidenav.php'; ?>

    <section class="home">
    <nav class="navbar">
        <div class="navbar-item">
            <a href="#">
                <i class='bx bx-search'></i>
            </a>
        </div>
        <div class="navbar-item">
            <a href="#">
                <i class='bx bx-user'></i>
            </a>
        </div>
        <div class="navbar-item">
            <a href="#">
                <i class='bx bx-shopping-bag'></i>
            </a>
            <span class="item">3</span>
            <span class="total">$289.68</span>
        </div>
    </nav>

    <div class="cont-prod">
        <table>
            <thead>
                <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Type</th>
                <th>Brand</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <!-- JS will fill this -->
            </tbody>
        </table>
    </div>
    </section>

    <script src="js/product.js"></script>
    <script src="js/display_product.js"></script>
    <script src="js/_sidenav.js"></script>
    <script src="https://unpkg.com/boxicons@2.1.4/dist/boxicons.js"></script>
</body>
</html>