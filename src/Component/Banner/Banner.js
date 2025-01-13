import React, { useState } from "react";
import bnimg from "../../Assets/Banner/banner1.jpg";
import "./Banner.css";
import { LiaBuffer } from "react-icons/lia";
import btimg from "../../Assets/Banner/banner top.png";
import NamazCard from "../NamazCard/NamazCard";

// import BannerBtm from '../BannerBtm/BannerBtm'

const Banners = () => {

  

  return (
    <>
      <div className="Banners">
        <img className="banner-top" src={btimg} alt="" />
        <div className="Banners-main">
          <div className="banner-image">
            <img src={bnimg} alt="" />
          </div>
          <div className="Banners-detail">
            <div className="banner-left">
              <h1>Allah Invites to the Home of Peace</h1>
            </div>
            <div className="banner-right">
              <NamazCard />
            </div>
          </div>
          <div className="banner-reserve">
            {/* <div className="reserve-box">
                <span>Reserve</span>
                <LiaBuffer />
                <span>Reserve</span>
              </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Banners;
