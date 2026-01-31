# Bejite Backend API Documentation

Complete guide for testing and implementing all APIs in the Bejite Backend project.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Profile Management](#profile-management)
4. [CV Builder](#cv-builder)
5. [Jobs](#jobs)
6. [Candidates](#candidates)
7. [Job Board](#job-board)
8. [CV Search](#cv-search)
9. [Payment Integration](#payment-integration)
10. [Error Handling](#error-handling)

---

## Getting Started

### Base URL
```
Development: http://localhost:3001
Production: https://bejite-backend-9mg2.onrender.com
```

### Root / Health Check

**Endpoint:** `GET /`

**Description:** Check if the server is running.

**Authentication:** Not required

**Response:**
```json
{
  "message": "Server is running "
}
```

**cURL Example:**
```bash
curl http://localhost:3001/
```

---

### Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Testing Tools
- **Postman**: Recommended for API testing
- **cURL**: Command-line testing
- **JavaScript/TypeScript**: Frontend integration examples

---

## Authentication

### 1. User Signup

**Endpoint:** `POST /auth/signup`

**Description:** Register a new user account

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "confirmPassword": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**JavaScript Example:**
```javascript
const signup = async (userData) => {
  const response = await fetch('http://localhost:3001/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  return response.json();
};
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

### 2. Complete Signup

**Endpoint:** `POST /auth/complete-signup`

**Description:** Complete user profile setup after initial signup

**Authentication:** Not required (uses token from signup)

**Request Body:**
```json
{
  "email": "user@example.com",
  "role": "jobseeker",
  "mode": "active_member",
  "followings": []
}
```

**Note:** 
- `role` must be either `"jobseeker"` or `"recruiter"`
- For `jobseeker`, `mode` must be one of: `"active_member"`, `"freelancer"`, `"inactive_member"`
- For `recruiter`, `mode` must be one of: `"corporate"`, `"individual"`
- `followings` is an array (can be empty)

**cURL Example:**
```bash
curl -X POST http://localhost:3001/auth/complete-signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "role": "jobseeker",
    "mode": "active_member",
    "followings": []
  }'
```

---

### 3. User Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and get JWT token

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Alternative (Google OAuth):**
```json
{
  "googleToken": "google_id_token"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

**Response:**
```json
{
  "message": "Login successful!",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "confirmedUser": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "jobseeker"
  }
}
```

---

### 4. Google OAuth

**Endpoint:** `GET /auth/google`

**Description:** Initiate Google OAuth flow

**Authentication:** Not required

**cURL Example:**
```bash
curl http://localhost:3001/auth/google
```

**Note:** This redirects to Google's OAuth page. After authentication, it redirects to `/auth/google/callback`.

**Callback Endpoint:** `GET /auth/google/callback`

**Response:** Redirects to frontend with token in URL parameters. (Used by Google OAuth; do not call directly from client.)

---

### 4b. Google OAuth Failure

**Endpoint:** `GET /auth/failure`

**Description:** Called when Google OAuth login fails. Returns 401 with a failure message.

**Authentication:** Not required

**Response:**
```json
{
  "message": "❌ Google login failed"
}
```

---

### 5. Refresh Token

**Endpoint:** `GET /auth/refresh`

**Description:** Refresh JWT access token

**Authentication:** Required (current token)

**cURL Example:**
```bash
curl -X GET http://localhost:3001/auth/refresh \
  -H "Authorization: Bearer <your_token>"
```

---

### 6. Logout

**Endpoint:** `GET /auth/logout`

**Description:** Logout user and invalidate session

**Authentication:** Required

**cURL Example:**
```bash
curl -X GET http://localhost:3001/auth/logout \
  -H "Authorization: Bearer <your_token>"
```

---

### 7. Verify Email

**Endpoint:** `GET /auth/verify-email?token=<verification_token>`

**Description:** Verify user email address

**Authentication:** Not required (uses token from email)

**cURL Example:**
```bash
curl "http://localhost:3001/auth/verify-email?token=verification_token"
```

---

### 8. Forgot Password

**Endpoint:** `POST /auth/forgot-password`

**Description:** Request password reset email

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

---

### 9. Reset Password

**Endpoint:** `PATCH /auth/reset-Pword`

**Description:** Reset password using reset token

**Authentication:** Not required (uses token from email)

**Request Body:**
```json
{
  "token": "reset_token",
  "password": "NewSecurePassword123!"
}
```

**cURL Example:**
```bash
curl -X PATCH http://localhost:3001/auth/reset-Pword \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset_token",
    "password": "NewSecurePassword123!"
  }'
```

---

### 10. Upload Profile Photo (Auth)

**Endpoint:** `POST /auth/upload/photo`

**Description:** Upload profile photo during signup/profile setup

**Authentication:** Not required

**Request:** `multipart/form-data`

**Form Data:**
- `photo`: Image file (jpg, png, etc.)

**cURL Example:**
```bash
curl -X POST http://localhost:3001/auth/upload/photo \
  -F "photo=@/path/to/image.jpg"
```

---

### 11. Submit Profile with Photo

**Endpoint:** `POST /auth/user/profile`

**Description:** Submit complete user profile with photo

**Authentication:** Not required

**Request:** `multipart/form-data`

**Form Data:**
- `photo`: Image file (required)
- `nickname`: String (required)
- `phone_number`: String (required)
- `gender`: String (required)
- `marital_status`: String (required)
- `age`: Number (required)
- `country`: String (required)
- `street_address`: String (required)
- `city_town`: String (required)
- `tribe`: String (required)
- `zip_code`: String (required)
- `bio`: String (required)

**cURL Example:**
```bash
curl -X POST http://localhost:3001/auth/user/profile \
  -F "photo=@/path/to/image.jpg" \
  -F "nickname=John" \
  -F "phone_number=+2348012345678" \
  -F "gender=Male" \
  -F "marital_status=Single" \
  -F "age=25" \
  -F "country=Nigeria" \
  -F "street_address=123 Main Street" \
  -F "city_town=Lagos" \
  -F "tribe=Yoruba" \
  -F "zip_code=100001" \
  -F "bio=A passionate software developer..."
```

---

### 12. LinkedIn OAuth

**Endpoint:** `GET /auth/linkedin`

**Description:** Initiate LinkedIn OAuth flow. Redirects the user to LinkedIn for authentication.

**Authentication:** Not required

**Note:** Requires `LINKEDIN_CLIENT_ID` and `LINKEDIN_CALLBACK_URL` environment variables. After authentication, LinkedIn redirects to `GET /auth/linkedin/callback`.

**cURL Example:**
```bash
curl -L http://localhost:3001/auth/linkedin
```

---

### 12b. LinkedIn OAuth Callback

**Endpoint:** `GET /auth/linkedin/callback`

**Description:** OAuth callback from LinkedIn. Handles the authorization code and completes login. (Used by LinkedIn redirect; do not call directly from client.)

**Authentication:** Not required (receives `code` in query from LinkedIn)

---

### 12c. LinkedIn OAuth Test

**Endpoint:** `GET /auth/linkedin/test`

**Description:** Test endpoint to verify LinkedIn OAuth route and configuration (redirect URI, client ID presence).

**Authentication:** Not required

**Response:**
```json
{
  "message": "LinkedIn route is working!",
  "redirectUri": "<LINKEDIN_CALLBACK_URL>",
  "clientId": "Set" | "Missing"
}
```

**cURL Example:**
```bash
curl http://localhost:3001/auth/linkedin/test
```

---

## Profile Management

### 1. Get Profile

**Endpoint:** `GET /api/profile/profile`

**Description:** Get user profile information

**Authentication:** Required

**cURL Example:**
```bash
curl -X GET http://localhost:3001/api/profile/profile \
  -H "Authorization: Bearer <your_token>"
```

---

### 2. Upload CV

**Endpoint:** `POST /api/profile/upload-cv`

**Description:** Upload CV/resume file

**Authentication:** Required

**Request:** `multipart/form-data`

**Form Data:**
- `cv`: PDF or document file

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/profile/upload-cv \
  -H "Authorization: Bearer <your_token>" \
  -F "cv=@/path/to/resume.pdf"
```

---

## CV Builder

All CV Builder endpoints are prefixed with `/api/cv-builder`

### Bio/Personal Information

#### 1. Create/Update Bio

**Endpoint:** `POST /api/cv-builder/bio`

**Description:** Create or update user bio/personal information

**Authentication:** Required

**Request Body:**
```json
{
  "nickname": "John",
  "phone": "+2348012345678",
  "gender": "Male",
  "maritalStatus": "Single",
  "age": "25",
  "country": "Nigeria",
  "street": "123 Main Street",
  "city": "Lagos",
  "tribe": "Yoruba",
  "zip": "100001",
  "bio": "A passionate software developer with 3 years of experience..."
}
```

**Note:** `user_id` is automatically extracted from the JWT token. Do not include it in the request body.

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/cv-builder/bio \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "John",
    "phone": "+2348012345678",
    "gender": "Male",
    "maritalStatus": "Single",
    "age": "25",
    "country": "Nigeria",
    "street": "123 Main Street",
    "city": "Lagos",
    "tribe": "Yoruba",
    "zip": "100001",
    "bio": "A passionate software developer..."
  }'
```

---

#### 2. Get Bio

**Endpoint:** `GET /api/cv-builder/bio/:userId`

**Description:** Get user bio information

**Authentication:** Not required (public endpoint)

**cURL Example:**
```bash
curl http://localhost:3001/api/cv-builder/bio/user123
```

---

#### 3. Update Bio

**Endpoint:** `PUT /api/cv-builder/bio/:userId`

**Description:** Update existing bio

**Authentication:** Required

**Request Body:**
```json
{
  "nickname": "Johnny",
  "phone": "+2348012345679",
  "gender": "Male",
  "maritalStatus": "Single",
  "age": "25",
  "country": "Nigeria",
  "street": "123 Main Street",
  "city": "Lagos",
  "tribe": "Yoruba",
  "zip": "100001",
  "bio": "Updated bio information..."
}
```

**Note:** Use camelCase field names (e.g., `maritalStatus` not `marital_status`). All fields are optional - only include fields you want to update.

**cURL Example:**
```bash
curl -X PUT http://localhost:3001/api/cv-builder/bio/user123 \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "Johnny",
    "phone": "+2348012345679"
  }'
```

---

#### 4. Upload Profile Photo

**Endpoint:** `POST /api/cv-builder/bio/:userId/photo`

**Description:** Upload profile photo

**Authentication:** Required

**Request:** `multipart/form-data`

**Form Data:**
- `profilePhoto`: Image file

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/cv-builder/bio/user123/photo \
  -H "Authorization: Bearer <your_token>" \
  -F "profilePhoto=@/path/to/photo.jpg"
```

---

### Education

#### 1. Create Education Entry

**Endpoint:** `POST /api/cv-builder/education`

**Description:** Add education entry

**Authentication:** Required

**Request Body:**
```json
{
  "userId": "user123",
  "educationLevel": "Tertiary Institution",
  "institutionName": "University of Lagos",
  "location": "Lagos",
  "fieldOfStudy": "Computer Science",
  "degree": "Bachelor of Science",
  "startDate": "2018-09-01",
  "endDate": "2022-06-30"
}
```

**Note:** Field names use camelCase. `userId` is required in the body for this endpoint.

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/cv-builder/education \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "educationLevel": "Tertiary Institution",
    "institutionName": "University of Lagos",
    "location": "Lagos",
    "fieldOfStudy": "Computer Science",
    "degree": "Bachelor of Science",
    "startDate": "2018-09-01",
    "endDate": "2022-06-30"
  }'
```

---

#### 2. Get All Education

**Endpoint:** `GET /api/cv-builder/education/:userId`

**Description:** Get all education entries for a user

**Authentication:** Not required

**cURL Example:**
```bash
curl http://localhost:3001/api/cv-builder/education/user123
```

---

#### 3. Get Single Education Entry

**Endpoint:** `GET /api/cv-builder/education/:userId/:educationId`

**Description:** Get specific education entry

**Authentication:** Not required

**cURL Example:**
```bash
curl http://localhost:3001/api/cv-builder/education/user123/1
```

---

#### 4. Update Education Entry

**Endpoint:** `PUT /api/cv-builder/education/:userId/:educationId`

**Description:** Update education entry

**Authentication:** Required

**Request Body:**
```json
{
  "educationLevel": "Tertiary Institution",
  "institutionName": "MIT",
  "degree": "Master of Science"
}
```

**Note:** Use camelCase field names. All fields are optional - only include fields you want to update.

**cURL Example:**
```bash
curl -X PUT http://localhost:3001/api/cv-builder/education/user123/1 \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "degree": "Master of Science"
  }'
```

---

#### 5. Delete Education Entry

**Endpoint:** `DELETE /api/cv-builder/education/:userId/:educationId`

**Description:** Delete education entry

**Authentication:** Required

**cURL Example:**
```bash
curl -X DELETE http://localhost:3001/api/cv-builder/education/user123/1 \
  -H "Authorization: Bearer <your_token>"
```

---

### Skills

#### 1. Create Skill Entry

**Endpoint:** `POST /api/cv-builder/skills`

**Description:** Add skill entry

**Authentication:** Required

**Request Body:**
```json
{
  "userId": "user123",
  "skillSector": "JavaScript",
  "category": "Mid-Level",
  "experience": "2-3 years"
}
```

**Note:** Field names use camelCase. `userId` is required in the body for this endpoint.

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/cv-builder/skills \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "skillSector": "JavaScript",
    "category": "Mid-Level",
    "experience": "2-3 years"
  }'
```

---

#### 2. Get All Skills

**Endpoint:** `GET /api/cv-builder/skills/:userId`

**Description:** Get all skills for a user

**Authentication:** Not required

**cURL Example:**
```bash
curl http://localhost:3001/api/cv-builder/skills/user123
```

---

#### 3. Get Single Skill

**Endpoint:** `GET /api/cv-builder/skills/:userId/:skillId`

**Description:** Get specific skill entry

**Authentication:** Not required

**cURL Example:**
```bash
curl http://localhost:3001/api/cv-builder/skills/user123/1
```

---

#### 4. Update Skill

**Endpoint:** `PUT /api/cv-builder/skills/:userId/:skillId`

**Description:** Update skill entry

**Authentication:** Required

**Request Body:**
```json
{
  "skillSector": "JavaScript",
  "category": "Senior",
  "experience": "5+ years"
}
```

**Note:** Use camelCase field names. All fields are optional - only include fields you want to update.

**cURL Example:**
```bash
curl -X PUT http://localhost:3001/api/cv-builder/skills/user123/1 \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Senior"
  }'
```

---

#### 5. Delete Skill

**Endpoint:** `DELETE /api/cv-builder/skills/:userId/:skillId`

**Description:** Delete skill entry

**Authentication:** Required

**cURL Example:**
```bash
curl -X DELETE http://localhost:3001/api/cv-builder/skills/user123/1 \
  -H "Authorization: Bearer <your_token>"
```

---

### Work History

#### 1. Create Work History Entry

**Endpoint:** `POST /api/cv-builder/work-history`

**Description:** Add work history entry

**Authentication:** Required

**Request Body:**
```json
{
  "userId": "user123",
  "jobTitle": "Frontend Developer",
  "companyName": "Tech Solutions Ltd",
  "responsibilities": "• Developed responsive web applications using React\n• Collaborated with design team",
  "startDate": "2022-07-01",
  "endDate": "2024-01-15"
}
```

**Note:** Field names use camelCase. `userId` is required in the body for this endpoint.

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/cv-builder/work-history \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "jobTitle": "Frontend Developer",
    "companyName": "Tech Solutions Ltd",
    "responsibilities": "Developed responsive web applications",
    "startDate": "2022-07-01",
    "endDate": "2024-01-15"
  }'
```

---

#### 2. Get All Work History

**Endpoint:** `GET /api/cv-builder/work-history/:userId`

**Description:** Get all work history entries

**Authentication:** Not required

**cURL Example:**
```bash
curl http://localhost:3001/api/cv-builder/work-history/user123
```

---

#### 3. Get Single Work History Entry

**Endpoint:** `GET /api/cv-builder/work-history/:userId/:workId`

**Description:** Get specific work history entry

**Authentication:** Not required

**cURL Example:**
```bash
curl http://localhost:3001/api/cv-builder/work-history/user123/1
```

---

#### 4. Update Work History Entry

**Endpoint:** `PUT /api/cv-builder/work-history/:userId/:workId`

**Description:** Update work history entry

**Authentication:** Required

**Request Body:**
```json
{
  "jobTitle": "Lead Frontend Developer",
  "companyName": "Tech Solutions Ltd",
  "responsibilities": "Updated responsibilities...",
  "startDate": "2022-07-01",
  "endDate": "2024-01-15"
}
```

**Note:** Use camelCase field names. All fields are optional - only include fields you want to update.

**cURL Example:**
```bash
curl -X PUT http://localhost:3001/api/cv-builder/work-history/user123/1 \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "job_title": "Lead Frontend Developer"
  }'
```

---

#### 5. Delete Work History Entry

**Endpoint:** `DELETE /api/cv-builder/work-history/:userId/:workId`

**Description:** Delete work history entry

**Authentication:** Required

**cURL Example:**
```bash
curl -X DELETE http://localhost:3001/api/cv-builder/work-history/user123/1 \
  -H "Authorization: Bearer <your_token>"
```

---

### Certificates

#### 1. Create Certificate Entry

**Endpoint:** `POST /api/cv-builder/certificates`

**Description:** Add certificate entry

**Authentication:** Required

**Request Body:**
```json
{
  "userId": "user123",
  "certName": "AWS Certified Solutions Architect",
  "issuer": "Amazon Web Services",
  "issueDate": "2023-06-15"
}
```

**Note:** Field names use camelCase. `userId` is required in the body for this endpoint.

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/cv-builder/certificates \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "certName": "AWS Certified Solutions Architect",
    "issuer": "Amazon Web Services",
    "issueDate": "2023-06-15"
  }'
```

---

#### 2. Get All Certificates

**Endpoint:** `GET /api/cv-builder/certificates/:userId`

**Description:** Get all certificates for a user

**Authentication:** Not required

**cURL Example:**
```bash
curl http://localhost:3001/api/cv-builder/certificates/user123
```

---

#### 3. Get Single Certificate

**Endpoint:** `GET /api/cv-builder/certificates/:userId/:certificateId`

**Description:** Get specific certificate entry

**Authentication:** Not required

**cURL Example:**
```bash
curl http://localhost:3001/api/cv-builder/certificates/user123/1
```

---

#### 4. Update Certificate

**Endpoint:** `PUT /api/cv-builder/certificates/:userId/:certificateId`

**Description:** Update certificate entry

**Authentication:** Required

**Request Body:**
```json
{
  "certName": "AWS Certified Developer",
  "issuer": "Amazon Web Services",
  "issueDate": "2023-06-15"
}
```

**Note:** Use camelCase field names. All fields are optional - only include fields you want to update.

**cURL Example:**
```bash
curl -X PUT http://localhost:3001/api/cv-builder/certificates/user123/1 \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "cert_name": "AWS Certified Developer"
  }'
```

---

#### 5. Delete Certificate

**Endpoint:** `DELETE /api/cv-builder/certificates/:userId/:certificateId`

**Description:** Delete certificate entry

**Authentication:** Required

**cURL Example:**
```bash
curl -X DELETE http://localhost:3001/api/cv-builder/certificates/user123/1 \
  -H "Authorization: Bearer <your_token>"
```

---

#### 6. Upload Certificate File

**Endpoint:** `POST /api/cv-builder/certificates/:userId/:certificateId/file`

**Description:** Upload certificate file (PDF/image)

**Authentication:** Required

**Request:** `multipart/form-data`

**Form Data:**
- `certificateFile`: PDF or image file

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/cv-builder/certificates/user123/1/file \
  -H "Authorization: Bearer <your_token>" \
  -F "certificateFile=@/path/to/certificate.pdf"
```

---

### Links

#### 1. Create/Update Links

**Endpoint:** `POST /api/cv-builder/links`

**Description:** Create or update social media and portfolio links

**Authentication:** Required

**Request Body:**
```json
{
  "userId": "user123",
  "linkedin": "https://linkedin.com/in/johndoe",
  "twitter": "https://twitter.com/johndoe",
  "instagram": "https://instagram.com/johndoe",
  "portfolio": "https://johndoe.dev"
}
```

**Note:** `userId` is required in the body for this endpoint.

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/cv-builder/links \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "linkedin": "https://linkedin.com/in/johndoe",
    "twitter": "https://twitter.com/johndoe",
    "portfolio": "https://johndoe.dev"
  }'
```

---

#### 2. Get Links

**Endpoint:** `GET /api/cv-builder/links/:userId`

**Description:** Get user's social links

**Authentication:** Not required

**cURL Example:**
```bash
curl http://localhost:3001/api/cv-builder/links/user123
```

---

#### 3. Update Links

**Endpoint:** `PUT /api/cv-builder/links/:userId`

**Description:** Update social links

**Authentication:** Required

**Request Body:**
```json
{
  "portfolio": "https://newportfolio.com"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:3001/api/cv-builder/links/user123 \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "portfolio": "https://newportfolio.com"
  }'
```

---

### Complete CV Operations

#### 1. Get Complete CV

**Endpoint:** `GET /api/cv-builder/complete/:userId`

**Description:** Get complete CV with all sections (bio, education, skills, work history, certificates, links)

**Authentication:** Not required

**cURL Example:**
```bash
curl http://localhost:3001/api/cv-builder/complete/user123
```

**Response:**
```json
{
  "bio": {...},
  "education": [...],
  "skills": [...],
  "work_history": [...],
  "certificates": [...],
  "links": {...}
}
```

---

#### 2. Save CV Progress

**Endpoint:** `POST /api/cv-builder/save-progress/:userId`

**Description:** Save CV progress/draft

**Authentication:** Required

**Request Body:**
```json
{
  "currentStep": "education",
  "progress": 40
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/cv-builder/save-progress/user123 \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentStep": "education",
    "progress": 40
  }'
```

---

#### 3. Generate CV PDF

**Endpoint:** `GET /api/cv-builder/generate-pdf/:userId`

**Description:** Generate PDF version of CV

**Authentication:** Required

**cURL Example:**
```bash
curl -X GET http://localhost:3001/api/cv-builder/generate-pdf/user123 \
  -H "Authorization: Bearer <your_token>" \
  --output cv.pdf
```

---

## Jobs

All job endpoints are prefixed with `/api/jobs`

Job payloads use the **job preferences** structure (JOB TITLE, INDUSTRY/SECTOR, PREFERRED COUNTRY/STATE, WORK TYPE, EXPECTED SALARY, CURRENCY, REMOTE PREFERENCE, AVAILABILITY).

### 1. Create Job

**Endpoint:** `POST /api/jobs`

**Description:** Create a new job posting using the job preferences payload

**Authentication:** Required

**Request Body:**
| Field | Type | Description |
|-------|------|--------------|
| `job_title` or `title` | string | Job title (e.g. Graphics Design) |
| `industry_sector` | string | Industry / sector (e.g. Health Sector) |
| `preferred_country` | string | Preferred country (e.g. Nigeria) |
| `preferred_state` | string | Preferred state (e.g. Anambra) |
| `work_type` | string | Full-time, Part-time, Contract, Internship |
| `expected_salary` | string | e.g. N150,000 |
| `currency` | string | e.g. NGN |
| `remote_preference` | string | Remote, On-site, Hybrid |
| `availability` | string | e.g. Immediately |
| `posted_by` | string | User or employer identifier (optional) |

```json
{
  "job_title": "Graphics Design",
  "industry_sector": "Health Sector",
  "preferred_country": "Nigeria",
  "preferred_state": "Anambra",
  "work_type": "Full-time",
  "expected_salary": "N150,000",
  "currency": "NGN",
  "remote_preference": "Hybrid",
  "availability": "Immediately",
  "posted_by": "user_id_or_email"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/jobs \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "job_title": "Graphics Design",
    "industry_sector": "Health Sector",
    "preferred_country": "Nigeria",
    "preferred_state": "Anambra",
    "work_type": "Full-time",
    "expected_salary": "N150,000",
    "currency": "NGN",
    "remote_preference": "Hybrid",
    "availability": "Immediately"
  }'
```

---

### 2. Get All Jobs

**Endpoint:** `GET /api/jobs`

**Description:** Get all jobs with optional filtering

**Authentication:** Not required

**Query Parameters:**
- `search`: Search term (job title or industry/sector)
- `preferred_country`: Filter by preferred country
- `preferred_state`: Filter by preferred state
- `work_type`: Full-time, Part-time, Contract, Internship
- `industry_sector`: Filter by industry/sector
- `remote_preference`: Remote, On-site, Hybrid
- `availability`: Filter by availability
- `currency`: Filter by currency (e.g. NGN)
- `page`: Page number
- `limit`: Results per page

**cURL Example:**
```bash
curl "http://localhost:3001/api/jobs?preferred_country=Nigeria&work_type=Full-time&remote_preference=Hybrid&limit=10"
```

---

### 3. Search Jobs

**Endpoint:** `GET /api/jobs/search`

**Description:** Advanced job search (searches title, industry_sector, preferred_country, preferred_state)

**Authentication:** Not required

**Query Parameters:**
- `q`: Search query (title, industry_sector, preferred_country, preferred_state)
- `preferred_country`: Filter by preferred country
- `preferred_state`: Filter by preferred state
- `work_type`: Job type
- `industry_sector`: Industry/sector
- `remote_preference`: Remote, On-site, Hybrid
- `availability`: Availability
- `currency`: Currency (e.g. NGN)
- `page`: Page number
- `limit`: Results per page

**cURL Example:**
```bash
curl "http://localhost:3001/api/jobs/search?q=Graphics&preferred_country=Nigeria&work_type=Full-time&currency=NGN&limit=10"
```

---

### 4. Get Job by ID

**Endpoint:** `GET /api/jobs/:id`

**Description:** Get specific job by ID

**Authentication:** Not required

**cURL Example:**
```bash
curl http://localhost:3001/api/jobs/1
```

---

### 5. Update Job

**Endpoint:** `PUT /api/jobs/:id`

**Description:** Update job posting. Use the same fields as Create Job (e.g. `job_title` or `title`, `industry_sector`, `preferred_country`, `preferred_state`, `work_type`, `expected_salary`, `currency`, `remote_preference`, `availability`).

**Authentication:** Required

**Request Body:**
```json
{
  "job_title": "Senior Graphics Design",
  "expected_salary": "N200,000",
  "remote_preference": "Remote"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:3001/api/jobs/1 \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "job_title": "Senior Graphics Design",
    "expected_salary": "N200,000",
    "remote_preference": "Remote"
  }'
```

---

### 6. Delete Job

**Endpoint:** `DELETE /api/jobs/:id`

**Description:** Delete job posting

**Authentication:** Required

**cURL Example:**
```bash
curl -X DELETE http://localhost:3001/api/jobs/1 \
  -H "Authorization: Bearer <your_token>"
```

---

## Candidates

All candidate endpoints are prefixed with `/api/candidates`

### 1. Create Candidate Profile

**Endpoint:** `POST /api/candidates`

**Description:** Create a new candidate profile

**Authentication:** Required

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@email.com",
  "phone": "+1-555-0123",
  "location": "New York, NY",
  "title": "Senior Frontend Developer",
  "bio": "Passionate frontend developer with 5+ years of experience...",
  "experience_years": 5,
  "skills": ["JavaScript", "React", "TypeScript", "Vue.js"],
  "education": [{
    "degree": "Bachelor of Science",
    "field": "Computer Science",
    "institution": "MIT",
    "year": 2018
  }],
  "work_history": [{
    "company": "Tech Corp",
    "title": "Frontend Developer",
    "duration": "2020-2023",
    "description": "Built responsive web applications"
  }],
  "certifications": ["AWS Certified Developer"],
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "availability": "Available",
  "salary_expectation": 120000,
  "remote_preference": true
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/candidates \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@email.com",
    "location": "New York, NY",
    "title": "Senior Frontend Developer",
    "experience_years": 5,
    "skills": ["JavaScript", "React"],
    "availability": "Available"
  }'
```

---

### 2. Get All Candidates

**Endpoint:** `GET /api/candidates`

**Description:** Get all candidates with optional filtering

**Authentication:** Not required

**Query Parameters:**
- `location`: Filter by location
- `skills`: Comma-separated skills
- `experience_years`: Filter by experience
- `availability`: Filter by availability
- `remote_preference`: Filter by remote preference
- `page`: Page number
- `limit`: Results per page

**cURL Example:**
```bash
curl "http://localhost:3001/api/candidates?location=New York&skills=JavaScript,React&experience_years=3&limit=10"
```

---

### 3. Search Candidates

**Endpoint:** `GET /api/candidates/search`

**Description:** Advanced candidate search

**Authentication:** Not required

**Query Parameters:**
- `q`: Search query
- `location`: Filter by location
- `skills`: Comma-separated skills
- `experience_min`: Minimum experience years
- `experience_max`: Maximum experience years
- `availability`: Availability status
- `remote_preference`: Remote preference
- `salary_expectation`: Salary expectation
- `page`: Page number
- `limit`: Results per page

**cURL Example:**
```bash
curl "http://localhost:3001/api/candidates/search?q=developer&location=New York&skills=JavaScript&experience_min=3&limit=10"
```

---

### 4. Get Candidate by ID

**Endpoint:** `GET /api/candidates/:id`

**Description:** Get specific candidate by ID

**Authentication:** Not required

**cURL Example:**
```bash
curl http://localhost:3001/api/candidates/1
```

---

### 5. Update Candidate

**Endpoint:** `PUT /api/candidates/:id`

**Description:** Update candidate profile

**Authentication:** Required

**Request Body:**
```json
{
  "title": "Senior Full Stack Developer",
  "experience_years": 6,
  "skills": ["JavaScript", "React", "Node.js"]
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:3001/api/candidates/1 \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Full Stack Developer",
    "experience_years": 6
  }'
```

---

### 6. Delete Candidate

**Endpoint:** `DELETE /api/candidates/:id`

**Description:** Delete candidate profile

**Authentication:** Required

**cURL Example:**
```bash
curl -X DELETE http://localhost:3001/api/candidates/1 \
  -H "Authorization: Bearer <your_token>"
```

---

## Job Board

All job board endpoints are prefixed with `/api/job-board`

Job payloads use the same **job preferences** structure as `/api/jobs` (job_title, industry_sector, preferred_country, preferred_state, work_type, expected_salary, currency, remote_preference, availability).

### Jobs

#### 1. Create Job Posting

**Endpoint:** `POST /api/job-board/job`

**Description:** Create a new job posting on job board (same payload as `/api/jobs`)

**Authentication:** Required

**Request Body:** Same as `/api/jobs` — use `job_title`, `industry_sector`, `preferred_country`, `preferred_state`, `work_type`, `expected_salary`, `currency`, `remote_preference`, `availability`, `posted_by`.

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/job-board/job \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "job_title": "Graphics Design",
    "industry_sector": "Health Sector",
    "preferred_country": "Nigeria",
    "preferred_state": "Anambra",
    "work_type": "Full-time",
    "expected_salary": "N150,000",
    "currency": "NGN",
    "remote_preference": "Hybrid",
    "availability": "Immediately"
  }'
```

---

#### 2. Get All Jobs

**Endpoint:** `GET /api/job-board/jobs`

**Description:** Get all jobs with filtering

**Authentication:** Not required

**Query Parameters:** Same as `/api/jobs` — `search`, `preferred_country`, `preferred_state`, `work_type`, `industry_sector`, `remote_preference`, `availability`, `currency`, `page`, `limit`.

**cURL Example:**
```bash
curl "http://localhost:3001/api/job-board/jobs?preferred_country=Nigeria&work_type=Full-time&remote_preference=Hybrid"
```

---

#### 3. Advanced Job Search

**Endpoint:** `GET /api/job-board/jobs/search`

**Description:** Advanced job search (same filters as `/api/jobs/search`)

**Authentication:** Required

**Query Parameters:** Same as `/api/jobs/search` — `q`, `preferred_country`, `preferred_state`, `work_type`, `industry_sector`, `remote_preference`, `availability`, `currency`, `page`, `limit`.

**cURL Example:**
```bash
curl "http://localhost:3001/api/job-board/jobs/search?q=Graphics&preferred_country=Nigeria&work_type=Full-time" \
  -H "Authorization: Bearer <your_token>"
```

---

#### 4. Get Job by ID

**Endpoint:** `GET /api/job-board/jobs/:id`

**Description:** Get specific job by ID

**Authentication:** Not required

**cURL Example:**
```bash
curl http://localhost:3001/api/job-board/jobs/1
```

---

#### 5. Update Job

**Endpoint:** `PUT /api/job-board/jobs/:id`

**Description:** Update job posting (same fields as Create Job)

**Authentication:** Required

**Request Body:** Same as `/api/jobs/:id` — e.g. `job_title`, `industry_sector`, `preferred_country`, `preferred_state`, `work_type`, `expected_salary`, `currency`, `remote_preference`, `availability`.

**cURL Example:**
```bash
curl -X PUT http://localhost:3001/api/job-board/jobs/1 \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "job_title": "Senior Graphics Design",
    "expected_salary": "N200,000"
  }'
```

---

#### 6. Delete Job

**Endpoint:** `DELETE /api/job-board/jobs/:id`

**Description:** Delete job posting

**Authentication:** Required

**cURL Example:**
```bash
curl -X DELETE http://localhost:3001/api/job-board/jobs/1 \
  -H "Authorization: Bearer <your_token>"
```

---

### Candidates

#### 1. Create Candidate Profile

**Endpoint:** `POST /api/job-board/candidates`

**Description:** Create candidate profile on job board

**Authentication:** Required

**Request Body:** Same as `/api/candidates` endpoint

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/job-board/candidates \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "title": "Frontend Developer"
  }'
```

---

#### 2. Get All Candidates

**Endpoint:** `GET /api/job-board/candidates`

**Description:** Get all candidates with filtering

**Authentication:** Not required

**Query Parameters:** Same as `/api/candidates` endpoint

**cURL Example:**
```bash
curl "http://localhost:3001/api/job-board/candidates?location=New York&skills=JavaScript"
```

---

#### 3. Get Candidate by ID

**Endpoint:** `GET /api/job-board/candidates/:id`

**Description:** Get specific candidate by ID

**Authentication:** Not required

**cURL Example:**
```bash
curl http://localhost:3001/api/job-board/candidates/1
```

---

#### 4. Update Candidate

**Endpoint:** `PUT /api/job-board/candidates/:id`

**Description:** Update candidate profile

**Authentication:** Required

**Request Body:** Same as `/api/candidates/:id` PUT endpoint

**cURL Example:**
```bash
curl -X PUT http://localhost:3001/api/job-board/candidates/1 \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Developer"
  }'
```

---

#### 5. Delete Candidate

**Endpoint:** `DELETE /api/job-board/candidates/:id`

**Description:** Delete candidate profile

**Authentication:** Required

**cURL Example:**
```bash
curl -X DELETE http://localhost:3001/api/job-board/candidates/1 \
  -H "Authorization: Bearer <your_token>"
```

---

### Applications

#### 1. Create Job Application

**Endpoint:** `POST /api/job-board/applications`

**Description:** Submit job application

**Authentication:** Required

**Request Body:**
```json
{
  "job_id": 1,
  "candidate_id": 1,
  "cover_letter": "I am excited to apply for this position...",
  "resume_url": "https://example.com/resume.pdf"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/job-board/applications \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": 1,
    "candidate_id": 1,
    "cover_letter": "I am excited to apply...",
    "resume_url": "https://example.com/resume.pdf"
  }'
```

---

#### 2. Get Applications

**Endpoint:** `GET /api/job-board/applications`

**Description:** Get applications with filtering

**Authentication:** Not required

**Query Parameters:**
- `job_id`: Filter by job ID
- `candidate_id`: Filter by candidate ID
- `status`: Filter by status (Applied, Under Review, Interview, Rejected, Hired)
- `page`: Page number
- `limit`: Results per page

**cURL Example:**
```bash
curl "http://localhost:3001/api/job-board/applications?job_id=1&status=Applied"
```

---

#### 3. Update Application Status

**Endpoint:** `PUT /api/job-board/applications/:id`

**Description:** Update application status

**Authentication:** Required

**Request Body:**
```json
{
  "status": "Under Review"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:3001/api/job-board/applications/1 \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Under Review"
  }'
```

---

## CV Search

All CV search endpoints are prefixed with `/api/cv`

### 1. Get My CV

**Endpoint:** `GET /api/cv/myCV`

**Description:** Get authenticated user's own CV

**Authentication:** Required

**cURL Example:**
```bash
curl -X GET http://localhost:3001/api/cv/myCV \
  -H "Authorization: Bearer <your_token>"
```

---

### 2. Get Employee CV

**Endpoint:** `GET /api/cv/employee_CV/:id`

**Description:** Get specific employee's CV by user_id (for employers/recruiters)

**Authentication:** Required (Recruiter/Employer role)

**cURL Example:**
```bash
curl -X GET http://localhost:3001/api/cv/employee_CV/user123 \
  -H "Authorization: Bearer <recruiter_token>"
```

---

### 3. Advanced CV Search

**Endpoint:** `GET /api/cv/search`

**Description:** Advanced CV search for recruiters/employers (searches myCv tables)

**Authentication:** Required (Recruiter/Employer role)

**Query Parameters:**
- `q`: General text search
- `location`: Filter by location
- `city`: Filter by city
- `country`: Filter by country
- `title`: Filter by job title
- `experience_min`: Minimum years of experience
- `experience_max`: Maximum years of experience
- `skills`: Comma-separated skills
- `education_level`: Filter by education level
- `field_of_study`: Filter by field of study
- `degree`: Filter by degree type
- `job_title`: Filter by previous job title
- `company_name`: Filter by previous company name
- `cert_name`: Filter by certificate name
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `sort_by`: Sort field (created_at, updated_at, first_name, last_name, title, experience_years)
- `order`: Sort order (ASC, DESC)

**cURL Example:**
```bash
curl "http://localhost:3001/api/cv/search?q=developer&location=Lagos&experience_min=3&skills=JavaScript,React&page=1&limit=10" \
  -H "Authorization: Bearer <recruiter_token>"
```

**Response:**
```json
{
  "success": true,
  "data": [...candidates...],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 4. Advanced Employee CV Search

**Endpoint:** `GET /api/cv/employee/search`

**Description:** Advanced CV search for recruiters/employers (searches employeeCv tables)

**Authentication:** Required (Recruiter/Employer role)

**Query Parameters:** Same as `/api/cv/search` endpoint

**cURL Example:**
```bash
curl "http://localhost:3001/api/cv/employee/search?q=developer&title=Manager&experience_min=5" \
  -H "Authorization: Bearer <recruiter_token>"
```

---

## Payment Integration

### Paystack

All Paystack endpoints are prefixed with `/api/paystack`

#### 1. Initialize Payment

**Endpoint:** `POST /api/paystack/init`

**Description:** Initialize Paystack payment

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "customer@example.com",
  "amount": 5000
}
```

**Note:** 
- `amount` is in Naira (will be converted to kobo internally by multiplying by 100)
- `email` is the customer's email address

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/paystack/init \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "amount": 5000
  }'
