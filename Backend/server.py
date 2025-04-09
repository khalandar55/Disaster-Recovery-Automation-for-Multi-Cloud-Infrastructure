from flask import Flask, request, jsonify
import boto3
from flask_cors import CORS
from pymongo import MongoClient, ReturnDocument
from datetime import datetime
from bson import ObjectId # Import ObjectId



app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from the frontend

# Global AWS client and MongoDB client variables
aws_client = None

# Configure MongoDB connection
MONGO_URI = "mongodb://admin:securepassword@localhost:27017/disaster_recovery?authSource=admin"  # Replace with your MongoDB URI if different
mongo_client = MongoClient(MONGO_URI)
db = mongo_client["disaster_recovery"]  # Database name
vm_collection = db["vms"]  # Collection name for VMs
# Collection for Disaster Recovery Plans
dr_plan_collection = db["dr_plans"]
# Add a collection for lifecycle policies
lifecycle_policy_collection = db["lifecycle_policies"]




# ---------- DR Plan APIs ----------------#

@app.route('/api/drplans', methods=['GET'])
def get_dr_plans():
    try:
        plans = list(dr_plan_collection.find({}))
        for plan in plans:
            plan["_id"] = str(plan["_id"])  # Convert ObjectId to string
        return jsonify(plans), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/drplans', methods=['POST'])
