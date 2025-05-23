import React, { useEffect, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import "./Navbar.css";
import { Link } from "react-router";
import Logo from "../../Assets/Allah_s1-removebg-preview.png";
import { IoLogoWhatsapp } from "react-icons/io5";
import FormFloat from "./FormFloat";

const Navbar = (props) => {
    const [activeLink, setActiveLink] = useState("/");
    const [isCollapseOpen, setIsCollapseOpen] = useState(false);
    const [formopen, setFormopen] = useState(false);
    const [navtrns, setNavtrns] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const show = window.scrollY > 100;
            setNavtrns(show)
        };

        window.addEventListener("scroll", handleScroll);

        // Cleanup function to remove the event listener
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLinkClick = (path) => {
        window.scrollTo({
            top: 0,
            behavior: "auto",
        });
        setActiveLink(path);
        closeMenu();
    };

    const closeMenu = () => {
        const navbarCollapse = document.getElementById("navbarSupportedContent");
        if (navbarCollapse.classList.contains("show")) {
            navbarCollapse.classList.remove("show");
        }
        const togglerIcon = document.querySelectorAll(".toggler-icon");
        togglerIcon.forEach((icon) => {
            icon.classList.toggle("active");
        });
        setIsCollapseOpen(!isCollapseOpen);
    };

    const formIsOpen = () => {
        setFormopen(!formopen);
    };

    const formIsClose = () => {
        setFormopen(false);
    };

    return (
        <>
            <div className={`navBar ${navtrns}`}>
                <div id="myNavMenu" className="nav-menu">
                    <nav className="row navbar navbar-expand-lg navbar-light align-items-lg-end">
                        <div className="container-fluid">
                            <div className="company-logo">
                                <div className="company-logo-box">
                                    <Link
                                        className={`nav-link ${activeLink === "/" ? "active" : ""}`}
                                        to="/"
                                    >
                                        <img src={Logo} alt="" />
                                    </Link>
                                </div>
                            </div>
                            <div className="nav-button">
                                <button
                                    className={`navbar-toggler ${isCollapseOpen ? "" : "collapsed"
                                        } d-flex d-lg-none flex-column justify-content-around`}
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#navbarSupportedContent"
                                    aria-controls="navbarSupportedContent"
                                    aria-expanded="false"
                                    aria-label="Toggle navigation"
                                    onClick={closeMenu}
                                >
                                    <span className="toggler-icon top-bar"></span>
                                    <span className="toggler-icon middle-bar"></span>
                                    <span className="toggler-icon bottom-bar"></span>
                                </button>
                            </div>
                            <div className="navbar-items">
                                <div
                                    className="collapse navbar-collapse"
                                    id="navbarSupportedContent"
                                >
                                    <ul className="navbar-nav ml-auto">
                                        
                                        <li className="nav-item">
                                            <Link
                                                className={`nav-link ${activeLink === "/namaz" ? "active" : ""
                                                    }`}
                                                to="/namaz"
                                                onClick={() => handleLinkClick("/namaz")}
                                            >
                                                Namaz
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                           
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Navbar;