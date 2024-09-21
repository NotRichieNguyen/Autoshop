import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomerCreate from "./components/CustomerCreate";
import CustomerRead from "./components/CustomerRead";
import Navbar from "./components/navbar"; // Import Navbar
import Login from "./components/Login";
import "./App.css";

const App = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [customers, setCustomers] = useState([]);
  const [activeTab, setActiveTab] = useState("read"); // Track active tab

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchCustomers();
    } else {
      localStorage.removeItem("token");
      axios.defaults.headers.common["Authorization"] = "";
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", {
        username: formData.username,
        password: formData.password,
      });
      setToken(response.data.token);
    } catch (error) {
      console.error("Login error", error);
      alert("Invalid credentials");
    }
  };

  const handleCustomerAdded = (newCustomer) => {
    setCustomers([...customers, newCustomer]);
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("/api/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers", error);
    }
  };

  const handleLogout = () => {
    setToken("");
  };

  return (
    <div>
      {/* Conditionally render the navbar only when token exists */}
      {token && (
        <div className="nav">
          <button className="Btn" onClick={handleLogout}>
            <div className="sign">
              <svg viewBox="0 0 512 512">
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32z"></path>
              </svg>
            </div>
          </button>
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />{" "}
          {/* Navbar here */}
        </div>
      )}

      {/* Render app content if token exists, otherwise show login */}
      {token ? (
        <div className="app-container">
          {activeTab === "read" && <CustomerRead customers={customers} />}
          {activeTab === "create" && (
            <CustomerCreate onCustomerAdded={handleCustomerAdded} />
          )}
        </div>
      ) : (
        <div className="login-root">
          <form className="login-container" onSubmit={handleLogin}>
            <div className="login-header">Sign in</div>
            <input
              placeholder="Username"
              type="text"
              name="username"
              className="login-username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              placeholder="Password"
              type="password"
              name="password"
              className="login-password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div className="login-no-account">
              <div>Don't Have an Account?</div>
              <div style={{ textDecoration: "underline", cursor: "pointer" }}>
                Register here
              </div>
            </div>
            <div className="login-submit">
              <button className="submit-button">Submit</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
// <div className="root">
//   <form className="form" onSubmit={handleLogin}>
//     <p id="heading">Login</p>
//     <div className="field">
//       <input
//         autoComplete="off"
//         placeholder="Username"
//         className="input-field"
//         type="text"
//         name="username"
//         value={formData.username}
//         onChange={handleChange}
//         required
//       />
//     </div>
//     <div className="field">
//       <input
//         placeholder="Password"
//         className="input-field"
//         type="password"
//         name="password"
//         value={formData.password}
//         onChange={handleChange}
//         required
//       />
//     </div>
//     <div className="btn">
//       <button className="button1" type="submit">
//         Login
//       </button>
//     </div>
//   </form>
// </div>
