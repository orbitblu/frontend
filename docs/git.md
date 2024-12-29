# Git Workflow Documentation

*Last Updated: 2024-01-03*

## Repository Information

- **Repository**: `blu_ai-frontend` (https://github.com/orbitblu/frontend.git)
- **Type**: Monorepo
- **Structure**: NPM Workspaces

## Branch Structure

```
master (stable)
├── develop (main development branch)
│   ├── feature/* (new features)
│   ├── bugfix/* (bug fixes)
│   └── release/* (release preparation)
└── hotfix/* (urgent production fixes)
```

## Branch Types

1. **master**
   - Production-ready code
   - Always stable
   - Protected branch
   - Requires pull request and review

2. **develop**
   - Main development branch
   - Integration branch for features
   - Semi-stable state
   - Base for feature branches

3. **feature branches**
   - Named: `feature/description`
   - Created from: `develop`
   - Merged back into: `develop`
   - Example: `feature/auth-system`

4. **bugfix branches**
   - Named: `bugfix/description`
   - Created from: `develop`
   - Merged back into: `develop`
   - Example: `bugfix/login-validation`

5. **release branches**
   - Named: `release/version`
   - Created from: `develop`
   - Merged into: `master` and `develop`
   - Example: `release/1.0.0`

6. **hotfix branches**
   - Named: `hotfix/description`
   - Created from: `master`
   - Merged into: `master` and `develop`
   - Example: `hotfix/critical-auth-fix`

## Workflow

### Feature Development
```bash
# Start a new feature
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Work on your feature...
git add .
git commit -m "feat: your feature description"

# Push to remote
git push -u origin feature/your-feature-name

# Create pull request to develop branch
```

### Bug Fixes
```bash
# Start a bug fix
git checkout develop
git pull origin develop
git checkout -b bugfix/bug-description

# Fix the bug...
git add .
git commit -m "fix: bug description"

# Push to remote
git push -u origin bugfix/bug-description

# Create pull request to develop branch
```

### Releases
```bash
# Create release branch
git checkout develop
git pull origin develop
git checkout -b release/1.0.0

# Make release preparations...
git add .
git commit -m "chore: prepare 1.0.0 release"

# Push to remote
git push -u origin release/1.0.0

# Create pull request to master
```

### Hotfixes
```bash
# Create hotfix branch
git checkout master
git pull origin master
git checkout -b hotfix/critical-fix

# Fix the issue...
git add .
git commit -m "fix: critical issue description"

# Push to remote
git push -u origin hotfix/critical-fix

# Create pull request to master AND develop
```

## Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:
```bash
git commit -m "feat: add user authentication system"
git commit -m "fix: resolve token validation issue"
git commit -m "docs: update README with new features"
```

## Pull Request Process

1. Create PR from your branch to appropriate target
2. Fill out PR template
3. Request reviews from team members
4. Address review comments
5. Merge once approved
6. Delete branch after merge

## Protection Rules

1. **master branch**
   - No direct pushes
   - Requires pull request
   - Requires review approval
   - Must be up to date before merging

2. **develop branch**
   - No direct pushes
   - Requires pull request
   - Requires review approval

## Best Practices

1. **Keep branches updated**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout your-branch
   git merge develop
   ```

2. **Regular commits**
   - Commit early and often
   - Use meaningful commit messages
   - Follow commit convention

3. **Code Review**
   - Review PRs promptly
   - Provide constructive feedback
   - Test changes locally when needed

4. **Branch Cleanup**
   - Delete merged branches
   - Keep remote clean
   - Regular cleanup of stale branches 