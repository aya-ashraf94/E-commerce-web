//////////////////////////////////حماية صفحة الأدمن//////////////////////////////////
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", function () {
    loadDashboardCounts();
});

//////////////////////////////////Counts//////////////////////////////////
function loadDashboardCounts() {
    // Products
    fetch("https://698a5167c04d974bc6a1ef3e.mockapi.io/api/v1/vegShop")
        .then(res => res.json())
        .then(data => {
            document.getElementById("productsCount").textContent = data.length;
        });

    // Orders
    fetch("https://699f62ea3188b0b1d535f9d3.mockapi.io/orders")
        .then(res => res.json())
        .then(data => {
            document.getElementById("ordersCount").textContent = data.length;
        });

    // Users
    fetch("https://699f62ea3188b0b1d535f9d3.mockapi.io/users")
        .then(res => res.json())
        .then(data => {
            document.getElementById("usersCount").textContent = data.length;
        });
}


////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////delete function//////////////////////////////////
function deleteProduct(id, element) {
    let xhr4 = new XMLHttpRequest();
    xhr4.open("DELETE", `https://698a5167c04d974bc6a1ef3e.mockapi.io/api/v1/vegShop/${id}`)
    xhr4.send();
    xhr4.onreadystatechange = function () {
        if (xhr4.readyState == 4 && xhr4.status == 200) {
            let row = element.closest("tr");
            row.remove();
            alert(`Deleted Successfully Student ID: ${id}`);
        }
    }
}

//////////////////////////////////confirmation fuction//////////////////////////////////
function confirmOrder(orderId) {
    let getOrder = new XMLHttpRequest();
    getOrder.open("GET", `https://699f62ea3188b0b1d535f9d3.mockapi.io/orders/${orderId}`);
    getOrder.send();
    getOrder.onreadystatechange = function () {
        if (getOrder.readyState == 4 && getOrder.status == 200) {
            let order = JSON.parse(getOrder.responseText);
            let productsData = [];
            let checkedProducts = 0;
            order.items.forEach(item => {
                let getProduct = new XMLHttpRequest();
                getProduct.open("GET", `https://698a5167c04d974bc6a1ef3e.mockapi.io/api/v1/vegShop/${item.id}`);
                getProduct.send();
                getProduct.onreadystatechange = function () {
                    if (getProduct.readyState == 4 && getProduct.status == 200) {
                        let product = JSON.parse(getProduct.responseText);
                        if (product.stock < item.quantity) {
                            alert(`Not enough stock for ${product.title}`);
                            return;
                        }
                        productsData.push({ product, item });
                        checkedProducts++;
                        if (checkedProducts === order.items.length) {
                            let updatedCount = 0;
                            productsData.forEach(data => {
                                let newStock = data.product.stock - data.item.quantity;
                                let newSold = data.product.sold + data.item.quantity;
                                let updateProduct = new XMLHttpRequest();
                                updateProduct.open("PUT", `https://698a5167c04d974bc6a1ef3e.mockapi.io/api/v1/vegShop/${data.product.id}`);
                                updateProduct.setRequestHeader("Content-Type", "application/json");
                                updateProduct.send(JSON.stringify({
                                    stock: newStock,
                                    sold: newSold
                                }));
                                updateProduct.onreadystatechange = function () {
                                    if (updateProduct.readyState == 4 && updateProduct.status == 200) {
                                        updatedCount++;
                                        if (updatedCount === productsData.length) {
                                            updateOrderStatus(orderId);
                                        }
                                    }
                                };
                            });
                        }
                    }
                };
            });
        }
    };
}

function updateOrderStatus(orderId) {
    let updateOrder = new XMLHttpRequest();
    updateOrder.open("PUT", `https://699f62ea3188b0b1d535f9d3.mockapi.io/orders/${orderId}`);
    updateOrder.setRequestHeader("Content-Type", "application/json");
    updateOrder.send(JSON.stringify({
        status: "Confirmed"
    }));
    updateOrder.onreadystatechange = function () {
        if (updateOrder.readyState == 4 && updateOrder.status == 200) {
            alert("Order Confirmed & Stock Updated ✅");
            location.reload();
        }
    };
}

