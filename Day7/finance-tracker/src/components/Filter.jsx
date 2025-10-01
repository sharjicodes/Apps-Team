import React, { useState } from "react";

const Filter = ({ onFilter }) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleFilter = (e) => {
    e.preventDefault();
    if (!start || !end) {
      alert("Select both start and end dates");
      return;
    }
    onFilter(start, end);
    setStart("");
    setEnd("");
  };

  return (
    <form onSubmit={handleFilter}>
      <div className="row">
        <div className="field">
          <label htmlFor="start">Start Date:</label>
          <input
            type="date"
            id="start"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="end">End Date:</label>
          <input
            type="date"
            id="end"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
          />
        </div>
      </div>
      <button type="submit">Filter</button>
    </form>
  );
};

export default Filter;
