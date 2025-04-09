import React, { useEffect } from "react";
import { Input, Select } from "./ui";

const SchedulerForm = ({ schedule, setSchedule }) => {
  
  useEffect(() => {
    // Reset fields when Retention Type changes
    if (schedule.retentionType === "Count") {
      setSchedule((prev) => ({
        ...prev,
        expireAfterDays: "",
        expireUnit: "",
      }));
    } else if (schedule.retentionType === "Age") {
      setSchedule((prev) => ({
        ...prev,
        snapshotCount: "",
      }));
    }
  }, [schedule.retentionType, setSchedule]);

  return (
    <div className="space-y-4 border-t pt-4">
      <h2 className="text-lg font-semibold">Scheduler Configuration</h2>

      {/* Schedule Name */}
      <Input
        label="Schedule Name"
        value={schedule.name || ""}
        onChange={(e) => setSchedule({ ...schedule, name: e.target.value })}
      />

      {/* Frequency */}
      <Select
        label="Frequency"
        options={["Daily", "Weekly"]}
        value={schedule.frequency || ""}
        onChange={(value) => setSchedule({ ...schedule, frequency: value })}
      />

      {/* Execution Interval */}
      <Select
        label="Every"
        options={["12 hours", "24 hours"]}
        value={schedule.interval || ""}
        onChange={(value) => setSchedule({ ...schedule, interval: value })}
      />

      {/* Start Time */}
      <Input
        label="Starting At"
        type="time"
        value={schedule.startTime || "09:00"}
        onChange={(e) => setSchedule({ ...schedule, startTime: e.target.value })}
      />

      {/* Retention Type Dropdown */}
      <Select
        label="Retention Type"
        options={["Count", "Age"]}
        value={schedule.retentionType || ""}
        onChange={(value) => {
          setSchedule((prev) => ({
            ...prev,
            retentionType: value,
            snapshotCount: value === "Count" ? "" : prev.snapshotCount,
            expireAfterDays: value === "Age" ? "" : prev.expireAfterDays,
            expireUnit: value === "Age" ? "" : prev.expireUnit,
          }));
        }}
      />

      {/* Show "Keep Snapshots" if Count is selected */}
      {schedule.retentionType === "Count" && (
        <div className="flex items-center space-x-2">
          <Input
            label="Keep"
            type="number"
            min="1"
            value={schedule.snapshotCount || ""}
            onChange={(e) => setSchedule({ ...schedule, snapshotCount: e.target.value })}
            required
          />
          <span className="text-gray-600">snapshots in standard tier</span>
        </div>
      )}

      {/* Show "Expire After X" with unit selection if Age is selected */}
      {schedule.retentionType === "Age" && (
        <div className="flex items-center space-x-2">
          <Input
            label="Expire from Standard Tier"
            type="number"
            min="1"
            value={schedule.expireAfterDays || ""}
            onChange={(e) => setSchedule({ ...schedule, expireAfterDays: e.target.value })}
            required
          />
          <Select
            label="Unit"
            options={["days", "weeks", "months", "years"]}
            value={schedule.expireUnit || ""}
            onChange={(value) => setSchedule({ ...schedule, expireUnit: value })}
            required
          />
          <span className="text-gray-600">after creation</span>
        </div>
      )}
    </div>
  );
};

export default SchedulerForm;
