# Little Monster (LM) GPA Study Platform

Multi-platform educational application with AI-powered content generation, self-hosted LLM integration, and comprehensive study tools.

## 🎯 Project Status

**Phase 0**: Environment Setup - IN PROGRESS
- ✅ Git installed
- ✅ Node.js v22.21.0 installed  
- ✅ Python 3.11.9 installed
- ✅ Docker Desktop installed
- ⏳ Configuration in progress

## 📁 Project Structure

```
lm-gpa-platform/
├── docs/                          # All project documentation
│   ├── phase-0/                  # Phase 0 environment setup
│   ├── specifications/           # Functional and technical specs
│   ├── business-processes.md    # Business workflow documentation
│   └── project-plan-wbs.md      # Work breakdown structure
├── backend/                      # Supabase backend and API services
│   ├── api/                     # RESTful API endpoints
│   ├── database/                # Database schemas and migrations
│   ├── ai-services/            # LLM and content generation
│   └── tests/                   # Backend tests
├── shared/                      # Shared types and utilities
│   ├── types/                   # TypeScript type definitions
│   ├── utils/                   # Shared utility functions
│   └── api-client/             # Shared API client
├── web-app/                    # React web application
├── mobile-app/                 # React Native mobile app
├── desktop-app/                # Electron desktop application
├── ai-infrastructure/          # Self-hosted LLM setup
└── devops/                     # Infrastructure and deployment

```

## 🚀 Getting Started

### Prerequisites

All required software has been installed:
- Git 2.47.1+
- Node.js 22.21.0 (LTS)
- Python 3.11.9
- Docker Desktop 4.49.0

### Next Steps

1. **Restart PowerShell** to refresh environment variables
2. **Verify installations**:
   ```powershell
   git --version
   node --version
   python --version
   docker --version
   ```
3. **Configure Git**:
   ```powershell
   git config --global user.email "rogermmurphy@gmail.com"
   git config --global user.name "Roger Murphy"
   git config --global init.defaultBranch main
   ```
4. **Install global npm packages**:
   ```powershell
   npm install -g typescript ts-node nodemon eslint prettier supabase
   ```
5. **Initialize Git repository**:
   ```powershell
   git init
   git add .
   git commit -m "Initial project setup with Phase 0 documentation"
   ```

## 📚 Documentation

- **[Phase 0 Setup Guide](docs/phase-0/phase-0-environment-setup.md)** - Complete environment setup
- **[Implementation Plan](implementation_plan.md)** - Phase 1-6 development plan
- **[Project Plan](docs/project-plan-wbs.md)** - 18-month project timeline
- **[Specifications](docs/specifications/)** - Functional and technical specs
- **[Quick Setup](SETUP-GUIDE.md)** - Fast installation guide

## 🛠️ Technology Stack

### Frontend
- React 18+ with TypeScript
- TailwindCSS for styling
- Vite for build tooling
- React Query for data fetching

### Backend
- Supabase (PostgreSQL)
- Node.js + Express + TypeScript
- Redis for caching
- Self-hosted LLM (Llama 2 / Mistral)

### Mobile
- React Native
- Expo (optional)

### Desktop
- Electron
- Native OS integration

### DevOps
- Docker + Docker Compose
- GitHub Actions CI/CD
- Prometheus + Grafana monitoring

## 🎓 Development Phases

- **Phase 0** (1-2 weeks): Environment Setup ← **YOU ARE HERE**
- **Phase 1** (Months 1-3): Backend Infrastructure & AI Integration
- **Phase 2** (Months 4-6): Web Application Development
- **Phase 3** (Months 7-9): Mobile Application Development
- **Phase 4** (Months 10-12): Desktop Application Development  
- **Phase 5** (Months 13-15): Integration & Testing
- **Phase 6** (Months 16-18): Launch Preparation

## 🔐 Security

- All sensitive credentials stored in `.env` files (not committed)
- Row Level Security (RLS) enabled on database
- JWT token authentication
- Content moderation on all user inputs
- HTTPS enforcement

## 📝 License

Private project - All rights reserved

## 👥 Contributors

- Roger Murphy (@rogermmurphy@gmail.com)

---

**Last Updated**: October 30, 2025  
**Current Phase**: Phase 0 - Environment Setup
