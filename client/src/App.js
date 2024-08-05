import React, { useState } from "react";
import CustomerCreate from "./components/CustomerCreate";
import CustomerRead from "./components/CustomerRead";

const App = () => {
  const [customers, setCustomers] = useState([]);

  const handleCustomerAdded = (newCustomer) => {
    setCustomers([...customers, newCustomer]);
  };

  return (
    <>
      <CustomerCreate onCustomerAdded={handleCustomerAdded} />
      <CustomerRead customers={customers} />
    </>
  );
};

export default App;
