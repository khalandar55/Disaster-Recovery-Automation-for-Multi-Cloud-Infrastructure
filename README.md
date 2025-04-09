
# MultiCloud and Hybrid Disaster Recovery Tool

## Overview

The **MultiCloud and Hybrid Disaster Recovery Tool** is a web application designed to manage cloud environments. It connects to AWS to fetch and display Virtual Private Clouds (VPCs), Subnets, and Virtual Machines (VMs) in an organized way. It allows users to configure AWS accounts dynamically and interact with their resources.

---

## Features

- Dynamic AWS account configuration
- Fetch and display VPCs, Subnets, and Virtual Machines (VMs)
- Save selected VM details to MongoDB
- Interactive UI with dropdowns for resources
- Backend API for AWS interaction using Flask, Boto3, and MongoDB
- Frontend developed using React and TailwindCSS

---

## Prerequisites

Before setting up the project, ensure you have the following installed:

1. **Node.js** (v14 or higher)
2. **npm** or **yarn**
3. **Python 3.8 or higher**
4. **pip** - Python package manager
5. **Virtual Environment** - For Python dependencies
6. **AWS CLI** - To verify credentials
7. **MongoDB** (locally or on a cloud)

---

## Technologies Used

- **Frontend**:
  - React.js
  - TailwindCSS
  - Vite.js (optional if you migrate in the future)

- **Backend**:
  - Flask (Python)
  - Boto3 (AWS SDK for Python)
  - MongoDB (Database)

- **Dependencies**:
  - Frontend: `react-icons`, `tailwindcss`
  - Backend: `flask`, `flask-cors`, `boto3`, `pymongo`

---

## Project Structure

```
/frontend
    - React.js frontend code
/backend
    - Flask backend for API communication
```

---

## Setting Up the Project Locally

### Step 1: Clone the Repository
```bash
git clone https://github.com/Fvectors-Group/MultiCloud-and-Hybrid-Disaster-recovery.git
cd MultiCloud-and-Hybrid-Disaster-recovery
```

---

### Step 2: Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The frontend should now be running on `http://localhost:3000`.

---

### Step 3: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd ../backend
   ```

2. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the Flask development server:
   ```bash
   python3 server.py
   ```

5. The backend should now be running on `http://localhost:5001`.

---

### Step 4: MongoDB Setup

#### Local MongoDB Setup:

1. **Install MongoDB Community Edition**:
   - For macOS:
     ```bash
     brew tap mongodb/brew
     brew install mongodb-community@6.0
     ```
   - For other platforms, follow the [official installation guide](https://www.mongodb.com/docs/manual/installation/).

2. **Start MongoDB**:
   ```bash
   brew services start mongodb/brew/mongodb-community@6.0
   ```

3. **Verify MongoDB Installation**:
   Use the following command to verify the MongoDB service:
   ```bash
   mongosh
   ```

#### Remote MongoDB (Optional):
If using a cloud-based MongoDB (e.g., MongoDB Atlas), create a cluster, add your IP to the whitelist, and copy the connection string (e.g., `mongodb+srv://<username>:<password>@cluster.mongodb.net/disaster_recovery`).

#### Configure MongoDB Connection:
1. Update the `MongoClient` URI in `server.py`:
   ```python
   mongo_client = MongoClient("mongodb://localhost:27017/")  # Replace with your MongoDB URI if using remote
   ```

2. Test the connection:
   Start the Flask server and run:
   ```bash
   curl -X POST http://127.0.0.1:5001/test-mongodb
   ```

   You should receive a success message if the connection is established.

---

### Step 5: AWS Configuration

1. Add your **Access Key ID**, **Secret Access Key**, and **Region** in the frontend modal to dynamically configure AWS.

2. Ensure that your AWS account has the following permissions for the application to work:
   - `ec2:DescribeVpcs`
   - `ec2:DescribeSubnets`
   - `ec2:DescribeInstances`

---

### Commands Reference

| Command                       | Description                              |
|-------------------------------|------------------------------------------|
| `npm install`                 | Installs frontend dependencies          |
| `npm start`                   | Starts the frontend server              |
| `python3 -m venv venv`        | Creates a Python virtual environment     |
| `source venv/bin/activate`    | Activates the virtual environment        |
| `pip install -r requirements.txt` | Installs backend dependencies           |
| `python3 server.py`           | Starts the Flask backend server         |
| `brew services start mongodb/brew/mongodb-community@6.0` | Starts MongoDB locally |

---

## Testing MongoDB Connection

To verify the MongoDB setup:

1. Run the backend server:
   ```bash
   python3 server.py
   ```

2. Test the MongoDB connection:
   ```bash
   curl -X POST http://127.0.0.1:5001/test-mongodb
   ```

3. You should see a success message with the test data inserted into the database.

4. To view the database contents, use `mongosh`:
   ```bash
   mongosh
   use disaster_recovery
   db.vms.find().pretty()
   ```

---

## Troubleshooting

### Common Issues

1. **Module Not Found**:
   Ensure all dependencies are installed. Run:
   ```bash
   pip install -r requirements.txt
   npm install
   ```

2. **MongoDB Connection Error**:
   - Verify the MongoDB service is running.
   - Check the connection string in `server.py`.

3. **AWS Access Error**:
   Verify your AWS credentials and ensure they have the required permissions.

4. **Backend Port Conflict**:
   If port 5001 is occupied, specify a different port in `server.py`:
   ```python
   app.run(port=YOUR_PORT)
   ```

5. **Frontend/Backend Connection**:
   Ensure the frontend and backend are running on the same machine or update API URLs in the frontend code.

---

## Contributions

Feel free to fork the repository and submit pull requests to contribute.

--- 
