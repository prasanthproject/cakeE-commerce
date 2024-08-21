const productSection = document.getElementById("productSection");
const Pagination = document.getElementById("pagination");
const SortBtn = document.querySelectorAll(".sortBtn");
const priceRange = document.getElementById("priceRange");
const priceText = document.querySelector(".priceValue");
const filterSection = document.querySelector(".categoryList");

const fetchCupcakeProduct = async () => {
  try {
    const responce = await fetch("http://localhost:5000/menuItems");
    if (!responce.ok) {
      throw new Error("Network responce was not ok");
    }
    const data = await responce.json();
    return data;
  } catch (error) {
    cosole.log("Fetch error :", error);
    return null;
  }
};
const productOrder = (Cupcakes) => {
  document.querySelector("#ascOrder").addEventListener("click", () => {
    console.log("asc");
    setPageCount(Cupcakes.sort((a, b) => a.price - b.price));
  });
  document.querySelector("#decOrder").addEventListener("click", () => {
    console.log("decorder");
    setPageCount(Cupcakes.sort((a, b) => b.price - a.price));
  });
};

const setPrice = (Cupcakes) => {
  const priceValues = Cupcakes.map((item) => {
    return item.price;
  });
  console.log(...priceValues);
  const maximunPrice = Math.max(...priceValues);
  const minimunPrice = Math.min(...priceValues);
  priceRange.min = minimunPrice;
  priceRange.max = maximunPrice;
  priceRange.value = maximunPrice;
  priceText.textContent = "₹ " + priceRange.value;
  console.log(maximunPrice);
  console.log(minimunPrice);
  console.log(priceRange);
  priceRange.addEventListener("input", (e) => {
    console.log(e.target.value);
    let price = e.target.value;
    priceText.textContent = "₹ " + price;
    console.log(filterCategories);
    combinedfilter(Cupcakes, filterCategories, price);
  });
};

let filterCategories = [];
const setCategories = (Cupcakes) => {
  let CategoriesList = [];
  Cupcakes.forEach((item) => {
    item.flavour.forEach((category) => {
      if (!CategoriesList.includes(category)) {
        CategoriesList.push(category);
      }
    });
  });
  CategoriesList.sort().forEach((item) => {
    filterSection.innerHTML += `<br/><input type="checkbox"  id="${item.toLowerCase()}" value="${item}" class="py-5"  />
      <label class="checkboxTitle" for="${item.toLowerCase()}">${item}</label>`;
  });
  filterSection.addEventListener("change", (e) => {
    if (e.target.checked == true ? filterCategories.push(e.target.value) : filterCategories.splice(filterCategories.indexOf(e.target.value), 1)) {
    }
    console.log(filterCategories);
    let price = priceRange.value;
    combinedfilter(Cupcakes, filterCategories, price);
  });
};

