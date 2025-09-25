function sortBtn() {
    document.getElementById("myDropdown").classList.toggle("show");
}
  
window.onclick = function(event) {
    if (!event.target.matches('.dropdown-button')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

window.addEventListener('resize', function() {
    const cardList = document.querySelector('.card-list');
    if (cardList) {
        cardList.offsetHeight;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const tbody = document.querySelector("table tbody");
    const cartPopup = document.getElementById("cart-popup");
    const cartItemsList = document.getElementById("cart-items");
    const cartTotalEl = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");
    const cartIcon = document.querySelector(".cart-container a");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function renderCart() {
        cartItemsList.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.qty;
            const li = document.createElement("li");
            li.innerHTML = `
                <div class="item-name">${item.name}</div>
                <div class="item-qty">x${item.qty}</div>
                <div class="item-peso">₱</div>
                <div class="item-price">${(item.price * item.qty).toFixed(2)}</div>
                <div class="remove-btn" data-index="${index}">&times;</div>
            `;
            cartItemsList.appendChild(li);
        });

        const totalRow = document.createElement("li");
        totalRow.classList.add("cart-total");
        totalRow.innerHTML = `
            <div class="item-name">Total</div>
            <div class="item-qty"></div>
            <div class="item-peso">₱</div>
            <div class="item-price">${total.toFixed(2)}</div>
            <div class="remove-btn"></div>
        `;
        cartItemsList.appendChild(totalRow);
    }

    cartItemsList.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-btn")) {
            e.stopPropagation();
            const index = e.target.getAttribute("data-index");
            cart.splice(index, 1);
            saveCart();
            renderCart();
        }
    });

    const addPopup = document.getElementById("add-popup");
    const popupImg = document.getElementById("popup-img");
    const popupName = document.getElementById("popup-name");
    const popupType = document.getElementById("popup-type");
    const popupBrand = document.getElementById("popup-brand");
    const popupPrice = document.getElementById("popup-price");
    const popupQty = document.getElementById("popup-qty");
    const popupAddBtn = document.getElementById("popup-add-btn");
    const closeBtn = document.querySelector(".add-popup .close-btn");

    let currentProduct = null;

    tbody.addEventListener("click", (e) => {
        if (e.target.closest("button")) {
            const row = e.target.closest("tr");
            currentProduct = {
                id: parseInt(row.dataset.id, 10),
                name: row.cells[1].innerText,
                type: row.cells[2]?.innerText || "",
                brand: row.cells[3]?.innerText || "",
                stock: parseInt(row.cells[4].innerText, 10),
                price: parseFloat(row.cells[5].innerText.replace("₱", "").trim()),
                img: row.cells[0]?.querySelector("img")?.src || ""
            };

            popupImg.src = currentProduct.img;
            popupName.textContent = currentProduct.name;
            popupType.textContent = currentProduct.type;
            popupBrand.textContent = currentProduct.brand;
            popupPrice.textContent = `₱${currentProduct.price.toFixed(2)}`;

            if (currentProduct.stock > 0) {
                popupQty.value = 1;
                popupQty.max = currentProduct.stock;
                popupQty.disabled = false;
                popupAddBtn.disabled = false;
                popupAddBtn.textContent = "Add to Cart";
            } else {
                popupQty.value = 0;
                popupQty.disabled = true;
                popupAddBtn.disabled = true;
                popupAddBtn.textContent = "Out of Stock";
            }

            addPopup.classList.add("active");
        }
    });

    function closeAddPopup() {
        addPopup.classList.remove("active");
        currentProduct = null;
    }

    closeBtn.addEventListener("click", closeAddPopup);

    popupAddBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (!currentProduct) return;

        const qty = parseInt(popupQty.value, 10);
        if (qty > 0) {
            const existing = cart.find(p => p.id === currentProduct.id);
            const existingQty = existing ? existing.qty : 0;

            if (qty + existingQty > currentProduct.stock) {
                alert(`Only ${currentProduct.stock} items available in stock!`);
                return;
            }

            if (existing) {
                existing.qty += qty;
            } else {
                cart.push({ ...currentProduct, qty });
            }
            saveCart();
            renderCart();
            closeAddPopup();
        }
    });

    addPopup.addEventListener("click", (e) => {
        if (e.target === addPopup) {
            closeAddPopup();
        }
    });

    cartIcon.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        cartPopup.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
        if (!cartPopup.contains(e.target) && !cartIcon.contains(e.target)) {
            cartPopup.classList.remove("active");
        }
    });

    checkoutBtn.addEventListener("click", () => {
        let savedCart = JSON.parse(localStorage.getItem("cart")) || [];

        if (savedCart.length === 0) {
            alert("Cart is empty!");
            return;
        }

        fetch("./checkout.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart: savedCart })
        })
        .then(res => res.json())
        .then(data => {
            console.log("Checkout response:", data);
            if (data.success) {
                localStorage.removeItem("cart");
                cart = [];
                renderCart();
                alert("Checkout complete!");
            } else {
                alert("Checkout failed: " + data.message);
            }
        })
        .catch(err => {
            console.error("Checkout error:", err);
        });
    });

    renderCart();
});
