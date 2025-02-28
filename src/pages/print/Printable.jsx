import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useLocation } from "react-router-dom";
import "./printable.css";

const Printable = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Print_Document",
  });

  // Get dynamic data passed via route state
  const location = useLocation();
  const printData = location.state || {
    title: "Default Print",
    content: "No data provided.",
  };

  return (
    <div className="print-container">
      <div ref={componentRef} className="print-content">
        <h1 className="text-xl font-bold">{printData.title}</h1>
        <p className="text-md">{printData.content}</p>
      </div>
      <button onClick={handlePrint} className="print-button">
        Print
      </button>
    </div>
  );
};

export default Printable;
