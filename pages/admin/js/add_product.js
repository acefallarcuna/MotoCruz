document.querySelector(".add-product-button").addEventListener("click", () => {
    const overlay = document.createElement("div");
    overlay.className = "overlay-bg";

    const content = document.createElement("div");
    content.className = "overlay-content";

    content.innerHTML = `
      <h2>Add New Product</h2>
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
        <div class="price-group">
            <input type="number" step="0.01" placeholder="Product Price">
            <button class="add-button">Add</button>
        </div>
      </div>
    `;

    overlay.appendChild(content);
    document.body.appendChild(overlay);

    // Wait for next frame before triggering the fade-in
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
    });

    // Close modal when clicking outside content
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
            setTimeout(() => overlay.remove(), 300); // wait for fade-out
        }
    });
  
    // Function to generate a random alphanumeric prod_id
    function generateProdId() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let prodId = '';
        for (let i = 0; i < 6; i++) {
            prodId += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return prodId;
    }

    // Add event listener to the dynamically added "Add" button
    content.querySelector(".add-button").addEventListener("click", function (e) {
        e.preventDefault();

        // Get form values
        const prodName = content.querySelector('input[placeholder="Product Name"]').value;
        const prodType = content.querySelector('input[placeholder="Product Type"]').value;
        const prodBrand = content.querySelector('input[placeholder="Product Brand"]').value;
        const prodStock = content.querySelector('input[placeholder="Stock Quantity"]').value;
        const prodPrice = content.querySelector('input[placeholder="Product Price"]').value;
        const prodImg = content.querySelector('input[type="file"]').files[0];
        const prodId = generateProdId();

        const formData = new FormData();
        formData.append('prod_id', prodId);
        formData.append('prod_name', prodName);
        formData.append('prod_type', prodType);
        formData.append('prod_brand', prodBrand);
        formData.append('prod_stock', prodStock);
        formData.append('prod_price', prodPrice);
        if (prodImg) formData.append('prod_img', prodImg);

        fetch('add_product.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Product added successfully!');
                overlay.remove(); // Close modal after success
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
