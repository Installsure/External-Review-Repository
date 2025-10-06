#!/bin/bash
# Test All Applications Script - Cross-Platform
# External Review Repository
# Last Updated: 2025-10-06
# Production Hardening - Phase 1

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Running All Tests (Production Mode)...${NC}"
echo -e "${CYAN}=================================${NC}"

# Run preflight checks first
echo -e "${YELLOW}🔍 Running preflight checks...${NC}"
if ./tools/preflight-check.sh; then
    echo -e "   ${GREEN}✅ Preflight checks passed${NC}"
else
    echo -e "   ${RED}❌ Preflight checks failed. Some tests may not run properly.${NC}"
    echo -e "   ${YELLOW}⚠️  Continuing with tests anyway...${NC}"
fi

# Enhanced function to run tests with better reporting
test_app() {
    local app_name="$1"
    local app_path="$2"
    local test_type="$3"
    local critical="${4:-false}"
    
    echo -e "\n${YELLOW}🔄 Testing $app_name ($test_type)...${NC}"
    echo -e "   ${GRAY}Path: $app_path${NC}"
    
    if [ ! -d "$app_path" ]; then
        echo -e "   ${RED}❌ Application path not found: $app_path${NC}"
        if [ "$critical" = "true" ]; then
            echo -e "   ${RED}🚨 Critical application test failed!${NC}"
            return 1
        fi
        return 1
    fi
    
    local original_location=$(pwd)
    cd "$app_path"
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        echo -e "   ${RED}❌ package.json not found${NC}"
        cd "$original_location"
        if [ "$critical" = "true" ]; then
            return 1
        fi
        return 1
    fi
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo -e "   ${BLUE}📦 Installing dependencies...${NC}"
        npm install --silent
    fi
    
    # Check if test script exists
    if ! npm run "$test_type" --silent 2>/dev/null | grep -q "Missing script"; then
        # Run different types of tests
        case "$test_type" in
            "test")
                echo -e "   ${GRAY}🧪 Running unit tests...${NC}"
                if npm run test >/dev/null 2>&1; then
                    echo -e "   ${GREEN}✅ Unit tests passed${NC}"
                    cd "$original_location"
                    return 0
                else
                    echo -e "   ${RED}❌ Unit tests failed${NC}"
                    if [ "$critical" = "true" ]; then
                        echo -e "   ${RED}🚨 Critical test failure!${NC}"
                    fi
                    cd "$original_location"
                    return 1
                fi
                ;;
            "build")
                echo -e "   ${GRAY}🔨 Testing build process...${NC}"
                if npm run build >/dev/null 2>&1; then
                    echo -e "   ${GREEN}✅ Build tests passed${NC}"
                    cd "$original_location"
                    return 0
                else
                    echo -e "   ${RED}❌ Build tests failed${NC}"
                    if [ "$critical" = "true" ]; then
                        echo -e "   ${RED}🚨 Critical build failure!${NC}"
                    fi
                    cd "$original_location"
                    return 1
                fi
                ;;
            "lint")
                echo -e "   ${GRAY}📝 Running linting...${NC}"
                if npm run lint >/dev/null 2>&1; then
                    echo -e "   ${GREEN}✅ Lint tests passed${NC}"
                    cd "$original_location"
                    return 0
                else
                    echo -e "   ${RED}❌ Lint tests failed${NC}"
                    cd "$original_location"
                    return 1
                fi
                ;;
            *)
                echo -e "   ${GRAY}🧪 Running default tests...${NC}"
                if npm run test >/dev/null 2>&1; then
                    echo -e "   ${GREEN}✅ Tests passed${NC}"
                    cd "$original_location"
                    return 0
                else
                    echo -e "   ${RED}❌ Tests failed${NC}"
                    cd "$original_location"
                    return 1
                fi
                ;;
        esac
    else
        echo -e "   ${YELLOW}⚠️  No $test_type script found${NC}"
        cd "$original_location"
        return 0  # Not a failure, just no tests
    fi
}

# Enhanced health check function
test_health_check() {
    local app_name="$1"
    local url="$2"
    local port="$3"
    
    echo -e "\n${YELLOW}🔄 Health check for $app_name...${NC}"
    
    if curl -s --max-time 10 "$url" >/dev/null 2>&1; then
        echo -e "   ${GREEN}✅ $app_name is healthy (Port $port)${NC}"
        return 0
    else
        echo -e "   ${RED}❌ $app_name health check failed${NC}"
        return 1
    fi
}

