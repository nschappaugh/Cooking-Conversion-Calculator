/* <!-- Nicolas Schappaugh 12-12-2022 --> */

import React from "react";
import "./button.css";

const Button = ({ className, value, onClick }) => {
  return (
    <button className={className} onClick={onClick}>
      {value}
    </button>
  );
};

export default Button;