const combinedfilter = (Cupcakes, filterCategories, price) => {
  // console.log("price", price);
  let filteredProducts = Cupcakes.filter((item) => item.price <= price);
  if (filterCategories.length > 0) {
    filteredProducts = filteredProducts.filter((flavours) => flavours.flavour.some((flavor) => filterCategories.includes(flavor)));
  }
  document.getElementById("filterlength").innerText = filteredProducts.length;
  setPageCount(filteredProducts);
  productOrder(filteredProducts);
};
function showCupcakeProducts(Cupcakes, start, end) {
  productSection.innerHTML = "";
  Cupcakes.slice(start, end + 1).forEach((Cupcake) => {
    productSection.innerHTML += `<div class="card productPost mb-5 mx-1">
              <div class="row">
                <div class="col-6">
                <a href="http://localhost:5000/Cupcakes/productpage/${Cupcake._id}" target="_blank">
                  <div class="productImg mx-auto"><img src="${Cupcake.img}" class="mx-auto" alt="${Cupcake.name}" /></div>
                  </a>
                </div>
                <div class="col-6 ps-4 position-relative">
                <i class="fa-regular fa-heart"></i>
                <div class="productDetail">
                    <p class="id"> ${Cupcake._id}</p>
                    <p class="title">${Cupcake.name.trim()}</p>
                    <div class="d-flex justify-content-end">
                      <p class="kg ms-3">5 piece</p>
                      <p class="price">₹${Cupcake.price}</p>
                      </div>                 
                      <p class="category"> ${Cupcake.category}</p>

                    <div class="d-flex justify-content-center" id="buttons">
                      <button type="submit" class="mx-1 px-3 cartBtn"><i class="fa-solid fa-cart-shopping"></i><span class="me-2"> ADD TO CART </span></button>
                      </div>
                  </div>
                </div>
              </div>
            </div>`;
  });
  setTimeout(() => {
    const cartBtn = productSection.querySelectorAll(".cartBtn");
    const favBtn = productSection.querySelectorAll(".fa-heart");

    cartBtn.forEach((btn) => {
      btn.addEventListener("click", addtocart);
    });
    favBtn.forEach((btn) => {
      btn.addEventListener("click", favList);
    });
    initializeFavIcons();
  }, 100);
}

function getCartItems() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function addtocart() {
  let card = this.closest(".productPost");
  let id = card.querySelector(".id").innerHTML;
  let img = card.querySelector("img").src;
  let title = card.querySelector(".title").innerHTML;
  let price = card.querySelector(".price").innerHTML;
  setCartitems(id, img, title, price);
}
function setCartitems(id, img, title, price) {
  const CakeValues = getCartItems();
  const Values = { cakeId: id, cakeimg: img, cakeTitle: title, cakePrice: price };
  if (CakeValues.find((cake) => cake.cakeId == Values.cakeId)) {
    wrongAlertMsg();
    return;
  } else {
    console.log("add to value");
    console.log(Values.cakeTitle);
    alertMsg(Values.cakeTitle);

    CakeValues.push(Values);
    console.log(CakeValues);
  }
  localStorage.setItem("cart", JSON.stringify(CakeValues));
  cartItemlength();
  console.log("cart length", CakeValues.length);
}

function cartItemlength() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  console.log(cart.length);
  // return cart.length;
  document.querySelector(".cartItemLength").innerText = cart.length;
}
const alertMsg = (title) => {
  const alert = document.getElementById("alert");
  alert.querySelector("span").innerText = `${title} Add to Product`;
  alert.classList.add("show");
  setTimeout(() => {
    alert.classList.remove("show");
  }, 1500);
};

const wrongAlertMsg = () => {
  const wrongAlert = document.getElementById("wrongAlert");
  wrongAlert.classList.add("show");
  setTimeout(() => {
    wrongAlert.classList.remove("show");
  }, 1500);
};
// **********************************************    FAVORITES LIST    *************************************
const getFavItems = () => {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
};

let favProductData = getFavItems();

function initializeFavIcons() {
  document.querySelectorAll(".productPost").forEach((product) => {
    const productID = product.querySelector(".id").textContent.trim();
    const favIcon = product.querySelector(".fa-heart");
    if (favProductData.some((item) => item.favProductID.trim() === productID)) {
      favIcon.classList.add("fa-solid");
      favIcon.classList.remove("fa-regular");
    } else {
      favIcon.classList.add("fa-regular");
      favIcon.classList.remove("fa-solid");
    }
  });
}
function favList() {
  let fav = this;
  if (fav.classList.contains("fa-regular")) {
    addtoFav(this);
  } else {
    removetoFav(this);
  }
}

