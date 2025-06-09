// Load transactions from localStorage
let incomes = JSON.parse(localStorage.getItem("incomes")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editIncomeIndex = null;
let editExpenseIndex = null;

// Add or edit income
const incomeForm = document.getElementById("income-form");
incomeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const amount = +document.getElementById("income-amount").value;
  const category = document.getElementById("income-category").value;
  const date = document.getElementById("income-date").value;
  if (editIncomeIndex !== null) {
    incomes[editIncomeIndex] = { amount, category, date };
    editIncomeIndex = null;
    incomeForm.querySelector("button[type='submit']").textContent = "Add Income";
  } else {
    incomes.push({ amount, category, date });
  }
  updateLocalStorage();
  updateUI();
  e.target.reset();
});

// Add or edit expense
const expenseForm = document.getElementById("expense-form");
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const description = document.getElementById("description").value;
  const amount = +document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;
  if (editExpenseIndex !== null) {
    expenses[editExpenseIndex] = { description, amount, category, date };
    editExpenseIndex = null;
    expenseForm.querySelector("button[type='submit']").textContent = "Add Expense";
  } else {
    expenses.push({ description, amount, category, date });
  }
  updateLocalStorage();
  updateUI();
  e.target.reset();
});

// Update localStorage
function updateLocalStorage() {
  localStorage.setItem("incomes", JSON.stringify(incomes));
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Filter logic
function getFilteredIncomes() {
  // Add filter logic if needed
  return incomes;
}
function getFilteredExpenses() {
  const filterCategory = document.getElementById("filter-category").value;
  const filterDate = document.getElementById("filter-date").value;
  return expenses.filter(t => {
    let match = true;
    if (filterCategory !== "all" && t.category !== filterCategory) match = false;
    if (filterDate && t.date !== filterDate) match = false;
    return match;
  });
}

// Update UI (balance, transaction list)
function updateUI() {
  const filteredIncomes = getFilteredIncomes();
  const filteredExpenses = getFilteredExpenses();
  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const balance = totalIncome - totalExpense;
  document.getElementById("balance").textContent = balance;
  document.getElementById("income").textContent = totalIncome;
  document.getElementById("expense").textContent = totalExpense;

  const transactionsList = document.getElementById("transactions");
  let html = '';
  filteredIncomes.forEach((t, i) => {
    html += `<li class="income${editIncomeIndex === i ? ' editing' : ''}">
      Income: $${t.amount} (${t.category}) on ${t.date || '-'}
      <button class="edit" onclick="editIncome(${i})">Edit</button>
      <button onclick="deleteIncome(${i})">Delete</button>
    </li>`;
  });
  filteredExpenses.forEach((t, i) => {
    html += `<li class="expense${editExpenseIndex === i ? ' editing' : ''}">
      ${t.description}: $${t.amount} (${t.category}) on ${t.date || '-'}
      <button class="edit" onclick="editExpense(${i})">Edit</button>
      <button onclick="deleteExpense(${i})">Delete</button>
    </li>`;
  });
  transactionsList.innerHTML = html;
}

// Delete income
function deleteIncome(index) {
  incomes.splice(index, 1);
  updateLocalStorage();
  updateUI();
}
window.deleteIncome = deleteIncome;

// Delete expense
function deleteExpense(index) {
  expenses.splice(index, 1);
  updateLocalStorage();
  updateUI();
}
window.deleteExpense = deleteExpense;

// Edit income
window.editIncome = function(index) {
  const t = incomes[index];
  document.getElementById("income-amount").value = t.amount;
  document.getElementById("income-category").value = t.category;
  document.getElementById("income-date").value = t.date;
  editIncomeIndex = index;
  incomeForm.querySelector("button[type='submit']").textContent = "Update";
  updateUI();
};

// Edit expense
window.editExpense = function(index) {
  const t = expenses[index];
  document.getElementById("description").value = t.description;
  document.getElementById("amount").value = t.amount;
  document.getElementById("category").value = t.category;
  document.getElementById("date").value = t.date;
  editExpenseIndex = index;
  expenseForm.querySelector("button[type='submit']").textContent = "Update";
  updateUI();
};

// Clear all transactions
const clearBtn = document.getElementById("clear-all");
clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all incomes and expenses?")) {
    incomes = [];
    expenses = [];
    updateLocalStorage();
    updateUI();
  }
});

// Filter events
const filterCategory = document.getElementById("filter-category");
const filterDate = document.getElementById("filter-date");
filterCategory.addEventListener("change", updateUI);
filterDate.addEventListener("change", updateUI);

// Export CSV
function exportCSV() {
  const filteredIncomes = getFilteredIncomes();
  const filteredExpenses = getFilteredExpenses();
  const csvRows = [
    ["Type", "Description", "Amount", "Category", "Date"],
    ...filteredIncomes.map(t => ["Income", "", t.amount, t.category, t.date || '']),
    ...filteredExpenses.map(t => ["Expense", t.description, t.amount, t.category, t.date || ''])
  ];
  const csvContent = csvRows.map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transactions.csv';
  a.click();
  URL.revokeObjectURL(url);
}
document.getElementById("export-csv").addEventListener("click", exportCSV);

// Initialize UI
updateUI();