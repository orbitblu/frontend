# Blu AI Frontend Monorepo

This repository contains the frontend applications for the Blu AI project, including the admin interface and customer dashboard.

## Current Status

- Authentication system implemented and tested ✓
- Basic routing and authorization in place ✓
- React 19.0.0 integration complete ✓
- Test coverage for core functionality ✓
- Monorepo workspace setup complete ✓
- Error handling for localStorage and API failures ✓
- API integration configuration ✓

### Core Dependencies
- React 19.0.0
- Next.js 15.1.3
- Material UI 6.3.0
- React Query 3.39.3
- Formik 2.4.6 with Yup 1.6.1
- Notistack 3.0.1
- Axios 1.6.2
- Date-fns 2.30.0

### Testing Stack
- Jest 29.7.0
- Testing Library React 16.1.0
- Testing Library Jest DOM 6.1.4
- MSW 2.7.0 for API mocking

### Completed Features
- API client with error handling ✓
- Authentication flows (login, register, logout) ✓
- Protected routing based on user roles ✓
- Basic app shells for admin and customer interfaces ✓
- Form components with validation and error handling ✓
  - Login form with tests ✓
  - Registration form with tests ✓
  - Form accessibility features ✓
- Robust error handling ✓
  - localStorage access errors ✓
  - API failures ✓
  - Token validation ✓
- Loading states and user feedback ✓

### In Progress
- Layout and navigation components
  - Main layout component
  - Navigation component
  - Header component
  - Sidebar component
  - Footer component

### Next Development Phase
- UI/UX implementation for auth forms
- Extended test coverage for UI components
- Integration tests with Mock Service Worker
- Error boundaries and global error handling
- Performance optimizations
- Accessibility improvements

## API Integration

### Prerequisites

1. Running API server (default: http://localhost:5000)
2. Environment configuration
3. CORS enabled on API for development

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp config/env.example .env
   ```

2. Update the environment variables:
   ```bash
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:5000  # Your API server URL
   NEXT_PUBLIC_API_VERSION=v1                 # API version

   # Authentication
   NEXT_PUBLIC_AUTH_TOKEN_NAME=token          # LocalStorage token key
   NEXT_PUBLIC_AUTH_REFRESH_TOKEN_NAME=refresh_token

   # Environment
   NEXT_PUBLIC_ENVIRONMENT=development        # or production

   # Application URLs
   NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
   NEXT_PUBLIC_CUSTOMER_URL=http://localhost:3000
   ```

### API Client Configuration

The API client is configured in `packages/common/src/services/api/client.ts` with:

- Automatic token management
- Error handling
- Request/response interceptors
- Environment-based configuration
- CORS support for development

### Available API Services

1. Authentication (`packages/common/src/services/api/auth.ts`):
   - Registration
   - Login
   - Logout
   - Token refresh
   - User information

### Error Handling

The API client handles various error scenarios:

- Authentication errors (401)
- Rate limiting (429)
- Validation errors (400)
- Server errors (500+)
- Network errors
- localStorage access errors

### Development Setup

1. Start the API server:
   ```bash
   # In the API repository
   python -m flask run
   ```

2. Start the frontend development server:
   ```bash
   # For admin interface
   npm run dev:admin

   # For customer dashboard
   npm run dev:customer
   ```

### Production Deployment

1. Set up production environment:
   ```bash
   cp config/env.production .env
   ```

2. Build the applications:
   ```bash
   npm run build
   ```

3. Deploy to production servers

## Repository Structure

```
frontend/
├── node_modules/      # Hoisted dependencies (workspace root)
├── packages/
│   ├── common/       # Shared components and utilities
│   │   ├── src/
│   │   │   ├── components/ # Reusable React components
│   │   │   ├── contexts/   # React contexts (Auth, Theme, etc.)
│   │   │   ├── hooks/     # Custom React hooks
│   │   │   ├── utils/     # Utility functions
│   │   │   ├── services/  # API services
│   │   │   └── styles/    # Shared styles and themes
│   │   └── package.json   # Common package dependencies
│   ├── admin/       # Admin interface
│   │   ├── src/
│   │   │   ├── components/ # Admin-specific components
│   │   │   ├── pages/     # Next.js pages
│   │   │   ├── services/  # API services
│   │   │   └── styles/    # Admin-specific styles
│   │   └── package.json   # Admin package dependencies
│   └── customer/    # Customer dashboard
│       ├── src/
│       │   ├── components/ # Customer-specific components
│       │   ├── pages/     # Next.js pages
│       │   ├── services/  # API services
│       │   └── styles/    # Customer-specific styles
│       └── package.json   # Customer package dependencies
├── config/          # Build and environment configurations
├── scripts/         # Build and development scripts
└── package.json     # Workspace root dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/orbitblu/frontend.git
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Set up environment variables:
   ```bash
   cp config/env.example .env
   ```

4. Start the development server:
   ```bash
   # For admin interface (runs on port 3001)
   npm run dev:admin

   # For customer dashboard (runs on port 3000)
   npm run dev:customer
   ```

## Development

### Workspace Structure

The project uses npm workspaces to manage the monorepo:

- `packages/common`: Shared components and utilities
  - Core UI components using Material UI
  - Authentication context and hooks
  - API client and services
  - Shared types and utilities
  - Error handling utilities

- `packages/admin`: Admin interface
  - Built with Next.js 15.1.3
  - Uses Material UI components
  - React Query for state management
  - Notistack for notifications

- `packages/customer`: Customer dashboard
  - Built with Next.js 15.1.3
  - Uses Material UI components
  - React Query for state management
  - Notistack for notifications

### Available Scripts

- `npm run dev:admin` - Start admin interface in development mode (port 3001)
- `npm run dev:customer` - Start customer dashboard in development mode (port 3000)
- `npm run build` - Build all packages for production
- `npm run test` - Run tests across all packages
- `npm run lint` - Run linting across all packages
- `npm run format` - Format code using Prettier

### Testing

Each package includes:
- Jest for unit and integration testing ✓
- React Testing Library for component testing ✓
- Mock Service Worker (MSW) for API mocking ✓
- Test coverage reporting ✓

Current test coverage:
- API Client: Error handling, auth token management ✓
- Auth API: Login, register, logout, token refresh flows ✓
- Auth Context: User state management, authentication flows ✓
  - localStorage error handling ✓
  - API error handling ✓
  - Token validation ✓
- App Components: Basic routing and authorization checks ✓
- Form Components: Validation, error handling, loading states ✓

Run tests:
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test -- --coverage

# Run tests in watch mode
npm run test -- --watch
```

### Code Style

This project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks

## Deployment

The project is deployed using Vercel. Each push to the main branch triggers a deployment to the staging environment.

### Production Deployment

1. Ensure all tests pass:
   ```bash
   npm run test
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy to production:
   ```bash
   npm run deploy
   ```

### Environment Variables

Required environment variables:
- `NEXT_PUBLIC_API_URL` - Blu AI API endpoint
- `NEXT_PUBLIC_AUTH_URL` - Authentication service endpoint
- `NEXT_PUBLIC_ENVIRONMENT` - Current environment (development/staging/production)

## Contributing

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git commit -m "feat: add your feature"
   ```

3. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request

### Branch Naming Convention

- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Documentation: `docs/description`
- Performance improvements: `perf/description`

### Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)

## License

This project is proprietary and confidential. All rights reserved.
