# React CRUD Application

A simple, extensible User Management application built with React, TypeScript, Vite, Material-UI, and Tailwind CSS.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete users.
- **Form Validation**: Robust validation using Zod and React Hook Form.
- **Extensible Architecture**: Configuration-driven form builder (`src/config/formConfig.ts`) allows adding new fields with zero UI code changes.
- **Responsive Design**: precise layout using Material-UI components.
- **Mock API Adapter**: 
    - **Local Development**: Connects to `json-server` for a real REST API experience.
    - **Production/Demo**: Automatically switches to a `localStorage` adapter so the app is fully functional on static hosting platforms (Vercel/Netlify) without a backend.

## Tech Stack

- **Framework**: Vite + React + TypeScript
- **UI Library**: Material-UI (@mui/material)
- **Styling**: Tailwind CSS (for layout utilities)
- **State/Form**: React Hook Form
- **Validation**: Zod
- **Routing**: React Router DOM
- **HTTP Client**: Axios

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dhruvidesai1805/delta-sigma-ventures
   cd delta-sigma-ventures
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To run the application with the full JSON Server backend:

```bash
npm run dev
```

This command concurrently starts:
- The Vite development server at `http://localhost:5173`
- The JSON Server at `http://localhost:3001`

### Building for Production

```bash
npm run build
```

## Deployment

This application is designed to be easily deployed to Vercel, Netlify, or GitHub Pages.

**Important**: The application detects if it's running in production mode (via `import.meta.env.PROD`) and automatically switches to using the `localStorage` adapter. This ensures that the live demo is fully interactive (you can add/edit users) even without a live backend server.

## Extensibility: Adding a New Field

To add a new field (e.g., "Date of Birth"):

1. Open `src/config/formConfig.ts`.
2. Add a new object to the `userFormConfig` array:

```typescript
{
  name: 'dob',
  label: 'Date of Birth',
  type: 'date', // Supported types: text, email, tel, number, date
  required: true,
  validation: z.string().min(1, 'Date of birth is required'),
}
```

3. Update the `User` interface in `src/types/user.ts` to include the new field (optional, but recommended for strict typing).

The form will automatically render the new input field with validation rules applied.

## Assumptions & Design Decisions
- **Material-UI**: Chosen for its robust, accessible, and professional-looking pre-built components, accelerating development.
- **Configuration-Driven forms**: Prioritized to meet the "Extensibility" requirement.
- **Persistence Strategy**: A hybrid approach was chosen to ensure the "Live Demo" requirement is met without needing a hosted database service.
