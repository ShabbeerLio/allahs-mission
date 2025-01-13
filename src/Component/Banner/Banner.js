import React from "react";
import "./Banner.css";
import Clock from "../Clock/Clock";
import bg from "../../Assets/Banner/bg.png";

const Banner = () => {
  return (
    <div className="Banner">
      <img src={bg} alt="" />
      <div className="Banner-main">
        <div className="Banner-box">
          <div className="Banner-box-left">time box</div>
          <div className="Banner-box-right">
            <Clock />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
