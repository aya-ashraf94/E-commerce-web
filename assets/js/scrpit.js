const toggleBtn = document.querySelector(".sidebar-toggle");
const sidebar = document.querySelector(".mobile-sidebar");
const overlay = document.querySelector(".sidebar-overlay");
const closeBtn = document.querySelector(".close-sidebar");
toggleBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
});
closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
});
overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
});


/////////////////Choose Languages///////////////////////////
let langToggle = document.getElementById("langToggle");
let dropdown = document.querySelector(".dropdown-menu");

langToggle.addEventListener("click", function (e) {
    e.preventDefault();
    dropdown.classList.toggle("show");
});

document.querySelectorAll(".dropdown-menu a").forEach(item => {
    item.addEventListener("click", function (e) {
        e.preventDefault();
        let selectedLang = this.getAttribute("data-lang");
        langToggle.innerHTML = `<i class="fa-solid fa-globe"></i> ${selectedLang}`;
        dropdown.classList.remove("show");
    });
});

document.addEventListener("click", function (e) {
    if (!e.target.closest(".language-dropdown")) {
        dropdown.classList.remove("show");
    }
});


///////////////////////////Scroll top////////////////////////
const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", function () {
    if (window.scrollY > 200) {
        scrollBtn.classList.add("show");
    } else {
        scrollBtn.classList.remove("show");
    }
});

scrollBtn.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


//////////////////////////add to cart///////////////////////////////
// const cartBadge = document.getElementById("cart-count");
// let cartCount = localStorage.getItem("cartCount");

// if (cartCount === null) {
//     cartCount = 0;
// } else {
//     cartCount = parseInt(cartCount);
// }
// cartBadge.textContent = cartCount;

// document.addEventListener("click", function (e) {
//     if (e.target.closest(".border-btn")) {
//         e.preventDefault();
//         cartCount++;
//         cartBadge.textContent = cartCount;
//         localStorage.setItem("cartCount", cartCount);
//     }
// });
/////////////////////////Per User Cart Count//////////////////////last
// const cartBadge = document.getElementById("cart-count");
// const currentUser = JSON.parse(localStorage.getItem("currentUser"));
// let cartCount = 0;
// if (currentUser) {
//     const userCartCountKey = "cartCount_" + currentUser.uername;
//     cartCount = parseInt(localStorage.getItem(userCartCountKey)) || 0;
//     cartBadge.textContent = cartCount;
//     document.addEventListener("click", function (e) {
//         if (e.target.closest(".border-btn")) {
//             e.preventDefault();
//             cartCount++;
//             cartBadge.textContent = cartCount;
//             localStorage.setItem(userCartCountKey, cartCount);
//         }
//     });
// } else {
//     cartBadge.textContent = 0;
// }

document.addEventListener("click", function (e) {

    const btn = e.target.closest(".border-btn");
    if (!btn) return;

    e.preventDefault(); // 🔥 يمنع الـ scroll لفوق

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        alert("Please login first");
        return;
    }

    const userCartKey = "cart_" + currentUser.uername; // زي ما عندك
    let cart = JSON.parse(localStorage.getItem(userCartKey)) || [];

    // 🔥 نجيب الكارد نفسه
    const productCard = btn.closest(".single-product");

    const title = productCard.querySelector("h3 a").innerText;
    const priceText = productCard.querySelector(".current-price").innerText;
    const image = productCard.querySelector("img").getAttribute("src");
    const productId = productCard.getAttribute("data-id");

    // نستخرج الرقم من السعر ($200.00 → 200)
    const price = parseFloat(priceText.replace("$", ""));

    const product = {
        id: productId, 
        name: title,
        price: price,
        image: image,
        quantity: 1
    };

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push(product);
    }

    localStorage.setItem(userCartKey, JSON.stringify(cart));

    updateCartCount();

    alert("Added to cart");
});


function updateCartCount() {

    const cartBadge = document.getElementById("cart-count");
    if (!cartBadge) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        cartBadge.textContent = 0;
        return;
    }

    const userCartKey = "cart_" + currentUser.uername;
    const cart = JSON.parse(localStorage.getItem(userCartKey)) || [];

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartBadge.textContent = totalItems;
}

document.addEventListener("DOMContentLoaded", updateCartCount);




// ///////////////////////log out///////////////////////////////////
// document.addEventListener("DOMContentLoaded", function () {
//     const registerNav = document.getElementById("registerNav");
//     const logoutNav = document.getElementById("logoutNav");
//     const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//     if (currentUser) {
//         registerNav.style.display = "none";
//         logoutNav.style.display = "inline-block";
//     } else {
//         registerNav.style.display = "inline-block";
//         logoutNav.style.display = "none";
//     }
// });

// //////////////////account name///////////////////////
// document.addEventListener("DOMContentLoaded", function () {
//     const accountNav = document.getElementById("accountNav");
//     const userNav = document.getElementById("userNav");
//     const usernameDisplay = document.getElementById("usernameDisplay");
//     const logoutNav = document.getElementById("logoutNav");
//     const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//     if (currentUser) {
//         accountNav.style.display = "none";
//         userNav.style.display = "inline-block";
//         usernameDisplay.textContent = currentUser.uername;
//         logoutNav.style.display = "inline-block";
//     } else {
//         accountNav.style.display = "inline-block";
//         userNav.style.display = "none";
//         logoutNav.style.display = "none";
//     }
// });

/////////////////////merge between logout & Account name/////////////////////////////
document.addEventListener("DOMContentLoaded", function () {

    const registerNav = document.getElementById("registerNav");
    const logoutNav = document.getElementById("logoutNav");
    const accountNav = document.getElementById("accountNav");
    const userNav = document.getElementById("userNav");
    const usernameDisplay = document.getElementById("usernameDisplay");

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {

        registerNav.style.display = "none";
        accountNav.style.display = "none";
        userNav.style.display = "inline-block";
        usernameDisplay.textContent = currentUser.uername;
        logoutNav.style.display = "inline-block";
    } else {
        registerNav.style.display = "inline-block";
        accountNav.style.display = "inline-block";
        userNav.style.display = "none";
        logoutNav.style.display = "none";
    }
});

function logout() {
    localStorage.removeItem("currentUser");
    window.location.reload();
}
