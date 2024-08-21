const favoriteContainer = document.querySelector(".favContainer");

const getcartItems = () => {
  return JSON.parse(localStorage.getItem("cart") || "[]");
};
document.getElementById("back").addEventListener("click", () => {
  window.history.back();
});

// **********************************  CART ITEMS LENGTH  *************************
const cartItems = getcartItems();
console.log(cartItems);
document.querySelector(".cartItemLength").innerHTML = cartItems.length;

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}

const favoriteItems = getFavorites();
document.querySelector(".favlength").innerText = favoriteItems.length;
const favItems = () => {
  favoriteContainer.innerHTML = "";
  console.log(favoriteItems);
  favoriteItems.forEach((item) => {
    favoriteContainer.innerHTML += `
            <a href="http://localhost:5000/${item.favProductCategory.concat("s")}/productpage/${item.favProductID}" target="_blank">
                <div class="favProduct">
                        <div class="image">
                                 <img src="${item.favProductImg}" alt="${item.favProductTitle}" />
                        </div>
                        <div class="productDetail">
                             <div class="Name">${item.favProductTitle}</div>
                             <div class="Price my-2">₹${item.favProductPrice}</div>
                        </div>
                </div>
            </a>`;
  });
};

document.addEventListener("DOMContentLoaded", () => {
  favItems();
});
