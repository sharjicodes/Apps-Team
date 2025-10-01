
import React, { useState, useEffect } from "react";
import TransactionForm from "./components/TransactionForm";
import Totals from "./components/Totals";
import Filter from "./components/Filter";
import TransactionList from "./components/TransactionList";
import ExportButton from "./components/ExportButton";


//function for calling app
const App = () => {
  //usestate for transactions,totals,filtered
  const [transactions, setTransactions] = useState(
    JSON.parse(localStorage.getItem("transactions")) || []
  );

  const [totals, setTotals] = useState(
    JSON.parse(localStorage.getItem("totals")) || { income: 0, expense: 0, balance: 0 }
  );

  const [filtered, setFiltered] = useState([]);

  //useEffect for fetching changed or updated datas
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("totals", JSON.stringify(totals));
  }, [transactions, totals]);

  //function for adding transaction
  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);//appending the newtransactions with old transaction

    let newTotals = { ...totals };//declaring newTotals by taking copies from existing totals
    if (transaction.amount > 0) {
      newTotals.income += transaction.amount;
    } else {
      newTotals.expense += Math.abs(transaction.amount);
    }
    newTotals.balance = newTotals.income - newTotals.expense;

    setTotals(newTotals);//setting totals as calculated new totals
  };

  //function for deleting transaction
  const deleteTransaction = (index) => {
    const updated = [...transactions];//declaring updated by taking old transactions
    updated.splice(index, 1);
    setTransactions(updated);//set the transactions as new transaction which is updated
  };

  //function for filtering transactions
  const filterTransactions = (start, end) => {
    //declaring result as transactions.filter with some conditionals
    const result = transactions.filter(
      (t) => (!start || t.date >= start) && (!end || t.date <= end)
    );
    setFiltered(result);//setting filtered as new filtered data which is result
  };
//html return things
  return (
    <div className="container">
      <div className="content">
        <h1>Personal Finance Tracker</h1>
        <hr className="dotted-divider" />
        {/* calling transactionform component for the form and onAdd for adding a transaction */}
        <TransactionForm onAdd={addTransaction} />

        <hr className="dotted-divider" />
        {/* calling totals component to display totals with calculated tottals to dispaly */}
        <Totals totals={totals} />

        <hr className="dotted-divider" />
        {/* calling filtering component for getting filtered transaction and onfilter to fetch desired transactions */}
        <Filter onFilter={filterTransactions} />
      </div>

      <div className="scrollable-section">
        <p className="transaction">TRANSACTION LIST</p>
        <hr className="dotted-divider" />
        {/* calling transactionlist components which always shows th transaction and ondelete for deleting transaction */}
        <TransactionList
          transactions={filtered.length > 0 ? filtered : transactions}
          onDelete={deleteTransaction}
        />
        {/* calling ExportButton component for to download transaction json file */}
        <ExportButton transactions={transactions} />
      </div>
    </div>
  );
};

export default App;
