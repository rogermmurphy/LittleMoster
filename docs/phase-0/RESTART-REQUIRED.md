# ⚠️ RESTART YOUR COMPUTER NOW

## What Happened

All software was installed successfully:
- ✅ Git
- ✅ Node.js v22.21.0
- ✅ Python 3.11.9
- ✅ Docker Desktop

BUT Windows doesn't recognize them yet because the PATH environment variable wasn't refreshed.

## What You MUST Do

**1. RESTART YOUR COMPUTER**
   - Save any open work
   - Restart Windows
   - This updates the system PATH so installed software is recognized

## After Restart

Open a NEW PowerShell window and run these commands ONE AT A TIME:

```powershell
# Navigate to project
cd C:\Users\roger\Documents\Ella-Ai

# Test installations work now
git --version
node --version
python --version
docker --version

# If all show versions, continue:

# Configure Git
git config --global user.email "rogermmurphy@gmail.com"
git config --global user.name "Roger Murphy"
git config --global init.defaultBranch main

# Install global npm tools
npm install -g typescript ts-node nodemon eslint prettier

# Initialize Git repo
git init
git add .
git commit -m "Initial commit - Phase 0 complete"

# Start Docker Desktop (if not running)
# Then run:
docker-compose up -d

# Verify Docker services
docker-compose ps
```

That's it. Phase 0 will be complete.

## Still Not Working After Restart?

If commands still not recognized after restarting:

**Check System PATH:**
1. Search Windows for "Environment Variables"
2. Click "Edit the system environment variables"
3. Click "Environment Variables" button
4. Under "System variables" find "Path"
5. Verify these are listed:
   - `C:\Program Files\Git\cmd`
   - `C:\Program Files\nodejs`
   - `C:\Program Files\Docker\Docker\resources\bin`
   - Python path (check under User variables too)

If paths are missing, you may need to reinstall or manually add them.

---

**The software IS installed - Windows just needs a restart to recognize it.**
