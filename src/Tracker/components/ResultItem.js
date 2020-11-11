import React from "react";

const ResultItem = ({ title, detail }) => {
  return (
    <li className="result__box">
      <h3 className="head__small upp light-1">{title}</h3>
      <h2 className="head__med dark">{detail ? detail : "____"}</h2>
    </li>
  );
};

export default ResultItem;
