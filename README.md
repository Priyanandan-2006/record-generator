# Record Generator

React frontend and Node.js Express backend for generating a professional A4 experiment record PDF without using a database.

## Project structure

- `frontend/` - React app built with Vite
- `backend/` - Express API that creates the PDF with PDFKit

## Setup

### 1. Install dependencies

```bash
cd frontend
npm install
cd ../backend
npm install
```

### 2. Run the backend

```bash
cd backend
npm run dev
```

### 3. Run the frontend

```bash
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173` and calls the backend at `http://localhost:5000`.

## Included PDF fields

- Date
- Experiment Number
- Title
- Aim
- Algorithm
- Code
- Output
- Result
