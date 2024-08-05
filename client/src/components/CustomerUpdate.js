import React, { useState } from "react";

const CustomerUpdate = ({ customer }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState(customer.name);

  const toggleModal = () => setShowModal(!showModal);

  const handleInputChange = (e) => {
    setName(e.target.value);
  };

  const updateName = async () => {
    try {
      const body = { name };
      const response = await fetch(
        `http://localhost:5000/api/customers/${customer.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update the name");
      }
      // Optionally close the modal after successful update
      toggleModal();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-info btn-lg"
        onClick={toggleModal}
      >
        Edit
      </button>

      {showModal && (
        <div className="modal" role="dialog" style={{ display: "block" }}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" onClick={toggleModal}>
                  &times;
                </button>
                <h4 className="modal-title">Edit Customer</h4>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  value={name}
                  onChange={handleInputChange}
                  autoFocus
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={updateName}
                >
                  Edit
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
