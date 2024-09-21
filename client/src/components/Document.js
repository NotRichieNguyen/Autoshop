import React, { useEffect, useState } from "react";
import "../styles/Document.css";
import CustomerUpdate from "./CustomerUpdate";
import axios from "axios";
import ServiceCreate from "./ServiceCreate";

const Document = ({ customer, services, onServiceAdded }) => {
  const [customers, setCustomers] = useState([]);
  const [services2, setServices2] = useState([]);
  const [vehicleServices, setVehicleServices] = useState(services || []);

  useEffect(() => {
    setVehicleServices(services);
  }, [services]);

  const handleServiceAdded = async (newVehicleService) => {
    // Notify the parent component to refetch services
    onServiceAdded(newVehicleService);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("/api/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchServices = async (customerId) => {
    try {
      const response = await axios.get(`/api/customers/${customerId}/services`);
      setVehicleServices(response.data); // Update vehicleServices state with the fetched data
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      const deleteCustomer = await fetch(
        `http://localhost:5000/api/customers/${id}`,
        {
          method: "DELETE",
        }
      );

      setCustomers(customers.filter((customer) => customer.id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };
  const deleteService = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/services/${id}`, {
        method: "DELETE",
      });

      // Update vehicleServices locally
      setVehicleServices((prevServices) =>
        prevServices.filter((service) => service.id !== id)
      );

      // Notify parent to refresh services
      onServiceAdded(); // or whatever your handler is named
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleUpdate = () => {
    fetchCustomers();
  };

  // Calculate total parts, tax, and labor
  const calculateTotals = () => {
    const totalParts = vehicleServices.reduce(
      (total, service) => total + parseFloat(service.parts || 0),
      0
    );
    const totalLabor = vehicleServices.reduce(
      (total, service) => total + parseFloat(service.labor || 0),
      0
    );
    const taxRate = 0.0825; // Assuming 8% tax rate
    const tax = totalParts * taxRate;

    return {
      totalParts,
      totalLabor,
      tax,
      grandTotal: totalParts + totalLabor + tax,
    };
  };

  const { totalParts, totalLabor, tax, grandTotal } = calculateTotals();

  // console.log(vehicleServices);

  if (!customer) {
    return <div>No customer selected</div>;
  }

  return (
    <div className="document-root">
      <ServiceCreate
        vehicleId={customer.id}
        onServiceAdded={handleServiceAdded}
      />
      <div className="delete-container">
        <CustomerUpdate customer={customer} onUpdate={handleUpdate} />
        <button
          onClick={() => deleteCustomer(customer.id)}
          style={{
            border: "none",
            backgroundColor: "white",
            cursor: "pointer",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            class="bi bi-trash3-fill"
            viewBox="0 0 16 16"
          >
            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
          </svg>
        </button>
      </div>
      <div className="header-container">
        <h6>TX AUTO CARE, LLC</h6>
      </div>
      <div className="header-container">
        <h2>AUTO SERVICES</h2>
      </div>
      <div className="info-container">
        <div className="info-left">
          <div className="name">Name: {customer.name} </div>
          <div className="address">Address: {customer.address}</div>
          <div className="phone">Phone: {customer.phone}</div>
        </div>
        <div className="info-right">
          <div className="info-right-top">
            <div className="YMM">Y/M/M: {customer.yearmakemodel}</div>
            <div className="vin">Vin: {customer.vin}</div>
          </div>
          <div className="info-right-bottom">
            <div className="license-mil">
              <div className="license">Lic. #: {customer.license}</div>
              <div className="mil">Mil: {customer.mil}</div>
            </div>
            <div className="color-tech">
              <div className="color">Color: {customer.color}</div>
              <div className="tech">Tech: {customer.tech}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="work-container">
        <div className="work-top">
          <div className="work-top-1">PARTS & DESCRIPTION OF WORK</div>
          <div className="work-top-2">PARTS</div>
          <div className="work-top-3" style={{ width: "16.5%" }}>
            LABOR
          </div>
        </div>
        {vehicleServices.map((service) => (
          <div key={service.id} className="work-mid">
            <div className="work-top-1">{service.description}</div>
            <div className="work-top-2">${service.parts}</div>
            <div className="work-top-3">${service.labor}</div>
            <button
              className="work-top-4"
              onClick={() => deleteService(service.id)}
            >
              X
            </button>
          </div>
        ))}
      </div>
      <div className="total-prices-container">
        <div className="work-bot-1">Parts: ${totalParts.toFixed(2)}</div>
        <div className="work-bot-1">Tax: ${tax.toFixed(2)}</div>
        <div className="work-bot-1">Labor: ${totalLabor.toFixed(2)}</div>
        <div className="work-bot-1">Total: ${grandTotal.toFixed(2)}</div>
        <div className="work-bot-1">
          {customer.service_date.substring(0, 10)}
        </div>
      </div>
    </div>
  );
};

export default Document;
