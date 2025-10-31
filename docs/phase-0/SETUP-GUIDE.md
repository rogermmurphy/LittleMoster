# Little Monster - Quick Setup Guide for Windows
**Current System**: Windows (PowerShell detected)

## ⚠️ Required Software Not Detected

Your system needs the following software installed before you can begin development:

### Missing Software:
- ❌ **Node.js** - Required for backend development
- ❌ **Git** - Required for version control
- ❌ **Docker Desktop** - Required for containerized services
- ❌ **Python** - Required for AI model integration

---

## 🚀 Quick Installation Steps (Windows)

### Option 1: Install Using Chocolatey (Recommended - Fastest)

**Step 1: Install Chocolatey Package Manager**
1. Open PowerShell as **Administrator** (right-click Start → Windows PowerShell (Admin))
2. Run this command:
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```
3. Close and reopen PowerShell as Administrator

**Step 2: Install All Required Software**
```powershell
# Install Git
choco install git -y

# Install Node.js LTS
choco install nodejs-lts -y

# Install Python 3.11
choco install python311 -y

# Install Docker Desktop
choco install docker-desktop -y

# Refresh environment variables
refreshenv
```

**Step 3: Verify Installations**
Close PowerShell, open a new regular PowerShell window, and run:
```powershell
git --version
node --version
python --version
docker --version
```

---

### Option 2: Manual Installation (If you prefer)

**1. Git for Windows**
- Download: https://git-scm.com/download/win
- Run installer with default settings
- **Important**: Select "Git from the command line and also from 3rd-party software"

**2. Node.js (LTS Version)**
- Download: https://nodejs.org/en/download/
- Get version 18 LTS or newer
- Run installer with default settings
- Verify: Open new PowerShell and run `node --version`

**3. Python 3.11**
- Download: https://www.python.org/downloads/
- Get Python 3.11.x
- **Important**: Check "Add Python to PATH" during installation
- Run installer

**4. Docker Desktop for Windows**
- Download: https://www.docker.com/products/docker-desktop/
- System Requirements: Windows 10/11 Pro, Enterprise, or Education
- **Important**: Enable WSL 2 backend during installation
- Restart computer after installation

---

## 📋 After Installation Checklist

Once all software is installed, run these commands in PowerShell:

```powershell
# Verify all installations
git --version          # Should show 2.40.0 or later
node --version         # Should show v18.x.x or later
npm --version          # Should show 9.x.x or later
python --version       # Should show 3.11.x
docker --version       # Should show 24.0.0 or later
docker-compose --version  # Should show 2.20.0 or later

# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main

# Install global npm packages
npm install -g typescript ts-node nodemon eslint prettier supabase
```

---

## 🎯 Next Steps After Software Installation

Once all required software is installed and verified:

1. **Review Full Phase 0 Documentation**
   - Open: `docs/phase-0/phase-0-environment-setup.md`
   - This has complete setup instructions including VS Code configuration

2. **Create Project Structure**
   - Initialize folders for backend, web-app, mobile-app, etc.
   - Set up Git repository

3. **Configure Development Environment**
   - Set up Docker containers
   - Configure Supabase project
   - Install VS Code extensions

4. **Run Verification Scripts**
   - Ensure all systems are properly configured

---

## 💡 Helpful Resources

- **Phase 0 Full Documentation**: `docs/phase-0/phase-0-environment-setup.md`
- **Implementation Plan**: `implementation_plan.md`
- **Project Standards**: `.clinerules/lm-gpa-project-standards.md`

---

## 🆘 Troubleshooting

**If commands not recognized after installation:**
- Close and reopen PowerShell/Terminal
- Restart your computer
- Check Windows Environment Variables (System Properties → Advanced → Environment Variables)

**Docker not starting:**
- Ensure Hyper-V is enabled (Windows Features)
- Ensure WSL 2 is installed: `wsl --install`
- Restart Docker Desktop

**Permission errors with npm:**
- Run PowerShell as Administrator for global npm installs
- Or configure npm to use user directory (see Phase 0 docs)

---

## ⏱️ Estimated Time
- **Chocolatey Method**: 15-30 minutes
- **Manual Installation**: 30-60 minutes
- **Full Phase 0 Setup**: 2-4 hours (includes project structure, configuration, testing)

---

**Ready to continue?** Once you've installed all required software, let me know and I'll help you with the next steps of environment setup!