```

**Response:**
```json
{
  "status": true,
  "message": "Authorization URL created",
  "data": {
    "authorization_url": "https://checkout.paystack.com/...",
    "access_code": "access_code",
    "reference": "unique_ref_123"
  }
}
```

---

#### 2. Verify Payment

**Endpoint:** `GET /api/paystack/verify/:reference`

**Description:** Verify Paystack payment transaction

**Authentication:** Not required

**cURL Example:**
```bash
curl http://localhost:3001/api/paystack/verify/unique_ref_123
```

**Response:**
```json
{
  "status": true,
  "message": "Verification successful",
  "data": {
    "amount": 500000,
    "currency": "NGN",
    "status": "success",
    "reference": "unique_ref_123"
  }
}
```

---

### Flutterwave

All Flutterwave endpoints are prefixed with `/api/flutterwave`

#### 1. Initialize Payment

**Endpoint:** `POST /api/flutterwave/init`

**Description:** Initialize Flutterwave payment

**Authentication:** Not required

**Request Body:**
```json
{
  "tx_ref": "unique_transaction_ref",
  "amount": 5000,
  "currency": "NGN",
  "redirect_url": "https://yourwebsite.com/payment/callback",
  "customer": {
    "email": "customer@example.com",
    "name": "John Doe",
    "phone_number": "+2348012345678"
  }
}
```

**Note:** All fields are required.

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/flutterwave/init \
  -H "Content-Type: application/json" \
  -d '{
    "tx_ref": "unique_tx_ref_123",
    "amount": 5000,
    "currency": "NGN",
    "redirect_url": "https://yourwebsite.com/payment/callback",
    "customer": {
      "email": "customer@example.com",
      "name": "John Doe",
      "phone_number": "+2348012345678"
    }
  }'
```

