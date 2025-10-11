# JWT Token Usage Guide

This guide explains how to use JWT tokens in the Bejite frontend application.

## Table of Contents
- [Overview](#overview)
- [How It Works](#how-it-works)
- [Making Authenticated API Calls](#making-authenticated-api-calls)
- [Using the useAuth Hook](#using-the-useauth-hook)
- [Protecting Routes](#protecting-routes)
- [Token Management Utilities](#token-management-utilities)
- [Examples](#examples)

---

## Overview

The backend provides two tokens after successful login:
- **Access Token** (expires in 15 minutes) - Used for authenticating API requests
- **Refresh Token** (expires in 30 days) - Used to get a new access token when it expires

Both tokens are automatically stored in `localStorage` and managed by the application.

---

## How It Works

### 1. Login Flow
When a user logs in successfully:

```javascript
// Backend Response
{
  "message": "Login successful!",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "confirmedUser": {
    "id": "user-id",
    "email": "user@example.com",
    "role": "jobseeker"
  }
}
```

The `authSlice` automatically stores these tokens in localStorage:
- `accessToken` → localStorage
- `refreshToken` → localStorage
- `user` → localStorage

### 2. Automatic Token Attachment
The `axiosInstance` automatically:
- Attaches the `accessToken` to every API request in the `Authorization` header
- Handles token refresh when the access token expires (401 error)
- Redirects to login if refresh fails

### 3. Token Refresh Flow
When an API call returns a 401 error:
1. The interceptor catches it
2. Sends the `refreshToken` to `/auth/refresh`
3. Gets a new `accessToken`
4. Retries the original request with the new token
5. If refresh fails, clears storage and redirects to login

---

## Making Authenticated API Calls

### Using the API Service (Recommended)

```javascript
// src/services/api.js
import axiosInstance from '../utils/axiosInstance';

export const getUserProfile = async () => {
  const response = await axiosInstance.get('/user/profile');
  return response.data;
};
```

### Using in Components

```javascript
import { getUserProfile } from '../services/api';
import { toast } from 'react-toastify';

function ProfileComponent() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return <div>{profile?.name}</div>;
}
```

### Direct API Calls

```javascript
import axiosInstance from '../utils/axiosInstance';

// GET request
const getJobs = async () => {
  const response = await axiosInstance.get('/jobs');
  return response.data;
};

// POST request
const createJob = async (jobData) => {
  const response = await axiosInstance.post('/jobs', jobData);
  return response.data;
};

// PUT request
const updateProfile = async (profileData) => {
  const response = await axiosInstance.put('/user/profile', profileData);
  return response.data;
};

// DELETE request
const deleteJob = async (jobId) => {
  const response = await axiosInstance.delete(`/jobs/${jobId}`);
  return response.data;
};
```

---

## Using the useAuth Hook

The `useAuth` hook provides easy access to authentication state and actions:

```javascript
import useAuth from '../hooks/useAuth';

function MyComponent() {
  const { 
    user,           // Current user object
    loading,        // Loading state
    authenticated,  // Boolean: is user authenticated?
    isVerified,     // Boolean: is email verified?
    accessToken,    // Current access token
    hasRole,        // Function: check if user has specific role
    logout          // Function: logout user
  } = useAuth();

  // Check if user has a specific role
  const isJobseeker = hasRole('jobseeker');
  const isRecruiter = hasRole('recruiter');

  // Logout handler
  const handleLogout = () => {
    logout(); // Clears tokens and redirects to login
  };

  return (
    <div>
      {authenticated ? (
        <>
          <p>Welcome, {user?.email}!</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

---

## Protecting Routes

Use the `ProtectedRoute` component to protect routes that require authentication:

### Basic Protection

```javascript
// App.jsx
import ProtectedRoute from './components/ProtectedRoute';

<Routes>
  <Route 
    path="/dashboard" 
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } 
  />
</Routes>
```

### Require Email Verification

```javascript
<Route 
  path="/profile" 
  element={
    <ProtectedRoute requireVerified={true}>
      <Profile />
    </ProtectedRoute>
  } 
/>
```

### Require Specific Role

```javascript
<Route 
  path="/recruitment" 
  element={
    <ProtectedRoute requiredRole="recruiter">
      <Recruitment />
    </ProtectedRoute>
  } 
/>
```

### Combined Requirements

```javascript
<Route 
  path="/employer-dashboard" 
  element={
    <ProtectedRoute requireVerified={true} requiredRole="recruiter">
      <EmployerDashboard />
    </ProtectedRoute>
  } 
/>
```

---

## Token Management Utilities

Import from `src/utils/tokenManager.js`:

```javascript
import {
  storeTokens,
  getAccessToken,
  getRefreshToken,
  storeUser,
  getUser,
  clearAuthData,
  isAuthenticated,
  decodeToken
} from '../utils/tokenManager';

// Store tokens
storeTokens(accessToken, refreshToken);

// Get access token
const token = getAccessToken();

// Get refresh token
const refreshToken = getRefreshToken();

// Store user data
storeUser({ id: '123', email: 'user@example.com' });

// Get user data
const user = getUser();

// Clear all auth data (logout)
clearAuthData();

// Check if user is authenticated
const isAuth = isAuthenticated();

// Decode a JWT token
const payload = decodeToken(token);
console.log(payload); // { id, email, role, verified, exp, iat }
```

---

## Examples

### Example 1: Fetching User Jobs

```javascript
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axiosInstance.get('/jobs/my-jobs');
        setJobs(response.data);
      } catch (error) {
        toast.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {jobs.map(job => (
            <li key={job.id}>{job.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Example 2: Uploading a File

```javascript
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

function ResumeUpload() {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axiosInstance.post('/upload/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Resume uploaded successfully!');
      console.log('Upload response:', response.data);
    } catch (error) {
      toast.error('Failed to upload resume');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} accept=".pdf,.doc,.docx" />
    </div>
  );
}
```

### Example 3: Creating a Job Post

```javascript
import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';

function CreateJob() {
  const { hasRole } = useAuth();
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    location: '',
    salary: ''
  });

  if (!hasRole('recruiter')) {
    return <p>Only recruiters can create job posts</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axiosInstance.post('/jobs', jobData);
      toast.success('Job created successfully!');
      console.log('Created job:', response.data);
      
      // Reset form
      setJobData({ title: '', description: '', location: '', salary: '' });
    } catch (error) {
      toast.error('Failed to create job');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={jobData.title}
        onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
        placeholder="Job Title"
      />
      {/* More form fields... */}
      <button type="submit">Create Job</button>
    </form>
  );
}
```

### Example 4: Logout Button

```javascript
import useAuth from '../hooks/useAuth';

function Header() {
  const { user, authenticated, logout } = useAuth();

  return (
    <header>
      {authenticated ? (
        <>
          <span>Welcome, {user?.email}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <a href="/">Login</a>
      )}
    </header>
  );
}
```

---

## Important Notes

1. **Never manually add tokens to headers** - The `axiosInstance` does this automatically
2. **Use `axiosInstance` for all API calls** - Don't use plain `axios`
3. **Token refresh is automatic** - The interceptor handles expired tokens
4. **Logout clears everything** - Use `logout()` from `useAuth` or Redux action
5. **Protected routes redirect automatically** - No need to check auth in every component

---

## Troubleshooting

### Token not being sent with requests
- Make sure you're using `axiosInstance` from `src/utils/axiosInstance.js`
- Check that tokens are stored in localStorage
- Open DevTools → Application → Local Storage → check for `accessToken` and `refreshToken`

### Getting 401 errors repeatedly
- Check if refresh token endpoint exists: `/auth/refresh`
- Verify backend accepts `{ refreshToken }` in the request body
- Check console for refresh errors

### User redirected to login unexpectedly
- Token might have expired and refresh failed
- Check if refresh token is still valid (30 days)
- Verify backend refresh endpoint is working

---

## Backend Requirements

For the token system to work, your backend needs:

1. **Login endpoint** returns:
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "confirmedUser": { "id": "...", "email": "..." }
}
```

2. **Refresh endpoint** (`POST /auth/refresh`):
```json
// Request
{ "refreshToken": "..." }

// Response
{ "accessToken": "..." }
```

3. **Protected endpoints** check for:
```
Authorization: Bearer <accessToken>
```

---

## Summary

✅ **Tokens are stored automatically** after login  
✅ **Tokens are attached automatically** to all API requests  
✅ **Tokens refresh automatically** when expired  
✅ **Use `axiosInstance`** for all API calls  
✅ **Use `useAuth` hook** for auth state  
✅ **Use `ProtectedRoute`** to guard routes  

That's it! The token system is now fully set up and ready to use. 🚀

