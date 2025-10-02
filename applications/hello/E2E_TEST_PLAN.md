# Hello App - E2E Test Plan

## Overview
This document outlines the end-to-end testing plan for the Hello App, focusing on critical user journeys and workflows.

## Testing Tools

### Current Setup
- **Vitest**: Unit and integration testing
- **Testing Library**: Component testing
- **jsdom**: Browser environment simulation

### Recommended for Full E2E
- **Playwright**: Browser automation and E2E testing
- **Cypress**: Alternative E2E testing framework

## Critical User Journeys

### Journey 1: New User Onboarding
**Priority**: High  
**Complexity**: Medium

**Steps**:
1. User opens the app
2. Guest authentication happens automatically
3. User sees onboarding screen
4. User fills in profile information:
   - Display name
   - Handle (unique identifier)
   - Bio (optional)
   - Avatar (optional)
   - Social links (optional)
5. User saves profile
6. User is redirected to "My Card" view
7. User sees their digital business card

**Test Cases**:
- ✅ Valid profile creation
- ✅ Handle uniqueness validation
- ✅ Required field validation
- ✅ Optional fields handling
- ✅ Successful redirect after save
- ✅ Error handling for duplicate handles

**Acceptance Criteria**:
- New user can complete onboarding in < 2 minutes
- Profile is saved correctly to database
- User sees confirmation of successful creation
- Invalid inputs show clear error messages

---

### Journey 2: Viewing and Sharing My Card
**Priority**: High  
**Complexity**: Low

**Steps**:
1. User navigates to "My Card" tab
2. User sees their profile information
3. User sees QR code for sharing
4. User can download vCard
5. User can edit profile

**Test Cases**:
- ✅ Profile displays correctly
- ✅ QR code generates properly
- ✅ QR code can be scanned
- ✅ vCard download works
- ✅ Edit button navigates to edit view

**Acceptance Criteria**:
- All profile information displays correctly
- QR code is scannable
- vCard downloads in standard format
- Edit functionality works

---

### Journey 3: Scanning and Viewing Other Cards
**Priority**: High  
**Complexity**: Medium

**Steps**:
1. User navigates to "Scan" tab
2. User searches for another user by handle
3. System displays the other user's card
4. User views profile information
5. User can send a hello request

**Test Cases**:
- ✅ Search by handle works
- ✅ Profile not found error handling
- ✅ Card displays correctly
- ✅ Send hello button is visible
- ✅ Cannot send hello to self

**Acceptance Criteria**:
- Search is fast (< 1 second)
- Profile displays all public information
- User cannot send hello to themselves
- Clear error for non-existent handles

---

### Journey 4: Sending Hello Requests
**Priority**: High  
**Complexity**: Medium

**Steps**:
1. User views another user's card
2. User clicks "Say Hello" button
3. User optionally adds a note
4. User submits hello request
5. System confirms request sent
6. User sees request in "Hellos" > "Outgoing" tab

**Test Cases**:
- ✅ Hello request sent successfully
- ✅ Optional note included
- ✅ Request appears in outgoing list
- ✅ Cannot send duplicate request
- ✅ User is redirected after sending

**Acceptance Criteria**:
- Hello request is created in database
- Success message is shown
- User cannot spam same person
- Request status is "PENDING"

---

### Journey 5: Receiving and Accepting Hello Requests
**Priority**: High  
**Complexity**: High

**Steps**:
1. User receives a hello request
2. User navigates to "Hellos" tab
3. User sees incoming request
4. User views requester's profile
5. User accepts the request
6. System creates introduction
7. User sees new connection in introductions

**Test Cases**:
- ✅ Incoming request displays correctly
- ✅ Sender information shown
- ✅ Note is displayed if present
- ✅ Accept creates introduction
- ✅ Introduction appears in list
- ✅ Both users see the connection

**Acceptance Criteria**:
- Incoming requests are listed
- Sender profile is accessible
- Accept creates bidirectional connection
- Request status changes to "ACCEPTED"
- Introduction is created properly

---

### Journey 6: Declining Hello Requests
**Priority**: Medium  
**Complexity**: Low

**Steps**:
1. User sees incoming hello request
2. User clicks decline button
3. System confirms decline
4. Request is removed from incoming list

**Test Cases**:
- ✅ Decline button works
- ✅ Request status changes to "DECLINED"
- ✅ Request removed from incoming list
- ✅ No introduction created

**Acceptance Criteria**:
- Decline is immediate
- Request status updated
- UI updated appropriately
- No connection created

---