**Response:**
```json
{
  "status": "success",
  "message": "Hosted Link",
  "data": {
    "link": "https://ravemodal-dev.herokuapp.com/v3/hosted/pay/...",
    "tx_ref": "unique_tx_ref_123"
  }
}
```

---

#### 2. Verify Payment

**Endpoint:** `GET /api/flutterwave/verify/:id`

**Description:** Verify Flutterwave payment transaction

**Authentication:** Not required

**cURL Example:**
```bash
curl http://localhost:3001/api/flutterwave/verify/transaction_id_123
```

**Response:**
```json
{
  "status": "success",
  "message": "Transaction fetched successfully",
  "data": {
    "id": 123456,
    "tx_ref": "unique_tx_ref_123",
    "amount": 500000,
    "currency": "NGN",
    "status": "successful"
  }
}
```

---

## Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format

```json
{
  "error": "Error message",
  "details": "Detailed error description (optional)",
  "code": "ERROR_CODE (optional)"
}
```

### Common Error Messages

- `"Please log in!"` - Missing or invalid authentication token
- `"Invalid token format!"` - Token format is incorrect
- `"Invalid or expired token"` - Token has expired or is invalid
- `"access denied! Only recruiters/employers can access this resource."` - Insufficient permissions
- `"CV not found!"` - CV does not exist
- `"User not found"` - User does not exist

