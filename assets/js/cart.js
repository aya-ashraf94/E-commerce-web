document.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const cartContainer = document.getElementById("cart-container");
    const totalElement = document.getElementById("cart-total");

    if (!cartContainer) return;

    if (!currentUser) {
        cartContainer.innerHTML = "<p>Please login first</p>";
        return;
    }

    const userCartKey = "cart_" + currentUser.uername;
    let cart = JSON.parse(localStorage.getItem(userCartKey)) || [];

    /* =========================
        Render Cart
    ========================== */
    function renderCart() {
        cartContainer.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = "<h4>Your cart is empty</h4>";
            totalElement.textContent = 0;
            return;
        }

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            cartContainer.innerHTML += `
                <div class="card mb-3 p-3">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <img src="${item.image}" class="img-fluid">
                        </div>
                        <div class="col-md-3">
                            <h5>${item.name}</h5>
                            <p>${item.price} EGP</p>
                        </div>
                        <div class="col-md-3">
                            <button onclick="decreaseQty(${index})" class="btn btn-sm btn-secondary">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button onclick="increaseQty(${index})" class="btn btn-sm btn-secondary">+</button>
                        </div>
                        <div class="col-md-2">
                            <strong>${item.price * item.quantity} EGP</strong>
                        </div>
                        <div class="col-md-2">
                            <button onclick="removeItem(${index})" class="btn btn-sm">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        // totalElement.textContent = total;
        // localStorage.setItem(userCartKey, JSON.stringify(cart));
        totalElement.textContent = total;

        if (cart.length === 0) {
            localStorage.removeItem(userCartKey);
        } else {
            localStorage.setItem(userCartKey, JSON.stringify(cart));
        }
    }

    /* =========================
        Quantity Controls
    ========================== */
    window.increaseQty = function (index) {
        cart[index].quantity++;
        renderCart();
    };

    window.decreaseQty = function (index) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
        renderCart();
    };

    window.removeItem = function (index) {
        cart.splice(index, 1);
        renderCart();
    };

    // window.removeItem = function (id) {
    //     cart = cart.filter(item => item.id !== id);
    //     renderCart();
    // }

    /* =========================
        Checkout
    ========================== */
    const checkoutBtn = document.getElementById("checkoutBtn");
    const checkoutForm = document.getElementById("checkoutForm");

    if (checkoutBtn) {

        checkoutBtn.addEventListener("click", function () {

            if (cart.length === 0) {
                alert("Cart is empty");
                return;
            }

            const subtotal = parseInt(totalElement.textContent);
            const shipping = 80;
            const finalTotal = subtotal + shipping;

            checkoutForm.style.display = "block";

            checkoutForm.innerHTML = `
                <div class="card p-4">
                    <h4>Checkout</h4>

                    <div class="mb-3">
                        <label>Name</label>
                        <input type="text" id="orderName" class="form-control">
                    </div>

                    <div class="mb-3">
                        <label>Phone</label>
                        <input type="text" id="orderPhone" class="form-control">
                    </div>

                    <div class="mb-3">
                        <label>Governorate</label>
                        <select id="orderGov" class="form-select">
                            ${getEgyptGovernorates()}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label>Address</label>
                        <input type="text" id="orderAddress" class="form-control">
                    </div>

                    <h5>Subtotal: ${subtotal} EGP</h5>
                    <h5>Shipping: ${shipping} EGP</h5>
                    <h4>Total: ${finalTotal} EGP</h4>

                    <button onclick="confirmOrder(${subtotal}, ${finalTotal})"
                        class="btn btn-primary mt-3">
                        Confirm Order
                    </button>
                </div>
            `;
        });
    }

    /* =========================
        Governorates
    ========================== */
    function getEgyptGovernorates() {

        const govs = [
            "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira",
            "Fayoum", "Gharbia", "Ismailia", "Menofia", "Minya", "Qaliubiya",
            "New Valley", "Suez", "Aswan", "Assiut", "Beni Suef",
            "Port Said", "Damietta", "Sharkia", "South Sinai", "Kafr El Sheikh",
            "Matrouh", "Luxor", "Qena", "North Sinai", "Sohag"
        ];

        return govs.map(g => `<option value="${g}">${g}</option>`).join("");
    }

    /* =========================
        Confirm Order
    ========================== */
    window.confirmOrder = function (subtotal, finalTotal) {

        const name = document.getElementById("orderName").value;
        const phone = document.getElementById("orderPhone").value;
        const gov = document.getElementById("orderGov").value;
        const address = document.getElementById("orderAddress").value;

        if (!name || !phone || !address) {
            alert("Please fill all fields");
            return;
        }

        const order = {
            orderNumber: "ORD-" + Date.now(),
            user: currentUser.uername,
            items: cart,
            subtotal: subtotal,
            shipping: 80,
            total: finalTotal,
            customer: {
                name,
                phone,
                governorate: gov,
                address
            },
            status: "Pending",
            createdAt: new Date().toLocaleString()
        };

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://699f62ea3188b0b1d535f9d3.mockapi.io/orders");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(order));

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 201) {

                alert("Order placed successfully 🎉");

                cart = [];
                localStorage.setItem(userCartKey, JSON.stringify(cart));
                renderCart();
                checkoutForm.style.display = "none";
            }
        };
    };

    renderCart();
});