### Journey 7: Managing Introductions
**Priority**: Medium  
**Complexity**: Low

**Steps**:
1. User navigates to "Hellos" > "Introductions" tab
2. User sees list of connections
3. User can view connection details
4. User can start chat (future feature)

**Test Cases**:
- ✅ Introductions list displays
- ✅ Connection information shown
- ✅ Both users see connection
- ✅ List updates after new accept

**Acceptance Criteria**:
- All connections are listed
- Connection details are accurate
- List is sorted by date (newest first)
- Empty state handled gracefully

---

## Performance Requirements

### Page Load Times
- Initial load: < 2 seconds
- Navigation between tabs: < 500ms
- Search results: < 1 second
- Database queries: < 500ms

### Responsiveness
- Mobile-first design
- Works on screens 320px - 1920px wide
- Touch-friendly buttons (min 44x44px)
- Smooth animations (60fps)

---

## Test Data Requirements

### User Profiles
- Minimum 5 test users
- Mix of complete/incomplete profiles
- Various handle formats
- Different avatar types

### Hello Requests
- Pending requests (incoming/outgoing)
- Accepted requests
- Declined requests
- Requests with/without notes

### Introductions
- At least 3 active connections per user
- Various connection dates

---

## Error Scenarios

### Network Errors
- ✅ No internet connection
- ✅ API timeout
- ✅ 500 server errors
- ✅ 404 not found

### Validation Errors
- ✅ Invalid handle format
- ✅ Duplicate handle
- ✅ Missing required fields
- ✅ Invalid data types

### Business Logic Errors
- ✅ Sending hello to self
- ✅ Duplicate hello request
- ✅ Accepting already processed request
- ✅ Unauthorized actions

---

## Accessibility Testing

### WCAG 2.1 Compliance
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Color contrast
- ✅ Focus indicators
- ✅ Alt text for images
- ✅ ARIA labels

### Testing Tools
- axe DevTools
- WAVE Browser Extension
- Lighthouse Accessibility Audit

---

## Security Testing

### Authentication
- ✅ Token validation
- ✅ Expired token handling
- ✅ Invalid token rejection

### Authorization
- ✅ Cannot access other users' data
- ✅ Cannot modify other users' profiles
- ✅ Cannot delete others' requests

### Input Validation
- ✅ SQL injection prevention
- ✅ XSS prevention
- ✅ CSRF protection

---

## Cross-Browser Testing

### Desktop Browsers
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Mobile Browsers
- iOS Safari (latest)
- Android Chrome (latest)

---

## Test Environment Setup

### Prerequisites
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with test database credentials
```

### Running E2E Tests
```bash
# Install Playwright (recommended)
npm install -D @playwright/test

# Run E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run in debug mode
npm run test:e2e:debug
```

---

## CI/CD Integration

### GitHub Actions Workflow
```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npx playwright install
      - run: npm run test:e2e
```

---

## Test Metrics & Reporting

### Coverage Targets
- Code Coverage: 80%+
- User Journey Coverage: 100%
- API Endpoint Coverage: 100%
- Component Coverage: 80%+

### Reporting Tools
- Vitest Coverage Reporter
- Playwright HTML Reporter
- Codecov (optional)

---

## Known Issues & Limitations

### Current Limitations
1. No real QR code scanner (uses manual input)
2. No push notifications for new requests
3. No real-time updates
4. Limited offline support

### Future Improvements
1. Add WebSocket for real-time updates
2. Implement push notifications
3. Add offline mode with sync
4. Add camera-based QR scanning

---

## Maintenance

### Test Review Schedule
- Weekly: Review failing tests
- Monthly: Update test data
- Quarterly: Review coverage metrics
- Annually: Full test suite audit

### Test Data Cleanup
- Remove old test data monthly
- Reset test database weekly
- Archive test results monthly

---

## Resources

### Documentation
- [Playwright Documentation](https://playwright.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Best Practices
- Write tests before fixing bugs
- Keep tests independent
- Use descriptive test names
- Mock external dependencies
- Test user behavior, not implementation

---

## Conclusion

This E2E test plan provides a comprehensive framework for testing the Hello App. The plan covers:
- ✅ All critical user journeys
- ✅ Performance requirements
- ✅ Error scenarios
- ✅ Accessibility testing
- ✅ Security testing
- ✅ Cross-browser testing

**Status**: Ready for implementation  
**Priority**: High  
**Next Steps**: 
1. Install Playwright
2. Implement Journey 1 tests
3. Set up CI/CD pipeline
4. Achieve 80% coverage target
