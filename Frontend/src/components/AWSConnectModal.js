import React, { useState } from "react";

const AWSConnectModal = ({ isOpen, onClose, onConnect }) => {
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [region, setRegion] = useState("");

  if (!isOpen) return null;

  const handleConnect = () => {
    if (!accessKeyId || !secretAccessKey || !region) {
      alert("Please fill in all fields");
      return;
    }
    onConnect({ accessKeyId, secretAccessKey, region });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Connect AWS Account</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Access Key ID</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={accessKeyId}
            onChange={(e) => setAccessKeyId(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Secret Access Key</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={secretAccessKey}
            onChange={(e) => setSecretAccessKey(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Region</label>
          <select
            className="w-full p-2 border rounded"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">Select Region</option>
            <option value="us-east-1">US East (N. Virginia)</option>
            <option value="us-west-1">US West (N. California)</option>
            <option value="eu-west-2">Europe (London)</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleConnect}
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default AWSConnectModal;
