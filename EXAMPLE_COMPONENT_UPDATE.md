# Example: Updating Components to Use Tokens

## Before and After Examples

### Example 1: Fetching Data

#### ❌ BEFORE (Don't do this)
```javascript
import axios from 'axios';

function JobsList() {
  const [jobs, setJobs] = useState([]);
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    axios.get('https://bejite-backend.onrender.com/jobs', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => setJobs(res.data))
    .catch(err => console.error(err));
  }, []);
  
  return <div>{/* render jobs */}</div>;
}
```

#### ✅ AFTER (Correct way)
```javascript
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axiosInstance.get('/jobs');
        setJobs(response.data);
      } catch (error) {
        toast.error('Failed to load jobs');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return <div>{/* render jobs */}</div>;
}
```

---

### Example 2: Creating/Posting Data

#### ❌ BEFORE
```javascript
import axios from 'axios';

function CreateJobForm() {
  const handleSubmit = async (formData) => {
    const token = localStorage.getItem('authToken');
    
    try {
      await axios.post('https://bejite-backend.onrender.com/jobs', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert('Job created!');
    } catch (error) {
      alert('Error creating job');
    }
  };
  
  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

#### ✅ AFTER
```javascript
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

function CreateJobForm() {
  const handleSubmit = async (formData) => {
    try {
      const response = await axiosInstance.post('/jobs', formData);
      toast.success('Job created successfully!');
      console.log('Created job:', response.data);
    } catch (error) {
      toast.error('Failed to create job');
      console.error(error);
    }
  };
  
  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

---

### Example 3: Using Auth State

#### ❌ BEFORE
```javascript
function Header() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };
  
  return (
    <header>
      {user ? (
        <>
          <span>{user.email}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <a href="/">Login</a>
      )}
    </header>
  );
}
```

#### ✅ AFTER
```javascript
import useAuth from '../hooks/useAuth';

function Header() {
  const { user, authenticated, logout } = useAuth();
  
  return (
    <header>
      {authenticated ? (
        <>
          <span>{user?.email}</span>
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

### Example 4: Protected Page Component

#### ❌ BEFORE
```javascript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);
  
  return <div>Dashboard Content</div>;
}
```

#### ✅ AFTER (Option 1: Using ProtectedRoute wrapper)
```javascript
// App.jsx
import ProtectedRoute from './components/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>

// Dashboard.jsx - No auth check needed!
function Dashboard() {
  return <div>Dashboard Content</div>;
}
```

#### ✅ AFTER (Option 2: Using useAuth hook)
```javascript
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

function Dashboard() {
  const { authenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!authenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <div>Dashboard Content</div>;
}
```

---

## Real-World Example: Job Application Feature

```javascript
import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';

function JobApplicationForm({ jobId }) {
  const { user, authenticated, hasRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    coverLetter: '',
    resume: null
  });

  // Check if user is a job seeker
  if (!authenticated) {
    return <p>Please login to apply</p>;
  }

  if (!hasRole('jobseeker')) {
    return <p>Only job seekers can apply for jobs</p>;
  }

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for file upload
      const data = new FormData();
      data.append('coverLetter', formData.coverLetter);
      data.append('resume', formData.resume);
      data.append('jobId', jobId);

      // Submit application - token automatically attached!
      const response = await axiosInstance.post('/applications', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Application submitted successfully!');
      console.log('Application response:', response.data);
      
      // Reset form
      setFormData({ coverLetter: '', resume: null });
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error('Invalid application data');
      } else if (error.response?.status === 409) {
        toast.error('You have already applied to this job');
      } else {
        toast.error('Failed to submit application');
      }
      console.error('Application error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Apply for this Job</h3>
      <p>Applying as: {user?.email}</p>
      
      <textarea
        placeholder="Cover Letter"
        value={formData.coverLetter}
        onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
        required
      />
      
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}

export default JobApplicationForm;
```

---

## Key Takeaways

1. ✅ **Always use `axiosInstance`** - Never use plain `axios` for API calls
2. ✅ **Never manually add Authorization headers** - The interceptor does it automatically
3. ✅ **Use `useAuth` hook** - For accessing user data and auth state
4. ✅ **Use `ProtectedRoute`** - For routes that require authentication
5. ✅ **Use `toast` for feedback** - Better UX than `alert()`
6. ✅ **Handle loading states** - Show loading indicators during API calls
7. ✅ **Handle errors properly** - Catch and display meaningful error messages

---

## Common Mistakes to Avoid

❌ Don't manually manage tokens in components
❌ Don't use plain axios for authenticated requests  
❌ Don't check localStorage for auth in every component
❌ Don't manually clear localStorage on logout
❌ Don't add Authorization headers manually

✅ Use `axiosInstance` for all API calls
✅ Use `useAuth` hook for auth state
✅ Use `logout()` function from useAuth
✅ Let interceptors handle tokens automatically

