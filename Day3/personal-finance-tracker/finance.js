
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];


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


function save() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}


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

  
  const income = transactionsToRender
    .filter(t => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactionsToRender
    .filter(t => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  incomeEl.textContent = income;
  expenseEl.textContent = Math.abs(expense);
  balanceEl.textContent = income + expense;
}


form.onsubmit = function(e) {
  e.preventDefault();

  const newTransaction = {
    desc: desc.value,
    amount: Number(amount.value),
    category: category.value,
    date: date.value
  };

  transactions = [...transactions, newTransaction]; 
  save();
  render();
  form.reset();
};


filterBtn.onclick = function() {
  const s = start.value;
  const e = end.value;

  if(!s|!e){
    alert("select date")
    
  }

  const filtered = transactions.filter(t => {
    return (!s | t.date >= s) && (!e | t.date <= e);
    start.value = "";
    end.value = "";
  });

  render(filtered);

//   if(!render(filtered)){
//     alert("No transactions found on selected dates")
    
//   }
  start.value = " ";
  end.value = " ";
};


exportBtn.onclick = function() {
  const dataStr = JSON.stringify(transactions, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.json";
  a.click();
};


render();
