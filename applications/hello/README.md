# Hello - Digital Business Card App

A modern, mobile-first digital business card application built with React Router v7 and PostgreSQL.

## 📱 Features

- **Digital Business Cards**: Create and share your professional profile
- **QR Code Sharing**: Instant sharing via QR codes
- **Connection Requests**: Send and receive "hello" requests
- **Introductions**: Manage your professional network
- **vCard Export**: Download contacts in standard format
- **Dark Mode**: Automatic theme switching
- **Mobile-First**: Optimized for mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js v20+
- npm v10+
- PostgreSQL database (Neon serverless)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at http://localhost:3005

## 📖 Documentation

- **[Demo Guide](DEMO_GUIDE.md)** - Complete demo walkthrough and feature overview
- **[Test Coverage](TEST_COVERAGE.md)** - Testing strategy and current coverage
- **[E2E Test Plan](E2E_TEST_PLAN.md)** - End-to-end testing plan and user journeys

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run component tests
npm run test:ui

# Run API tests
npm run test:api

# Watch mode
npm run test:watch
```

### Current Test Status
- ✅ 19 passing tests
- ✅ Component tests (Nav)
- ✅ Smoke tests (Application structure)
- ⚠️ API tests (require database connection)

## 🏗️ Architecture

### Frontend
- **Framework**: React 18
- **Routing**: React Router v7
- **State Management**: TanStack Query
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### Backend
- **API**: React Router API routes
- **Database**: Neon PostgreSQL (serverless)
- **Authentication**: JWT-based guest auth
- **ORM**: Neon serverless driver

### Key Components
- `HelloApp.jsx` - Main application container
- `Nav.jsx` - Bottom navigation
- `MyCard.jsx` - User's business card
- `Scan.jsx` - QR scanner and search
- `CardView.jsx` - View other cards
- `HelloFeed.jsx` - Manage requests
- `Onboarding.jsx` - User setup

## 📡 API Endpoints

### Authentication
- `POST /api/auth/guest` - Guest login

### Profile
- `GET /api/card/:handle` - Get card
- `GET /api/card/:handle/qrcode` - QR code
- `GET /api/card/:handle/vcard` - vCard download
- `GET /api/profile/me` - Current user
- `POST /api/profile/me` - Update profile

### Connections
- `POST /api/hello` - Send request
- `GET /api/hello` - List requests
- `POST /api/hello/:id/accept` - Accept
- `POST /api/hello/:id/decline` - Decline
- `GET /api/intros` - List connections

### Health
- `GET /api/health` - Health check

## 🎨 User Interface

### Pages
1. **My Card** - Your digital business card
2. **Scan** - Find and view other cards
3. **Hellos** - Manage requests and connections
4. **Settings** - Account settings

### Navigation
- Bottom tab bar for easy mobile access
- Smooth transitions between pages
- Active state indicators

## 🛠️ Development

### Scripts
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Type checking
- `npm run test` - Run tests

### Environment Variables
```env
DATABASE_URL=postgresql://...
NEON_DATABASE_URL=postgresql://...
NODE_ENV=development
PORT=3005
```

## 🔒 Security

- JWT token authentication
- SQL injection prevention (parameterized queries)
- Input validation
- CORS configuration
- Secure password hashing (if applicable)

## 🎯 Performance

- Server-side rendering (SSR)
- Code splitting
- Lazy loading
- Optimized database queries
- Query result caching

## 📱 Mobile Support

- Responsive design (320px - 1920px)
- Touch-friendly controls
- Mobile-first approach
- PWA-ready structure

## 🌙 Dark Mode

- Automatic theme detection
- Manual theme switching
- Consistent theming across all components

## 🔄 State Management

- **Server State**: TanStack Query
- **Local State**: React hooks
- **Auth State**: localStorage
- **Form State**: React Hook Form

## 📦 Dependencies

### Core
- react ^18.2.0
- react-router ^7.6.0
- @tanstack/react-query ^5.72.2
- @neondatabase/serverless ^0.10.4

### UI
- tailwindcss 3
- lucide-react 0.358.0
- react-hook-form ^7.55.0

### Testing
- vitest ^3.2.4
- @testing-library/react ^16.3.0
- @testing-library/jest-dom ^6.6.4

## 🚧 Roadmap

### Phase 1: Core Features ✅
- [x] User authentication
- [x] Profile creation
- [x] QR code generation
- [x] Hello requests
- [x] Introductions

### Phase 2: Testing (Current)
- [x] Component tests
- [x] API tests
- [x] Smoke tests
- [ ] E2E tests
- [ ] Integration tests

### Phase 3: Enhancements
- [ ] Real-time updates (WebSocket)
- [ ] Push notifications
- [ ] Camera QR scanning
- [ ] Chat functionality
- [ ] File attachments

### Phase 4: Scale
- [ ] Analytics
- [ ] Admin dashboard
- [ ] Team accounts
- [ ] Advanced search
- [ ] Export/import

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```
Error: No database connection string was provided
```
Solution: Check `.env` file has valid `DATABASE_URL`

**Port Already in Use**
```
Error: listen EADDRINUSE: address already in use
```
Solution: Change `PORT` in `.env` or stop other process

**Dependencies Not Found**
```
Error: Cannot find module
```
Solution: Run `npm install` again

## 📄 License

This project is part of the External Review Repository.

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## 📞 Support

- **Issues**: GitHub Issues
- **Documentation**: See `/documentation` folder
- **Demo**: See [DEMO_GUIDE.md](DEMO_GUIDE.md)

## ✅ Status

**Current Status**: Development Ready  
**Test Coverage**: 19/24 tests passing  
**Demo Ready**: Yes ✅  
**Production Ready**: No (requires security hardening)

## 🎓 Learning Resources

- [React Router v7 Docs](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com/)
- [Neon Database](https://neon.tech/)

---

**Built with ❤️ for professional networking**
