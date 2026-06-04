#!/bin/bash
# Quick test script for the API

echo "🧪 Testing Product Launch Tool API locally..."
echo ""

# Test health endpoint
echo "1. Testing /api/health..."
curl -s http://localhost:8787/api/health | jq . || echo "Health check failed"
echo ""

# Test validation with valid data
echo "2. Testing /api/validate with valid data..."
curl -s -X POST http://localhost:8787/api/validate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "tagline": "Best product ever",
    "description": "Amazing product description",
    "makerComment": "Excited to launch!"
  }' | jq .
echo ""

# Test validation with invalid data
echo "3. Testing /api/validate with missing fields..."
curl -s -X POST http://localhost:8787/api/validate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "tagline": "",
    "description": "",
    "makerComment": ""
  }' | jq .
echo ""

# Test prepare endpoint
echo "4. Testing /api/prepare..."
curl -s -X POST http://localhost:8787/api/prepare \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Product",
    "tagline": "Best product ever",
    "description": "Amazing product description",
    "makerComment": "Excited to launch!",
    "url": "https://example.com",
    "tags": "productivity, tools"
  }' | jq .data.markdown
echo ""

echo "✅ Tests completed!"
