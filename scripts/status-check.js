#!/usr/bin/env node
/**
 * Status Check Script
 * Cross-platform status monitoring for all applications and services
 */

import { createRequire } from 'module';
import { exec } from 'child_process';
import { promisify } from 'util';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json');
const execAsync = promisify(exec);

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
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

async function checkPort(port) {
  try {
    if (process.platform === 'win32') {
      const { stdout } = await execAsync(`netstat -an | findstr :${port}`);
      return stdout.trim().length > 0;
    } else {
      const { stdout } = await execAsync(`lsof -i :${port} || netstat -tuln | grep :${port}`);
      return stdout.trim().length > 0;
    }
  } catch (error) {
    return false;
  }
}

async function checkRedis() {
  try {
    if (process.platform === 'win32') {
      await execAsync('docker ps --filter "name=redis-installsure" --format "{{.Names}}"');
      return true;
    } else {
      const { stdout } = await execAsync('docker ps --filter "name=redis-installsure" --format "{{.Names}}"');
      return stdout.trim() === 'redis-installsure';
    }
  } catch (error) {
    return false;
  }
}

async function getSystemInfo() {
  try {
    const { stdout: nodeVersion } = await execAsync('node --version');
    const { stdout: npmVersion } = await execAsync('npm --version');
    
    return {
      node: nodeVersion.trim(),
      npm: npmVersion.trim(),
      platform: process.platform,
      arch: process.arch
    };
  } catch (error) {
    return {
      node: 'unknown',
      npm: 'unknown',
      platform: process.platform,
      arch: process.arch
    };
  }
}

async function main() {
  log('📊 System Status Check', 'cyan');
  log('======================', 'cyan');
  
  // System Information
  log('\n💻 System Information', 'yellow');
  const sysInfo = await getSystemInfo();
  log(`   Platform: ${sysInfo.platform} (${sysInfo.arch})`, 'white');
  log(`   Node.js: ${sysInfo.node}`, 'white');
  log(`   npm: ${sysInfo.npm}`, 'white');
  
  // Redis Status
  log('\n🔴 Redis Status', 'yellow');
  const redisRunning = await checkRedis();
  if (redisRunning) {
    log('   ✅ Redis container is running', 'green');
  } else {
    log('   ❌ Redis container is not running', 'red');
  }
  
  // Port Status
  log('\n🌐 Port Status', 'yellow');
  const ports = packageJson.config?.ports || {};
  const portStatuses = {};
  
  for (const [service, port] of Object.entries(ports)) {
    if (service === 'redis') continue; // Skip Redis port, checked separately
    
    const isInUse = await checkPort(port);
    portStatuses[service] = isInUse;
    
    if (isInUse) {
      log(`   ✅ Port ${port} (${service}) - In Use`, 'green');
    } else {
      log(`   ⚪ Port ${port} (${service}) - Available`, 'white');
    }
  }
  
  // Application Status
  log('\n📱 Application Status', 'yellow');
  const apps = packageJson.production?.apps || [];
  let runningApps = 0;
  let criticalAppsRunning = 0;
  let totalCriticalApps = 0;
  
  for (const app of apps) {
    const isRunning = await checkPort(app.port);
    if (isRunning) runningApps++;
    
    if (app.critical) {
      totalCriticalApps++;
      if (isRunning) criticalAppsRunning++;
    }
    
    const status = isRunning ? '🟢 RUNNING' : '🔴 STOPPED';
    const criticality = app.critical ? ' (CRITICAL)' : '';
    log(`   ${status} - ${app.name}${criticality}`, isRunning ? 'green' : 'red');
  }
  
  // Summary
  log('\n📈 Summary', 'cyan');
  log('===========', 'cyan');
  
  log(`\nApplications: ${runningApps}/${apps.length} running`, 'white');
  log(`Critical Apps: ${criticalAppsRunning}/${totalCriticalApps} running`, 'white');
  log(`Redis: ${redisRunning ? 'Running' : 'Stopped'}`, redisRunning ? 'green' : 'red');
  
  // Overall Status
  if (criticalAppsRunning === totalCriticalApps && redisRunning) {
    log('\n✅ SYSTEM OPERATIONAL', 'green');
    log('All critical services are running', 'green');
  } else if (criticalAppsRunning === totalCriticalApps) {
    log('\n⚠️  SYSTEM PARTIALLY OPERATIONAL', 'yellow');
    log('Critical apps running but Redis is stopped', 'yellow');
  } else if (runningApps === 0) {
    log('\n🔴 SYSTEM OFFLINE', 'red');
    log('No applications are currently running', 'red');
  } else {
    log('\n⚠️  SYSTEM DEGRADED', 'yellow');
    log('Some critical applications are not running', 'yellow');
  }
  
  log('\n💡 Management Commands:', 'cyan');
  log('   • npm run start     - Start all applications', 'white');
  log('   • npm run stop      - Stop all applications', 'white');
  log('   • npm run test      - Run all tests', 'white');
  log('   • npm run health    - Check application health', 'white');
}

main().catch(err => {
  log(`❌ Status check failed: ${err.message}`, 'red');
  process.exit(1);
});