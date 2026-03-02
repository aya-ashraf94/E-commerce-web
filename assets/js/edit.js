const id = window.location.search.split("=")[1];

const xhr = new XMLHttpRequest();
xhr.open("GET", `https://698a5167c04d974bc6a1ef3e.mockapi.io/api/v1/vegShop/${id}`);
xhr.send();

xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        const product = JSON.parse(xhr.responseText);

        document.getElementById("title").value = product.title;
        document.getElementById("image").value = product.image;
        document.getElementById("category").value = product.category;
        document.getElementById("rating").value = product.rating;
        document.getElementById("price").value = product.price;
        document.getElementById("status").value = product.status;
        document.getElementById("stock").value = product.stock;
        document.getElementById("sold").value = product.sold;
    }
};

const form = document.getElementById("editProductForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const updatedProduct = {
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
    xhr.open("PUT", `https://698a5167c04d974bc6a1ef3e.mockapi.io/api/v1/vegShop/${id}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(updatedProduct));
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
            alert("Product Updated Successfully ✅");
            window.location.href = "admin.html";
        }
    };
});
