import requests

API_URL = "http://localhost:5001/api/drplans"

sample_dr_plans = [  [
  {
    "planName": "AWS Production DR",
    "cloudProvider": "AWS",
    "lifecyclePolicies": ["Backup-Critical-1", "High-Availability"],
    "rto": "4 hours",
    "rpo": "1 hour",
    "backupLocation": "us-east-1",
    "restorePriority": "High",
    "failoverType": "Hot Standby",
    "drRegion": "us-west-2",
    "notificationEmails": "admin@example.com"
  },
  {
    "planName": "Azure Finance DR",
    "cloudProvider": "Azure",
    "lifecyclePolicies": ["Compliance-Policy", "Monthly-Backup"],
    "rto": "12 hours",
    "rpo": "6 hours",
    "backupLocation": "europe-west",
    "restorePriority": "Medium",
    "failoverType": "Cold Standby",
    "drRegion": "europe-north",
    "notificationEmails": "finance@example.com"
  },
  {
    "planName": "GCP R&D DR",
    "cloudProvider": "GCP",
    "lifecyclePolicies": ["R&D-Archive"],
    "rto": "24 hours",
    "rpo": "12 hours",
    "backupLocation": "us-central1",
    "restorePriority": "Low",
    "failoverType": "Warm Standby",
    "drRegion": "us-east4",
    "notificationEmails": "research@example.com"
  },
  {
    "planName": "Banking Disaster Recovery",
    "cloudProvider": "AWS",
    "lifecyclePolicies": ["Compliance-Policy", "Weekly-Backup"],
    "rto": "1 hour",
    "rpo": "15 min",
    "backupLocation": "us-west-1",
    "restorePriority": "High",
    "failoverType": "Hot Standby",
    "drRegion": "us-east-1",
    "notificationEmails": "security@example.com"
  },
  {
    "planName": "Healthcare DR Strategy",
    "cloudProvider": "Azure",
    "lifecyclePolicies": ["Backup-Critical-2", "Production-DR"],
    "rto": "6 hours",
    "rpo": "30 min",
    "backupLocation": "europe-central",
    "restorePriority": "High",
    "failoverType": "Warm Standby",
    "drRegion": "europe-west",
    "notificationEmails": "healthcare@example.com"
  },
  {
    "planName": "On-Prem Datacenter DR",
    "cloudProvider": "On-Prem",
    "lifecyclePolicies": ["Test-Policy-1", "On-Demand-Backup"],
    "rto": "8 hours",
    "rpo": "4 hours",
    "backupLocation": "Local-DC",
    "restorePriority": "Medium",
    "failoverType": "Cold Standby",
    "drRegion": "DR-Site-1",
    "notificationEmails": "infra@example.com"
  },
  {
    "planName": "SaaS Application DR",
    "cloudProvider": "AWS",
    "lifecyclePolicies": ["High-Availability", "Monthly-Backup"],
    "rto": "2 hours",
    "rpo": "45 min",
    "backupLocation": "ap-southeast-1",
    "restorePriority": "High",
    "failoverType": "Hot Standby",
    "drRegion": "ap-southeast-2",
    "notificationEmails": "ops@example.com"
  },
  {
    "planName": "E-Commerce DR Plan",
    "cloudProvider": "GCP",
    "lifecyclePolicies": ["Weekly-Backup", "Dev-Test-Policy"],
    "rto": "3 hours",
    "rpo": "30 min",
    "backupLocation": "us-east1",
    "restorePriority": "High",
    "failoverType": "Warm Standby",
    "drRegion": "us-central1",
    "notificationEmails": "support@example.com"
  },
  {
    "planName": "Government Agency DR",
    "cloudProvider": "Azure",
    "lifecyclePolicies": ["Backup-Critical-1", "Compliance-Policy"],
    "rto": "4 hours",
    "rpo": "2 hours",
    "backupLocation": "gov-west",
    "restorePriority": "High",
    "failoverType": "Hot Standby",
    "drRegion": "gov-east",
    "notificationEmails": "gov@example.com"
  },
  {
    "planName": "University IT DR",
    "cloudProvider": "AWS",
    "lifecyclePolicies": ["R&D-Archive", "Test-Policy-2"],
    "rto": "10 hours",
    "rpo": "5 hours",
    "backupLocation": "us-west-2",
    "restorePriority": "Medium",
    "failoverType": "Warm Standby",
    "drRegion": "us-east-1",
    "notificationEmails": "itadmin@example.com"
  }
]

]

for plan in sample_dr_plans:
    response = requests.post(API_URL, json=plan)
    if response.status_code == 201:
        print(f"✅ Created: {plan['planName']}")
    else:
        print(f"❌ Failed to create {plan['planName']}: {response.text}")