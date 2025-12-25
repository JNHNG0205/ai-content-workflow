# Frontend Setup

## Installation

After cloning the repository, install dependencies:

```bash
cd frontend
npm install
```

## Required Dependencies

The following packages need to be installed:

```bash
npm install clsx tailwind-merge
npm install -D tailwindcss postcss autoprefixer tailwindcss-animate
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:4000/api
```

## Running the Frontend

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (default Vite port).

## Features

- **Authentication**: Login and Register pages
- **Writer Dashboard**: 
  - Create drafts with AI assistance
  - View drafts, submitted, rejected, and approved content
  - Submit drafts for review
  - Edit rejected content
- **Reviewer Dashboard**:
  - View pending reviews
  - Assign content to review
  - Approve or reject content with comments
  - View reviewed content

## Tech Stack

- React 19 with TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Custom API client

## Project Structure

```
src/
├── components/
│   └── ui/          # shadcn/ui components
├── contexts/        # React contexts (Auth)
├── lib/             # Utilities and API client
├── pages/           # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── WriterDashboard.tsx
│   └── ReviewerDashboard.tsx
└── App.tsx          # Main app component
```