---

## Testing in Postman

### Setting Up Postman

1. **Create Environment Variables:**
   - `base_url`: `http://localhost:3001`
   - `access_token`: Your JWT token (update after login)

2. **Set Authorization at Collection Level:**
   - Go to Collection settings → Authorization
   - Type: Bearer Token
   - Token: `{{access_token}}`

3. **Use Variables in URLs:**
   - `{{base_url}}/api/jobs`
   - `{{base_url}}/auth/login`

### Postman Collection Structure

```
Bejite Backend API
├── Authentication
│   ├── Signup
│   ├── Login
│   ├── Google OAuth
│   ├── Refresh Token
│   ├── Logout
│   ├── Forgot Password
│   └── Reset Password
├── Profile
│   ├── Get Profile
│   └── Upload CV
├── CV Builder
│   ├── Bio
│   ├── Education
│   ├── Skills
│   ├── Work History
│   ├── Certificates
│   ├── Links
│   └── Complete CV
├── Jobs
│   ├── Create Job
│   ├── Get All Jobs
│   ├── Search Jobs
│   ├── Get Job by ID
│   ├── Update Job
│   └── Delete Job
├── Candidates
│   ├── Create Candidate
│   ├── Get All Candidates
│   ├── Search Candidates
│   ├── Get Candidate by ID
│   ├── Update Candidate
│   └── Delete Candidate
├── Job Board
│   ├── Jobs
│   ├── Candidates
│   └── Applications
├── CV Search
│   ├── Get My CV
│   ├── Get Employee CV
│   ├── Search CVs
│   └── Search Employee CVs
└── Payments
    ├── Paystack Init
    ├── Paystack Verify
    ├── Flutterwave Init
    └── Flutterwave Verify
```

