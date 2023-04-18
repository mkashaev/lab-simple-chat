docker pull redis:latest
docker run --name chat-redis -p 6379:6379 -d redis