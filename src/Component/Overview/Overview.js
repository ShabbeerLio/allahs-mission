import React from "react";
import "./Overview.css";
// import overviewlogo from "../../Assets/Overview/overview1.png";
import OverviewCard from "./OverviewCard";
import OverviewData from "./OverviewData";

const Overview = () => {
  return (
    <div className="Overview">
      <div className="Overview-main">
        <div className="Overview-heading">
          {/* <img src={overviewlogo} alt="" /> */}
          <h2>Fidalgo is for everyone who collects beautiful moments</h2>
          <h4>For the best memories</h4>
        </div>
        {OverviewData.map((item, index) => (
          <OverviewCard data={item} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Overview;
