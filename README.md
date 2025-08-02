# Full-Stack Application

A modern full-stack application built with React, TypeScript, Tailwind CSS, Node.js, Express, and Prisma.

## Project Structure

```
trainee-golems-25t2/
├── frontend/          # React + TypeScript + Vite + Tailwind
│   ├── src/
│   │   ├── pages/     # Page components
│   │   ├── App.tsx    # Main app with routing
│   │   └── main.tsx   # Entry point
│   └── package.json
├── backend/           # Node.js + Express + TypeScript + Prisma
│   ├── src/
│   │   └── index.ts   # Express server
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
└── README.md
```

## Technologies Used

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Database (configurable)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (or another supported database)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd backend

# Create environment file
cp .env.example .env

# Update .env with your database credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/myapp?schema=public"

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations (after setting up your database)
npx prisma migrate dev

# Start the development server
npm run dev
```

The backend will be available at `http://localhost:3000`

### API Endpoints

- `GET /api/health` - Health check endpoint

## Development Commands

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server

### Database

- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma generate` - Generate Prisma client

## Next Steps

1. Set up your database and update the `DATABASE_URL` in `.env`
2. Run `npx prisma migrate dev` to create the database tables
3. Start building your application features!

## Git Hooks (Automatic Quality Checks)

This project uses **Husky** to run automatic checks that ensure code quality for all team members:

### Pre-commit Hook

Runs automatically when you commit:

- ✅ **ESLint** - Code style and quality checks
- ✅ **TypeScript** - Type checking for frontend and backend

### Pre-push Hook

Runs automatically when you push:

- ✅ **Tests** - All unit tests must pass
- ✅ **Build** - Production builds must succeed

**Note**: These hooks run automatically after `npm install` for all team members!

## Development Commands

### Root Project

- `npm run install:all` - Install all dependencies
- `npm run dev:frontend` - Start frontend dev server
- `npm run dev:backend` - Start backend dev server
- `npm run test:frontend` - Run frontend tests
- `npm run test:backend` - Run backend tests
- `npm run lint:frontend` - Lint frontend code
- `npm run lint:backend` - Lint backend code

## Contributing

1. Fork (or clone if you're in added to the repo) the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
   - Pre-commit hooks will run automatically ✅
4. Push to the branch (`git push origin feature/amazing-feature`)
   - Pre-push hooks will run tests and builds ✅
5. Open a Pull Request
