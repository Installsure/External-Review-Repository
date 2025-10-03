#!/bin/bash
# Cleanup Demo - Remove demo artifacts and temporary files

set -e

echo "🧹 Cleaning up demo artifacts..."
echo "================================"

# Remove sample files
if [ -d samples ]; then
  echo "Removing samples directory..."
  rm -rf samples
fi

# Remove API response files
for file in translate.json sync.json items.json estimate.json; do
  if [ -f "$file" ]; then
    echo "Removing $file..."
    rm -f "$file"
  fi
done

# Remove log files
for file in backend.log frontend.log; do
  if [ -f "$file" ]; then
    echo "Removing $file..."
    rm -f "$file"
  fi
done

# Remove playwright artifacts
if [ -d playwright-report ]; then
  echo "Removing playwright-report directory..."
  rm -rf playwright-report
fi

if [ -d test-results ]; then
  echo "Removing test-results directory..."
  rm -rf test-results
fi

echo ""
echo "✅ Cleanup complete!"
echo "================================"
