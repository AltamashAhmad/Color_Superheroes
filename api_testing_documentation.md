
# API Testing Documentation

## Prerequisites
- Node.js and npm installed
- Redis server running
- cURL or Postman for testing

## Setup
1. Start Redis server:
```bash
brew services start redis
```

2. Start the application:
```bash
npm start
```

## API Endpoints Testing

### 1. Health Check
```bash
curl http://localhost:3000/health
```
**Expected Response:**
```json
{
  "status": "success",
  "message": "Service is healthy",
  "redis": "connected"
}
```

### 2. Submit Analytics Data

#### a. Basic Submit (Free Tier)
```bash
curl -X POST http://localhost:3000/api/v1/analytics/submit   -H "Content-Type: application/json"   -H "X-User-ID: test123"   -H "X-User-Tier: free"   -d '{
    "platform": "twitter",
    "content": "Testing the API #test #nodejs",
    "timestamp": "2024-02-06T12:00:00Z"
  }'
```
**Expected Response:**
```json
{
  "status": "success",
  "submission_id": "<uuid>"
}
```

#### b. Standard Tier Submit
```bash
curl -X POST http://localhost:3000/api/v1/analytics/submit   -H "Content-Type: application/json"   -H "X-User-ID: test123"   -H "X-User-Tier: standard"   -d '{
    "platform": "linkedin",
    "content": "Professional post #career #jobs",
    "timestamp": "2024-02-06T12:00:00Z"
  }'
```

#### c. Premium Tier Submit
```bash
curl -X POST http://localhost:3000/api/v1/analytics/submit   -H "Content-Type: application/json"   -H "X-User-ID: test123"   -H "X-User-Tier: premium"   -d '{
    "platform": "instagram",
    "content": "Premium content #premium #social",
    "timestamp": "2024-02-06T12:00:00Z"
  }'
```

#### d. Test Rate Limiting
```bash
# Run this script to test rate limiting
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/v1/analytics/submit     -H "Content-Type: application/json"     -H "X-User-ID: test123"     -H "X-User-Tier: free"     -d '{
      "platform": "twitter",
      "content": "Rate limit test #test",
      "timestamp": "2024-02-06T12:00:00Z"
    }'
  echo "
"
  sleep 1
done
```
**Expected Response after limit exceeded:**
```json
{
  "status": "error",
  "message": "Rate limit exceeded."
}
```

### 3. Dashboard Analytics

#### a. Basic Dashboard Query
```bash
curl "http://localhost:3000/api/v1/analytics/dashboard?user_id=test123"
```
**Expected Response:**
```json
{
  "mentions_count": 3,
  "top_hashtags": ["test", "nodejs", "career", "jobs", "premium", "social"],
  "sentiment_score": 0.2
}
```

#### b. Platform-Specific Query
```bash
curl "http://localhost:3000/api/v1/analytics/dashboard?user_id=test123&platform=twitter"
```

#### c. Time-Range Query
```bash
curl "http://localhost:3000/api/v1/analytics/dashboard?user_id=test123&start_time=2024-02-06T00:00:00Z&end_time=2024-02-06T23:59:59Z"
```

## Error Cases Testing

### 1. Missing User ID
```bash
curl -X POST http://localhost:3000/api/v1/analytics/submit   -H "Content-Type: application/json"   -H "X-User-Tier: free"   -d '{
    "platform": "twitter",
    "content": "Test content"
  }'
```
**Expected Response:**
```json
{
  "status": "error",
  "message": "Missing X-User-ID header."
}
```

### 2. Invalid Tier
```bash
curl -X POST http://localhost:3000/api/v1/analytics/submit   -H "Content-Type: application/json"   -H "X-User-ID: test123"   -H "X-User-Tier: invalid"   -d '{
    "platform": "twitter",
    "content": "Test content"
  }'
```
**Expected Response:**
```json
{
  "status": "error",
  "message": "Invalid or missing X-User-Tier header."
}
```

### 3. Missing Dashboard User ID
```bash
curl "http://localhost:3000/api/v1/analytics/dashboard"
```
**Expected Response:**
```json
{
  "status": "error",
  "message": "Missing user_id query parameter."
}
```

## Rate Limits
- Free Tier: 10 requests/minute, 100 requests/hour
- Standard Tier: 50 requests/minute, 500 requests/hour
- Premium Tier: 200 requests/minute, 2000 requests/hour

## Testing with Postman
1. Import the following cURL commands into Postman
2. Create a collection for organized testing
3. Use Postman's environment variables for user_id and tier

## Automated Testing Script
```bash
#!/bin/bash

# Test health
echo "Testing Health Endpoint..."
curl http://localhost:3000/health

# Test Submit Endpoint
echo "
Testing Submit Endpoint..."
curl -X POST http://localhost:3000/api/v1/analytics/submit   -H "Content-Type: application/json"   -H "X-User-ID: test123"   -H "X-User-Tier: free"   -d '{
    "platform": "twitter",
    "content": "Testing the API #test #nodejs",
    "timestamp": "2024-02-06T12:00:00Z"
  }'

# Test Dashboard Endpoint
echo "
Testing Dashboard Endpoint..."
curl "http://localhost:3000/api/v1/analytics/dashboard?user_id=test123"

# Test Rate Limiting
echo "
Testing Rate Limiting..."
for i in {1..11}; do
  echo "
Request $i:"
  curl -X POST http://localhost:3000/api/v1/analytics/submit     -H "Content-Type: application/json"     -H "X-User-ID: test123"     -H "X-User-Tier: free"     -d '{
      "platform": "twitter",
      "content": "Rate limit test #test",
      "timestamp": "2024-02-06T12:00:00Z"
    }'
  sleep 1
done
```

Save this script as `test.sh` and run:
```bash
chmod +x test.sh
./test.sh
```

## Common Issues and Troubleshooting
1. Redis Connection Issues
   - Ensure Redis is running: `redis-cli ping`
   - Restart Redis: `brew services restart redis`

2. Rate Limiting Issues
   - Clear Redis cache: `redis-cli FLUSHALL`
   - Check current rate limit count: `redis-cli GET "rate_limit:test123:free:minute"`

3. Server Issues
   - Check server logs
   - Restart the server
   - Verify environment variables
