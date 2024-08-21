const SortBtn = document.querySelectorAll(".sortBtn");
const productSection = document.querySelector("#productSection");
const Pagination = document.getElementById("pagination");
const filterSection = document.querySelector(".categoryList");
const priceRange = document.querySelector("#priceRange");
const priceText = document.querySelector(".priceValue");

// *******************************************      FETCH CAKE PRODUCT      **********************************************
const fetchCakeProduct = async () => {
  try {
    const response = await fetch("http://localhost:5000/menuItems");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

// *******************************************      SET CATEGORIES      **********************************************

const setCategories = (Cakes) => {
  console.log(Cakes);
  let filterFlavor = [];
  Cakes.forEach((item) => {
    item.flavour.forEach((flavor) => {
      if (!filterFlavor.includes(flavor)) {
        filterFlavor.push(flavor);
      }
    });
  });
  console.log(filterFlavor);
  filterFlavor.sort().forEach((item) => {
    filterSection.innerHTML += `<br/><input type="checkbox" id="${item.toLowerCase()}" value="${item}" class="py-5"  />
    <label class="checkboxTitle" for="${item.toLowerCase()}">${item}</label>`;
  });
  filterSection.addEventListener("change", () => {
    const selectedCategories = [...filterSection.querySelectorAll('input[type="checkbox"]:checked')].map((checkbox) => checkbox.value);
    console.log(selectedCategories);
    let price = priceRange.value;
    document.getElementById("selectedCategories").innerHTML = "";
    selectedCategories.forEach((category) => {
      document.getElementById("selectedCategories").innerHTML += ` <span class="ms-2 d-flex align-items-center px-2 my-2 py-1 category">${category}</span>`;
    });
    const filteredProducts = combinedFilter1(Cakes, selectedCategories, price);
    document.getElementById("filterlength").innerText = filteredProducts.length;
    if (filteredProducts.length == 0) {
      console.log("no more items");
      document.querySelector(".zero_length").textContent = `No more items`;
    } else {
      document.querySelector(".zero_length").textContent = ` `;
    }
    setPageCount(filteredProducts);
    productOrder(filteredProducts, 0, 9);
    CakeProduct(filteredProducts, 0, 9);
    SortBtn.forEach((btn) => btn.classList.remove("active"));
  });
};

// *******************************************      SET PRICE      **********************************************

const setPrice = (Cakes, start, end) => {
  const priceValues = Cakes.map((value) => {
    return value.price;
  });
  const maximumPrice = Math.max(...priceValues);
  const minimumPrice = Math.min(...priceValues);
  priceRange.min = minimumPrice;
  priceRange.max = maximumPrice;
  priceRange.value = maximumPrice;
  priceText.textContent = "₹ " + priceRange.value;

  priceRange.addEventListener("input", (e) => {
    const price = e.target.value;
    priceText.textContent = `₹ ${price}`;
    const selectedCategories = [...filterSection.querySelectorAll('input[type="checkbox"]:checked')].map((checkbox) => checkbox.value);
    const filteredCakes = combinedFilter1(Cakes, selectedCategories, price);
    document.getElementById("filterlength").innerText = filteredCakes.length;
    console.log(filteredCakes);
    if (filteredCakes.length == 0) {
      console.log("no more items price");
      document.querySelector(".zero_length").textContent = `No more items`;
    } else {
      document.querySelector(".zero_length").textContent = ` `;
    }

    setPageCount(filteredCakes);
    CakeProduct(filteredCakes, start, end);
    productOrder(filteredCakes, start, end);
    SortBtn.forEach((btn) => btn.classList.remove("active"));
  });
};

// ********************************     PRODUCT ORDER    ***************************************

const productOrder = (Cakes, start, end) => {
  document.querySelector("#ascOrder").addEventListener("click", () => {
    const price = priceRange.value;
    const selectedCategories = [...filterSection.querySelectorAll('input[type="checkbox"]:checked')].map((checkbox) => checkbox.value);
    const filteredCakes = combinedFilter1(Cakes, selectedCategories, price);
    setPageCount(filteredCakes.sort((a, b) => a.price - b.price));
  });
  document.querySelector("#decOrder").addEventListener("click", () => {
    const price = priceRange.value;
    const selectedCategories = [...filterSection.querySelectorAll('input[type="checkbox"]:checked')].map((checkbox) => checkbox.value);
    const filteredCakes = combinedFilter1(Cakes, selectedCategories, price);
    setPageCount(filteredCakes.sort((a, b) => b.price - a.price));
  });
};

// *******************************************     CAKE PRODUCT      **********************************************

function CakeProduct(Cakes, start, end) {
  productSection.innerHTML = "";
  // start=0
  // end=40
  Cakes.slice(start, end + 1).forEach((item) => {
    productSection.innerHTML += `
    <div class="card productPost mb-5 mx-1">
              <div class="row">
                <div class="col-6">
                  <div class="productImg mx-auto">
                      <a href="http://localhost:5000/Cakes/productpage/${item._id}" target="_blank">
                          <img src="${item.img}" class="mx-auto" alt="${item.name}" />
                      </a>
                  </div>
                </div>
                <div class="col-6 ps-4 position-relative">
                <i class="fa-regular fa-heart"></i>
                  <div class="productDetail">
                    <p class="id">${item._id}</p>
                    <p class="title">${item.name.trim()}</p>
                    <div class="d-flex justify-content-end">
                      <p class="kg ms-3">1 KG</p>
                      <p class="price">₹${item.price}</p>
                    </div>
                      <p class="category"> ${item.category}</p>
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
      btn.addEventListener("click", addtoCart);
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

function addtoCart() {
  console.log(this);
  let card = this.closest(".productPost");
  const id = card.querySelector(".id").innerHTML;
  let img = card.querySelector("img").src;
  let title = card.querySelector(".title").innerHTML;
  console.log(title);
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
  }
  localStorage.setItem("cart", JSON.stringify(CakeValues));
  cartItemlength();
  console.log("cart length", CakeValues.length);
}

function cartItemlength() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
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
  // console.log(favProductID, favProductTitle, favProductPrice, favProductImg);
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

// *******************************************      INIT      **********************************************

const init = async () => {
  const Cake = await fetchCakeProduct();
  document.getElementById("cakeslength").innerText = Cake.Cakes.length;
  document.getElementById("filterlength").innerText = Cake.Cakes.length;
  setCategories(Cake.Cakes);
  setPageCount(Cake.Cakes);
  setPrice(Cake.Cakes, 0, 9);
  cartItemlength();
  initializeFavIcons();
};

// *******************************************     SET PAGE COUNT     **********************************************

function setPageCount(Cakes, loadpage) {
  pageCount(Cakes, loadpage);
}

// *******************************************     PAGE COUNT      **********************************************

const pageCount = (Cakes) => {
  productLimit = 10;
  Count = Math.ceil(Cakes.length / productLimit);
  getPageNumber(Count);
  pageValue(Cakes);
  // pageValue(Cakes, loadpage);
};

// *******************************************      GET PAGE NUMBER      **********************************************

const getPageNumber = (Count) => {
  Pagination.innerHTML = "";
  for (let i = 1; i <= Count; i++) {
    Pagenation(i);
  }
};

// *******************************************      PAGINATION      **********************************************

const Pagenation = (index) => {
  Pagination.innerHTML += ` 
      <li class="page-item">
          <a href="#" index="${index}" class="page-link">${index}</a>
      </li>`;
};

// *******************************************      PAGE VALUE      **********************************************

const pageValue = (Cakes) => {
  let defaultPageValue = 1;
  const li = Pagination.querySelectorAll("li.page-item");
  li.forEach((page) => {
    if (page.querySelector("a").getAttribute("index") == defaultPageValue) {
      setPage(defaultPageValue, page, Cakes);
      page.querySelector("a").classList.add("active");
    }
    page.addEventListener("click", () => {
      let pageIndex = parseInt(page.querySelector("a").getAttribute("index"));
      setPage(pageIndex, page, Cakes);
    });
  });
};

// *******************************************      SET PAGE      **********************************************

const setPage = (index, page, Cakes) => {
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
    combinedFilter(Cakes, start, end);
  }
};

// *******************************************      COMBINED FILTER      **********************************************
const combinedFilter1 = (Cakes, selectedCategories, price) => {
  return Cakes.filter((product) => {
    const matchesFlavour = selectedCategories.length === 0 || product.flavour.some((flavor) => selectedCategories.includes(flavor));
    const matchesPrice = product.price <= price;
    return matchesFlavour && matchesPrice;
  });
};

function combinedFilter(Cakes, start, end) {
  CakeProduct(Cakes, start, end);
  productOrder(Cakes, start, end);
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});

// *******************************************      SORT BTN TOGGLE      **********************************************

function sortBtnToggle(event) {
  SortBtn.forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");
}

SortBtn.forEach((button) => {
  button.addEventListener("click", sortBtnToggle);
});
