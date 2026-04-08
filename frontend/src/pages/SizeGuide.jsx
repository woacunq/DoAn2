import React from "react";
import { sizeData } from "../utils/sizeData";

const SizeGuide = () => {
  return (
    <div className="size-guide-page container">
      <h2>Hướng dẫn chọn size</h2>

      {Object.keys(sizeData).map((key) => (
        <div key={key} className="size-section">
          <h3>{sizeData[key].title}</h3>
          <table className="size-table">
            <thead>
              <tr>
                {sizeData[key].headers.map((header, idx) => (
                  <th key={idx}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizeData[key].rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default SizeGuide;
