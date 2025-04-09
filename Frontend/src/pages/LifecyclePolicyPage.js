import React, { useState, useEffect } from "react";
import { Button, Modal, Input, Select } from "../components/ui";
import SchedulerForm from "../components/SchedulerForm";

const LifecyclePolicyPage = () => {
  const [policies, setPolicies] = useState([]); // State to store policies
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastModified, setLastModified] = useState("N/A"); // Last modified date

  const [policyData, setPolicyData] = useState({
    name: "",
    criticality: "Critical",
    copies: 1,
    schedule: {},
    _id: null,
  });

  // Handle editing a policy: populate modal form with existing data
  const handleEditPolicy = (policy) => {
    setPolicyData({
      _id: policy._id,
      name: policy.name,
      criticality: policy.criticality,
      copies: policy.copies,
      schedule: policy.schedule || {},
    });
    setIsModalOpen(true);
  };

  // Handle creating a new policy
  const handleCreatePolicy = () => {
    fetch("http://localhost:5001/api/lifecycle-policies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(policyData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.policy) {
          setPolicies([...policies, data.policy]);
          setLastModified(new Date().toLocaleString());
          setIsModalOpen(false);
          setPolicyData({
            name: "",
            criticality: "Critical",
            copies: 1,
            schedule: {},
            _id: null,
          });
        }
      })
      .catch((error) => console.error("Error creating Lifecycle Policy:", error));
  };

  // Handle updating an existing policy
  const handleUpdatePolicy = () => {
    if (!policyData._id) {
      console.error("Error: No policy ID found for update.");
      return;
    }

    fetch(`http://localhost:5001/api/lifecycle-policies/${policyData._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(policyData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Update error:", data.error);
        } else {
          console.log("Policy updated successfully:", data);
          setPolicies((prevPolicies) =>
            prevPolicies.map((p) =>
              p._id === policyData._id ? { ...p, ...policyData } : p
            )
          );
          setIsModalOpen(false);
        }
      })
      .catch((error) => console.error("Error updating policy:", error));
  };

  // Handle deleting a policy
  const handleDeletePolicy = (policyId) => {
    if (!policyId) {
      console.error("Error: Policy ID is undefined.");
      return;
    }

    fetch(`http://localhost:5001/api/lifecycle-policies/${policyId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setPolicies((prevPolicies) => prevPolicies.filter((p) => p._id !== policyId));
        } else {
          console.error("Error:", data.error);
        }
      })
      .catch((error) => console.error("Error deleting policy:", error));
  };

  // Fetch policies on mount
  useEffect(() => {
    fetch("http://localhost:5001/api/lifecycle-policies")
      .then((response) => response.json())
      .then((data) => {
        setPolicies(data);
        if (data.length > 0) {
          setLastModified(new Date().toLocaleString());
        }
      })
      .catch((error) => console.error("Error fetching Lifecycle Policies:", error));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* 
        1) This is the main header for the page — 
           you can style it however you like, but here’s a simple example. 
      */}
      <h1 className="text-2xl font-bold mb-4">LifeCyclePolicy</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-gray-500 text-lg">Total Policies</h2>
          <p className="text-2xl font-bold">{policies.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-gray-500 text-lg">Active Policies</h2>
          <p className="text-2xl font-bold">
            {policies.filter((p) => p.status === "Active").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-gray-500 text-lg">Last Modified</h2>
          <p className="text-lg">{lastModified}</p>
        </div>
      </div>

      {/* Lifecycle Policies Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Lifecycle Policies</h2>
          <Button
            onClick={() => {
              setPolicyData({
                name: "",
                criticality: "Critical",
                copies: 1,
                schedule: {},
                _id: null,
              });
              setIsModalOpen(true);
            }}
          >
            Create Lifecycle Policy
          </Button>
        </div>

        {policies.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No policies found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">Policy Name</th>
                <th className="p-3">Criticality</th>
                <th className="p-3">Number of Copies</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy._id} className="border-t">
                  <td className="p-3">{policy.name}</td>
                  <td className="p-3">{policy.criticality}</td>
                  <td className="p-3">{policy.copies}</td>
                  <td className="p-3">
                    <span className="bg-green-200 text-green-700 px-3 py-1 rounded-md text-sm">
                      {policy.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleEditPolicy(policy)}
                      className="text-blue-500 hover:underline mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePolicy(policy._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for Creating/Updating Lifecycle Policy */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={policyData._id ? "Update Lifecycle Policy" : "Create Lifecycle Policy"}
        >
          <div className="space-y-4">
            <Input
              label="Policy Name"
              value={policyData.name}
              onChange={(e) => setPolicyData({ ...policyData, name: e.target.value })}
            />
            <Select
              label="Criticality"
              options={["Critical", "Non-Critical"]}
              value={policyData.criticality}
              onChange={(value) => setPolicyData({ ...policyData, criticality: value })}
            />
            <Input
              label="Number of Copies"
              type="number"
              value={policyData.copies}
              onChange={(e) => setPolicyData({ ...policyData, copies: e.target.value })}
            />
            <SchedulerForm
              schedule={policyData.schedule}
              setSchedule={(update) =>
                setPolicyData((prevPolicyData) => ({
                  ...prevPolicyData,
                  schedule:
                    typeof update === "function"
                      ? update(prevPolicyData.schedule || {})
                      : update,
                }))
              }
            />
            {policyData._id ? (
              <Button onClick={handleUpdatePolicy}>Update Policy</Button>
            ) : (
              <Button onClick={handleCreatePolicy}>Create</Button>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LifecyclePolicyPage;
