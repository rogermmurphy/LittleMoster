# Little Monster (LM) - Phase 0: Development Environment Setup
## Project Preparation and Local Environment Configuration

**Version**: 1.0  
**Last Updated**: October 30, 2025  
**Document Type**: Phase 0 - Environment Setup Plan  
**Duration**: 1-2 weeks (before Phase 1 development begins)  
**Status**: Living Document - Update as requirements change

---

## 1. Executive Summary

Phase 0 establishes the complete development environment and project infrastructure required before Phase 1 backend development can begin. This includes workstation setup, tool installation, repository configuration, and verification of all systems. Completing Phase 0 ensures developers have a consistent, fully-functional environment that meets all technical requirements for the Little Monster platform development.

This phase is prerequisite to all development work and must be completed successfully before any coding begins. All installations, configurations, and verifications documented here are mandatory for project participation.

---

## 2. Phase 0 Objectives

### 2.1 Primary Goals
- Install and configure all required development tools
- Set up version control and project repository structure
- Configure local development environment with Docker
- Establish database and backend service connections
- Verify all installations with validation scripts
- Document environment configurations for team consistency

### 2.2 Success Criteria
- All required software installed and verified
- Git repository cloned and configured properly
- Docker containers running successfully
- Supabase project created and accessible
- All team members can run provided test scripts successfully
- Environment documentation complete and accessible

---

## 3. Hardware and System Requirements

### 3.1 Minimum Hardware Specifications
**Development Workstation:**
- **CPU**: Intel i5 / AMD Ryzen 5 (8th gen or newer) or equivalent
- **RAM**: 16GB minimum (32GB recommended for AI model work)
- **Storage**: 50GB free SSD space (100GB+ recommended)
- **GPU**: Optional but recommended for AI model testing (NVIDIA with CUDA support)
- **Network**: Stable internet connection (50+ Mbps recommended)

**Operating System Support:**
- Windows 10/11 (64-bit) - Build 1903 or later
- macOS 10.14 Mojave or later (Intel or Apple Silicon)
- Linux: Ubuntu 18.04+, Fedora 32+, Debian 10+

### 3.2 Recommended Specifications
- **CPU**: Intel i7 / AMD Ryzen 7 or better
- **RAM**: 32GB for smooth development with AI models
- **Storage**: 256GB SSD with 100GB+ free space
- **GPU**: NVIDIA RTX series with 8GB+ VRAM for AI work
- **Display**: 1920x1080 minimum (dual monitors recommended)

---

## 4. Core Software Installation

### 4.1 Version Control System

**Git Installation:**
```bash
# Windows (using Chocolatey)
choco install git

# macOS (using Homebrew)
brew install git

# Linux (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install git

# Verify installation
git --version  # Should show 2.40.0 or later
```

**Git Configuration:**
```bash
# Set global user information
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Configure line endings
git config --global core.autocrlf true  # Windows
git config --global core.autocrlf input  # macOS/Linux

# Set default branch name
git config --global init.defaultBranch main

# Configure pull behavior
git config --global pull.rebase false

# Verify configuration
git config --list
```

**SSH Key Setup (for secure Git operations):**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Start ssh-agent
eval "$(ssh-agent -s)"  # macOS/Linux
# Or use Windows Services for ssh-agent on Windows

# Add key to ssh-agent
ssh-add ~/.ssh/id_ed25519

# Copy public key (add to GitHub/GitLab)
cat ~/.ssh/id_ed25519.pub  # macOS/Linux
# Or use: clip < ~/.ssh/id_ed25519.pub  # Windows

# Test SSH connection
ssh -T git@github.com
```

### 4.2 Node.js and Package Manager

**Node.js Installation:**
```bash
# Windows (using Chocolatey)
choco install nodejs-lts

# macOS (using Homebrew)
brew install node@18

# Linux (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version   # Should show v18.x.x or later
npm --version    # Should show 9.x.x or later
```

**Alternative: Using NVM (Node Version Manager) - Recommended:**
```bash
# Install NVM
# Windows: Download from https://github.com/coreybutler/nvm-windows
# macOS/Linux:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js LTS
nvm install 18
nvm use 18
nvm alias default 18

