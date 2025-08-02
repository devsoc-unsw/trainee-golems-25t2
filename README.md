# Trainee Golems 25T2 - Full-Stack Application

A modern, production-ready full-stack application with authentication, built using React, TypeScript, Tailwind CSS, Node.js, Express, Prisma, and NeonDB.

## 🚀 Features

- **🔐 Authentication System**: User registration, login, logout with session management
- **🗄️ Database**: NeonDB (serverless PostgreSQL) with Prisma ORM
- **🎨 Modern UI**: React 18, TypeScript, Tailwind CSS v3
- **⚡ Fast Development**: Vite dev server with HMR
- **🧪 Testing**: Comprehensive test suites (Vitest + Jest)
- **🔍 Code Quality**: ESLint, TypeScript, automated Git hooks
- **🚀 CI/CD**: GitHub Actions with automated testing and builds

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Database Setup (NeonDB)](#-database-setup-neondb)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Code Quality & Git Hooks](#-code-quality--git-hooks)
- [Contributing](#-contributing)

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better developer experience
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS v3** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Vitest** - Testing framework

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **TypeScript** - Type safety for backend
- **Prisma** - Next-generation ORM
- **NeonDB** - Serverless PostgreSQL database
- **Jest** - Testing framework

### DevOps & Quality

- **GitHub Actions** - CI/CD pipeline
- **Husky** - Git hooks for quality gates
- **ESLint** - Code linting and formatting
- **Pre-commit/Pre-push hooks** - Automated quality checks

## 📁 Project Structure

```
trainee-golems-25t2/
├── 📁 frontend/                    # React application
│   ├── 📁 src/
│   │   ├── 📁 pages/              # Route components (Home, About)
│   │   ├── 📁 Components/         # Reusable components (Navbar)
│   │   ├── 📁 test/               # Test files and setup
│   │   ├── App.tsx                # Main app component
│   │   ├── Router.tsx             # Route definitions
│   │   └── main.tsx               # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── 📁 backend/                     # Express API server
│   ├── 📁 src/
│   │   ├── 📁 controllers/        # Request handlers
│   │   ├── 📁 services/           # Business logic
│   │   ├── 📁 middleware/         # Express middleware
│   │   ├── 📁 routes/             # API routes
│   │   ├── 📁 lib/                # Utilities (Prisma client)
│   │   ├── 📁 tests/              # Test files
│   │   └── server.ts              # Express server
│   ├── 📁 prisma/
│   │   └── schema.prisma          # Database schema
│   ├── package.json
│   └── .env                       # Environment variables
├── 📁 .github/workflows/          # CI/CD configuration
│   └── ci.yml
├── 📁 .husky/                     # Git hooks
│   ├── pre-commit
│   └── pre-push
├── package.json                   # Root workspace config
└── README.md
```

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **NeonDB Account** - [Sign up here](https://console.neon.tech)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/devsoc-unsw/trainee-golems-25t2.git
cd trainee-golems-25t2
```

### 2. Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Or install individually:
cd frontend && npm install --legacy-peer-deps
cd ../backend && npm install --legacy-peer-deps
```

### 3. Set Up Database (NeonDB)

Follow the [Database Setup section](#-database-setup-neondb) below for detailed NeonDB configuration.

### 4. Start Development Servers

```bash
# Start both frontend and backend simultaneously
npm run dev

# Or start individually:
npm run dev:frontend  # Frontend at http://localhost:5173
npm run dev:backend   # Backend at http://localhost:3001
```

## 🗄️ Database Setup (NeonDB)

NeonDB is a serverless PostgreSQL database that's perfect for modern applications. Here's how to set it up:

### Step 1: Create a NeonDB Project

1. **Sign up/Login** to [NeonDB Console](https://console.neon.tech)
2. **Click "New Project"**
3. **Configure your project:**
   - **Project name**: `trainee-golems-25t2` (or your preference)
   - **Database name**: `neondb` (default)
   - **Region**: Choose closest to you (e.g., `US East`, `Asia Pacific`)
4. **Click "Create Project"**

### Step 2: Get Your Connection String

1. **In your NeonDB dashboard, click "Connect"**
2. **Configure connection settings:**
   - **Branch**: `main` (default)
   - **Database**: `neondb`
   - **Role**: `neondb_owner` (default)
   - **Connection pooling**: ✅ **ENABLED** (recommended)
3. **Copy the connection string** - it will look like:
   ```
   postgresql://neondb_owner:abc123@ep-cool-name-123456-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

### Step 3: Configure Environment Variables

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Update your `.env` file:**

   ```bash
   # Server Configuration
   PORT=3001
   NODE_ENV=development

   # NeonDB Database Configuration
   DATABASE_URL="your_actual_neondb_connection_string_here"
   ```

3. **Replace `DATABASE_URL`** with your actual NeonDB connection string from Step 2.

### Step 4: Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

### Step 5: Verify Connection

```bash
# Test the backend server
npm run dev

# You should see: "✅ Server running on port 3001"
```

**🎉 Success!** Your NeonDB is now connected and ready for development.

### Database Schema

The application includes these tables:

- **User**: Stores user accounts (id, email, name, password, userId)
- **Session**: Manages user sessions (id, sessionId, userId, timestamps)

## 🛠️ Development

### Available Scripts

#### Root Project Commands

```bash
npm run install:all      # Install all dependencies
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only
npm run test:frontend    # Run frontend tests
npm run test:backend     # Run backend tests
npm run build:frontend   # Build frontend for production
npm run build:backend    # Build backend for production
npm run lint:frontend    # Lint frontend code
npm run lint:backend     # Lint backend code
```

#### Frontend Commands

```bash
cd frontend
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run test             # Run tests with Vitest
npm run lint             # Run ESLint
```

#### Backend Commands

```bash
cd backend
npm run dev              # Start development server with hot reload
npm run build            # Compile TypeScript to JavaScript
npm run start            # Start production server
npm run test             # Run tests with Jest
npm run lint             # Run ESLint
```

#### Database Commands

```bash
cd backend
npx prisma generate      # Generate Prisma client
npx prisma db push       # Sync database with schema
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Create and apply migrations (optional)
```

### Development Workflow

1. **Start development servers:**

   ```bash
   npm run dev
   ```

2. **Make your changes** to frontend or backend code

3. **Access your application:**

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Database Studio: http://localhost:5555 (if running)

4. **Run tests:**
   ```bash
   npm run test:frontend
   npm run test:backend
   ```

## 🧪 Testing

### Frontend Testing

- **Framework**: Vitest with React Testing Library
- **Location**: `frontend/src/test/`
- **Run tests**: `npm run test:frontend`

### Backend Testing

- **Framework**: Jest with Supertest
- **Location**: `backend/src/tests/`
- **Run tests**: `npm run test:backend`

### Test Coverage

```bash
# Frontend coverage
cd frontend && npm run test -- --coverage

# Backend coverage
cd backend && npm run test -- --coverage
```

## 🚀 Deployment

### Frontend Deployment

The frontend is configured for deployment on platforms like:

- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**

### Backend Deployment

The backend can be deployed to:

- **Railway**
- **Heroku**
- **DigitalOcean**
- **AWS**

### Environment Variables for Production

Make sure to set these in your production environment:

```bash
# Backend
DATABASE_URL="your_production_neondb_url"
NODE_ENV="production"
PORT="3001"
```

## 🔍 Code Quality & Git Hooks

This project maintains high code quality through automated checks:

### Pre-commit Hook (Runs on `git commit`)

- ✅ **ESLint** - Code style and quality checks
- ✅ **TypeScript** - Type checking for frontend and backend

### Pre-push Hook (Runs on `git push`)

- ✅ **Tests** - All unit tests must pass
- ✅ **Build** - Production builds must succeed

### CI/CD Pipeline (GitHub Actions)

The CI pipeline runs on every push and pull request:

1. **Linting** - Code quality checks
2. **Type Checking** - TypeScript validation
3. **Testing** - Comprehensive test suites
4. **Building** - Production build verification
5. **Security Audit** - Dependency vulnerability scanning

**Note**: Git hooks are automatically installed for all team members after running `npm install`!

## 🤝 Contributing

### Development Process

1. **Clone/Fork the repository:**

   ```bash
   git clone https://github.com/devsoc-unsw/trainee-golems-25t2.git
   ```

2. **Create a feature branch:**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes and test:**

   ```bash
   npm run test:frontend
   npm run test:backend
   ```

4. **Commit your changes:**

   ```bash
   git commit -m "feat: add amazing feature"
   # Pre-commit hooks will run automatically ✅
   ```

5. **Push to your branch:**

   ```bash
   git push origin feature/amazing-feature
   # Pre-push hooks will run tests and builds ✅
   ```

6. **Open a Pull Request**

### Commit Message Convention

We follow conventional commits for clear and consistent commit messages:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Code Style

- **Frontend**: ESLint + TypeScript + Prettier
- **Backend**: ESLint + TypeScript
- **Formatting**: Enforced through pre-commit hooks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Need Help?

- **Issues**: [GitHub Issues](https://github.com/devsoc-unsw/trainee-golems-25t2/issues)
- **Documentation**: Check this README or inline code comments
- **NeonDB Docs**: [NeonDB Documentation](https://neon.tech/docs)
- **Prisma Docs**: [Prisma Documentation](https://www.prisma.io/docs)

---

**Happy coding! 🚀**
