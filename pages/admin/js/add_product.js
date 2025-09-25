document.addEventListener("DOMContentLoaded", function () {
    console.log("JS loaded!");

    const addButton = document.querySelector(".add-product-button"); // Assuming you have a button to trigger Add Product

    addButton.addEventListener("click", function () {
        // Create overlay
        const overlay = document.createElement("div");
        overlay.className = "overlay-bg";

        const content = document.createElement("div");
        content.className = "overlay-content";

        const inner = document.createElement("div");
        inner.className = "overlay-inner";

        inner.innerHTML = `
            <h2>Add Product</h2>
            <div class="form-group">
                <label>Upload Image</label>
                <input type="file" accept="image/*">
            </div>
            <div class="form-group">
                <label>Name</label>
                <input type="text" placeholder="Product Name">
            </div>
            <div class="form-group">
                <label>Type</label>
                <input type="text" placeholder="Product Type">
            </div>
            <div class="form-group">
                <label>Brand</label>
                <input type="text" placeholder="Product Brand">
            </div>
            <div class="form-group">
                <label>Stock</label>
                <input type="number" placeholder="Stock Quantity">
            </div>
            <div class="form-group">
                <label>Price</label>
                <input type="number" placeholder="Product Price">
            </div>
            <div class="button-container">
                <button class="update-button">Add Product</button>
            </div>
        `;

        content.appendChild(inner);
        overlay.appendChild(content);
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'auto';
        });

        // Close overlay when clicking outside
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
                setTimeout(() => overlay.remove(), 300);
            }
        });

        // Price input formatting
        const priceInput = inner.querySelector('input[placeholder="Product Price"]');
        priceInput.addEventListener('blur', () => {
            let val = parseFloat(priceInput.value);
            if (isNaN(val)) val = 0;
            priceInput.value = val.toFixed(2);
        });
        priceInput.addEventListener('input', () => {
            priceInput.value = priceInput.value.replace(/[^\d.]/g, '');
        });

        inner.querySelector(".update-button").addEventListener("click", function (e) {
            e.preventDefault();

            const prodName = inner.querySelector('input[placeholder="Product Name"]').value;
            const prodType = inner.querySelector('input[placeholder="Product Type"]').value;
            const prodBrand = inner.querySelector('input[placeholder="Product Brand"]').value;
            const prodStock = inner.querySelector('input[placeholder="Stock Quantity"]').value;
            const prodPrice = inner.querySelector('input[placeholder="Product Price"]').value;
            const prodImg = inner.querySelector('input[type="file"]').files[0];

            if (!prodName || !prodType || !prodBrand || !prodStock || !prodPrice) {
                alert("Please fill in all fields before adding.");
                return;
            }

            const formData = new FormData();
            formData.append('prod_name', prodName);
            formData.append('prod_type', prodType);
            formData.append('prod_brand', prodBrand);
            formData.append('prod_stock', prodStock);
            formData.append('prod_price', prodPrice);
            if (prodImg) formData.append('prod_img', prodImg);

            fetch('/motocruz/pages/admin/add_product.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(text => {
                const data = JSON.parse(text);
                if (data.success) {
                    alert('Product added successfully!');
                    overlay.remove(); // Close overlay
                    location.reload();
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An unexpected error occurred.');
            });
        });
    });
});