# Verify
node --version
npm --version
```

**Configure npm:**
```bash
# Set registry (if needed)
npm config set registry https://registry.npmjs.org/

# Set up global package directory (prevents permission issues)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# Add to PATH (add to .bashrc/.zshrc)
export PATH=~/.npm-global/bin:$PATH
```

### 4.3 Docker and Container Management

**Docker Desktop Installation:**
```bash
# Windows
# Download from: https://www.docker.com/products/docker-desktop/
# Install Docker Desktop for Windows
# Enable WSL 2 backend during installation

# macOS
brew install --cask docker

# Linux (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER
# Log out and back in for group changes to take effect

# Verify installation
docker --version         # Should show 24.0.0 or later
docker-compose --version # Should show 2.20.0 or later

# Test Docker
docker run hello-world
```

**Docker Configuration:**
```bash
# Configure Docker resources (adjust based on your system)
# Docker Desktop: Settings > Resources
# - CPUs: 4 minimum (6-8 recommended)
# - Memory: 8GB minimum (16GB recommended)
# - Swap: 2GB
# - Disk: 64GB virtual disk size

# Enable Kubernetes (optional for later phases)
# Docker Desktop: Settings > Kubernetes > Enable Kubernetes
```

### 4.4 Python (for AI Model Integration)

**Python Installation:**
```bash
# Windows (using Chocolatey)
choco install python311

# macOS (using Homebrew)
brew install python@3.11

# Linux (Ubuntu/Debian)
sudo apt-get install python3.11 python3.11-venv python3-pip

# Verify installation
python3 --version  # Should show 3.11.x
pip3 --version
```

**Python Virtual Environment Setup:**
```bash
# Create virtual environment directory
mkdir ~/python-envs
cd ~/python-envs
python3 -m venv lm-ai-env

# Activate virtual environment
source lm-ai-env/bin/activate  # macOS/Linux
# Or: .\lm-ai-env\Scripts\activate  # Windows

# Upgrade pip
pip install --upgrade pip setuptools wheel
```

### 4.5 Database Tools

**PostgreSQL Client Tools:**
```bash
# Windows
choco install postgresql

# macOS
brew install postgresql@15

# Linux
sudo apt-get install postgresql-client-15

# Verify
psql --version  # Should show 15.x
```

**Supabase CLI:**
```bash
# Install Supabase CLI
npm install -g supabase

# Verify installation
supabase --version

# Login to Supabase (requires account)
supabase login
```

**DBeaver (Universal Database Tool - Optional):**
```bash
# Windows/macOS: Download from https://dbeaver.io/
# Linux
sudo snap install dbeaver-ce
```

### 4.6 Code Editor and IDE

**Visual Studio Code (Recommended):**
```bash
# Windows
choco install vscode

# macOS
brew install --cask visual-studio-code

# Linux
sudo snap install code --classic

# Verify
code --version
```

**Essential VS Code Extensions:**
```bash
# Install via command line
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension christian-kohler.path-intellisense
code --install-extension eamodio.gitlens
code --install-extension ms-azuretools.vscode-docker
code --install-extension rangav.vscode-thunder-client
code --install-extension ms-python.python
code --install-extension ms-vscode-remote.remote-containers

# Or install manually via VS Code Extensions panel
```

**VS Code Configuration:**
Create `.vscode/settings.json` in project root:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.exclude": {
    "node_modules": true,
    "dist": true,
    ".env": false
  }
}
```

---

## 5. Project Repository Setup

### 5.1 Repository Initialization

**Option A: Create New Repository**
```bash
# Navigate to project directory
cd ~/projects
mkdir lm-gpa-platform
cd lm-gpa-platform

# Initialize Git repository
git init
git branch -M main

# Create GitHub repository (via GitHub CLI or web interface)
gh repo create lm-gpa-platform --private --source=. --remote=origin

# Or manually add remote
git remote add origin git@github.com:your-username/lm-gpa-platform.git
```

**Option B: Clone Existing Repository**
```bash
# Clone repository
git clone git@github.com:your-org/lm-gpa-platform.git
cd lm-gpa-platform

# Verify remote
git remote -v
```

### 5.2 Project Structure Initialization

