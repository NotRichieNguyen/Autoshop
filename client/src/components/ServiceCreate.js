import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ServiceCreate.css";

const ServiceCreate = ({ vehicleId, onServiceAdded }) => {
  const [formData, setFormData] = useState({
    description: "",
    parts: "",
    labor: "",
    vehicle_id: vehicleId, // Use the passed vehicle ID
  });

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      vehicle_id: vehicleId, // Update vehicle_id whenever vehicleId prop changes
    }));
  }, [vehicleId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/services", formData)
      .then((response) => {
        console.log("Service added:", response.data);
        onServiceAdded(response.data); // Notify parent component of new service
        setFormData({
          description: "",
          parts: "",
          labor: "",
          vehicle_id: vehicleId, // Reset vehicle_id
        }); // Clear form
      })
      .catch((error) => {
        console.error("There was an error adding the service!", error);
      });
  };

  return (
    <div className="service-root">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <input
          type="number"
          name="parts"
          value={formData.parts}
          onChange={handleChange}
          placeholder="Parts Cost"
          required
        />
        <input
          type="number"
          name="labor"
          value={formData.labor}
          onChange={handleChange}
          placeholder="Labor Cost"
          required
        />
        <button type="submit">Add Service</button>
      </form>
    </div>
  );
};

export default ServiceCreate;
