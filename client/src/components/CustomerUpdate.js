import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CustomerUpdate.css";

const CustomerUpdate = ({ customer, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    yearmakemodel: "",
    vin: "",
    license: "",
    mil: "",
    color: "",
    tech: "",
    service_date: "",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        address: customer.address,
        phone: customer.phone,
        yearmakemodel: customer.yearmakemodel,
        vin: customer.vin,
        license: customer.license,
        mil: customer.mil,
        color: customer.color,
        tech: customer.tech,
        service_date: customer.service_date.slice(0, 10),
      });
    }
  }, [customer]);

  const toggleModal = () => setShowModal(!showModal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const updateCustomer = async () => {
    try {
      await axios.put(`/api/customers/${customer.id}`, formData);
      toggleModal();
      onUpdate(); // Call the onUpdate callback to refresh data
    } catch (err) {
      console.error(err.message);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <button
        style={{ border: "none", backgroundColor: "white", cursor: "pointer" }}
        onClick={toggleModal}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          class="bi bi-pencil"
          viewBox="0 0 16 16"
        >
          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
        </svg>
      </button>

      {showModal && (
        <div className="modal" role="dialog" style={{ display: "block" }}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title">Edit Customer</h6>
                <button type="button" className="close" onClick={toggleModal}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                {Object.keys(formData).map((key) => (
                  <div key={key} className="form-group">
                    <label>{key.replace("_", " ")}</label>
                    <input
                      type="text"
                      name={key}
                      value={formData[key]}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={updateCustomer}
                >
                  Edit Information
                </button>
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={toggleModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerUpdate;