**Create base folder structure:**
```bash
# Create main directories
mkdir -p backend/{api,database,ai-services,tests}
mkdir -p shared/{types,utils,api-client}
mkdir -p web-app/{src,public,tests}
mkdir -p mobile-app/{src,ios,android,tests}
mkdir -p desktop-app/{src,resources,tests}
mkdir -p ai-infrastructure/{models,deployment,config}
mkdir -p devops/{ci-cd,infrastructure,monitoring,scripts}
mkdir -p docs/wireframes

# Verify structure
tree -L 2  # Or use 'ls -R' if tree is not installed
```

**Create essential configuration files:**
```bash
# Root .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/

# Environment variables
.env
.env.local
.env.*.local

# Logs
*.log
npm-debug.log*
logs/

# Editor
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# AI Models (large files)
*.bin
*.gguf
ai-infrastructure/models/*.pt
ai-infrastructure/models/*.safetensors

# Database
*.db
*.sqlite

# Docker
.docker/
EOF

# Root README.md
cat > README.md << 'EOF'
# Little Monster (LM) GPA Study Platform

Multi-platform educational application with AI-powered content generation.

## Project Structure
- `backend/` - Supabase backend and API services
- `web-app/` - React web application
- `mobile-app/` - React Native mobile app
- `desktop-app/` - Electron desktop application
- `shared/` - Shared types and utilities
- `ai-infrastructure/` - Self-hosted LLM setup
- `devops/` - Infrastructure and deployment
- `docs/` - Project documentation

## Getting Started
See `docs/phase-0-environment-setup.md` for environment setup instructions.

## Development
```bash
# Install dependencies
npm install

# Start development environment
docker-compose up -d
```

## Documentation
- [Phase 0: Environment Setup](docs/phase-0-environment-setup.md)
- [Phase 1: Implementation Plan](implementation_plan.md)
- [Project Plan](docs/project-plan-wbs.md)
EOF

# Initial commit
git add .
git commit -m "Initial project structure"
git push -u origin main
```

### 5.3 Git Workflow Setup

**Branch Strategy Configuration:**
```bash
# Create development branch
git checkout -b develop
git push -u origin develop

# Set up branch protection (via GitHub/GitLab web interface)
# - Protect 'main' branch: require pull requests, 2 approvals
# - Protect 'develop' branch: require pull requests, 1 approval

# Create feature branch template
git config --local commit.template .gitmessage

# Create commit message template
cat > .gitmessage << 'EOF'
# Type: subject (max 50 characters)
# |<----  Using a Maximum Of 50 Characters  ---->|

# Body: Explain what and why (wrap at 72 characters)
# |<----   Try To Limit Each Line to a Maximum Of 72 Characters   ---->|

# Footer: Issue references, breaking changes
# Example: Closes #123, Fixes #456
EOF
```

---

## 6. Cloud Services Setup

### 6.1 Supabase Project Setup

**Create Supabase Account and Project:**
1. Visit https://supabase.com
2. Sign up for free account
3. Create new project:
   - Project Name: `lm-gpa-platform-dev`
   - Database Password: Generate strong password (save securely)
   - Region: Select closest to your location
   - Plan: Free tier for development

**Save Supabase Credentials:**
```bash
# Create credentials file (DO NOT commit to Git)
cat > backend/.env.local << 'EOF'
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres
EOF

# Verify credentials
supabase projects list
```

### 6.2 GitHub Account and Repository Access

**GitHub CLI Installation:**
```bash
# Windows
choco install gh

# macOS
brew install gh

# Linux
sudo apt install gh

# Authenticate
gh auth login

# Verify
gh auth status
```

**Repository Access Setup:**
```bash
# Add team members (for organization repos)
gh repo add-collaborator your-org/lm-gpa-platform username --permission push

# Set up branch protection rules
gh repo edit your-org/lm-gpa-platform --enable-issues --enable-wiki

# Configure repository settings via web interface:
# - Enable Issues and Projects
# - Set up code owners (create CODEOWNERS file)
# - Configure webhook integrations
```

---

## 7. Development Tools Configuration

### 7.1 Package Managers and Build Tools

**Global npm packages:**
```bash
# Install essential global packages
npm install -g typescript
npm install -g ts-node
npm install -g nodemon
npm install -g eslint
npm install -g prettier
npm install -g supabase
npm install -g @angular/cli  # If needed for admin dashboard

# Verify installations
tsc --version
ts-node --version
nodemon --version
eslint --version
prettier --version
```

