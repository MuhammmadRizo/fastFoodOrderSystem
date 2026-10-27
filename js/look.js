const customersList = document.querySelector(".customers-list");
const userAdd = document.querySelector("#userAdd");
const usernameInput = document.querySelector("#usernameInput");
const telephoneInput = document.querySelector("#telephoneInput");
const foodsSelect = document.querySelector("#foodsSelect");
const foodsForm = document.querySelector("#foodsForm");
const ordersList = document.querySelector(".orders-list");
const clientId = document.querySelector("#clientId");
const userHeader = document.querySelector("#userHeader");
const foodsCount = document.querySelector("#foodsCount");

const getClientId = window.localStorage.getItem("clientId");
const getClientName = window.localStorage.getItem("userHeader");
const getFoodId = window.localStorage.getItem("foodId");

clientId.textContent = getClientId ? getClientId : 1;
userHeader.textContent = getClientName ? getClientName : "Sobir";

async function getAllUsers() {
  let users = await axios.get("https://look-njzu.onrender.com/users");

  users = users.data.data;

  customersList.innerHTML = null;
  for (const u of users) {
    customersList.innerHTML += `
        <li class="customer-item">
	    	<span class="customer-name">${u.username}</span>
	      <a class="customer-phone" href="tel:${u.telephone}">${u.telephone}</a>
	    </li>
    `;
  }
  const customerItem = customersList.querySelectorAll(".customer-item");

  customerItem.forEach((customer, index) => {
    customer.addEventListener("click", () => {
      customerItem.forEach((item) => {
        item.classList.remove("active");
      });

      customer.classList.add("active");

      clientId.textContent = users[index].userId;
      userHeader.textContent = users[index].username;

      window.localStorage.setItem("clientId", users[index].userId);
      window.localStorage.setItem("userHeader", users[index].username);

      getAllOrderedFoods();
    });
  });
}

userAdd.addEventListener("submit", async (e) => {
  e.preventDefault();
  let addUser = await axios.post("https://look-njzu.onrender.com/users", {
    username: usernameInput.value,
    telephone: telephoneInput.value,
  });

  if (addUser.status == 201) {
    getAllUsers();
    usernameInput.value = "";
    telephoneInput.value = "";
  }
});

async function getAllFoods() {
  let allFoods = await axios.get("https://look-njzu.onrender.com/foods");

  allFoods = allFoods.data.data;

  foodsSelect.innerHTML = null;
  for (const food of allFoods) {
    foodsSelect.innerHTML += `
      <option value="${food.foodId}">${food.food_name}</option>
    `;
  }

  window.localStorage.setItem("foodId", foodsSelect.value);

  foodsSelect.addEventListener("change", (e) => {
    e.preventDefault();
    window.localStorage.setItem("foodId", foodsSelect.value);
  });
}

function orderFood() {
  foodsForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = window.localStorage.getItem("clientId") || 1;

    let orderFoods = await axios.post("https://look-njzu.onrender.com/orders", {
      userId: userId,
      foodId: foodsSelect.value,
      count: foodsCount.value,
    });

    if (orderFoods.status == 201) {
      getAllOrderedFoods();
    }
  });
}

async function getAllOrderedFoods() {
  const userId = window.localStorage.getItem("clientId");

  let orderedFoods = await axios.get(
    `https://look-njzu.onrender.com/orders/${userId ? userId : 1}`,
  );
  orderedFoods = orderedFoods.data.data;

  ordersList.innerHTML = "";
  for (const f of orderedFoods) {
    ordersList.innerHTML += `
      <li class="order-item">
      	<img src="https://look-njzu.onrender.com${f.foods[0].food_img}">
      	<div>
      		<span class="order-name">${f.foods[0].food_name}</span>
      		<span class="order-count">${f.count}</span>
      	</div>
      </li>
    `;
  }
}

getAllUsers();
getAllFoods();
orderFood();
getAllOrderedFoods();
