import React, { useState } from "react";
import axios from "axios";

const CustomerCreate = ({ onCustomerAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    make: "",
    model: "",
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
        setFormData({ name: "", year: "", make: "", model: "" }); // Clear form
      })
      .catch((error) => {
        console.error("There was an error adding the customer!", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        type="number"
        name="year"
        value={formData.year}
        onChange={handleChange}
        placeholder="Year"
        required
      />
      <input
        type="text"
        name="make"
        value={formData.make}
        onChange={handleChange}
        placeholder="Make"
        required
      />
      <input
        type="text"
        name="model"
        value={formData.model}
        onChange={handleChange}
        placeholder="Model"
        required
      />
      <button type="submit">Add Customer</button>
    </form>
  );
};

export default CustomerCreate;
