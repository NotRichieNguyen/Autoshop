import React from "react";
import "../styles/navbar.css";

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li className="link" onClick={() => setActiveTab("read")}>
          View Customers
        </li>
        <li className="link" onClick={() => setActiveTab("create")}>
          Add Customer
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