---

## JavaScript/TypeScript Integration Examples

### Authentication Helper

```javascript
// auth.js
const API_BASE_URL = 'http://localhost:3001';

class AuthService {
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  }

  async signup(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}

export default new AuthService();
```

### API Client Helper

```javascript
// apiClient.js
import authService from './auth';

const API_BASE_URL = 'http://localhost:3001';

class ApiClient {
  async request(endpoint, options = {}) {
    const token = authService.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // CV Builder methods
  async createBio(bioData) {
    return this.request('/api/cv-builder/bio', {
      method: 'POST',
      body: JSON.stringify(bioData)
    });
  }

  async getBio(userId) {
    return this.request(`/api/cv-builder/bio/${userId}`);
  }

  // Job methods
  async createJob(jobData) {
    return this.request('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  }

  async searchJobs(filters) {
    const params = new URLSearchParams(filters);
    return this.request(`/api/jobs/search?${params}`);
  }

  // Candidate methods
  async createCandidate(candidateData) {
    return this.request('/api/candidates', {
      method: 'POST',
      body: JSON.stringify(candidateData)
    });
  }

  async searchCandidates(filters) {
    const params = new URLSearchParams(filters);
    return this.request(`/api/candidates/search?${params}`);
  }
}

export default new ApiClient();
```

