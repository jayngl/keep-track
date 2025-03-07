const costInput = document.getElementById("costInput");
const expenseNameInput = document.getElementById("expenseNameInput");
const submitExpenseBtn = document.getElementById("submitExpenseBtn");
const expenseFood = document.getElementById("expenseFood");
const expenseTravel = document.getElementById("expenseTravel");
const expenseShopping = document.getElementById("expenseShopping");
const breakDownContainer = document.getElementById("breakDownContainer");
const totalExpenses = document.getElementById("totalExpenses");
// const deleteBtns = document.querySelectorAll(".deleteBtn");

const allExpenses = JSON.parse(localStorage.getItem("expense")) || [];
class Expense {
  constructor(expenseName, expenseType, expenseCost, dateStamp) {
    this.expenseName = expenseName;
    this.expenseType = expenseType;
    this.expenseCost = expenseCost;
    this.dateStamp = dateStamp;
  }
}

// add expense
let selectedExpense = "";
const addExpense = () => {
  if (expenseFood.checked) {
    selectedExpense = expenseFood.value;
  } else if (expenseTravel.checked) {
    selectedExpense = expenseTravel.value;
  } else if (expenseShopping.checked) {
    selectedExpense = expenseShopping.value;
  }

  const expense = new Expense(
    expenseNameInput.value,
    selectedExpense,
    costInput.value,
    dateStamp()
  );

  allExpenses.push(expense);
  localStorage.setItem("expense", JSON.stringify(allExpenses));

  breakDownContainer.innerHTML = "";
  displayExpense();
};

const dateStamp = () => {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  const monthsOfTheYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${day} ${monthsOfTheYear[month]}, ${year}`;
};

// display expense
let expenseIcon = "";
let saveClickCounter = 0;
let expenseTotal = 0;
const displayExpense = () => {
  allExpenses.forEach((expense, index) => {
    const expenseCard = document.createElement("div");
    expenseCard.classList.add(
      "flex",
      "justify-between",
      "w-full",
      "items-center",
      "mb-8"
    );

    expenseTotal += Number(expense.expenseCost);

    // choosing what expense type image depending on the expense
    if (expense.expenseType === "Food/Berverage") {
      expenseIcon = "fa-solid fa-pizza-slice";
    } else if (expense.expenseType === "Travel/Commute") {
      expenseIcon = "fa-solid fa-car";
    } else {
      expenseIcon = "fa-solid fa-bag-shopping";
    }

    // expense card stucture
    const expenseInfo = `
        <div class="flex justify-center items-center gap-x-3">
          <i class = "${expenseIcon}"></i>
          <div>
            <h1 class="font-bold">${expense.expenseName}</h1>
            <p class="text-[0.55rem] text-gray-400">${expense.expenseType}</p>
          </div>
        </div>

        <div class="flex gap-x-3">
          <div class="flex flex-col justify-center items-end">
            <h1 class="font-bold">~ $${expense.expenseCost}.00</h1>
            <p class="text-[0.55rem] text-gray-400">${expense.dateStamp}</p>
          </div>
          <button class="editBtn cursor-pointer px-3">
            <i class="fa-solid fa-pen hover:text-pink-400"></i>
          </button>
          <button class="deleteBtn cursor-pointer px-3 bg-gray-200 rounded-[.45rem]">
            <i class="fa-solid fa-trash hover:text-pink-400"></i>
          </button>
        </div>
    `;

    expenseCard.innerHTML = expenseInfo;
    breakDownContainer.append(expenseCard);
  });

  // add eventlistener to each delete button
  const deleteBtns = document
    .querySelectorAll(".deleteBtn")
    .forEach((btn, index) => {
      btn.addEventListener("click", () => {
        deleteExpense(index);
      });
    });

  // add eventlistener to each edit button
  const editBtns = document
    .querySelectorAll(".editBtn")
    .forEach((btn, index) => {
      btn.addEventListener("click", () => {
        btn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i>`;
        saveClickCounter++;
        costInput.focus();
        showEditValue(index);

        if (saveClickCounter > 1) {
          editExpense(index);
          saveClickCounter = 0;
          btn.innerHTML = `<i class="fa-solid fa-pen"></i>`;
          refreshForm();
          expenseNameInput.placeholder = "enter expense...";
          costInput.placeholder = "enter cost...";
        }
      });
    });

  totalExpenses.innerHTML = `<i class="fas fa-dollar-sign"></i> ${expenseTotal}.00`;
};

displayExpense();

// delete functionality
const deleteExpense = (index) => {
  allExpenses.splice(index, 1);
  localStorage.setItem("expense", JSON.stringify(allExpenses));
  breakDownContainer.innerHTML = "";
  displayExpense();
};

// edit functionality
const editExpense = (index) => {
  if (costInput.value !== "") {
    allExpenses[index].expenseCost = costInput.value;
  }

  if (expenseNameInput.value !== "") {
    allExpenses[index].expenseName = expenseNameInput.value;
  }

  if (expenseFood.checked !== false) {
    allExpenses[index].expenseType = expenseFood.value;
  } else if (expenseTravel.checked !== false) {
    allExpenses[index].expenseType = expenseTravel.value;
  } else if (expenseShopping.checked !== false) {
    allExpenses[index].expenseType = expenseShopping.value;
  }

  allExpenses[index].dateStamp = `edited: ${dateStamp()}`;
  localStorage.setItem("expense", JSON.stringify(allExpenses));
  breakDownContainer.innerHTML = "";
  displayExpense();
};

const showEditValue = (index) => {
  expenseNameInput.placeholder = allExpenses[index].expenseName;
  costInput.placeholder = allExpenses[index].expenseCost;
};

const refreshForm = () => {
  costInput.value = "";
  expenseNameInput.value = "";
  expenseFood.checked = false;
  expenseTravel.checked = false;
  expenseShopping.checked = false;
};

// submit expense
submitExpenseBtn.addEventListener("click", () => {
  if (
    (costInput.value !== "" &&
      expenseNameInput.value !== "" &&
      expenseFood.checked !== false) ||
    expenseTravel.checked !== false ||
    expenseShopping.checked !== false
  ) {
    addExpense();
    refreshForm();
  } else {
    alert("ensure no fields are empty");
  }
});
