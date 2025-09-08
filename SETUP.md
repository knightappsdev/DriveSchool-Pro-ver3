# 🚀 Quick Setup Guide - DriveSchool Pro v3.0

This guide will help you get DriveSchool Pro v3.0 up and running quickly.

## ⚡ Quick Start (5 minutes)

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/driveschool-pro-ver3.git
cd driveschool-pro-ver3
npm install --legacy-peer-deps
```

### 2. Environment Setup
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```bash
# Database (Update with your MySQL credentials)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=driveschool_pro

# Authentication (Generate a secure key)
AUTH_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=+447756183484
```

### 3. Database Setup
```bash
# Create the database in MySQL
mysql -u root -p
CREATE DATABASE driveschool_pro;
exit

# Run migrations
npm run db:generate
npm run db:migrate
```

### 4. Start Development
```bash
npm run dev
```

Visit `http://localhost:3000` - You're ready to go! 🎉

## 🔧 Detailed Setup

### Prerequisites Checklist
- [ ] Node.js 18+ installed
- [ ] MySQL 8.0+ running
- [ ] Git installed

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `MYSQL_HOST` | MySQL server host | `localhost` |
| `MYSQL_PORT` | MySQL server port | `3306` |
| `MYSQL_USER` | Database username | `driveschool_user` |
| `MYSQL_PASSWORD` | Database password | `secure_password123` |
| `MYSQL_DATABASE` | Database name | `driveschool_pro` |
| `AUTH_SECRET` | JWT signing secret (32+ chars) | `your-very-long-secret-key-here` |
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp CRM number | `+447756183484` |

### Database Commands

```bash
# Generate new migration after schema changes
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio

# Seed database with sample data
npm run db:seed
```

### Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run type checking
npx tsc --noEmit

# Run linting (if configured)
npm run lint
```

## 🐳 Docker Setup (Optional)

### Using Docker Compose

1. **Create docker-compose.yml:**
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: driveschool_pro
      MYSQL_USER: driveschool_user
      MYSQL_PASSWORD: userpassword
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - mysql
    environment:
      MYSQL_HOST: mysql
      MYSQL_USER: driveschool_user
      MYSQL_PASSWORD: userpassword
      MYSQL_DATABASE: driveschool_pro

volumes:
  mysql_data:
```

2. **Run with Docker:**
```bash
docker-compose up -d
```

## 🔐 First Admin User Setup

Since there's no seeded data, you'll need to create your first admin user manually:

1. **Register normally through the UI**
2. **Update user role in database:**
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-admin@email.com';
```

Or create a seed script:

```bash
# Create lib/db/seed.ts with admin user data
npm run db:seed
```

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically

### Manual Deployment
```bash
npm run build
npm run start
```

### Environment Variables for Production
```bash
MYSQL_HOST=your-production-db-host
MYSQL_USER=your-production-db-user
MYSQL_PASSWORD=your-production-db-password
MYSQL_DATABASE=driveschool_pro
AUTH_SECRET=your-super-secure-production-secret-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## ❗ Troubleshooting

### Common Issues & Solutions

**❌ Database Connection Failed**
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Check credentials in .env.local
# Ensure database exists
mysql -u root -p -e "SHOW DATABASES;"
```

**❌ Build Errors**
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

**❌ Port Already in Use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

**❌ JWT Secret Too Short**
```bash
# Generate secure secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Getting Help

1. **Check logs:**
```bash
# Development logs in terminal
npm run dev

# Production logs
pm2 logs # if using PM2
```

2. **Database debugging:**
```bash
# Open Drizzle Studio
npm run db:studio

# Check migration status
ls drizzle/migrations/
```

3. **Common file locations:**
- Configuration: `drizzle.config.ts`
- Database schema: `lib/db/schema.ts`
- Environment: `.env.local`
- Database queries: `lib/db/queries.ts`

## 🎯 What's Next?

After successful setup:

1. **Create your first admin user**
2. **Set up instructors and courses**
3. **Configure WhatsApp integration**
4. **Customize branding and colors**
5. **Set up backup strategies**

## 📱 PWA Installation

To enable PWA features:

1. **HTTPS required** (use ngrok for local testing)
2. **Visit site in Chrome/Edge**
3. **Look for "Install" button in address bar**

## 🔒 Security Checklist

- [ ] Strong AUTH_SECRET (32+ random characters)
- [ ] Database credentials secured
- [ ] HTTPS enabled in production
- [ ] Regular database backups
- [ ] Keep dependencies updated

---

**Need help?** Create an issue on GitHub or contact support@driveschoolpro.com