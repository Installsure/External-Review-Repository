#!/usr/bin/env node
/**
 * Health Check Script
 * Cross-platform health monitoring for all applications
 */

import { createRequire } from 'module';
import http from 'http';
import https from 'https';
import { URL } from 'url';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function log(message, color = 'white') {
  console.log(colorize(message, color));
}

async function checkHealth(url, timeout = 10000) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(url, { timeout }, (res) => {
      resolve({
        success: res.statusCode === 200,
        status: res.statusCode,
        message: `HTTP ${res.statusCode}`
      });
    });
    
    req.on('error', (err) => {
      resolve({
        success: false,
        status: 0,
        message: err.message
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        success: false,
        status: 0,
        message: 'Timeout'
      });
    });
    
    req.end();
  });
}

async function main() {
  log('🏥 Application Health Check', 'cyan');
  log('============================', 'cyan');
  
  const apps = packageJson.production?.apps || [];
  const results = [];
  
  for (const app of apps) {
    log(`\n🔄 Checking ${app.name}...`, 'yellow');
    
    const result = await checkHealth(app.healthCheck);
    
    if (result.success) {
      log(`   ✅ ${app.name} - Healthy (${result.message})`, 'green');
    } else {
      const severity = app.critical ? 'CRITICAL' : 'WARNING';
      const color = app.critical ? 'red' : 'yellow';
      log(`   ❌ ${severity}: ${app.name} - ${result.message}`, color);
    }
    
    results.push({
      ...app,
      healthy: result.success,
      status: result.status,
      message: result.message
    });
  }
  
  // Summary
  log('\n📊 Health Summary', 'cyan');
  log('=================', 'cyan');
  
  const healthy = results.filter(r => r.healthy).length;
  const total = results.length;
  const criticalUnhealthy = results.filter(r => !r.healthy && r.critical).length;
  
  log(`\nOverall: ${healthy}/${total} applications healthy`, 'white');
  
  if (criticalUnhealthy > 0) {
    log(`🚨 ${criticalUnhealthy} critical applications are unhealthy!`, 'red');
    process.exit(1);
  } else if (healthy === total) {
    log('✅ All applications are healthy', 'green');
    process.exit(0);
  } else {
    log('⚠️  Some non-critical applications are unhealthy', 'yellow');
    process.exit(0);
  }
}

main().catch(err => {
  log(`❌ Health check failed: ${err.message}`, 'red');
  process.exit(1);
});