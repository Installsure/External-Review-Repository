#!/bin/bash
# Stop All Applications Script
# External Review Repository
# Last Updated: 2025-09-29

echo "🛑 Stopping All Applications..."
echo "================================="

# Application names
declare -a apps=(
    "InstallSure"
    "Demo-Dashboard"
    "FF4U"
    "RedEye"
    "ZeroStack"
    "Hello"
    "Avatar"
)

stopped_count=0

for app in "${apps[@]}"; do
    pid_file="/tmp/${app}.pid"
    
    if [ -f "$pid_file" ]; then
        pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo "🔄 Stopping $app (PID: $pid)..."
            kill $pid 2>/dev/null
            sleep 1
            
            # Force kill if still running
            if ps -p $pid > /dev/null 2>&1; then
                kill -9 $pid 2>/dev/null
            fi
            
            echo "   ✅ $app stopped"
            ((stopped_count++))
        else
            echo "   ℹ️  $app was not running"
        fi
        
        # Clean up PID file
        rm -f "$pid_file"
    else
        echo "   ℹ️  No PID file found for $app"
    fi
    
    # Clean up log file
    log_file="/tmp/${app}.log"
    if [ -f "$log_file" ]; then
        rm -f "$log_file"
    fi
done

# Also try to kill any node processes on the ports
echo ""
echo "🔍 Checking for processes on application ports..."

declare -a ports=(3000 3001 3002 3003 3004 3005 3006)

for port in "${ports[@]}"; do
    pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo "   🔄 Killing process on port $port (PID: $pid)..."
        kill -9 $pid 2>/dev/null
    fi
done

echo ""
echo "🎉 Cleanup complete!"
echo "================================="
echo "📊 Stopped $stopped_count applications"
echo ""
