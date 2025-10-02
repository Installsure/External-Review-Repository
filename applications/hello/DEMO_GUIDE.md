# Hello App - Demo Guide

## Overview
The Hello App is a digital business card application that allows users to:
- Create and manage their digital business card
- Scan QR codes to view other users' cards
- Send "hello" requests to connect with others
- Accept/decline hello requests
- View and manage introductions/connections

## Quick Start

### 1. Install Dependencies
```bash
cd applications/hello
npm install
```

### 2. Set Up Environment
The `.env` file contains all necessary configuration including:
- Database connection (Neon PostgreSQL)
- Port configuration (default: 3005)

### 3. Run the Application
```bash
npm run dev
```

The app will be available at http://localhost:3005

## Features Demo

### Feature 1: User Onboarding
1. First-time users are automatically created with guest authentication
2. Users can set up their profile with:
   - Display name
   - Handle (unique identifier)
   - Avatar
   - Bio
   - Social media links

### Feature 2: My Card (Digital Business Card)
- View your personal digital business card
- Share via QR code
- Download as vCard for contacts
- Edit profile information

### Feature 3: Scan & Connect
- Scan QR codes to view other users' cards
- Send hello requests with optional notes
- View profile information before connecting

### Feature 4: Hello Feed
The Hello Feed shows:
- **Incoming**: Hello requests you've received
- **Outgoing**: Hello requests you've sent
- **Introductions**: Confirmed connections

Actions available:
- Accept hello requests (creates introduction)
- Decline hello requests
- View introduction details

### Feature 5: Settings
- View account information
- Logout functionality

## API Endpoints

### Authentication
- `POST /api/auth/guest` - Guest authentication

### Profile Management
- `GET /api/card/:handle` - Get user card by handle
- `GET /api/card/:handle/qrcode` - Get QR code for card
- `GET /api/card/:handle/vcard` - Download vCard
- `GET /api/profile/me` - Get current user's profile
- `POST /api/profile/me` - Update profile

### Hello Requests
- `POST /api/hello` - Send hello request
- `GET /api/hello` - Get hello requests
- `POST /api/hello/:id/accept` - Accept hello request
- `POST /api/hello/:id/decline` - Decline hello request

### Introductions
- `GET /api/intros` - Get introductions (connections)

### Health Check
- `GET /api/health` - Health check endpoint

## Testing

### Run All Tests
```bash
npm run test
```

### Run Component Tests Only
```bash
npm run test:ui
```

### Run API Tests Only
```bash
npm run test:api
```

## Architecture

### Frontend
- **Framework**: React with React Router v7
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS with dark mode support
- **Icons**: Lucide React

### Backend
- **Framework**: React Router API routes
- **Database**: Neon PostgreSQL (serverless)
- **Authentication**: Simple JWT-based guest authentication

### Key Components
1. **HelloApp.jsx** - Main application container
2. **Nav.jsx** - Bottom navigation bar
3. **MyCard.jsx** - User's digital business card
4. **Scan.jsx** - QR code scanner and manual search
5. **CardView.jsx** - View other users' cards
6. **HelloFeed.jsx** - Manage hello requests and introductions
7. **Onboarding.jsx** - New user setup flow

## Demo Script

### Scenario 1: New User Onboarding
1. Open the app - auto guest login happens
2. See onboarding screen
3. Fill in profile details
4. Save and see "My Card" page

### Scenario 2: Connecting with Others
1. Navigate to "Scan" tab
2. Search for a user by handle or scan QR
3. View their card
4. Send a hello request with a note
5. Navigate to "Hellos" tab
6. See the outgoing request

### Scenario 3: Accepting Hello Requests
1. Navigate to "Hellos" tab
2. Switch to "Incoming" view
3. See pending requests
4. Accept a request
5. View the new introduction

## Technical Highlights

- **Serverless Database**: Uses Neon PostgreSQL for auto-scaling
- **Mobile-First Design**: Optimized for mobile viewing
- **Dark Mode Support**: Automatic theme switching
- **Real-time Updates**: React Query for efficient data fetching
- **QR Code Generation**: Built-in QR code for easy sharing
- **vCard Export**: Standard contact format support

## Troubleshooting

### Common Issues

**Database Connection Error**
- Verify `.env` file has correct DATABASE_URL
- Check network connectivity

**Port Already in Use**
- Change PORT in `.env` file
- Or kill the process using port 3005

**Dependencies Not Found**
- Run `npm install` again
- Delete `node_modules` and reinstall

## Production Considerations

Before deploying to production:
1. Use proper JWT library (not base64 encoding)
2. Add HTTPS/TLS for API calls
3. Implement rate limiting
4. Add input sanitization
5. Enable CORS properly
6. Add monitoring and logging
7. Set up database backups
8. Implement proper error tracking

## Support

For issues or questions:
- Check the API documentation
- Review the troubleshooting guide
- Check component tests for usage examples