# Test results tracking with enhanced categories
declare -A unit_results
declare -A build_results
declare -A lint_results
declare -A health_results

critical_tests_failed=false

# Core applications (Critical for production)
echo -e "\n${CYAN}🎯 Testing Core Applications...${NC}"
echo -e "${CYAN}=================================${NC}"

core_apps=(
    "InstallSure Frontend:applications/installsure/frontend:true"
    "InstallSure Backend:applications/installsure/backend:true"
    "Demo Dashboard:applications/demo-dashboard:false"
)

for app_info in "${core_apps[@]}"; do
    IFS=':' read -r app_name app_path critical <<< "$app_info"
    
    echo -e "\n${WHITE}📋 Testing $app_name (Critical: $critical)...${NC}"
    
    # Unit tests
    if test_app "$app_name" "$app_path" "test" "$critical"; then
        unit_results["$app_name"]=true
    else
        unit_results["$app_name"]=false
    fi
    
    # Build tests
    if test_app "$app_name" "$app_path" "build" "$critical"; then
        build_results["$app_name"]=true
    else
        build_results["$app_name"]=false
    fi
    
    # Lint tests
    if test_app "$app_name" "$app_path" "lint" "$critical"; then
        lint_results["$app_name"]=true
    else
        lint_results["$app_name"]=false
    fi
    
    # Track critical failures
    if [ "$critical" = "true" ] && ([ "${unit_results[$app_name]}" = "false" ] || [ "${build_results[$app_name]}" = "false" ]); then
        critical_tests_failed=true
        echo -e "   ${RED}🚨 CRITICAL APPLICATION FAILED TESTS!${NC}"
    fi
done

# Optional applications (Development/Demo)
echo -e "\n${CYAN}📱 Testing Optional Applications...${NC}"
echo -e "${CYAN}=================================${NC}"

optional_apps=(
    "FF4U:applications/ff4u"
    "RedEye:applications/redeye"
    "ZeroStack:applications/zerostack"
    "Hello:applications/hello"
    "Avatar:applications/avatar"
)

for app_info in "${optional_apps[@]}"; do
    IFS=':' read -r app_name app_path <<< "$app_info"
    
    echo -e "\n${WHITE}📋 Testing $app_name (Optional)...${NC}"
    
    # Unit tests
    if test_app "$app_name" "$app_path" "test" "false"; then
        unit_results["$app_name"]=true
    else
        unit_results["$app_name"]=false
    fi
    
    # Build tests
    if test_app "$app_name" "$app_path" "build" "false"; then
        build_results["$app_name"]=true
    else
        build_results["$app_name"]=false
    fi
    
    # Lint tests
    if test_app "$app_name" "$app_path" "lint" "false"; then
        lint_results["$app_name"]=true
    else
        lint_results["$app_name"]=false
    fi
done

# Health checks (if applications are running)
echo -e "\n${CYAN}🏥 Running Health Checks...${NC}"
echo -e "${CYAN}=================================${NC}"

health_checks=(
    "InstallSure Frontend:http://localhost:3000:3000"
    "Demo Dashboard:http://localhost:3001:3001"
    "InstallSure Backend:http://localhost:8000/api/health:8000"
)

for check_info in "${health_checks[@]}"; do
    IFS=':' read -r check_name check_url check_port <<< "$check_info"
    
    if test_health_check "$check_name" "$check_url" "$check_port"; then
        health_results["$check_name"]=true
    else
        health_results["$check_name"]=false
    fi
done

# Enhanced Test Summary with Production Readiness Assessment
echo -e "\n${CYAN}📊 Comprehensive Test Results...${NC}"
echo -e "${CYAN}=================================${NC}"

show_test_category() {
    local category="$1"
    local -n results_ref=$2
    
    echo -e "\n${YELLOW}$category Tests:${NC}"
    for app in "${!results_ref[@]}"; do
        if [ "${results_ref[$app]}" = "true" ]; then
            echo -e "   ${GREEN}$app: ✅ PASSED${NC}"
        else
            echo -e "   ${RED}$app: ❌ FAILED${NC}"
        fi
    done
}

