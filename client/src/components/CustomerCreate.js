import React, { useState } from "react";
import axios from "axios";
import "../styles/CustomerCreate.css";

// name address phone yearmakemodel vin license color mil tech

const CustomerCreate = ({ onCustomerAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    yearmakemodel: "",
    vin: "",
    license: "",
    color: "",
    mil: "",
    tech: "",
    service_date: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/customers", formData)
      .then((response) => {
        console.log("Customer added:", response.data);
        onCustomerAdded(response.data); // Notify parent component of new customer
        setFormData({
          name: "",
          address: "",
          phone: "",
          yearmakemodel: "",
          vin: "",
          license: "",
          color: "",
          mil: "",
          tech: "",
          service_date: "",
        }); // Clear form
      })
      .catch((error) => {
        console.error("There was an error adding the customer!", error);
      });
  };
  // name address phone yearmakemodel vin license color mil tech
  return (
    <div className="create-root">
      <h2 style={{ marginTop: "10px" }}>Create a New Customer</h2>
      <form className="create-form" onSubmit={handleSubmit}>
        <input
          className="create-input"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />

        <input
          className="create-input"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="address"
          required
        />
        <input
          className="create-input"
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="phone"
          required
        />
        <input
          className="create-input"
          type="text"
          name="yearmakemodel"
          value={formData.yearmakemodel}
          onChange={handleChange}
          placeholder="yearmakemodel"
          required
        />
        <input
          className="create-input"
          type="text"
          name="vin"
          value={formData.vin}
          onChange={handleChange}
          placeholder="vin"
          required
        />
        <input
          className="create-input"
          type="text"
          name="license"
          value={formData.license}
          onChange={handleChange}
          placeholder="license"
          required
        />
        <input
          className="create-input"
          type="text"
          name="color"
          value={formData.color}
          onChange={handleChange}
          placeholder="color"
          required
        />
        <input
          className="create-input"
          type="text"
          name="mil"
          value={formData.mil}
          onChange={handleChange}
          placeholder="mil"
          required
        />
        <input
          className="create-input"
          type="text"
          name="tech"
          value={formData.tech}
          onChange={handleChange}
          placeholder="tech"
          required
        />
        <input
          className="create-input"
          type="text"
          name="service_date"
          value={formData.service_date}
          onChange={handleChange}
          placeholder="service_date"
          required
        />
        <div className="create-submit">
          <button className="submit" type="submit">
            Add Customer
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerCreate;
