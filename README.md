# DriveSchool Pro v3.0

> Advanced driving school management platform with comprehensive admin dashboard, instructor portal, and MySQL database integration.

![Next.js](https://img.shields.io/badge/Next.js-15.4.0-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.7-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🚀 What's New in v3.0

- **🔄 Database Migration**: Complete migration from PostgreSQL to MySQL 8.0
- **👨‍💼 Admin Dashboard**: Comprehensive admin management system
- **👨‍🏫 Instructor Portal**: Dedicated instructor dashboard with student management
- **🔐 Enhanced Authentication**: Role-based access control (Admin, Instructor, Student)
- **🌙 Dark Mode**: Improved dark mode support with proper styling
- **📱 PWA Ready**: Progressive Web App capabilities
- **🎨 Modern UI**: Enhanced interface with Tailwind CSS v4 and Radix UI components

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based session management
- Role-based access control (Admin, Instructor, Student)
- Secure route protection
- Multi-role dashboard routing

### 👨‍💼 Admin Dashboard
- **User Management**: Create, view, edit, and manage all users
- **System Analytics**: Real-time statistics and insights
- **Content Management**: Manage courses, lessons, and bookings
- **Activity Monitoring**: Track user activities and system logs
- **Role Management**: Assign and modify user roles

### 👨‍🏫 Instructor Portal
- **Student Management**: View and manage assigned students
- **Lesson Planning**: Schedule and manage driving lessons
- **Booking Management**: Accept/reject lesson booking requests
- **Progress Tracking**: Monitor student progress and performance
- **Schedule Overview**: Calendar view of lessons and appointments

### 🎓 Student Features
- **Lesson Booking**: Request lessons with preferred instructors
- **Progress Tracking**: View learning progress and achievements
- **Schedule Management**: View upcoming lessons and appointments
- **Profile Management**: Update personal information and preferences

### 🏢 Business Management
- **Course Management**: Create and manage different course types
- **Instructor Assignment**: Assign students to specific instructors
- **Booking System**: Comprehensive booking and scheduling system
- **Reviews & Ratings**: Collect and manage customer feedback
- **WhatsApp Integration**: CRM integration with WhatsApp (+447756183484)

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.4.0** - React framework with App Router
- **React 19.1.0** - Latest React with Server Components
- **TypeScript 5.8.3** - Type-safe development
- **Tailwind CSS 4.1.7** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Drizzle ORM** - Type-safe database toolkit
- **MySQL 8.0** - Relational database
- **bcryptjs** - Password hashing
- **Jose** - JWT token management

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting (optional)
- **Drizzle Kit** - Database migrations and management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18.0+** (LTS recommended)
- **npm 9.0+** or **yarn 3.0+**
- **MySQL 8.0+** database server

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/driveschool-pro-ver3.git
cd driveschool-pro-ver3
```

2. **Install dependencies**
```bash
npm install --legacy-peer-deps
```
*Note: Use `--legacy-peer-deps` due to Next.js 15 canary compatibility*

3. **Environment setup**
```bash
cp .env.example .env.local
```

## 🗄️ Database Setup

### MySQL Configuration

1. **Create database**
```sql
CREATE DATABASE driveschool_pro;
CREATE USER 'driveschool_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON driveschool_pro.* TO 'driveschool_user'@'localhost';
FLUSH PRIVILEGES;
```

2. **Update environment variables**
```bash
# .env.local
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=driveschool_user
MYSQL_PASSWORD=your_secure_password
MYSQL_DATABASE=driveschool_pro
```

3. **Run database migrations**
```bash
npm run db:generate
npm run db:migrate
```

4. **Seed database (optional)**
```bash
npm run db:seed
```

### Database Schema Overview

The application uses 9 main tables:

- **users** - Base user information and authentication
- **instructors** - Instructor-specific details and qualifications
- **students** - Student profiles and enrollment information
- **courses** - Available driving courses and packages
- **lessons** - Individual lesson records and status
- **bookings** - Lesson booking requests and scheduling
- **reviews** - Customer feedback and ratings
- **activity_logs** - System activity and audit trail
- **settings** - Application configuration and preferences

## ⚙️ Configuration

### Environment Variables

```bash
# Database
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=driveschool_user
MYSQL_PASSWORD=your_secure_password
MYSQL_DATABASE=driveschool_pro

# Authentication
AUTH_SECRET=your-super-secret-jwt-key-min-32-characters
NEXTAUTH_URL=http://localhost:3000

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=+447756183484

# PWA
NEXT_PUBLIC_PWA_NAME="DriveSchool Pro"
NEXT_PUBLIC_PWA_DESCRIPTION="Advanced Driving School Management"
```

### Clacky Environment Setup

If deploying in Clacky environment:

1. **Bind MySQL middleware**
```bash
# MySQL 8.0 should be automatically bound
# Verify with: list available middleware
```

2. **Environment configuration file**
```yaml
# .environments.yaml or .1024
runtime: node
services:
  - mysql
```

## 🚀 Development

### Start development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Drizzle Studio (GUI)
npm run db:seed      # Seed database with sample data
```

### Development Workflow

1. **Database Changes**
   - Modify schema in `lib/db/schema.ts`
   - Run `npm run db:generate` to create migrations
   - Run `npm run db:migrate` to apply changes

2. **Adding New Features**
   - Create components in `components/`
   - Add pages in `app/`
   - Create API routes in `app/api/`
   - Update types in `lib/db/schema.ts`

## 🔐 User Roles

### Admin
- Full system access
- User management (create, edit, delete users)
- System configuration and settings
- Analytics and reporting
- Content management

### Instructor  
- Student management (assigned students only)
- Lesson scheduling and management
- Booking approval/rejection
- Progress tracking and reporting
- Profile management

### Student
- Lesson booking requests
- Profile management
- Progress viewing
- Schedule viewing
- Review submission

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **Role-based Authorization** - Granular permission system
- **Route Protection** - Authenticated and role-based route guards
- **SQL Injection Prevention** - Drizzle ORM with prepared statements
- **XSS Protection** - React's built-in XSS protection
- **CSRF Protection** - Next.js built-in CSRF protection

## 📱 PWA Features

- **Offline Support** - Basic offline functionality
- **Install Prompt** - Add to home screen capability
- **Push Notifications** - Lesson reminders (configurable)
- **Background Sync** - Sync data when connection restored

## 🎨 UI/UX Features

### Design System
- **Consistent Theming** - Light/dark mode support
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG 2.1 compliant components
- **Modern UI** - Clean, professional interface

### Components
- Custom UI components with Radix UI primitives
- Form components with validation
- Data tables with sorting and filtering
- Modal dialogs and notifications
- Loading states and error boundaries

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Errors**
```bash
# Check MySQL service status
sudo systemctl status mysql

# Verify credentials in .env.local
# Check firewall settings for port 3306
```

2. **Build Errors with Next.js 15 Canary**
```bash
# Install with legacy peer deps
npm install --legacy-peer-deps

# Clear build cache
rm -rf .next
npm run build
```

3. **Authentication Issues**
```bash
# Verify AUTH_SECRET is set and long enough (32+ characters)
# Check JWT token expiration settings
# Clear browser cookies/localStorage
```

4. **PWA Service Worker Issues**
```bash
# Clear browser cache
# Check PWA configuration in next.config.js
# Verify service worker registration
```

### Performance Optimization

1. **Database Queries**
   - Use indexes on frequently queried columns
   - Implement query result caching
   - Use database connection pooling

2. **Frontend Performance**
   - Implement React Server Components
   - Use Next.js Image optimization
   - Enable incremental static regeneration

## 📚 API Documentation

### Authentication Endpoints

```typescript
POST /api/auth/signin    // User login
POST /api/auth/signup    // User registration
POST /api/auth/signout   // User logout
GET  /api/user          // Get current user
```

### Admin API

```typescript
GET  /api/admin/stats   // System statistics
GET  /api/admin/users   // List all users
POST /api/admin/users   // Create new user
PUT  /api/admin/users/:id // Update user
DELETE /api/admin/users/:id // Delete user
```

### Instructor API

```typescript
GET  /api/instructor/students  // Get assigned students
GET  /api/instructor/lessons   // Get instructor lessons
GET  /api/instructor/bookings  // Get booking requests
```

### Public API

```typescript
GET  /api/courses      // List available courses
POST /api/bookings     // Create booking request
GET  /api/instructors  // List available instructors
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design
- Follow accessibility guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Drizzle team for the excellent ORM
- Radix UI for accessible components
- Open source community

## 📞 Support

For support, email support@driveschoolpro.com or contact us via WhatsApp at +447756183484.

## 🗺️ Roadmap

### v3.1 (Coming Soon)
- [ ] Advanced reporting and analytics
- [ ] Mobile app development
- [ ] Payment integration
- [ ] SMS notifications
- [ ] Advanced scheduling features

### v3.2 (Future)
- [ ] Multi-location support
- [ ] Advanced instructor management
- [ ] Student portal enhancements
- [ ] Integration with driving test centers
- [ ] Advanced PWA features

---

**Made with ❤️ for driving schools worldwide**