import React from "react";

const TransactionList = ({ transactions, onDelete }) => {
  return (
    <ul>
      {transactions.map((t, index) => (
        <li key={index}>
          {t.date} | {t.desc} | {t.category} | {t.amount}
          <button onClick={() => onDelete(index)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TransactionList;
