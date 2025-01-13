import React from "react";
import "./OverviewCard.css";
import { Link } from "react-router";

const OverviewCard = ({ data }) => {
  var index = data.id;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  };

  return (
    <>
      <div className="homeCategory-box" key={index}>
        {index % 2 !== 0 ? (
          <>
            <div className="homeCategory-box-right">
              <div className="content">
                <div className="cont">
                  <div className="info">
                    <h4>{data.stitle}</h4>
                    <h6>{data.title}</h6>
                  </div>
                  <div className="cont-desc">
                    <p className="description">{data.description}</p>
                  </div>
                  <div className="butn-dark">
                    <Link to="/" onClick={scrollToTop}>
                      <span>Discover More</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="homeCategory-box-left">
              <img src={data.cover} alt="" />
              <div className="overview-clild-left">
                <img src={data.scover} alt="" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="homeCategory-box-left">
              <img src={data.cover} alt="" />
              <div className="overview-clild-right">
                <img src={data.scover} alt="" />
              </div>
            </div>
            <div className="homeCategory-box-right">
              <div className="content">
                <div className="cont">
                  <div className="info">
                    <h4>{data.stitle}</h4>
                    <h6>{data.title}</h6>
                  </div>
                  <div className="cont-desc">
                    <p className="description">{data.description}</p>
                  </div>
                  <div className="butn-dark">
                    <Link to="/" onClick={scrollToTop}>
                      <span>Discover More</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default OverviewCard;
