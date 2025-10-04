#!/bin/bash
# Start All Applications Script
# External Review Repository
# Last Updated: 2025-09-29

set -e

echo "🚀 Starting All Applications..."
echo "================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v20+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to start an application
start_app() {
    local app_name=$1
    local app_path=$2
    local port=$3
    local description=$4
    
    echo ""
    echo "🔄 Starting $app_name..."
    echo "   Port: $port"
    echo "   Description: $description"
    
    # Check if port is already in use
    if check_port $port; then
        echo "   ⚠️  Port $port is already in use. Skipping $app_name."
        return
    fi
    
    # Check if package.json exists
    if [ ! -f "$REPO_ROOT/$app_path/package.json" ]; then
        echo "   ⚠️  package.json not found in $app_path. Skipping $app_name."
        return
    fi
    
    # Check if node_modules exists
    if [ ! -d "$REPO_ROOT/$app_path/node_modules" ]; then
        echo "   ⚠️  node_modules not found. Installing dependencies..."
        cd "$REPO_ROOT/$app_path"
        npm install
    fi
    
    # Start the application in background
    cd "$REPO_ROOT/$app_path"
    nohup npm run dev > "/tmp/${app_name// /-}.log" 2>&1 &
    local pid=$!
    echo $pid > "/tmp/${app_name// /-}.pid"
    echo "   ✅ $app_name started successfully (PID: $pid)"
    echo "   📝 Logs: /tmp/${app_name// /-}.log"
}

# Start all applications
echo ""
echo "📱 Starting Applications..."

# InstallSure (Production Ready)
start_app "InstallSure" "applications/installsure" 3000 "Construction Management Platform"

# Demo Dashboard (Demo Ready)
start_app "Demo Dashboard" "applications/demo-dashboard" 3001 "Central Control Panel"

# FF4U (Development Ready)
start_app "FF4U" "applications/ff4u" 3002 "Adult Entertainment Platform"

# RedEye (Development Ready)
start_app "RedEye" "applications/redeye" 3003 "Project Management System"

# ZeroStack (Development Ready)
start_app "ZeroStack" "applications/zerostack" 3004 "Infrastructure Management"

# Hello (Development Ready)
start_app "Hello" "applications/hello" 3005 "Digital Business Cards"

# Avatar (Development Ready)
start_app "Avatar" "applications/avatar" 3006 "AI Avatar Platform"

# Wait for applications to start
echo ""
echo "⏳ Waiting for applications to start..."
sleep 15

# Check application status
echo ""
echo "🔍 Checking Application Status..."
echo "================================="

declare -a apps=(
    "InstallSure:3000:http://localhost:3000"
    "Demo Dashboard:3001:http://localhost:3001"
    "FF4U:3002:http://localhost:3002"
    "RedEye:3003:http://localhost:3003"
    "ZeroStack:3004:http://localhost:3004"
    "Hello:3005:http://localhost:3005"
    "Avatar:3006:http://localhost:3006"
)

running_count=0
for app_info in "${apps[@]}"; do
    IFS=':' read -r name port url <<< "$app_info"
    if check_port $port; then
        echo "✅ $name - Running on port $port"
        ((running_count++))
    else
        echo "❌ $name - Not responding on port $port"
    fi
done

echo ""
echo "🎉 Application startup complete!"
echo "================================="
echo "📊 Status: $running_count/7 applications running"
echo ""
echo "🌐 You can access them at:"
echo "   • InstallSure: http://localhost:3000"
echo "   • Demo Dashboard: http://localhost:3001"
echo "   • FF4U: http://localhost:3002"
echo "   • RedEye: http://localhost:3003"
echo "   • ZeroStack: http://localhost:3004"
echo "   • Hello: http://localhost:3005"
echo "   • Avatar: http://localhost:3006"
echo ""
echo "💡 To stop all applications, run './scripts/stop-all.sh'"
echo "📝 Application logs are in /tmp/*.log"
echo ""
echo "🚀 Visit http://localhost:3001 for the Demo Dashboard!"
