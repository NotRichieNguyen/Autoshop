import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomerUpdate from "./CustomerUpdate";

const CustomerRead = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/customers"); // This will be proxied to http://localhost:5000/api/customers
        setCustomers(response.data);
      } catch (err) {
        console.error("Error fetching data:", err.message);
      }
    };

    fetchData();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("/api/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // delete
  const deleteCustomer = async (id) => {
    try {
      const deleteCustomer = await fetch(
        `http://localhost:5000/api/customers/${id}`,
        {
          method: "DELETE",
        }
      );

      console.log(deleteCustomer);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchCustomers();
    const intervalId = setInterval(fetchCustomers, 1000); // Fetch every 5 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <>
      <h1>List of Customers</h1>
      <ul className="list-group">
        {customers.map((customer) => (
          <li className="list-group-item" key={customer.id}>
            {customer.name} - {customer.year} {customer.make} {customer.model}{" "}
            <CustomerUpdate customer={customer} />
            <button
              className="btn btn-danger"
              onClick={() => deleteCustomer(customer.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default CustomerRead;
