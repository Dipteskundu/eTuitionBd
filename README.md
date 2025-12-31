# eTuitionBd – Frontend 🎓

eTuitionBd is a full-stack tuition management platform that connects students with professional tutors. This repository contains the frontend single-page application built with modern React tooling, focused on speed, accessibility, and a smooth dashboard experience for students, tutors, and admins.


## 🔗 Live Project

https://etuitionbd-the-best-tuition-media.netlify.app/



## � Screenshot
Portal Home Page & Student Dashboard
<p align="left">
  <img width="20%" src="https://i.ibb.co.com/dsbSNHmL/Screenshot-2025-12-31-185631.png" alt="Diptes Kumar Kundu Profile Picture" />
</p> 


<p align="center">
  
  <img width="20%" src="https://i.ibb.co.com/7tWx2TK6/image.png" alt="Diptes Kumar Kundu Profile Picture" />
</p>


## 🚀 Core Features

- Multi-role dashboards for students, tutors, and admins
- Tuition posting, application management, and hiring flow
- Tutor discovery with search, filtering, and detailed profiles
- Secure Stripe-based payment integration for hiring tutors
- Activity analytics dashboards with charts and key metrics
- Schedule management with export to PDF
- Image upload for profiles and posts (ImgBB)
- Toast notifications, alerts, and confirmation dialogs
- Responsive design with dark/light theme support


## 🛠️ Main Technologies Used

- React 19
- Vite
- React Router DOM
- Tailwind CSS
- DaisyUI
- Firebase Authentication
- Axios
- TanStack React Query
- React Hook Form
- Framer Motion
- Recharts
- jsPDF and jspdf-autotable
- SweetAlert2
- React Hot Toast


## 📦 Dependencies

Runtime dependencies (from `package.json`):

- `@tanstack/react-query`
- `axios`
- `firebase`
- `framer-motion`
- `jspdf`
- `jspdf-autotable`
- `lucide-react`
- `react`
- `react-dom`
- `react-fast-marquee`
- `react-hook-form`
- `react-hot-toast`
- `react-router-dom`
- `recharts`
- `sweetalert2`

Development and tooling:

- `@eslint/js`
- `@types/react`
- `@types/react-dom`
- `@vitejs/plugin-react`
- `autoprefixer`
- `daisyui`
- `eslint`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `globals`
- `postcss`
- `tailwindcss`
- `vite`



## 🧩 Project Structure (Frontend)

- `src/` – React components, pages, hooks, routes, and utilities
- `src/components/` – Reusable UI components
- `src/pages/` – Route-level pages (home, dashboards, auth, etc.)
- `src/hooks/` – Custom hooks (secure Axios, queries, etc.)
- `src/utils/` – Shared utilities (`axiosInstance`, image upload helpers)
- `src/services/` – Firebase configuration and related services


## 🧪 Environment Variables

Create a `.env` file in the project root and provide the required Vite environment variables:

```env
VITE_API_BASE_URL=https://etuitionbd-server-dkbd.onrender.com

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

VITE_IMGBB_KEY=your_imgbb_api_key
```

You can also point `VITE_API_BASE_URL` to your own locally running backend instead of the deployed Render URL.



## 🧾 How To Run The Project Locally

### 1. Prerequisites

- Node.js 18 or higher
- npm (comes with Node) or another package manager like pnpm or yarn
- A running instance of the eTuitionBd backend (local or deployed)

### 2. Clone The Repository

```bash
git clone <your-repo-url>
cd eTuitionBd-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment

- Create a `.env` file at the project root.
- Copy the variables listed in the Environment Variables section.
- Fill in Firebase and ImgBB keys from your own accounts.
- Set `VITE_API_BASE_URL` to your backend URL, for example:

```env
VITE_API_BASE_URL=http://localhost:5000
```

or use the deployed API:

```env
VITE_API_BASE_URL=https://etuitionbd-server-dkbd.onrender.com
```

### 5. Start Development Server

```bash
npm run dev
```

The app will usually be available at `http://localhost:5173`.

### 6. Build For Production

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### 7. Lint The Project

```bash
npm run lint
```



## 🌐 Additional Resources

- Frontend (primary): https://symphonious-sherbet-5b5c9e.netlify.app
- Frontend (alternate): https://etuitionbd-the-best-tuition-media.netlify.app
- Backend API: https://etuitionbd-server-dkbd.onrender.com


