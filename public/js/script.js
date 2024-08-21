console.log("prasanth");
const NavBar = document.querySelector("nav");
const X_mark = document.querySelector("i");
const loginButton = document.querySelector("#loginBtn");
const cancelButton = document.querySelector(".cancelBtn");
const categoryBoxSection = document.querySelector(".categoryBoxSection");

// **********************************    SCROLL MENUBAR CHNAGE COLOR  ************************* 
window.addEventListener("scroll", () => {
  // console.log(window.scrollY);
  if (scrollY > 50) {
    NavBar.classList.add("scroll");
    // console.log(X_mark);
    X_mark.style.color = "#111";
  } else {
    NavBar.classList.remove("scroll");
    X_mark.style.color = "#fff";
  }
});
// **********************************  CART ITEMS LENGTH  ************************* 
const getcartItems = () => {
  return JSON.parse(localStorage.getItem("cart") || "[]");
};

const cartItems = getcartItems();
console.log(cartItems);
document.querySelector('.cartItemLength').innerHTML=cartItems.length;



// **********************************    FETCH DATA FROM DATABASE  ************************* 

let users;

const fetchdetails = async () => {
  try {
    const response = await fetch("http://localhost:5000/category");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

// ********************************************      SHOW TO CATEGORIES     *************************************** 

const ProductCategory = (category) => {
  category.forEach((data) => {
    categoryBoxSection.innerHTML += `<a href="/${data.title}"> <div class="mx-3 my-4 categoryBox">
    <img src=${data.img} alt=${data.title} class="card-img-top" />
    <div class="d-flex flex-column categoryDetails">
    <div class="menuTitle text-center">${data.title}</div>
    </div>
    <button class="">Select</button>
    </div></a>`;
  });
};

const getData = async () => {
  const category = await fetchdetails();
  ProductCategory(category);
};

getData();

// ********************************************      POPUP LOGIN AND REGISTER FORM      *************************************** 

document.querySelector(".registerForm").style.display = "none";
document.querySelector("#signin").addEventListener("click", (event) => {
  event.preventDefault();
  console.log("signin");
  document.querySelector(".registerForm").style.display = "flex";
});
document.querySelector("#signup").addEventListener("click", (event) => {
  event.preventDefault();

  console.log("signup");
  document.querySelector(".registerForm").style.display = "none";

  document.querySelector(".loginForm").style.display = "flex";
});

loginButton.addEventListener("click", () => {
  document.querySelector("#Form").classList.add("active");
});
console.log(cancelButton);
cancelButton.addEventListener("click", () => {
  document.querySelector("#Form").classList.remove("active");
});

// document.querySelectorAll(".categoryBox").forEach((element) => {
//   element.addEventListener("click", () => {
//     console.log(element);
//     const menuTitle = element.querySelector(".menuTitle").innerText;
//     console.log(menuTitle);
//   });
// });
