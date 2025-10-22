import React, { useState } from "react";

const TransactionForm = ({ onAdd }) => {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTransaction = {
      desc,
      amount: Number(amount),
      category,
      date,
    };

    onAdd(newTransaction);
    setDesc("");
    setAmount("");
    setCategory("food");
    setDate("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="desc">Description:</label>
      <input
        type="text"
        id="desc"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Write Your Description Here..."
        required
      />

      <div className="row">
        <div className="field">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="category">Type:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Food</option>
            <option>Rent</option>
            <option>Salary</option>
            <option>Entertainment</option>
            <option>Other</option>
          </select>
        </div>
    </div>

      <label htmlFor="date">Date:</label>
      <input
        type="date"
        id="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <button type="submit">Add</button>
    </form>
  );
};

export default TransactionForm;
