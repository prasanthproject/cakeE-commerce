const productSection = document.getElementById("productSection");
const Pagination = document.getElementById("pagination");
const SortBtn = document.querySelectorAll(".sortBtn");
const priceRange = document.getElementById("priceRange");
const priceText = document.querySelector(".priceValue");
const filterSection = document.querySelector(".categoryList");
const typeFilterSection = document.querySelector(".typeList");
console.log(typeFilterSection);
const fetchCakeSliceProduct = async () => {
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
const productOrder = (cakeSlices) => {
  document.querySelector("#ascOrder").addEventListener("click", () => {
    console.log("asc");
    setPageCount(cakeSlices.sort((a, b) => a.price - b.price));
  });
  document.querySelector("#decOrder").addEventListener("click", () => {
    console.log("decorder");
    setPageCount(cakeSlices.sort((a, b) => b.price - a.price));
  });
};

const setPrice = (cakeSlices) => {
  const priceValues = cakeSlices.map((item) => {
    return item.price;
  });
  // console.log(...priceValues);
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
    let price = e.target.value;
    priceText.textContent = "₹ " + price;
    combinedFilter(cakeSlices, price, selectedCategories, selectedTypeFilter);
  });
};
let selectedTypeFilter = [];
const setTypeFilter = (cakeSlices) => {
  const typeFilterList = [];
  cakeSlices.sort().map((item) => {
    if (!typeFilterList.includes(item.type)) {
      typeFilterList.push(item.type);
    }
  });
  console.log(typeFilterList);

  typeFilterList.forEach((item) => {
    typeFilterSection.innerHTML += `<br/><input type="checkbox"  id="${item.toLowerCase()}" value="${item}" class="py-5"  />
    <label class="typeCheckboxTitle" for="${item.toLowerCase()}">${item.charAt(0).toUpperCase() + item.slice(1)}</label>`;
  });
  typeFilterSection.addEventListener("change", () => {
    selectedTypeFilter = [...typeFilterSection.querySelectorAll('input[type="checkbox"]:checked')].map((check) => check.value);
    console.log(selectedTypeFilter);
    let price = priceRange.value;
    combinedFilter(cakeSlices, price, selectedCategories, selectedTypeFilter);
  });
};

let selectedCategories = [];
const setCategories = (cakeSlices) => {
  let CategoriesList = [];
  cakeSlices.forEach((item) => {
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
    if (e.target.checked == true ? selectedCategories.push(e.target.value) : selectedCategories.splice(selectedCategories.indexOf(e.target.value), 1)) {
    }
    console.log(selectedCategories);
    let price = priceRange.value;
    combinedFilter(cakeSlices, price, selectedCategories, selectedTypeFilter);
  });
};

function combinedFilter(cakeSlices, price, selectedCategories, selectedTypeFilter) {
  let filteredProducts = cakeSlices.filter((slice) => slice.price <= price);
  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter((flavours) => flavours.flavour.some((flavor) => selectedCategories.includes(flavor)));
  }
  if (selectedTypeFilter.length > 0) {
    filteredProducts = filteredProducts.filter((slice) => selectedTypeFilter.includes(slice.type));
  }
  console.log(filteredProducts);
  document.getElementById("filterlength").innerText = filteredProducts.length;
  setPageCount(filteredProducts);
  productOrder(filteredProducts);
}

function showCakeSliceProducts(cakeSlices, start, end) {
  productSection.innerHTML = "";
  cakeSlices.slice(start, end + 1).forEach((slice) => {
    productSection.innerHTML += `<div class="card productPost mb-4 mx-1">
              <div class="row">
                <div class="col-6">
                <a href="http://localhost:5000/cakeSlices/productpage/${slice._id}" target="_blank">
                  <div class="productImg mx-auto"><img src="${slice.img}" class="mx-auto" alt="${slice.name}" /></div>
                  </a>
                </div>
                <div class="col-6 ps-4 position-relative">
                <i class="fa-regular fa-heart"></i>
                  <div class="productDetail">
                    <p class="id">${slice._id}</p>
                    <p class="title">${slice.name}</p>
                    <div class="d-flex justify-content-end">
                      <p class="kg ms-3">5 piece</p>
                      <p class="price">₹${slice.price}</p>
                      </div>
                      <p class="text-start text-capitalize">${slice.type}</p>
                      <p class="category"> ${slice.category}</p>

                   
                    <div class="d-flex justify-content-center" id="buttons">
                      <button type="submit" class="mx-1 px-3 cartBtn"><i class="fa-solid fa-cart-shopping"></i><span class="me-2"> ADD TO CART </span></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>`;
  });
  setTimeout(() => {
    const cartBtn = document.querySelectorAll(".cartBtn");
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
  const Data = await fetchCakeSliceProduct();
  const cakeSlices = Data.CakeSlices;
  document.getElementById("cakeSlicelength").innerText = cakeSlices.length;
  document.getElementById("filterlength").innerText = cakeSlices.length;
  setPageCount(cakeSlices);
  productOrder(cakeSlices);
  setPrice(cakeSlices);
  setCategories(cakeSlices);
  setTypeFilter(cakeSlices);
  cartItemlength();
  initializeFavIcons();
};
function setPageCount(cakeSlices) {
  if (cakeSlices.length <= 0) {
    productSection.innerHTML = " ";
    document.querySelector(".zero_length").textContent = "No more Items";
  } else {
    document.querySelector(".zero_length").textContent = " ";
  }
  pageCount(cakeSlices.length);
  pageValue(cakeSlices);
}
function pageCount(count) {
  let productLimit = 10;
  let pageCount = Math.ceil(count / productLimit);
  getPageNumber(pageCount);
}
function getPageNumber(pageCount) {
  Pagination.innerHTML = "";

  for (i = 1; i <= pageCount; i++) {
    showPagination(i);
  }
}

function showPagination(index) {
  // console.log(page);
  Pagination.innerHTML += ` <li class="page-item"> <a href="#" index="${index}"class="page-link"> ${index}</a> </li>`;
}

function pageValue(cakeSlices) {
  let defaultPageValue = 1;
  const li = Pagination.querySelectorAll("li.page-item");
  li.forEach((page) => {
    if (page.querySelector("a").getAttribute("index") == defaultPageValue) {
      setPage(defaultPageValue, page, cakeSlices);
      page.querySelector("a").classList.add("active");
    }
    page.addEventListener("click", (e) => {
      let pageIndex = page.querySelector("a").getAttribute("index");
      setPage(pageIndex, page, cakeSlices);
    });
  });
}
const setPage = (index, page, cakeSlices) => {
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
    showCakeSliceProducts(cakeSlices, start, end);
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
