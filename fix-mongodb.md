# MongoDB Atlas IP Whitelist Fix

## Quick Fix Steps:

### 1. Go to MongoDB Atlas Dashboard
- Visit: https://cloud.mongodb.com/
- Login to your account

### 2. Navigate to Network Access
- Click on "Network Access" in the left sidebar
- You'll see your current IP whitelist

### 3. Add Your Current IP
**Option A: Add Current IP (Recommended for production)**
- Click "Add IP Address"
- Click "Add Current IP Address"
- Add a description like "My Development Machine"
- Click "Confirm"

**Option B: Allow All IPs (Development only - NOT for production)**
- Click "Add IP Address" 
- Enter: `0.0.0.0/0`
- Add description: "Allow All (Development Only)"
- Click "Confirm"

### 4. Wait for Changes
- Wait 2-3 minutes for changes to propagate
- Try running `npm start` again

## Alternative: Use Local MongoDB

If you prefer to use local MongoDB instead:

1. Install MongoDB locally
2. Update your `.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/CzarCore
   ```
3. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

## Test Connection
After making changes, test with:
```bash
npm start
```

The startup script will test the connection before starting the server.