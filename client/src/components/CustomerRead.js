import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/CustomerRead.css";
import Document from "./Document";

const CustomerRead = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Page tracking state
  const [searchName, setSearchName] = useState("");
  const [searchedCustomer, setSearchedCustomer] = useState(null); // Searched customer
  const [selectedCustomer, setSelectedCustomer] = useState(null); // For viewing Document
  const [services, setServices] = useState([]);

  const customersPerPage = 10; // Number of customers per page

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

  const fetchServices = async (vehicleId) => {
    try {
      const response = await axios.get(`/api/vehicles/${vehicleId}/services`);
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    }
  };

  // Search by customer name
  const fetchCustomerByName = async (name) => {
    try {
      const response = await axios.get(`/api/customers/${name}`);
      setSearchedCustomer(response.data);
      fetchServices(response.data.id); // Fetch services for the searched customer
    } catch (error) {
      console.error("Error fetching customer:", error);
      setSearchedCustomer(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchName) {
      fetchCustomerByName(searchName);
    }
  };

  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  // Handlers for pagination
  const handleNextPage = () => {
    if (indexOfLastCustomer < customers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // View customer document
  const openDocument = (customer) => {
    setSelectedCustomer(customer);
    fetchServices(customer.id); // Fetch services for the selected customer
  };

  return (
    <>
      <div className="read-root">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Enter customer name"
            className="search-input"
          />
          <button className="search-submit" type="submit">
            Search
          </button>
        </form>

        {/* Display searched customer if available */}
        {searchedCustomer && (
          <div className="searched-customer">
            <div className="customer-info" key={searchedCustomer.id}>
              <div className="read-id">{searchedCustomer.id}</div>
              <div className="read-name">{searchedCustomer.name}</div>
              <div className="read-phone">{searchedCustomer.phone}</div>
              <div className="read-YMM">{searchedCustomer.yearmakemodel}</div>
              <div className="read-service_date">
                {searchedCustomer.service_date.substring(0, 10)}
              </div>
              <button
                className="open-document-btn"
                onClick={() => openDocument(searchedCustomer)}
                style={{ marginRight: "10px" }}
              >
                View
              </button>
            </div>
          </div>
        )}

        {/* List of customers (paginated) */}
        <div className="read-header">
          <h2>List of Customers</h2>
        </div>
        <ul className="customer-list">
          <li className="customer-info">
            <div className="read-id">ID</div>
            <div className="read-name">NAME</div>
            <div className="read-phone">PHONE</div>
            <div className="read-YMM">YEAR/MAKE/MODEL</div>
            <div className="read-service_date">DATE</div>
            <div className="read-view">VIEW</div>
          </li>
          {currentCustomers.map((customer) => (
            <li className="customer-info" key={customer.id}>
              <div className="read-id">{customer.id}</div>
              <div className="read-name">{customer.name}</div>
              <div className="read-phone">{customer.phone}</div>
              <div className="read-YMM">{customer.yearmakemodel}</div>
              <div className="read-service_date">
                {customer.service_date.substring(0, 10)}
              </div>
              <button
                className="open-document-btn"
                style={{ marginRight: "10px" }}
                onClick={() => openDocument(customer)} // Open document on button click
              >
                View
              </button>
            </li>
          ))}
        </ul>

        {/* Pagination Buttons */}
        <div className="pagination">
          <button
            className="prev-button"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="next-button"
            onClick={handleNextPage}
            disabled={indexOfLastCustomer >= customers.length}
          >
            Next
          </button>
        </div>
      </div>

      {/* Document component to view customer details */}
      {selectedCustomer && (
        <Document
          customer={selectedCustomer}
          services={services}
          onServiceAdded={() => fetchServices(selectedCustomer.id)}
        />
      )}
    </>
  );
};

export default CustomerRead;