function addtoFav(element) {
  const favProduct = element.closest(".productPost");
  let favProductID = favProduct.querySelector(".id").innerHTML.trim();
  let favProductTitle = favProduct.querySelector(".title").innerHTML;
  let favProductPrice = parseInt(favProduct.querySelector(".price").innerHTML.trim().substring(1));
  let favProductImg = favProduct.querySelector("img").src;
  let favProductCategory = favProduct.querySelector(".category").innerHTML.trim();

  let favProductValues = { favProductID, favProductTitle, favProductPrice, favProductImg, favProductCategory };
  if (!favProductData.find((cake) => cake.favProductID === favProductValues.favProductID)) {
    favProductData.push(favProductValues);
    localStorage.setItem("favorites", JSON.stringify(favProductData));
    favProduct.querySelector(".fa-heart").classList.remove("fa-regular");
    favProduct.querySelector(".fa-heart").classList.add("fa-solid");
  }
}
function removetoFav(element) {
  let removeProductItem = element.closest(".productPost");
  let removeItemID = removeProductItem.querySelector(".id").innerHTML.trim();
  let index = favProductData.findIndex((item) => item.favProductID === removeItemID);
  if (index > -1) {
    favProductData.splice(index, 1);
    const updateFavProductData = JSON.stringify(favProductData);
    localStorage.setItem("favorites", updateFavProductData);
    removeProductItem.querySelector(".fa-heart").classList.add("fa-regular");
    removeProductItem.querySelector(".fa-heart").classList.remove("fa-solid");
  }
}
const init = async () => {
  const Data = await fetchCupcakeProduct();
  const Cupcakes = Data.Cupcakes;
  document.getElementById("cupcakelength").innerText = Cupcakes.length;
  document.getElementById("filterlength").innerText = Cupcakes.length;
  console.log(Cupcakes);
  setPageCount(Cupcakes);
  productOrder(Cupcakes);
  setPrice(Cupcakes);
  setCategories(Cupcakes);
  cartItemlength();
  initializeFavIcons();
};

function setPageCount(Cupcakes) {
  console.log(Cupcakes.length);
  if (Cupcakes.length <= 0) {
    console.log("zero");
    productSection.innerHTML = "";
    document.querySelector(".zero_length").textContent = "No more Items";
  } else {
    document.querySelector(".zero_length").textContent = " ";
  }
  pageCount(Cupcakes.length);
  pageValue(Cupcakes);
}
function pageCount(count) {
  // console.log(count);
  let productLimit = 10;
  let pageCount = Math.ceil(count / productLimit);
  // console.log(pageCount);
  getPageNumber(pageCount);
}
function getPageNumber(pageCount) {
  Pagination.innerHTML = "";
  for (i = 1; i <= pageCount; i++) {
    showPagination(i);
  }
}

function showPagination(index) {
  // console.log(index);
  Pagination.innerHTML += ` <li class="page-item"> <a href="#" index="${index}"class="page-link"> ${index}</a> </li>`;
}

function pageValue(Cupcakes) {
  // console.log(Cupcakes);
  let defaultPageValue = 1;
  const li = Pagination.querySelectorAll("li.page-item");
  li.forEach((page) => {
    if (page.querySelector("a").getAttribute("index") == defaultPageValue) {
      setPage(defaultPageValue, page, Cupcakes);
      page.querySelector("a").classList.add("active");
    }
    page.addEventListener("click", (e) => {
      let pageIndex = page.querySelector("a").getAttribute("index");
      setPage(pageIndex, page, Cupcakes);
    });
  });
}
const setPage = (index, page, Cupcakes) => {
  const li = Pagination.querySelectorAll("li.page-item");
  li.forEach((item) => {
    if (item.querySelector("a").classList.contains("active")) {
      item.querySelector("a").classList.remove("active");
    }
  });
  if (index >= 1) {
    let start = index * 10 - 10;
    let end = index * 10 - 1;
    page.querySelector("a").classList.add("active");
    showCupcakeProducts(Cupcakes, start, end);
  }
};

function sortBtnToggle(event) {
  SortBtn.forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");
}

SortBtn.forEach((button) => {
  button.addEventListener("click", sortBtnToggle);
});

document.addEventListener("DOMContentLoaded", init);
