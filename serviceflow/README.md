# ServiceFlow 🚀

A comprehensive Service Management platform inspired by ServiceNow, built with modern web technologies.

## 🌟 Features

### Core Modules
- **User Management** - Complete user lifecycle with roles and groups
- **Role-Based Access Control (RBAC)** - Granular permissions system
- **Ticketing System** - Full ITSM ticket management with state transitions
- **Incident Management** - Incident handling with classification
- **Audit Logging** - Complete audit trail for all system changes
- **Admin Impersonation** - Secure user impersonation for troubleshooting

### Architecture Highlights
- **Scalable Design** - Built for microservices expansion
- **Modern Tech Stack** - Next.js 15, TypeScript, Prisma, PostgreSQL
- **Security First** - JWT authentication, RBAC, audit logging
- **Professional UI** - Navy & honey color scheme, responsive design
- **State Management** - Enforced ticket state transitions

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT with HTTP-only cookies
- **UI Components**: Radix UI, Lucide Icons
- **Development**: Docker Compose, ESLint, Prettier

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose

### 1. Clone and Install
```bash
git clone <repository-url>
cd serviceflow
npm install
```

### 2. Environment Setup
Copy the `.env` file and update values for production:
```bash
cp .env .env.local
```

Key environment variables:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/serviceflow?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### 3. Start Development Environment
```bash
# Start PostgreSQL and Redis with Docker
npm run docker:up

# Set up database and seed data
npm run setup

# Start development server
npm run dev
```

Or run everything at once:
```bash
npm run dev:full
```

### 4. Access the Application
- **Application**: http://localhost:3000
- **Database Studio**: http://localhost:5001 (`npm run db:studio`)

## 🔐 Test Credentials

### Admin User
- **Email**: testuser1@serviceflow.com
- **Password**: ServiceFlow@123
- **Role**: Admin (full access + impersonation)

### Service Agent
- **Email**: agent@serviceflow.com
- **Password**: ServiceFlow@123
- **Role**: Agent (ticket management)

### End User
- **Email**: user@serviceflow.com
- **Password**: ServiceFlow@123
- **Role**: End User (basic access)

## 📱 Key Features Demo

### 1. Authentication & Security
- JWT-based authentication with HTTP-only cookies
- Role-based access control with granular permissions
- Secure password hashing with bcrypt
- Admin user impersonation with audit trail

### 2. Ticket Management
- Complete ticket lifecycle (New → In Progress → Resolved → Closed)
- State transition validation
- Assignment management
- Work notes and history
- Priority levels (Low, Medium, High, Critical)

### 3. User Management
- User CRUD operations
- Role and group assignment
- Active/inactive status management
- Comprehensive user profiles

### 4. Audit & Compliance
- Complete audit logging for all operations
- User activity tracking
- State change history
- Impersonation audit trail

### 5. Modern UI/UX
- Responsive design with mobile support
- Professional ServiceNow-inspired interface
- Navy & honey color scheme
- Intuitive navigation with collapsible sidebar

## 🏗️ Architecture

### Database Schema
```
Users → Roles (permissions)
Users → Groups (organization)
Tickets → Users (assigned/created)
Incidents → Users (assigned/created)
AuditLogs → Users (tracking)
```

### API Structure
```
/api/auth/*          - Authentication endpoints
/api/users/*         - User management
/api/roles/*         - Role management
/api/groups/*        - Group management
/api/tickets/*       - Ticket operations
/api/incidents/*     - Incident management
/api/audit-logs/*    - Audit trail
```

### Frontend Structure
```
/app/(auth)/         - Authentication pages
/app/(dashboard)/    - Main application
/components/ui/      - Reusable UI components
/components/layout/  - Layout components
/lib/               - Utilities and configurations
```

## 🚦 State Management

### Ticket State Transitions
```
NEW → IN_PROGRESS
IN_PROGRESS → RESOLVED
RESOLVED → CLOSED
Any State → REOPENED
```

### Permission System
```json
{
  "admin": true,                    // Full access
  "user_management": true,          // User CRUD
  "role_management": true,          // Role management
  "group_management": true,         // Group management
  "ticket_management": true,        // Ticket operations
  "incident_management": true,      // Incident handling
  "user_impersonation": true,       // Admin impersonation
  "audit_logs": true,              // Audit access
  "system_settings": true          // System configuration
}
```

## 📊 Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Create and run migrations
npm run db:migrate

# Seed database with test data
npm run db:seed

# Reset and reseed database
npm run db:reset

# Open Prisma Studio
npm run db:studio
```

## 🐳 Docker Commands

```bash
# Start services
npm run docker:up

# Stop services
npm run docker:down

# View logs
docker-compose logs -f
```

## 🔮 Future Roadmap

### Phase 2: Extended ITSM
- [ ] Service Catalog
- [ ] Change Management
- [ ] Problem Management
- [ ] Knowledge Base

### Phase 3: Advanced Features
- [ ] Workflow Engine
- [ ] SLA Management
- [ ] Reporting & Analytics
- [ ] Email Integration

### Phase 4: Microservices
- [ ] HRSD (Human Resources Service Delivery)
- [ ] ITAM (IT Asset Management)
- [ ] ITOM (IT Operations Management)
- [ ] GRC (Governance, Risk & Compliance)
- [ ] DevOps Integration
- [ ] Custom Widget Framework

### Phase 5: Enterprise Features
- [ ] Multi-tenancy
- [ ] API Gateway
- [ ] Message Queue (RabbitMQ/Kafka)
- [ ] Advanced Caching (Redis)
- [ ] SSO Integration (SAML/OIDC)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by ServiceNow's comprehensive service management platform
- Built with modern web technologies and best practices
- Designed for scalability and maintainability

---

**ServiceFlow** - Enterprise Service Management, Simplified 🌟
