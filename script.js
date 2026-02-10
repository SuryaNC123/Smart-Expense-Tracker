let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let income = Number(localStorage.getItem("income")) || 0;
let editId = null;

/* DOM */
const form = document.getElementById("expenseForm");
const tableBody = document.getElementById("expenseTable");

const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const descriptionInput = document.getElementById("description");
const dateInput = document.getElementById("date");

const incomeInput = document.getElementById("incomeInput");
const currencySelect = document.getElementById("currency");
const darkToggle = document.getElementById("darkToggle");

const incomeEl = document.getElementById("income");
const expensesEl = document.getElementById("expenses");
const balanceEl = document.getElementById("balance");

/* Filter DOM */
const filterToggle = document.getElementById("filterToggle");
const filterPanel = document.getElementById("filterPanel");
const filterCategory = document.getElementById("filterCategory");
const filterDate = document.getElementById("filterDate");
const filterDescription = document.getElementById("filterDescription");
const last30Btn = document.getElementById("last30Btn");
const clearFilter = document.getElementById("clearFilter");

/* Theme */
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

/* Currency format */
function formatMoney(val) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencySelect.value
  }).format(val);
}

/* Toggle filter panel */
filterToggle.addEventListener("click", () => {
  filterPanel.classList.toggle("show");
});

/* Add / Edit */
form.addEventListener("submit", e => {
  e.preventDefault();

  const data = {
    id: editId || Date.now(),
    amount: Number(amountInput.value),
    category: categoryInput.value,
    description: descriptionInput.value,
    date: dateInput.value
  };

  if (editId) {
    expenses = expenses.map(e => e.id === editId ? data : e);
    editId = null;
  } else {
    expenses.push(data);
  }

  form.reset();
  save();
  render(expenses);
});

/* Render */
function render(list) {
  tableBody.innerHTML = "";

  list.forEach(exp => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${formatMoney(exp.amount)}</td>
      <td>${exp.category}</td>
      <td>${exp.description}</td>
      <td>${exp.date}</td>
      <td>
        <button onclick="editExpense(${exp.id})">✏️</button>
        <button onclick="deleteExpense(${exp.id})">❌</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  const total = list.reduce((s, e) => s + e.amount, 0);
  incomeEl.textContent = formatMoney(income);
  expensesEl.textContent = formatMoney(total);
  balanceEl.textContent = formatMoney(income - total);
}

/* Edit */
window.editExpense = function(id) {
  const exp = expenses.find(e => e.id === id);
  amountInput.value = exp.amount;
  categoryInput.value = exp.category;
  descriptionInput.value = exp.description;
  dateInput.value = exp.date;
  editId = id;
};

/* Delete */
window.deleteExpense = function(id) {
  expenses = expenses.filter(e => e.id !== id);
  save();
  render(expenses);
};

/* Filters */
filterCategory.addEventListener("change", () => {
  render(expenses.filter(e => e.category === filterCategory.value));
});

filterDate.addEventListener("change", () => {
  render(expenses.filter(e => e.date === filterDate.value));
});

filterDescription.addEventListener("input", () => {
  const t = filterDescription.value.toLowerCase();
  render(expenses.filter(e => e.description.toLowerCase().includes(t)));
});

last30Btn.addEventListener("click", () => {
  const now = new Date();
  const last30 = expenses.filter(e => {
    const d = new Date(e.date);
    return (now - d) / (1000 * 60 * 60 * 24) <= 30;
  });
  render(last30);
});

clearFilter.addEventListener("click", () => {
  filterCategory.value = "";
  filterDate.value = "";
  filterDescription.value = "";
  render(expenses);
});

/* Income */
incomeInput.addEventListener("input", () => {
  income = Number(incomeInput.value) || 0;
  localStorage.setItem("income", income);
  render(expenses);
});

/* Dark mode */
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
});

/* Storage */
function save() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

/* Init */
incomeInput.value = income;
render(expenses);
