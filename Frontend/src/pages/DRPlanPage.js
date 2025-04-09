import React, { useState, useEffect } from "react";
import { Button, Input, Select, Modal } from "../components/ui";

const DRPlanPage = () => {
  const [step, setStep] = useState(1);
  const [drPlans, setDRPlans] = useState([]);
  const [lifecyclePolicies, setLifecyclePolicies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editPlanId, setEditPlanId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [drPlanData, setDrPlanData] = useState({
    planName: "",
    cloudProvider: "AWS",
    lifecyclePolicies: [],
    rto: "4 hours",
    rpo: "1 hour",
    backupLocation: "us-east-1",
    restorePriority: "High",
    failoverType: "Hot Standby",
    drRegion: "us-west-2",
    notificationEmails: "",
  });

  // New state variables for bulk actions
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [isBulkStatusModalOpen, setIsBulkStatusModalOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState("Active");

  // Fetch DR plans on mount
  useEffect(() => {
    fetch("http://localhost:5001/api/drplans")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched DR Plans:", data);
        setDRPlans(data);
      })
      .catch((error) => console.error("Error fetching DR Plans:", error));
  }, []);

  // Fetch lifecycle policies
  useEffect(() => {
    fetch("http://localhost:5001/api/lifecycle-policies")
      .then((response) => response.json())
      .then((data) => {
        setLifecyclePolicies(data);
      })
      .catch((error) =>
        console.error("Error fetching Lifecycle Policies:", error)
      );
  }, []);

  // Handle form data updates
  const updateFormData = (field, value) => {
    setDrPlanData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Reset form after submit/close
  const resetForm = () => {
    setIsModalOpen(false);
    setStep(1);
    setIsEditMode(false);
    setEditPlanId(null);
    setDrPlanData({
      planName: "",
      cloudProvider: "AWS",
      lifecyclePolicies: [],
      rto: "4 hours",
      rpo: "1 hour",
      backupLocation: "us-east-1",
      restorePriority: "High",
      failoverType: "Hot Standby",
      drRegion: "us-west-2",
      notificationEmails: "",
    });
  };

  // Handle "Edit"
  const handleEditPlan = (plan) => {
    const { _id, ...rest } = plan;
    setDrPlanData(rest);
    setEditPlanId(_id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Handle "Delete"
  const handleDeletePlan = (planId) => {
    fetch(`http://localhost:5001/api/drplans/${planId}`, { method: "DELETE" })
      .then((response) => response.json())
      .then((data) => {
        console.log("Deleted Successfully:", data);
        setDRPlans((prevPlans) =>
          prevPlans.filter((plan) => plan._id !== planId)
        );
      })
      .catch((error) => console.error("Error deleting DR Plan:", error));
  };

  // Handle "Submit" or "Update"
  const handleSubmit = () => {
    console.log("Submitting DR Plan Data:", drPlanData);

    if (isEditMode) {
      // Update existing DR Plan
      const { _id, ...updateData } = drPlanData; // remove _id from body

      fetch(`http://localhost:5001/api/drplans/${editPlanId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(`Failed to update plan. Server says: ${text}`);
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log("DR Plan updated:", data);
          if (data.plan) {
            setDRPlans((prevPlans) =>
              prevPlans.map((plan) =>
                plan._id === editPlanId ? data.plan : plan
              )
            );
          }
          resetForm();
        })
        .catch((error) => {
          console.error("Error updating DR Plan:", error);
          alert(error.message);
        });
    } else {
      // Create new DR Plan
      fetch("http://localhost:5001/api/drplans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(drPlanData),
      })
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(`Failed to create plan. Server says: ${text}`);
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log("DR Plan created:", data);
          if (data.plan) {
            setDRPlans((prevPlans) => [...prevPlans, data.plan]);
          }
          resetForm();
        })
        .catch((error) => {
          console.error("Error creating DR Plan:", error);
          alert(error.message);
        });
    }
  };

  // Handle checkbox selection for bulk action
  const handleSelectPlan = (planId) => {
    setSelectedPlans((prev) => {
      if (prev.includes(planId)) {
        return prev.filter((id) => id !== planId);
      } else {
        return [...prev, planId];
      }
    });
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = () => {
    Promise.all(
      selectedPlans.map((planId) =>
        fetch(`http://localhost:5001/api/drplans/${planId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: bulkStatus }),
        }).then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(text);
            });
          }
          return response.json();
        })
      )
    )
      .then(() => {
        // Update the UI with the new status for the selected plans
        setDRPlans((prevPlans) =>
          prevPlans.map((plan) => {
            if (selectedPlans.includes(plan._id)) {
              return { ...plan, status: bulkStatus };
            }
            return plan;
          })
        );
        setSelectedPlans([]);
        setIsBulkStatusModalOpen(false);
      })
      .catch((error) => {
        console.error("Error updating status for selected DR Plans:", error);
        alert("Error updating status: " + error.message);
      });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Page Header */}
      <h1 className="text-2xl font-bold mb-4">Disaster Recovery Plan</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-gray-500 text-lg">Total Plans</h2>
          <p className="text-2xl font-bold">{drPlans.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-gray-500 text-lg">Active Plans</h2>
          <p className="text-2xl font-bold">{drPlans.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-gray-500 text-lg">Last Modified</h2>
          <p className="text-lg">{new Date().toLocaleString()}</p>
        </div>
      </div>

      {/* DR Plan Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recovery Plans</h2>
          <div className="flex items-center space-x-2">
            <Button
              disabled={selectedPlans.length === 0}
              onClick={() => setIsBulkStatusModalOpen(true)}
            >
              Actions
            </Button>
            <Button
              onClick={() => {
                setIsModalOpen(true);
                setIsEditMode(false);
              }}
            >
              + New DR Plan
            </Button>
          </div>
        </div>

        {drPlans.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No DR Plans found.
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">Select</th>
                <th className="p-3">Plan Name</th>
                <th className="p-3">Cloud Provider</th>
                <th className="p-3">Last Updated</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drPlans.map((plan) => (
                <tr key={plan._id} className="border-t">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedPlans.includes(plan._id)}
                      onChange={() => handleSelectPlan(plan._id)}
                    />
                  </td>
                  <td className="p-3">{plan.planName || "N/A"}</td>
                  <td className="p-3">{plan.cloudProvider || "N/A"}</td>
                  <td className="p-3">
                    {plan.lastUpdated
                      ? new Date(plan.lastUpdated).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="p-3">
                    {/* Conditional styling for status */}
                    <span
                      className={
                        plan.status === "Active"
                          ? "bg-green-200 text-green-700 px-3 py-1 rounded-md text-sm"
                          : "bg-red-200 text-red-700 px-3 py-1 rounded-md text-sm"
                      }
                    >
                      {plan.status || "Active"}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleEditPlan(plan)}
                      className="text-blue-500 hover:underline mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan._id)}
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

      {/* Multi-Step Modal for Creating/Editing a DR Plan */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={resetForm}
          title={isEditMode ? "Edit DR Plan" : "Create New DR Plan"}
        >
          <div className="max-w-lg mx-auto space-y-4">
            {step === 1 && (
              <>
                <Input
                  label="Plan Name"
                  value={drPlanData.planName}
                  onChange={(e) =>
                    updateFormData("planName", e.target.value)
                  }
                />
                <Select
                  label="Cloud Provider"
                  options={["AWS", "Azure", "GCP", "On-Prem"]}
                  value={drPlanData.cloudProvider}
                  onChange={(value) =>
                    updateFormData("cloudProvider", value)
                  }
                />
              </>
            )}
            {step === 2 && (
              <Select
                label="Select Lifecycle Policies"
                options={lifecyclePolicies.map((p) => p.name)}
                isMulti
                value={drPlanData.lifecyclePolicies}
                onChange={(value) =>
                  updateFormData("lifecyclePolicies", value)
                }
              />
            )}
            {step === 3 && (
              <>
                <Select
                  label="RTO"
                  options={["1 hour", "4 hours", "12 hours", "24 hours"]}
                  value={drPlanData.rto}
                  onChange={(value) => updateFormData("rto", value)}
                />
                <Select
                  label="RPO"
                  options={[
                    "15 min",
                    "1 hour",
                    "6 hours",
                    "12 hours",
                    "24 hours",
                  ]}
                  value={drPlanData.rpo}
                  onChange={(value) => updateFormData("rpo", value)}
                />
              </>
            )}

            <div className="flex justify-between pt-2">
              {step > 1 && (
                <Button onClick={() => setStep(step - 1)}>Back</Button>
              )}
              {step < 3 ? (
                <Button onClick={() => setStep(step + 1)}>Next</Button>
              ) : (
                <Button onClick={handleSubmit}>
                  {isEditMode ? "Update" : "Submit"}
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Smaller Modal for Bulk Status Update */}
      {isBulkStatusModalOpen && (
        <Modal
          isOpen={isBulkStatusModalOpen}
          onClose={() => setIsBulkStatusModalOpen(false)}
          title="Change Status"
          className="max-w-sm"  // <-- Limit the width
        >
          <div className="space-y-4">
            <Select
              label="Update Status"
              options={["Active", "Inactive"]}
              value={bulkStatus}
              onChange={(value) => setBulkStatus(value)}
            />
            <div className="flex justify-end pt-2">
              <Button onClick={handleBulkStatusUpdate}>Update Status</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DRPlanPage;
