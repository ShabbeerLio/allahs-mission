import React from "react";
import "./Footer.css";
import logo from "../../Assets/The_Visage_New_Update_File_Page_06__1_-removebg-preview (1).png";
import { Link } from "react-router";

const Footer = () => {
  return (
    <>
      <div className="Footer">
        <div className="Footer-main">
          <div className="footer-box">
            <div className="footer-card">
              <h2>Contact Us</h2>
              <ul>
                <li>
                  <Link>9876543210</Link>
                </li>
                <li>
                  <Link>abcd123@gmail.com</Link>
                </li>
              </ul>
            </div>
            <div className="footer-card">
              <h2>Quick Links</h2>
              <ul>
                <li>
                  <Link>Home</Link>
                </li>
                <li>
                  <Link>Gallery</Link>
                </li>
                <li>
                  <Link>Blogs</Link>
                </li>
                <li>
                  <Link>Contact Us</Link>
                </li>
              </ul>
            </div>
            <div className="footer-card">
              <h2>Address</h2>
              <ul>
                <li>Piazza Della Signoria, 12<br />21562 . Firenze . Italy</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-down">
          <div className="footer-logo">
            <img src={logo} alt="" />
          </div>
          <div className="footer-copyright">
            <div className="footer-media">
              <p><Link>Pinterest</Link></p>
              <p><Link>Facebook</Link></p>
              <p><Link>Instagram</Link></p>
            </div>
            <p>&copy; 2024 THE VISAGE, ALL RIGHTS RESERVED</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
