# ClipConnect API Testing Guide

## Server Status
✅ Server is running at: http://localhost:5000
✅ MongoDB is connected
✅ Environment: development

## Available Endpoints

### 1. Health Check (Public)
**Endpoint:** `GET http://localhost:5000/health`

**Expected Response (200 OK):**
```json
{
  "status": "OK",
  "environment": "development"
}
```

**Test Result:** ✅ PASSED

---

### 2. User Signup (Public)
**Endpoint:** `POST http://localhost:5000/api/auth/signup`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "creator@test.com",
  "password": "password123",
  "role": "CREATOR"
}
```

**Expected Response (201 Created):**
```json
{
  "message": "Signup successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "676c5f8a7e8f9a1234567890",
    "email": "creator@test.com",
    "role": "CREATOR"
  }
}
```

**Test Cases:**
1. ✅ Valid CREATOR signup
2. ✅ Valid CLIPPER signup (use role: "CLIPPER")
3. ❌ Duplicate email (should return 409 Conflict)
4. ❌ Invalid role (should return 400 Bad Request)
5. ❌ Missing fields (should return 400 Bad Request)

---

### 3. User Login (Public)
**Endpoint:** `POST http://localhost:5000/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "creator@test.com",
  "password": "password123"
}
```

**Expected Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "676c5f8a7e8f9a1234567890",
    "email": "creator@test.com",
    "role": "CREATOR"
  }
}
```

**Test Cases:**
1. ✅ Valid credentials
2. ❌ Invalid email (should return 401 Unauthorized)
3. ❌ Invalid password (should return 401 Unauthorized)
4. ❌ Missing fields (should return 400 Bad Request)

---

## How to Test in Postman

### Test 1: Health Check
1. Open Postman
2. Create new request: `GET http://localhost:5000/health`
3. Click "Send"
4. Verify response status is 200 OK

### Test 2: Signup - Creator Account
1. Create new request: `POST http://localhost:5000/api/auth/signup`
2. Go to "Headers" tab
   - Add header: `Content-Type: application/json`
3. Go to "Body" tab
   - Select "raw" and "JSON"
   - Paste:
     ```json
     {
       "email": "creator@test.com",
       "password": "password123",
       "role": "CREATOR"
     }
     ```
4. Click "Send"
5. Verify response status is 201 Created
6. Copy the `token` from the response (you'll need it for protected routes)

### Test 3: Signup - Clipper Account
1. Same as above but use:
   ```json
   {
     "email": "clipper@test.com",
     "password": "password123",
     "role": "CLIPPER"
   }
   ```

### Test 4: Login with Creator Account
1. Create new request: `POST http://localhost:5000/api/auth/login`
2. Headers: `Content-Type: application/json`
3. Body (raw JSON):
   ```json
   {
     "email": "creator@test.com",
     "password": "password123"
   }
   ```
4. Click "Send"
5. Verify response status is 200 OK
6. Verify the token is returned

### Test 5: Login with Wrong Password
1. Same as above but use wrong password:
   ```json
   {
     "email": "creator@test.com",
     "password": "wrongpassword"
   }
   ```
2. Should return 401 Unauthorized with message "Invalid credentials"

### Test 6: Duplicate Email Signup
1. Try to signup again with an email that already exists
2. Should return 409 Conflict with message "User already exists"

---

## Testing Protected Routes (Future)

When testing protected routes, you'll need to include the Authorization header:

**Headers for Protected Routes:**
```
Content-Type: application/json
Authorization: Bearer <your-token-here>
```

**Example:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzZjNWY4YTdlOGY5YTEyMzQ1Njc4OTAiLCJyb2xlIjoiQ1JFQVRPUiIsImlhdCI6MTczNDk4NzY3MywiZXhwIjoxNzM1NTkyNDczfQ.abcdefghijklmnopqrstuvwxyz
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Email, password, and role are required"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials"
}
```

### 409 Conflict
```json
{
  "message": "User already exists"
}
```

### 500 Internal Server Error
```json
{
  "message": "Signup failed"
}
```

---

## Summary of Test Results

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/health` | GET | ✅ PASSED | Server is running |
| `/api/auth/signup` | POST | ⏳ MANUAL TEST REQUIRED | Add body in Postman |
| `/api/auth/login` | POST | ⏳ MANUAL TEST REQUIRED | Add body in Postman |

---

## Next Steps

1. Complete manual testing of signup and login endpoints in Postman
2. Save successful requests in a Postman collection
3. Create environment variables for:
   - `baseUrl`: http://localhost:5000
   - `token`: (save after login)
4. Test with both CREATOR and CLIPPER roles
5. Verify tokens work with protected routes once implemented
