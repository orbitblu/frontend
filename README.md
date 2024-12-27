# Blu AI Frontend

Frontend monorepo containing both admin and customer interfaces for the Blu AI platform.

## Repository Structure

```
frontend/
├── packages/           # Main packages directory
│   ├── common/        # Shared components, utilities, and styles
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── styles/
│   │   └── utils/
│   ├── admin/        # Admin dashboard application
│   │   ├── src/
│   │   ├── public/
│   │   └── tests/
│   └── customer/     # Customer dashboard application
│       ├── src/
│       ├── public/
│       └── tests/
├── config/          # Shared configuration files
│   ├── webpack/
│   ├── jest/
│   └── typescript/
└── scripts/        # Build and deployment scripts
    ├── build/
    ├── deploy/
    └── test/
```

## Applications

### Admin Dashboard
- URL: https://admin.orbitblu.net
- Features:
  - User management
  - System configuration
  - Analytics and monitoring
  - Content management

### Customer Dashboard
- URL: https://orbitblu.net
- Features:
  - Project management
  - AI interaction
  - Account settings
  - Billing and usage

## Setup

1. Install dependencies:
   ```bash
   # Install root dependencies
   npm install

   # Install package dependencies
   npm run bootstrap
   ```

2. Environment setup:
   ```bash
   # Copy environment files
   cp packages/admin/.env.example packages/admin/.env
   cp packages/customer/.env.example packages/customer/.env
   ```

3. Development:
   ```bash
   # Start admin dashboard
   npm run dev:admin

   # Start customer dashboard
   npm run dev:customer
   ```

## Development

### Branch Strategy
- `main`: Production-ready code
- `develop`: Development branch
- Feature branches: `feature/[name]`
- Bug fixes: `bugfix/[name]`

### Commands
```bash
# Development
npm run dev:admin      # Start admin dashboard
npm run dev:customer   # Start customer dashboard

# Building
npm run build:admin    # Build admin dashboard
npm run build:customer # Build customer dashboard
npm run build:all      # Build all packages

# Testing
npm run test          # Run all tests
npm run test:admin    # Test admin dashboard
npm run test:customer # Test customer dashboard

# Linting
npm run lint         # Lint all code
npm run lint:fix     # Fix linting issues
```

## Deployment

### Production Deployment
```bash
# Deploy admin dashboard
npm run deploy:admin

# Deploy customer dashboard
npm run deploy:customer

# Deploy all
npm run deploy:all
```

### Staging Deployment
```bash
# Deploy to staging
npm run deploy:staging
```

## Integration

This repository is part of the larger Blu AI project:
- Integrates with `blu_ai-api` for backend services
- Uses components from `blu_ai-ai` for AI features
- Coordinated through main `blu_ai` repository

## Contributing

1. Clone the repository
2. Create feature branch
3. Make changes
4. Run tests and linting
5. Submit pull request

## Documentation

- Component documentation in each package's `docs/` directory
- API integration guides in `docs/api/`
- Deployment guides in `docs/deployment/`

## License

Proprietary - All rights reserved
