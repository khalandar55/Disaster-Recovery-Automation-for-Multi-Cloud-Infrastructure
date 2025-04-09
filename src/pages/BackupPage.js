import React from "react";
import { useParams } from "react-router-dom"; // To get VM ID from URL

const BackupPage = () => {
  const { vmId } = useParams(); // Extract VM ID from URL

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Backup for VM: {vmId}</h1>
      <p>
        This page will allow you to configure backup options for the selected
        virtual machine.
      </p>
      {/* Add Backup configuration details here */}
    </div>
  );
};

export default BackupPage;
