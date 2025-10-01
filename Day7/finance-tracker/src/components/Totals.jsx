import React from "react";

const Totals = ({ totals }) => {
  return (
    <div className="totals">
      <p className="text">Total Income: <span>{totals.income}</span></p>
      <p className="text">Total Expense: <span>{totals.expense}</span></p>
      <p className="text">Balance: <span>{totals.balance}</span></p>
    </div>
  );
};

export default Totals;
