import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import AWSConnectModal from "../components/AWSConnectModal";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [isAWSModalOpen, setIsAWSModalOpen] = useState(false); // AWS Connect Modal
  const [selectedVpc, setSelectedVpc] = useState("");
  const [selectedSubnet, setSelectedSubnet] = useState("");
  const [selectedVmIds, setSelectedVmIds] = useState([]); // IDs of selected VMs
  const [vpcData, setVpcData] = useState([]);
  const [subnetData, setSubnetData] = useState([]);
  const [vmData, setVmData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5001/get-vpcs")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setVpcData(data);
        } else {
          console.error("Unexpected data format:", data);
          setVpcData([]);
        }
      })
      .catch((error) => console.error("Error fetching VPCs:", error));
  }, []);

  const handleConnect = async (credentials) => {
    try {
      const response = await fetch("http://localhost:5001/configure-aws", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        alert("AWS configured successfully!");
        fetch("http://localhost:5001/get-vpcs")
          .then((response) => response.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setVpcData(data);
            } else {
              console.error("Unexpected data format:", data);
            }
          })
          .catch((error) => console.error("Error fetching VPCs:", error));
      } else {
        console.error("Error configuring AWS:", data.error);
        alert("Error configuring AWS. Check console for details.");
      }
    } catch (error) {
      console.error("Error connecting to AWS:", error);
      alert("An error occurred while connecting to AWS. Please try again.");
    }
  };

  const handleVpcChange = (vpcId) => {
    setSelectedVpc(vpcId);
    setSelectedSubnet(""); // Reset subnet selection
    setVmData([]); // Reset VM data

    fetch("http://localhost:5001/get-subnets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vpcId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSubnetData(data);
        } else {
          console.error("Unexpected data format:", data);
          setSubnetData([]);
        }
      })
      .catch((error) => console.error("Error fetching subnets:", error));
  };

  const handleSubnetChange = (subnetId) => {
    setSelectedSubnet(subnetId);
    setVmData([]); // Reset VM data

    fetch("http://localhost:5001/get-vms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subnetId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setVmData(data);
        } else {
          console.error("Unexpected data format:", data);
          setVmData([]);
        }
      })
      .catch((error) => console.error("Error fetching VMs:", error));
  };

  const toggleVmSelection = (vmId) => {
    setSelectedVmIds((prevSelected) =>
      prevSelected.includes(vmId)
        ? prevSelected.filter((id) => id !== vmId)
        : [...prevSelected, vmId]
    );
  };

  const saveSelectedVms = () => {
    const selectedVms = vmData.filter((vm) => selectedVmIds.includes(vm.id));
    fetch("http://localhost:5001/save-vms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedVms),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert("VMs saved successfully!");
          setSelectedVmIds([]); // Reset selection

          navigate("/dr-plan");
        } else {
          console.error(data.error);
          alert("Error saving VMs. Check console for details.");
        }
      })
      .catch((error) => console.error("Error saving VMs:", error));
  };

  return (
    <div>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Disaster Recovery Tool</h1>

        <div className="flex items-center space-x-4">
          <button
            className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg transform hover:scale-105 transition duration-300"
            onClick={() => setIsAWSModalOpen(true)}
          >
            <FaUserCircle className="text-white text-2xl" />
          </button>
          <AWSConnectModal
            isOpen={isAWSModalOpen}
            onClose={() => setIsAWSModalOpen(false)}
            onConnect={(credentials) => handleConnect(credentials)}
          />
          <select
            className="p-2 bg-white border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 hover:bg-gray-100"
            defaultValue="AWS"
          >
            <option value="AWS">AWS</option>
            <option value="Azure">Azure</option>
            <option value="GCP">GCP</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded-lg shadow flex flex-col items-center">
          <div className="text-blue-500 text-4xl mb-2">🖥️</div>
          <p className="text-sm">Total VMs</p>
          <h2 className="text-2xl font-bold">2</h2>
        </div>
        <div className="p-4 bg-white rounded-lg shadow flex flex-col items-center">
          <div className="text-blue-500 text-4xl mb-2">🗂️</div>
          <p className="text-sm">S3 Buckets</p>
          <h2 className="text-2xl font-bold">2</h2>
        </div>
        <div className="p-4 bg-white rounded-lg shadow flex flex-col items-center">
          <div className="text-blue-500 text-4xl mb-2">🛢️</div>
          <p className="text-sm">Databases</p>
          <h2 className="text-2xl font-bold">2</h2>
        </div>
      </div>

      {/* VPC and Subnet Dropdowns */}
      <div className="p-6 bg-white rounded-lg shadow mb-6">
        <h2 className="text-lg font-bold mb-4">AWS Resources</h2>

        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-700 mb-2">Select VPC</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedVpc}
              onChange={(e) => handleVpcChange(e.target.value)}
            >
              <option value="">Select VPC</option>
              {vpcData.map((vpc) => (
                <option key={vpc.id} value={vpc.id}>
                  {vpc.name} ({vpc.id})
                </option>
              ))}
            </select>
          </div>

          {selectedVpc && (
            <div className="w-1/2">
              <label className="block text-gray-700 mb-2">Select Subnet</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedSubnet}
                onChange={(e) => handleSubnetChange(e.target.value)}
              >
                <option value="">Select Subnet</option>
                {subnetData.map((subnet) => (
                  <option key={subnet.id} value={subnet.id}>
                    {subnet.name} ({subnet.id})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {selectedSubnet && (
          <div>
            <h3 className="text-md font-bold mb-2">Virtual Machines</h3>
            <div className="flex justify-end mb-4">
              <button
                onClick={saveSelectedVms}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Selected VMs
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {vmData.map((vm) => (
                <div
                  key={vm.id}
                  className="p-4 bg-gray-100 border rounded shadow-sm flex flex-col items-start"
                >
                  <div className="flex items-center justify-between w-full">
                    <h4 className="font-bold">{vm.name || "Unnamed Instance"}</h4>
                    <input
                      type="checkbox"
                      checked={selectedVmIds.includes(vm.id)}
                      onChange={() => toggleVmSelection(vm.id)}
                    />
                  </div>
                  <p><strong>ID:</strong> {vm.id}</p>
                  <p><strong>Type:</strong> {vm.type}</p>
                  <p><strong>vCPUs:</strong> {vm.vcpus}</p>
                  <p><strong>RAM:</strong> {vm.ram}</p>
                  <span
                    className={`px-2 py-1 mt-2 rounded ${
                      vm.state === "running"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {vm.state}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