### Usage Example

```javascript
// Example usage
import apiClient from './apiClient';
import authService from './auth';

// Login
await authService.login('user@example.com', 'password');

// Create bio
await apiClient.createBio({
  user_id: 'user123',
  nickname: 'John',
  phone: '+2348012345678',
  bio: 'Software developer...'
});

// Create job (job preferences payload)
await apiClient.createJob({
  job_title: 'Graphics Design',
  industry_sector: 'Health Sector',
  preferred_country: 'Nigeria',
  preferred_state: 'Anambra',
  work_type: 'Full-time',
  expected_salary: 'N150,000',
  currency: 'NGN',
  remote_preference: 'Hybrid',
  availability: 'Immediately'
});

// Search jobs
const jobs = await apiClient.searchJobs({
  q: 'Graphics',
  preferred_country: 'Nigeria',
  work_type: 'Full-time',
  currency: 'NGN'
});
```

---

## Environment Variables

Make sure to set these environment variables in your `.env` file:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=your_database_url

# JWT
ACCESSTOKEN=your_jwt_secret
REFRESHTOKEN=your_refresh_token_secret

# Google OAuth
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
CALLBACK_URL=http://localhost:3001/auth/google/callback
FRONTEND_URL=http://localhost:5173

# Payment Gateways
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret_key
FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key

# Email
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Session
SECRET_SESSION=your_session_secret
```

---

## Additional Resources

- **Swagger Documentation**: Visit `http://localhost:3001/api-docs` when server is running
- **Postman Collection**: Import the collection from the provided examples
- **Google OAuth Guide**: See `GOOGLE_OAUTH_POSTMAN_GUIDE.md` for detailed OAuth testing

---

## Support

For issues or questions:
1. Check the error responses section
2. Verify your authentication token is valid
3. Ensure all required environment variables are set
4. Check server logs for detailed error messages

---

**Last Updated:** January 2026
**API Version:** 1.0.0
