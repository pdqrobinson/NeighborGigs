# Contributing to NeighborGigs

## Development Workflow

We follow a **branch → PR → review → merge** workflow to maintain code quality and production stability.

## Git Workflow

### 1. Create a Feature Branch
```bash
# Always work on a feature branch, never directly on main
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `chore/` - Maintenance tasks

### 2. Make Changes
- Write clean, self-documented code
- Add comments for complex logic
- Test your changes thoroughly

### 3. Commit Your Changes
```bash
git add .
git commit -m "type: description"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting/style
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance

Examples:
- `feat: Add phone authentication flow`
- `fix: Resolve task state transition bug`
- `docs: Update setup instructions`

### 4. Push to Remote
```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request
- Go to GitHub and create a PR from your branch to `main`
- Use the PR template
- Describe your changes clearly

### 6. Review & Fix
- Address CodeRabbit feedback
- Respond to reviewer comments
- Push fixes to the same branch
- Keep PRs focused and small

### 7. Merge
Once approved:
- Squash and merge
- Delete your feature branch

## Code Style

### TypeScript
- Use strict typing
- Avoid `any` types
- Define interfaces for data structures

### React/React Native
- Use functional components with hooks
- Keep components small and focused
- Use meaningful prop names

### File Organization
```
mobile-app/
├── src/
│   ├── components/     # Reusable components
│   ├── screens/        # Screen components
│   ├── lib/           # Utilities, config
│   └── hooks/         # Custom hooks
```

## Testing

### Before Submitting PR
- [ ] Run local tests
- [ ] Test on multiple devices
- [ ] Test edge cases
- [ ] Check console for errors

### Manual Testing Checklist
- [ ] Authentication works
- [ ] Broadcasts create successfully
- [ ] Tasks create and match
- [ ] Payments flow works
- [ ] Push notifications received
- [ ] UI renders correctly

## Code Review

### What We Look For
- **Correctness**: Does it work as intended?
- **Safety**: Are there potential bugs or edge cases?
- **Performance**: Any performance concerns?
- **Readability**: Is the code clear and maintainable?
- **Tests**: Are tests adequate?

### Responding to Feedback
- Address all reviewer comments
- Explain if you disagree (with reasoning)
- Be respectful and collaborative
- Keep iterations on the same PR

## Getting Help

- **Documentation**: Check `docs/` folder
- **Issues**: Check existing GitHub issues
- **Questions**: Create a discussion or issue

## Project Structure

```
NeighborGigs/
├── mobile-app/          # React Native (Expo) app
├── neighborgigs-web/    # Web app (Bun + Hono)
├── web-dashboard/       # Admin dashboard (Next.js)
├── backend/            # Supabase configuration
└── docs/              # Documentation
```

## Environment Variables

Never commit `.env.local` or similar files. Use `.env.example` for template.

```bash
# Copy example
cp .env.example .env.local

# Add your credentials (never commit)
```

## Questions?

If you're unsure about something:
- Ask in a GitHub Discussion
- Create a draft PR to get early feedback
- Check existing PRs for patterns
