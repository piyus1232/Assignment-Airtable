
# Airtable-Connected Form Builder  
*A Full-stack Form Builder & Viewer application built with React + Node.js + MongoDB, integrated with Airtable. Developed as part of an assignment project.*

## 🚀 Features Implemented

- **User Authentication (OAuth):**
  - Secure login with session storage.

- **Form Creation (Builder):**
  - Add multiple question types: short text, long text, email, single select, multi select, file upload.
  - Conditional logic → show questions only if conditions are met.
  - Forms stored in MongoDB, referenced to Airtable Base/Table.

- **Form Viewing (Public Form Page):**
  - Respondents answer and submit forms.
  - Multi-select shown as “pill buttons.”
  - File upload supported.
  - Conditional questions appear dynamically.

- **Form Submission:**
  - Responses saved to MongoDB.
  - Linked to correct Form ID.

- **Responses Management (Admin/Teacher View):**
  - Form owner can view all submitted responses in a table.
  - Responses include timestamps.

- **Airtable Integration:**
  - Forms linked to Airtable Base & Table IDs.

## 🛠 Tech Stack

- **Frontend:** React, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), Airtable API
- **Auth:** Custom authMiddleware (OAuth-based sessions)
- **Database:** MongoDB Atlas / Local MongoDB

## 📂 Project Structure

```
/Backend
├── src/
│   ├── controllers/    # formController.js (create, fetch, submit, responses)
│   ├── models/         # Form.js, Response.js, User.js
│   ├── routes/         # formRoutes.js, authRoutes.js
│   └── db/             # connectDB.js
└── server.js

/Frontend
├── src/
│   ├── pages/          # Login, Dashboard, CreateForm, FormPage, ResponsesPage
│   ├── utils/          # api.js (Axios client)
│   └── App.jsx
```

## ⚙️ Installation & Setup

**1️⃣ Clone Repository**
```
git clone https://github.com/piyus1232/Assignment-Airtable.git
cd Assignment-Airtable
```

**2️⃣ Backend Setup**
```
cd Backend
npm install
```
Create a `.env` file in `/Backend`:
```
MONGO_URI=mongodb://localhost:27017/formsdb
SESSION_SECRET=super_secret_key
AIRTABLE_API_KEY=your_airtable_api_key
```
Start backend server:
```
npm run dev
# Backend runs at: http://localhost:5000/
```

**3️⃣ Frontend Setup**
```
cd Frontend
npm install
```
Configure `src/utils/api.js`:
```
import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
});
export default api;
```
Start frontend server:
```
npm run dev
# Frontend runs at: http://localhost:5173/
```

## 🧪 Usage Demo

- **Login** → Authenticate as a user.
- **Create Form** → Add questions & save your form.
- **Share Form Link** → `/form/:id` for respondents.
- **Submit Responses** → Responses are saved to DB.
- **View Responses** → Owner goes to `/form/:id/responses` to view submissions.

## 📊 Example Forms

### 🎓 Student Feedback Form
- Name (short text)
- Email (short text)
- Rating (single select: Excellent / Good / Average / Poor)
- Feedback (long text)
- Upload project (file)

### 📅 Event Registration Form
- Full Name
- Email
- Workshops (multi select: AI/ML, Web3, Cloud, Cybersecurity)
- Motivation (long text)

---

**Note:**  
- Images of the project are inside "frontend screenshots".

**Resources:**  
- [Readme](https://github.com/piyus1232/Assignment-Airtable#readme-ov-file)
- [Activity](https://github.com/piyus1232/Assignment-Airtable/activity)
- [Releases](https://github.com/piyus1232/Assignment-Airtable/releases)
- [Packages](https://github.com/users/piyus1232/packages?repo_name=Assignment-Airtable)
- [JavaScript98.6%](https://github.com/piyus1232/Assignment-Airtable/search?l=javascript)
```