### 7.2 Docker Development Environment

**Create docker-compose.yml for local development:**
```yaml
# Save to: docker-compose.yml
version: '3.8'

services:
  # Redis for caching
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes

  # PostgreSQL (backup to Supabase)
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: lm_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  # Adminer (database management UI)
  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - postgres

volumes:
  redis-data:
  postgres-data:
```

**Start development environment:**
```bash
# Start all services
docker-compose up -d

# Verify services are running
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 8. Environment Verification

### 8.1 Verification Scripts

**Create verification script:**
```bash
# Save to: scripts/verify-environment.sh
#!/bin/bash

echo "=== Little Monster Environment Verification ==="
echo ""

# Check Node.js
echo "Checking Node.js..."
node --version || echo "❌ Node.js not found"
npm --version || echo "❌ npm not found"

# Check Git
echo "Checking Git..."
git --version || echo "❌ Git not found"

# Check Docker
echo "Checking Docker..."
docker --version || echo "❌ Docker not found"
docker-compose --version || echo "❌ Docker Compose not found"

# Check Python
echo "Checking Python..."
python3 --version || echo "❌ Python not found"
pip3 --version || echo "❌ pip not found"

# Check PostgreSQL client
echo "Checking PostgreSQL..."
psql --version || echo "❌ PostgreSQL client not found"

# Check Supabase CLI
echo "Checking Supabase CLI..."
supabase --version || echo "❌ Supabase CLI not found"

# Check VS Code
echo "Checking VS Code..."
code --version || echo "❌ VS Code not found"

# Check global npm packages
echo "Checking global npm packages..."
typescript -v || echo "❌ TypeScript not found"
eslint -v || echo "❌ ESLint not found"
prettier -v || echo "❌ Prettier not found"

# Test Docker services
echo "Testing Docker services..."
docker-compose ps | grep "Up" && echo "✓ Docker services running" || echo "❌ Docker services not running"

echo ""
echo "=== Verification Complete ==="
```

**Run verification:**
```bash
# Make script executable
chmod +x scripts/verify-environment.sh

# Run verification
./scripts/verify-environment.sh
```

### 8.2 Connection Tests

**Test Supabase connection:**
```javascript
// Save to: scripts/test-supabase.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('_test').select('*').limit(1);
    if (error && error.code === '42P01') {
      console.log('✓ Supabase connection successful (no tables yet, expected)');
    } else if (error) {
      console.error('❌ Supabase error:', error.message);
    } else {
      console.log('✓ Supabase connection successful');
    }
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

testConnection();
```

**Run tests:**
```bash
# Install required package
npm install @supabase/supabase-js dotenv

# Run test
node scripts/test-supabase.js
```

---

## 9. Team Collaboration Setup

### 9.1 Communication Channels

**Set up project communication:**
- Create dedicated Slack/Discord channel for development
- Set up daily standup schedule
- Configure GitHub notifications
- Establish code review process
- Create shared documentation workspace (Notion/Confluence)

### 9.2 Documentation Access

**Ensure all team members have access to:**
- Project documentation repository
- Supabase dashboard
- Cloud services accounts (if needed)
- Design files and wireframes
- Project management board (Jira/GitHub Projects)

### 9.3 Knowledge Sharing

**Create onboarding documentation:**
```markdown
# Save to: docs/onboarding-guide.md

# Developer Onboarding Guide

## Day 1: Environment Setup
1. Complete Phase 0 environment setup
2. Clone repository and verify access
3. Run verification scripts
4. Join team communication channels

## Week 1: Project Familiarization
1. Read all project documentation
2. Review technical specifications
3. Understand project architecture
4. Set up development workflow

## Week 2: First Contributions
1. Pick starter tasks from backlog
2. Create feature branch
3. Make first commit
4. Submit first pull request

