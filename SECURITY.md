# Security Policy

## Supported Versions

We actively support the following versions of this project:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of our software seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report a Security Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **Email**: Send details to the repository maintainers directly
2. **GitHub Security Advisories**: Use the "Security" tab in this repository to privately report a vulnerability

### What to Include in Your Report

Please include the following information in your report:

- Type of vulnerability (e.g., SQL injection, XSS, authentication bypass)
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability, including how an attacker might exploit it

### Response Timeline

- **Initial Response**: Within 48 hours of report submission
- **Status Update**: Within 7 days with preliminary assessment
- **Resolution**: Varies based on severity and complexity

### Disclosure Policy

- Security vulnerabilities will be disclosed publicly only after a fix is available
- We will credit reporters in our security advisories unless they prefer to remain anonymous
- We follow responsible disclosure practices

### Security Best Practices for This Repository

1. **Never commit sensitive data**: Use `.env.example` templates instead of actual `.env` files
2. **Review dependencies**: Regularly audit dependencies for known vulnerabilities
3. **Use environment variables**: Store all secrets in environment variables, never in code
4. **Keep dependencies updated**: Regularly update packages to patch security issues

### Security Features

This repository implements:

- **Environment variable isolation**: All secrets use `.env` files (git-ignored)
- **Type-safe configuration**: Zod schema validation for environment variables
- **Security headers**: Implemented in production builds
- **Rate limiting**: API endpoints have rate limiting enabled
- **Input validation**: All user inputs are validated and sanitized

## Third-Party Dependencies

We regularly monitor our dependencies for security vulnerabilities using:

- GitHub Dependabot alerts
- npm audit for Node.js packages
- pip audit for Python packages

If you discover a vulnerability in one of our dependencies, please report it both to us and to the dependency maintainer.

Thank you for helping keep this project and its users safe!
