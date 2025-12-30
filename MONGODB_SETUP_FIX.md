# MongoDB Setup & 500 Error Fix

## Problem Diagnosis
The 500 Internal Server Error is caused by **MongoDB not being installed or running** on your system. Your Node.js server is trying to connect to MongoDB but fails, causing all API requests to return 500 errors.

## Solution: Install & Run MongoDB

### Option 1: MongoDB Community Server (Recommended for Development)

1. **Download MongoDB**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows, Latest version, MSI installer
   - Download and run the installer

2. **Install MongoDB**
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service" (runs automatically on startup)
   - Keep default data directory: `C:\Program Files\MongoDB\Server\7.0\`

3. **Verify Installation**
   ```powershell
   mongod --version
   ```

4. **Start MongoDB Service** (if not auto-started)
   ```powershell
   net start MongoDB
   ```

### Option 2: MongoDB Atlas (Cloud - Free Tier)

If you prefer a cloud database (no local installation needed):

1. **Create Account**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create Cluster**
   - Choose "Free Shared Cluster" (M0)
   - Select your preferred region
   - Click "Create Cluster"

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

4. **Update Server .env File**
   ```env
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/clipconnect?retryWrites=true&w=majority
   ```

## After MongoDB is Running

1. **Restart Your Server**
   ```powershell
   cd C:\Users\HP\Desktop\ClipConnect\server
   npm run dev
   ```

2. **Verify Connection**
   You should see: `✅ MongoDB connected` in the console

3. **Test the Application**
   - Open your browser to http://localhost:5173
   - Try signing up or logging in
   - The 500 errors should be gone!

## Quick Test Commands

```powershell
# Check if MongoDB service is running
Get-Service -Name "*mongo*"

# Start MongoDB service
net start MongoDB

# Check if port 27017 (MongoDB default) is open
netstat -ano | Select-String ":27017"

# Check server logs
cd C:\Users\HP\Desktop\ClipConnect\server
npm run dev
```

## Common Issues

### Issue: "mongod: command not found"
**Solution**: Add MongoDB to your PATH:
1. Search for "Environment Variables" in Windows
2. Edit "Path" in System Variables
3. Add: `C:\Program Files\MongoDB\Server\7.0\bin`
4. Restart PowerShell

### Issue: "MongoDB service won't start"
**Solution**: 
```powershell
# Remove old service
sc.exe delete MongoDB

# Reinstall MongoDB with "Run as Administrator"
```

### Issue: Still getting 500 errors
**Solution**: Check server console for specific error messages. The enhanced error handling will now show you exactly what's wrong.
