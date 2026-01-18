# Rename Git Branch: master → main

## Why Rename?

Following modern Git best practices and community standards, we're moving from `master` to `main` as the default branch name[^1]. This aligns with the Git Commit Strategy and CodeRabbit recommendations.

## Quick Commands

### If you have admin access to the GitHub repository:

```bash
# 1. Rename local branch
git branch -m master main

# 2. Push new main branch and set upstream
git push -u origin main

# 3. Rename the default branch on GitHub
# Go to: https://github.com/pdqrobinson/NeighborGigs/settings/branches
# Click "Rename default branch" → enter "main"

# 4. Switch HEAD to new main branch
git symbolic-ref refs/remotes/origin/HEAD refs/remotes/origin/main

# 5. Delete old master branch locally (safe)
git branch -d master

# 6. Delete old master branch on GitHub (safe)
git push origin --delete master
```

## Step-by-Step Instructions

### Step 1: Verify Current State
```bash
git branch
# You should see: * feature/setup-supabase (or whatever branch you're on)

git branch -r
# You should see: origin/master
```

### Step 2: Create New Main Branch from Master
```bash
# Make sure you're on a clean working state
git status

# Fetch all branches
git fetch --all

# Create a local main branch tracking origin/master
git checkout -b main origin/master

# Push new main branch to remote
git push -u origin main
```

### Step 3: Update GitHub Repository Settings

1. Go to: https://github.com/pdqrobinson/NeighborGigs/settings/branches
2. Under "Default branch", click the settings icon ⚙️
3. Click "Rename default branch"
4. Enter `main` as the new name
5. Confirm the rename

### Step 4: Update Local Repository References

```bash
# Update HEAD to point to main
git symbolic-ref refs/remotes/origin/HEAD refs/remotes/origin/main

# Verify it worked
git symbolic-ref refs/remotes/origin/HEAD
# Should output: refs/remotes/origin/main
```

### Step 5: Clean Up Old Master Branch

```bash
# Delete local master branch (if you have one)
git branch -d master

# Delete remote master branch
git push origin --delete master

# Verify cleanup
git branch -r
# Should NOT show origin/master anymore
```

### Step 6: Update Any Automated Workflows

Check these files for hardcoded references to `master`:

- **GitHub Actions** (`.github/workflows/*.yml`)
- **CI/CD pipelines**
- **Deployment scripts**

Replace any `master` references with `main`.

## Verification Checklist

- [ ] `git branch` shows `main` (not `master`)
- [ ] `git branch -r` shows `origin/main` (not `origin/master`)
- [ ] GitHub repository settings show `main` as default
- [ ] `git symbolic-ref refs/remotes/origin/HEAD` returns `refs/remotes/origin/main`
- [ ] No `origin/master` remains in remote branches
- [ ] All automated workflows updated to use `main`

## Troubleshooting

### "Cannot delete master branch"
This happens if `master` is still the default branch. Complete Step 3 (update GitHub settings) first.

### "Upstream branch not set"
```bash
git push -u origin main
```

### "Symbolic ref not found"
```bash
git fetch --all
git symbolic-ref refs/remotes/origin/HEAD refs/remotes/origin/main
```

### Local collaborators need to update
After you complete this, anyone working locally on the repository needs to run:

```bash
git fetch origin
git checkout main
git branch --set-upstream-to=origin/main main
```

## References

[^1]: https://github.com/github/renaming#readme — GitHub's official guide on renaming the default branch
[^2]: Git Commit Strategy: `file 'GIT_COMMIT_STRATEGY.md'`

---

**Note**: All documentation (`SETUP_CHECKLIST.md`, `setup.sh`) has already been updated to use `main`. You only need to rename the actual git branch.
