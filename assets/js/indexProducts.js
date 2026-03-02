//////Get data from api/////////
function generateStars(rating) {
    let stars = "";
    for (let i = 0; i < rating; i++) {
        stars += `<i class="fa-solid fa-star"></i>`;
    }
    return stars;
}

const xhr = new XMLHttpRequest();

xhr.open("GET", "https://698a5167c04d974bc6a1ef3e.mockapi.io/api/v1/vegShop");
xhr.send();
xhr.onreadystatechange = function () {

    if (xhr.readyState === 4 && xhr.status === 200) {

        const products = JSON.parse(xhr.responseText);
        const container = document.getElementById("productsContainer");

        container.innerHTML = "";

        products.slice(0, 8).forEach(product => {

            if (product.status === "active") {

                container.innerHTML += `
                    <div class="col-xl-3 col-lg-4 col-md-6 col-12">
                        <div class="single-product" data-id="${product.id}">
                            <div class="product-image">
                                <a href="#">
                                    <img src="${product.image}" alt="${product.title}">
                                </a>
                                <ul>
                                    <li><a href="#"><i class="fa-regular fa-heart"></i></a></li>
                                    <li><a href="#"><i class="fa-solid fa-magnifying-glass"></i></a></li>
                                    <li><a href="#"><i class="fa-solid fa-share-nodes"></i></a></li>
                                </ul>
                            </div>

                            <div class="product-rating">
                                <a href="#">
                                    ${generateStars(product.rating)}
                                    <span class="rating-number">(${product.rating}.0)</span>
                                </a>
                            </div>

                            <h3>
                                <a href="#">${product.title}</a>
                            </h3>

                            <div class="product-price">
                                <span class="current-price">$${product.price}.00</span>
                            </div>

                            <a href="#" class="border-btn">
                                Add to cart
                                <i class="fa-solid fa-cart-shopping"></i>
                            </a>
                        </div>
                    </div>
                `;
            }
        });
    }
};