def create_dr_plan():
    try:
        data = request.json
        if not data or "planName" not in data or "cloudProvider" not in data:
            return jsonify({"error": "Missing required fields"}), 400

        new_plan = {
            "planName": data["planName"],
            "cloudProvider": data["cloudProvider"],
            "lifecyclePolicies": data.get("lifecyclePolicies", []),
            "rto": data.get("rto", "4 hours"),
            "rpo": data.get("rpo", "1 hour"),
            "backupLocation": data.get("backupLocation", "us-east-1"),
            "restorePriority": data.get("restorePriority", "High"),
            "failoverType": data.get("failoverType", "Hot Standby"),
            "drRegion": data.get("drRegion", "us-west-2"),
            "notificationEmails": data.get("notificationEmails", ""),
            "lastUpdated": datetime.utcnow().isoformat(),
            "status": "Active",
        }

        inserted_plan = dr_plan_collection.insert_one(new_plan)
        new_plan["_id"] = str(inserted_plan.inserted_id)

        return jsonify({"message": "DR Plan created successfully!", "plan": new_plan}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/drplans/<string:plan_id>', methods=['DELETE'])
def delete_dr_plan(plan_id):
    try:
        if not ObjectId.is_valid(plan_id):
            return jsonify({"error": "Invalid Plan ID format"}), 400

        result = dr_plan_collection.delete_one({"_id": ObjectId(plan_id)})
        if result.deleted_count == 0:
            return jsonify({"error": "DR Plan not found"}), 404

        return jsonify({"message": "DR Plan deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/drplans/<string:plan_id>', methods=['PUT'])
def update_dr_plan(plan_id):
    try:
        if not ObjectId.is_valid(plan_id):
            return jsonify({"error": "Invalid Plan ID format"}), 400

        data = request.json
        # remove _id if present
        data.pop("_id", None)

        # 1. Remove the requirement that planName and cloudProvider must be present
        # if "planName" not in data or "cloudProvider" not in data:
        #     return jsonify({"error": "Missing required fields (planName, cloudProvider)"}), 400

        # 2. Always update 'lastUpdated'
        data["lastUpdated"] = datetime.utcnow().isoformat()

        updated_plan = dr_plan_collection.find_one_and_update(
            {"_id": ObjectId(plan_id)},
            {"$set": data},
            return_document=ReturnDocument.AFTER
        )

        if not updated_plan:
            return jsonify({"error": "DR Plan not found"}), 404

        updated_plan["_id"] = str(updated_plan["_id"])
        return jsonify({"message": "DR Plan updated successfully!", "plan": updated_plan}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



# ----------- End of DR Plan APIs ----------------#




#-------Start of the Lifecyclepolicy page API's-------#


# Add a new collection for lifecycle policies
lifecycle_policy_collection = db["lifecycle_policies"]

#create a new lifecyle policy
@app.route('/api/lifecycle-policies', methods=['POST'])
def create_lifecycle_policy():
    """Creates a new lifecycle policy and stores it in MongoDB."""
    try:
        data = request.json
        if not data or "name" not in data or "schedule" not in data:
            return jsonify({"error": "Missing required fields"}), 400

        new_policy = {
            "name": data["name"],
            "criticality": data.get("criticality", "Non-Critical"),
            "copies": data.get("copies", 1),
            "schedule": data["schedule"],  # Capture the scheduler details
            "createdAt": datetime.utcnow().isoformat(),
            "status": "Active"
        }

        inserted_policy = lifecycle_policy_collection.insert_one(new_policy)
        new_policy["_id"] = str(inserted_policy.inserted_id)  # Convert ObjectId to string
        return jsonify({"message": "Lifecycle Policy created successfully!", "policy": new_policy}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500



#fetch lifecyclepolicies
@app.route('/api/lifecycle-policies', methods=['GET'])
def get_lifecycle_policies():
    """Fetch all lifecycle policies from MongoDB."""
    try:
        policies = list(lifecycle_policy_collection.find({}))
        for policy in policies:
            policy["_id"] = str(policy["_id"])  # Convert ObjectId to string
        return jsonify(policies), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#deletes lifecyclepolicy
@app.route('/api/lifecycle-policies/<string:policy_id>', methods=['DELETE'])
def delete_lifecycle_policy(policy_id):
    """Deletes a lifecycle policy by its MongoDB _id."""
    try:
        if not ObjectId.is_valid(policy_id):
            return jsonify({"error": "Invalid Policy ID format"}), 400
      
        result = lifecycle_policy_collection.delete_one({"_id": ObjectId(policy_id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Lifecycle Policy not found"}), 404

        return jsonify({"message": "Lifecycle Policy deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Update lifecycle policy
@app.route('/api/lifecycle-policies/<string:policy_id>', methods=['PUT'])
def update_lifecycle_policy(policy_id):
    """Updates an existing lifecycle policy in MongoDB."""
    try:
        data = request.json
        print(f"Updating policy ID: {policy_id}")  # Debugging log

        if not ObjectId.is_valid(policy_id):
            return jsonify({"error": "Invalid Policy ID format"}), 400

        # Remove _id field from update payload to avoid errors
        if "_id" in data:
            del data["_id"]

        result = lifecycle_policy_collection.find_one_and_update(
            {"_id": ObjectId(policy_id)},
            {"$set": data},
            return_document=True
        )

        if not result:
            return jsonify({"error": "Lifecycle Policy not found"}), 404

        result["_id"] = str(result["_id"])
        return jsonify({"message": "Lifecycle Policy updated successfully!", "policy": result}), 200
    except Exception as e:
        print("Error updating policy:", str(e))  # Debugging log
        return jsonify({"error": str(e)}), 500




#-------- end of lifecyclepolicy API's-----------#

#mongodb test route
@app.route('/test-mongo', methods=['GET'])
def test_mongo():
    """
    Test the MongoDB connection.
    """
    try:
        # Perform a ping operation to verify the MongoDB connection
        mongo_client.admin.command('ping')
        return jsonify({"message": "MongoDB connection successful!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#configure AWS
@app.route('/configure-aws', methods=['POST'])
def configure_aws():
    global aws_client
    try:
        data = request.json
        access_key = data['accessKeyId']
        secret_key = data['secretAccessKey']
        region = data['region']

        # Initialize the AWS client
        aws_client = boto3.client(
            'ec2',
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name=region
        )
        return jsonify({"message": "AWS configured successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400



#fetch VPC's
@app.route('/get-vpcs', methods=['GET'])
def get_vpcs():
    global aws_client
    if not aws_client:
        return jsonify({"error": "AWS is not configured"}), 400

    try:
        response = aws_client.describe_vpcs()
        vpcs = [
            {"id": vpc['VpcId'], "name": vpc.get('Tags', [{'Value': 'Unnamed VPC'}])[0]['Value']}
            for vpc in response['Vpcs']
        ]
        return jsonify(vpcs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500



#fetch Subnets
@app.route('/get-subnets', methods=['POST'])
def get_subnets():
    """
    Fetches subnets for a given VPC ID.
    """
    global aws_client
    if not aws_client:
        return jsonify({"error": "AWS is not configured"}), 400

    try:
        data = request.json
        vpc_id = data.get('vpcId')

        if not vpc_id:
            return jsonify({"error": "VPC ID is required"}), 400

        response = aws_client.describe_subnets(Filters=[{"Name": "vpc-id", "Values": [vpc_id]}])
        subnets = [
            {"id": subnet['SubnetId'], "name": subnet.get('Tags', [{'Value': 'Unnamed Subnet'}])[0]['Value']}
            for subnet in response['Subnets']
        ]
        return jsonify(subnets)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Define a mapping of instance types to RAM (in MiB)
INSTANCE_RAM_MAPPING = {
    "t2.micro": 1024,  # 1GB
    "t2.small": 2048,  # 2GB
    "t2.medium": 4096,  # 4GB
    "t2.large": 8192,  # 8GB
    "t3.micro": 1024,
    "t3.small": 2048,
    "t3.medium": 4096,
    "t3.large": 8192,
    "m5.large": 8192,
    "m5.xlarge": 16384,
    "m5.2xlarge": 32768,
    "m5.4xlarge": 65536,
    "m5.8xlarge": 131072,
    "m5.12xlarge": 196608,
    "m5.16xlarge": 262144,
    "m5.24xlarge": 393216,
}



#fetch vm's
@app.route('/get-vms', methods=['POST'])
def get_vms():
    """
    Fetches instances (VMs) for a given Subnet ID.
    """
    global aws_client
    if not aws_client:
        return jsonify({"error": "AWS is not configured"}), 400

    try:
        data = request.json
        subnet_id = data.get('subnetId')

        if not subnet_id:
            return jsonify({"error": "Subnet ID is required"}), 400

        response = aws_client.describe_instances(
            Filters=[{"Name": "subnet-id", "Values": [subnet_id]}]
        )
        instances = []
        for reservation in response['Reservations']:
            for instance in reservation['Instances']:
                instance_type = instance.get('InstanceType', 'N/A')
                ram_size = INSTANCE_RAM_MAPPING.get(instance_type, "Unknown")  # Get RAM from mapping
                
                instances.append({
                    "id": instance['InstanceId'],
                    "type": instance_type,
                    "state": instance['State']['Name'],
                    "vcpus": instance.get('CpuOptions', {}).get('CoreCount', 'N/A'),
                    "ram": f"{ram_size / 1024} GB" if isinstance(ram_size, int) else "N/A",
                    "name": next((tag['Value'] for tag in instance.get('Tags', []) if tag['Key'] == 'Name'), 'Unnamed Instance'),
                    "network": instance.get('NetworkInterfaces', [{}])[0].get('PrivateIpAddress', 'N/A')
                })
        return jsonify(instances)
    except Exception as e:
        return jsonify({"error": str(e)}), 500




# testing the mongdb connection
@app.route('/test-mongodb', methods=['POST'])
def test_mongodb():
    """
    Test route to insert a sample document into MongoDB and retrieve it.
    """
    try:
        # Insert a sample document
        sample_data = {
            "test_field": "This is a test",
            "timestamp": "2025-01-22"
        }
        inserted_id = db["test_collection"].insert_one(sample_data).inserted_id

        # Retrieve the inserted document and convert ObjectId to string
        result = db["test_collection"].find_one({"_id": inserted_id})
        result["_id"] = str(result["_id"])  # Convert ObjectId to string

        return jsonify({"message": "MongoDB connection successful!", "data": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500



#save vm's
@app.route('/save-vms', methods=['POST'])
def save_vms():
    """
    Saves selected VM information to MongoDB.
    """
    try:
        vms = request.json
        if not isinstance(vms, list) or not vms:
            return jsonify({"error": "Invalid VM data"}), 400

        # Insert VM data into MongoDB
        for vm in vms:
            # Avoid duplicate entries
            vm_collection.update_one({"id": vm["id"]}, {"$set": vm}, upsert=True)

        return jsonify({"message": "VMs saved successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