//////////////////////////////////cancel function//////////////////////////////////
function cancelOrder(orderId) {
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", `https://699f62ea3188b0b1d535f9d3.mockapi.io/orders/${orderId}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        status: "Cancelled"
    }));
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            alert("Order Cancelled ❌");
            location.reload();
        }
    };
}

//////////////////////////////////delete user//////////////////////////////////
function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", `https://699f62ea3188b0b1d535f9d3.mockapi.io/users/${id}`);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("User deleted successfully ✅");
            location.reload();
        }
    };
}

/////////////////////////////////////////////////////////////////////////////////

const menuItems = document.querySelectorAll(".menu li");
const contentArea = document.querySelector(".content");
const pageTitle = document.querySelector(".topbar h3");


menuItems.forEach(item => {

    item.addEventListener("click", function () {

        menuItems.forEach(li => li.classList.remove("active"));

        this.classList.add("active");

        const text = this.innerText.trim();
        if (text === "Dashboard") {
            pageTitle.innerText = "Dashboard Overview";
            contentArea.innerHTML = `
                <h3>Recent Activity</h3>
                <p>Welcome back Admin 👋</p>
            `;
        }

        if (text === "Products") {
            pageTitle.innerText = "All Products";
            contentArea.innerHTML = `
                <!--<h3>Products List</h3>-->
                <div id="productsTable">Loading...</div>
            `;
            const tableContainer = document.getElementById("productsTable");
            let xhr = new XMLHttpRequest();
            xhr.open("GET", "https://698a5167c04d974bc6a1ef3e.mockapi.io/api/v1/vegShop");
            xhr.send();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    let data = JSON.parse(xhr.responseText);
                    let tableHTML = `
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Stock</th>
                                    <th>Sold</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                    `;
                    data.forEach(item => {
                        tableHTML += `
                            <tr>
                                <td>${item.id}</td>
                                <td><img src="${item.image}" width="50"></td>
                                <td>${item.title}</td>
                                <td>${item.category || "-"}</td>
                                <td>$${item.price}</td>
                                <td>${item.status}</td>
                                <td>${item.stock}</td>
                                <td>${item.sold}</td>
                                <td><a href="edit.html?id=${item.id}" class="btn edit-btn">Edit</a></td>
                                <td><a href="#" onclick="deleteProduct(${item.id}, this)" class="btn delete-btn">Delete</a></td>
                            </tr>
                        `;
                    });
                    tableHTML += `
                            </tbody>
                        </table>
                    `;
                    tableContainer.innerHTML = tableHTML;
                }
            };
        }

        if (text === "Add Product") {
            pageTitle.innerText = "Add New Product";
            contentArea.innerHTML = `
                <h3>Add Product</h3>
                <form id="addProductForm" class="product-form">
                    <div class="form-group">
                        <label>Product Title</label>
                        <input type="text" id="title" required>
                    </div>
                    <div class="form-group">
                        <label>Image URL</label>
                        <input type="text" id="image" required>
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <input type="text" id="category" required>
                    </div>
                    <div class="form-group">
                        <label>Rating</label>
                        <input type="number" id="rating" required>
                    </div>
                    <div class="form-group">
                        <label>Price</label>
                        <input type="number" id="price" required>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select id="status" required>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Stock</label>
                        <input type="number" id="stock" required>
                    </div>
                    <div class="form-group">
                        <label>Sold</label>
                        <input type="number" id="sold" value="0">
                    </div>
                    <button type="submit" class="submit-btn">Save Product</button>
                </form>
            `;
            const form = document.getElementById("addProductForm");
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                const newProduct = {
                    title: document.getElementById("title").value,
                    image: document.getElementById("image").value,
                    category: document.getElementById("category").value,
                    rating: Number(document.getElementById("rating").value),
                    price: Number(document.getElementById("price").value),
                    status: document.getElementById("status").value,
                    stock: Number(document.getElementById("stock").value),
                    sold: Number(document.getElementById("sold").value)
                };
                const xhr = new XMLHttpRequest();
                xhr.open("POST", "https://698a5167c04d974bc6a1ef3e.mockapi.io/api/v1/vegShop");
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(newProduct));
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            alert("Product Added Successfully ✅");
                            form.reset();
                        } else {
                            alert("Can't Created!");
                        }
                    }
                }
            });
        }

        if (text === "Orders") {
            pageTitle.innerText = "Orders";

            contentArea.innerHTML = `
                <div id="ordersTable">Loading orders...</div>
            `;

            const ordersContainer = document.getElementById("ordersTable");

            let xhr = new XMLHttpRequest();
            xhr.open("GET", "https://699f62ea3188b0b1d535f9d3.mockapi.io/orders");
            xhr.send();

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    let orders = JSON.parse(xhr.responseText);

                    if (orders.length === 0) {
                        ordersContainer.innerHTML = "<p>No orders found.</p>";
                        return;
                    }

                    let cardsHTML = `<div class="orders-wrapper">`;

                    orders.forEach(order => {

                        let itemsHTML = "";

                        order.items.forEach(item => {
                            itemsHTML += `
                                <div class="order-item">
                                    <img src="${item.image}">
                                    <div class="item-info">
                                        <p class="item-name">${item.name}</p>
                                        <p class="item-qty">Qty: ${item.quantity}</p>
                                    </div>
                                    <span class="item-price">$${item.price}</span>
                                </div>
                            `;
                        });

                        cardsHTML += `
                            <div class="order-card">
                                <div class="order-header">
                                    <div>
                                        <h4>${order.orderNumber}</h4>
                                        <small>${order.createdAt}</small>
                                    </div>
                                    <span class="status 
                                        ${order.status === "Pending" ? "pending" :
                                order.status === "Confirmed" ? "confirmed" :
                                    "cancelled"}">
                                        ${order.status}
                                    </span>
                                </div>

                                <div class="order-body">
                                    <div class="order-items">
                                        ${itemsHTML}
                                    </div>
                                    <div class="order-customer">
                                        <h5>Customer Info</h5>
                                        <p>${order.customer.name}</p>
                                        <p>${order.customer.phone}</p>
                                        <p>${order.customer.governorate}</p>
                                        <p>${order.customer.address}</p>
                                    </div>
                                </div>

                                <div class="order-footer">
                                    <div class="order-total">Total: $${order.total}</div>
                                    ${order.status === "Pending"
                                ? `
                                            <button onclick="confirmOrder(${order.id})" class="confirm-btn">Confirm</button>
                                            <button onclick="cancelOrder(${order.id})" class="cancel-btn">Cancel</button>
                                          `
                                : order.status === "Confirmed"
                                    ? `<button class="confirmed-btn">✔ Confirmed</button>`
                                    : `<button class="cancelled-btn">✖ Cancelled</button>`
                            }
                                </div>
                            </div>
                        `;
                    });
                    cardsHTML += `</div>`;
                    ordersContainer.innerHTML = cardsHTML;
                }
            };
        }

        if (text === "Users") {
            pageTitle.innerText = "All Users";
            contentArea.innerHTML = `
                <div id="usersTable">Loading users...</div>
            `;
            const usersContainer = document.getElementById("usersTable");
            let xhr = new XMLHttpRequest();
            xhr.open("GET", "https://699f62ea3188b0b1d535f9d3.mockapi.io/users");
            xhr.send();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let users = JSON.parse(xhr.responseText);
                    if (users.length === 0) {
                        usersContainer.innerHTML = "<p>No users found.</p>";
                        return;
                    }
                    let tableHTML = `
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Created At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;
                    users.forEach(user => {
                        tableHTML += `
                            <tr>
                                <td>${user.id}</td>
                                <td>${user.uername}</td>
                                <td>${user.email}</td>
                                <td>
                                    <span class="role ${user.role === "admin" ? "admin-role" : "user-role"}">
                                        ${user.role}
                                    </span>
                                </td>
                                <td>${user.createdAt}</td>
                                <td>
                                    ${user.role !== "admin"
                                        ? `<button onclick="deleteUser(${user.id})" class="delete-btn">Delete</button>`
                                        : `<span class="admin-badge">Admin</span>`
                                    }
                                </td>
                            </tr>
                        `;
                    });
                    tableHTML += `
                            </tbody>
                        </table>
                    `;
                    usersContainer.innerHTML = tableHTML;
                }
            };
        }


        if (text === "Logout") {
            localStorage.removeItem("isAdmin");
            window.location.href = "login.html";
        }
    });
});