## Resources
- [Architecture Overview](docs/technical-specifications.md)
- [Development Workflow](docs/development-workflow.md)
- [Coding Standards](.clinerules/lm-gpa-project-standards.md)
```

---

## 10. Phase 0 Checklist and Completion

### 10.1 Environment Setup Checklist

**System Requirements:**
- [ ] Hardware meets minimum specifications
- [ ] Operating system updated to required version
- [ ] Stable internet connection available
- [ ] Sufficient disk space available (50GB+ free)

**Core Software:**
- [ ] Git installed and configured
- [ ] SSH keys generated and added to GitHub
- [ ] Node.js 18+ installed
- [ ] npm configured properly
- [ ] Docker Desktop installed and running
- [ ] Python 3.11+ installed
- [ ] PostgreSQL client tools installed
- [ ] Supabase CLI installed

**Development Tools:**
- [ ] VS Code installed with required extensions
- [ ] Git configured with user information
- [ ] Docker configured with adequate resources
- [ ] Python virtual environment created

**Project Setup:**
- [ ] Repository cloned or created
- [ ] Project structure initialized
- [ ] .gitignore configured
- [ ] README.md created
- [ ] Initial commit pushed to main branch

**Cloud Services:**
- [ ] Supabase account created
- [ ] Development project created in Supabase
- [ ] Credentials saved securely in .env.local
- [ ] GitHub repository created (if new project)
- [ ] Team members added with appropriate permissions

**Development Environment:**
- [ ] docker-compose.yml created
- [ ] Docker services running successfully
- [ ] Redis accessible on localhost:6379
- [ ] PostgreSQL accessible on localhost:5432
- [ ] All verification scripts pass successfully

**Team Setup:**
- [ ] Communication channels established
- [ ] Documentation access verified
- [ ] Code review process defined
- [ ] Development workflow documented

### 10.2 Verification and Sign-off

**Final Verification Steps:**
1. Run environment verification script - all checks pass
2. Test Supabase connection successfully
3. Docker services running without errors
4. Can create and commit to Git repository
5. VS Code opens project without errors
6. Can install npm packages successfully

**Phase 0 Sign-off:**
Once all checklist items are complete and verification passes:
```bash
# Create Phase 0 completion marker
echo "Phase 0 completed on $(date)" > .phase0-complete
git add .phase0-complete
git commit -m "Phase 0: Environment setup complete"
git push
```

**Proceed to Phase 1:**
After Phase 0 completion, developers are ready to:
- Begin Phase 1 backend implementation
- Follow the implementation plan in `implementation_plan.md`
- Start with Week 1 tasks from the implementation timeline

---

## 11. Troubleshooting Common Issues

### 11.1 Installation Issues

**Node.js/npm permission errors:**
```bash
# Fix npm permissions (avoid using sudo)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**Docker permission denied:**
```bash
# Linux: Add user to docker group
sudo usermod -aG docker $USER
# Log out and back in

# Windows: Run Docker Desktop as administrator
```

**Git SSH connection issues:**
```bash
# Test SSH connection
ssh -T git@github.com

# If fails, check SSH key is added to ssh-agent
ssh-add -l

# Add key if not listed
ssh-add ~/.ssh/id_ed25519
```

### 11.2 Environment Issues

**Port conflicts:**
```bash
# Find process using port
# Windows
netstat -ano | findstr :5432
# macOS/Linux
lsof -i :5432

# Kill process or change Docker port mapping
```

**Docker service won't start:**
```bash
# Reset Docker
docker system prune -a
docker-compose down -v
docker-compose up -d
```

**Supabase connection fails:**
```bash
# Verify credentials
cat backend/.env.local

# Test connection with psql
psql $DATABASE_URL -c "SELECT version();"
```

---

## 12. Next Steps

After completing Phase 0:

1. **Review Implementation Plan**: Read `implementation_plan.md` thoroughly
2. **Set Up Project Board**: Create tasks for Phase 1 Week 1
3. **Team Meeting**: Confirm all team members ready to start
4. **Begin Phase 1**: Start with Week 1 - Development Environment setup from implementation plan

**Phase 1 Week 1 Preview:**
- Initialize backend project structure
- Configure TypeScript and build tools
- Set up Supabase project schema
- Create environment variable templates
- Initialize shared types package

---

**Document Maintenance:**
This is a living document. Update as new tools or requirements are identified:
- Add new tools as they become necessary
- Update version requirements as technologies evolve
- Document solutions to new problems encountered
- Share improvements with the team

**Last Updated**: October 30, 2025  
**Next Review**: Before Phase 1 starts or as needed