show_test_category "📝 Unit" unit_results
show_test_category "🔨 Build" build_results
show_test_category "📋 Lint" lint_results
show_test_category "🏥 Health" health_results

# Calculate statistics
unit_passed=0
unit_total=${#unit_results[@]}
for result in "${unit_results[@]}"; do
    [ "$result" = "true" ] && ((unit_passed++))
done

build_passed=0
build_total=${#build_results[@]}
for result in "${build_results[@]}"; do
    [ "$result" = "true" ] && ((build_passed++))
done

lint_passed=0
lint_total=${#lint_results[@]}
for result in "${lint_results[@]}"; do
    [ "$result" = "true" ] && ((lint_passed++))
done

health_passed=0
health_total=${#health_results[@]}
for result in "${health_results[@]}"; do
    [ "$result" = "true" ] && ((health_passed++))
done

echo -e "\n${CYAN}📈 Test Statistics:${NC}"
echo -e "   ${WHITE}Unit Tests:   $unit_passed/$unit_total passed${NC}"
echo -e "   ${WHITE}Build Tests:  $build_passed/$build_total passed${NC}"
echo -e "   ${WHITE}Lint Tests:   $lint_passed/$lint_total passed${NC}"
echo -e "   ${WHITE}Health Checks: $health_passed/$health_total passed${NC}"

# Production Readiness Assessment
echo -e "\n${CYAN}🏭 Production Readiness Assessment${NC}"
echo -e "${CYAN}=================================${NC}"

production_ready=true
critical_apps_healthy=true

# Check critical applications
for app_info in "${core_apps[@]}"; do
    IFS=':' read -r app_name app_path critical <<< "$app_info"
    
    if [ "$critical" = "true" ]; then
        unit_passed_val="${unit_results[$app_name]}"
        build_passed_val="${build_results[$app_name]}"
        health_passed_val="${health_results[$app_name]:-false}"
        
        if [ "$unit_passed_val" = "false" ] || [ "$build_passed_val" = "false" ]; then
            production_ready=false
            echo -e "${RED}❌ CRITICAL: $app_name failed essential tests${NC}"
        fi
        
        if [ "$health_passed_val" = "false" ]; then
            critical_apps_healthy=false
            echo -e "${YELLOW}⚠️  WARNING: $app_name not currently running${NC}"
        fi
    fi
done

# Final assessment
if [ "$critical_tests_failed" = "true" ]; then
    echo -e "\n${RED}🚨 SYSTEM NOT READY FOR PRODUCTION${NC}"
    echo -e "${RED}=================================${NC}"
    echo -e "${RED}❌ Critical applications have failing tests${NC}"
    echo -e "${YELLOW}🔧 Fix critical issues before deployment${NC}"
elif [ "$production_ready" = "true" ] && [ "$critical_apps_healthy" = "true" ]; then
    echo -e "\n${GREEN}✅ SYSTEM READY FOR PRODUCTION${NC}"
    echo -e "${GREEN}=================================${NC}"
    echo -e "${GREEN}✅ All critical tests passing${NC}"
    echo -e "${GREEN}✅ All critical applications healthy${NC}"
    echo -e "${GREEN}🚀 Ready for production deployment${NC}"
elif [ "$production_ready" = "true" ]; then
    echo -e "\n${YELLOW}⚠️  SYSTEM TESTS PASSED - SERVICES NOT RUNNING${NC}"
    echo -e "${YELLOW}=================================${NC}"
    echo -e "${GREEN}✅ All tests pass but services need to be started${NC}"
    echo -e "${CYAN}🚀 Run ./scripts/start-all.sh to start services${NC}"
else
    echo -e "\n${RED}❌ SYSTEM HAS ISSUES${NC}"
    echo -e "${RED}=================================${NC}"
    echo -e "${YELLOW}⚠️  Some tests failing or applications not responding${NC}"
    echo -e "${YELLOW}🔧 Review test results and fix issues${NC}"
fi

echo -e "\n${CYAN}💡 Management Commands:${NC}"
echo -e "   ${GRAY}• Start All:  ./scripts/start-all.sh${NC}"
echo -e "   ${GRAY}• Stop All:   ./scripts/stop-all.sh${NC}"
echo -e "   ${GRAY}• Preflight:  ./tools/preflight-check.sh${NC}"