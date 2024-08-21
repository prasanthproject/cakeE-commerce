const cartItemContainer = document.querySelector(".cartItemContainer");
const tableBody = document.querySelector("tbody");
const getcartItems = () => {
  return JSON.parse(localStorage.getItem("cart") || "[]");
};


// **********************************  CART ITEMS LENGTH  ************************* 
const cartItems = getcartItems();
console.log(cartItems);
document.querySelector('.cartItemLength').innerHTML=cartItems.length;

document.getElementById('back').addEventListener('click',()=>{
    window.history.back();
})

// *******************************   CART ITEMS SHOW IN TABLE   ***********************
function showItems() {
  const cartItems = getcartItems();
  cartItems.forEach((item) => {
    tableBody.innerHTML += `  <tr>
            <td class="id">${item.cakeId}</td>
            <td class="image"><img src="${item.cakeimg}" alt="${item.cakeTitle}" /></td>
            <td class="name">${item.cakeTitle}</td>
            <td class="price">${item.cakePrice.trim()}</td>
            <td class="qty">
              <button class="minus">-</button>
              <input type="number" name="" class="my-1" value="1" id="input" />
              <button class="plus"> +</button>
            </td>
            <td class="total">${item.cakePrice}</td>
            <td class="remove"><i class="fa-solid fa-trash-can"></i></td>
        </tr>`;
  });
  ItemValues();
}

function ItemValues() {
  const removeCart = document.querySelectorAll(".remove");
  console.log(removeCart);
  removeCart.forEach((removeBtn) => {
    removeBtn.addEventListener("click", removeCartItem);
  });
  const addQTY = document.querySelectorAll(".plus");
  console.log(addQTY);
  addQTY.forEach((addBtn) => {
    addBtn.addEventListener("click", increseQTY);
  });
  const lessQTY = document.querySelectorAll(".minus");
  //   console.log(lessQTY);
  lessQTY.forEach((lessBtn) => {
    lessBtn.addEventListener("click", decreseQTY);
  });
  //     totalPrice();
}
function removeCartItem() {
  // console.log("remove");
  // console.log(this.parentElement);
  const cartId = this.parentElement.querySelector(".id").innerText;
  console.log(cartId);
  const cartItems = getcartItems();
  let index = cartItems.findIndex((item) => item.cakeId == cartId);
  if (index > -1) {
    cartItems.splice(index, 1);
    this.parentElement.remove();
    const updatecartItems = JSON.stringify(cartItems);
    localStorage.setItem("cart", updatecartItems);
    console.log("remove it");
  } else {
    console.log("cart items no found");
  }
  cartDetails();
}
function increseQTY() {
  const element = this;
  console.log(element.parentElement);
  const input = this.parentElement.querySelector("#input");
  console.log(input);
  const priceInput = this.closest("tr").querySelector(".price").innerHTML;
  console.log(priceInput);
  const price = parseInt(priceInput.substring(1));
  console.log(price);
  if (input.value > 0) {
    input.value++;
    totalPrice(price, input.value, element);
  }
  const inputValue = input.value;
  // console.log(inputValue);
  cartDetails();
}
function decreseQTY() {
  const element = this;
  const input = this.parentElement.querySelector("#input");
  const priceInput = this.closest("tr").querySelector(".price").innerHTML;
  const price = parseInt(priceInput.substring(1));

  console.log(priceInput);
  console.log(price);

  if (input.value <= 1) {
    input.value = 1;
    totalPrice(price, input.value, element);
  } else {
    input.value--;
    totalPrice(price, input.value, element);
  }
  const inputValue = input.value;
  cartDetails();
}
function totalPrice(price, value, element) {
  const totalPriceValue = price * value;
  console.log(totalPriceValue);
  element.closest("tr").querySelector(".total").innerText = "₹" + totalPriceValue;
}
document.addEventListener("DOMContentLoaded", () => {
  showItems();
  cartDetails();
});

function cartDetails() {
  let totalqty = 0;
  let totalPrice = 0;
  console.log(document.querySelectorAll("input"));
  document.querySelectorAll("input").forEach((input) => {
    totalqty = parseInt(totalqty) + parseInt(input.value);
  });
  document.querySelector(".totalqty").innerText = totalqty;
  console.log(totalqty);

  document.querySelectorAll(".total").forEach((total) => {
    totalPrice = parseInt(totalPrice) + parseInt(total.innerText.substring(1));
  });
  document.querySelector(".totalAmt").innerText = `₹${totalPrice}`;

  console.log(totalPrice);

  let offerAmt = (totalPrice / 100) * 10;
  document.querySelector(".offerAmt").innerText = `₹${offerAmt}`;
  console.log(offerAmt);
  let payAmt = totalPrice - offerAmt;
  document.querySelector(".payAmt").innerText = `₹${Math.round(payAmt)}`;
}
