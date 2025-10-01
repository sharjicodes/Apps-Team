import React from "react";

const ExportButton = ({ transactions }) => {
  const handleExport = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.json";
    a.click();
  };

  return (
    <button onClick={handleExport} type="button">
      Export JSON
    </button>
  );
};

export default ExportButton;
