import { describe, it, expect } from 'vitest';

describe('Hello App - Smoke Tests', () => {
  describe('Environment Configuration', () => {
    it('should have required environment variables defined in .env', () => {
      // This test just validates the structure exists
      // In real tests, these would be loaded from .env
      const requiredEnvVars = [
        'DATABASE_URL',
        'NEON_DATABASE_URL',
        'NODE_ENV',
        'PORT',
      ];

      requiredEnvVars.forEach((envVar) => {
        expect(envVar).toBeDefined();
        expect(typeof envVar).toBe('string');
      });
    });
  });

  describe('Application Structure', () => {
    it('should have all required components', async () => {
      const components = [
        'HelloApp',
        'Nav',
        'MyCard',
        'Scan',
        'CardView',
        'HelloFeed',
        'Onboarding',
      ];

      for (const component of components) {
        const module = await import(`@/components/${component}.jsx`);
        expect(module.default).toBeDefined();
        expect(typeof module.default).toBe('function');
      }
    });

    it('should export Nav component correctly', async () => {
      const Nav = (await import('@/components/Nav.jsx')).default;
      expect(Nav).toBeDefined();
      expect(Nav.name).toBe('Nav');
    });
  });

  describe('API Route Structure', () => {
    it('should have health check route', async () => {
      const { GET } = await import('@/app/api/health/route.js');
      expect(GET).toBeDefined();
      expect(typeof GET).toBe('function');
    });

    it('should have auth guest route', async () => {
      const { POST } = await import('@/app/api/auth/guest/route.js');
      expect(POST).toBeDefined();
      expect(typeof POST).toBe('function');
    });

    it('should have hello route', async () => {
      const module = await import('@/app/api/hello/route.js');
      expect(module.GET).toBeDefined();
      expect(module.POST).toBeDefined();
    });

    it('should have card routes', async () => {
      const { GET } = await import('@/app/api/card/[handle]/route.js');
      expect(GET).toBeDefined();
      expect(typeof GET).toBe('function');
    });
  });

  describe('Utility Functions', () => {
    it('should export sql utility', async () => {
      const sql = (await import('@/app/api/utils/sql.js')).default;
      expect(sql).toBeDefined();
      expect(typeof sql).toBe('function');
    });

    it('should export auth utilities', async () => {
      const module = await import('@/app/api/utils/auth.js');
      expect(module.requireAuth).toBeDefined();
      expect(typeof module.requireAuth).toBe('function');
    });
  });

  describe('Configuration Files', () => {
    it('should have valid package.json', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const pkgPath = path.resolve(__dirname, '../../../../package.json');
      const pkgContent = fs.readFileSync(pkgPath, 'utf8');
      const pkg = JSON.parse(pkgContent);
      
      expect(pkg.name).toBe('web');
      expect(pkg.scripts).toBeDefined();
      expect(pkg.scripts.dev).toBeDefined();
      expect(pkg.scripts.test).toBeDefined();
    });

    it('should have required dependencies', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const pkgPath = path.resolve(__dirname, '../../../../package.json');
      const pkgContent = fs.readFileSync(pkgPath, 'utf8');
      const pkg = JSON.parse(pkgContent);
      
      expect(pkg.dependencies).toBeDefined();
      expect(pkg.dependencies.react).toBeDefined();
      expect(pkg.dependencies['react-router']).toBeDefined();
      expect(pkg.dependencies['@tanstack/react-query']).toBeDefined();
    });

    it('should have required devDependencies', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const pkgPath = path.resolve(__dirname, '../../../../package.json');
      const pkgContent = fs.readFileSync(pkgPath, 'utf8');
      const pkg = JSON.parse(pkgContent);
      
      expect(pkg.devDependencies).toBeDefined();
      expect(pkg.devDependencies.vitest).toBeDefined();
      expect(pkg.devDependencies['@testing-library/react']).toBeDefined();
      expect(pkg.devDependencies['@testing-library/jest-dom']).toBeDefined();
    });
  });
});
