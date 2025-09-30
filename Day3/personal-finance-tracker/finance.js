let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let savedTotals = JSON.parse(localStorage.getItem("totals")) || { income: 0, expense: 0, balance: 0 };

const form = document.getElementById("form");
const desc = document.getElementById("desc");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");
const list = document.getElementById("list");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");
const start = document.getElementById("start");
const end = document.getElementById("end");
const filterBtn = document.getElementById("filter");
const exportBtn = document.getElementById("export");

//local storage saving function
function save() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  localStorage.setItem("totals", JSON.stringify(savedTotals));
}

// render transaction list function 
function render(transactionsToRender = transactions) {
  list.innerHTML = "";

  transactionsToRender.forEach((t, index) => {
    const li = document.createElement("li");
    li.textContent = `${t.date} | ${t.desc} | ${t.category} | ${t.amount}`;

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => {
      transactions.splice(index, 1); 
      save();
      render();
      
    };

    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// update UI totals from savedTotals
function renderTotals() {
  incomeEl.textContent = savedTotals.income;
  expenseEl.textContent = savedTotals.expense;
  balanceEl.textContent = savedTotals.balance;
}

// handle form submit
form.onsubmit = function (e) {
  e.preventDefault();

  const newTransaction = {
    desc: desc.value,
    amount: Number(amount.value),
    category: category.value,
    date: date.value
  };

  transactions = [...transactions, newTransaction];

  //  update savedTotals  when adding
  if (newTransaction.amount > 0) {
    savedTotals.income += newTransaction.amount;
  } else {
    savedTotals.expense += Math.abs(newTransaction.amount);
  }
  savedTotals.balance = savedTotals.income - savedTotals.expense;

  save();
  render();
  renderTotals();
  form.reset();
};

// handle filter transaction on perspective date 
filterBtn.onclick = function (e) {
  e.preventDefault();

  const s = start.value;
  const eDate = end.value;

  if (!s || !eDate) {
    alert("Select both start and end dates");
    return;
  }

  const filtered = transactions.filter(
    t => (!s || t.date >= s) && (!eDate || t.date <= eDate)
  );

  render(filtered);

  start.value = "";
  end.value = "";
};

// handle export JSON
exportBtn.onclick = function () {
  const dataStr = JSON.stringify(transactions, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.json";
  a.click();
};

// initial load for rendering list and totals
render();
renderTotals();
