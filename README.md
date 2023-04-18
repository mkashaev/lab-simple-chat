# Scalable chat system

## Introduction
Chat systems are a fundamental aspect of modern communication, enabling clients or services itself communicate in real-time. One of the problem of any chat system it is scalability for two or more instances. Throughout this lab, we will implement scalable chat system using React, Node.js, Socket.IO and Redis.

## Background
ReactJS - For web client part <br/> 
NodeJS - Environment for execution javascript as server code <br/>
Socket.IO - Library for realtime communication <br />
Redis - In-memory data storage using as database, cache or message broker <br />
Docker - For up and run containerized Redis instance

## Materials
[Socket.io Docs](https://socket.io/docs/v4/redis-adapter/) <br />
[ioredis Docs](https://ioredis.readthedocs.io/en/stable/README/) <br />
[Docker hub redis](https://hub.docker.com/_/redis) <br />

## Instructions
### Up and run redis instance
```
docker pull redis:alpine
docker run --name chat-redis -p 6379:6379 -d redis
```
To connect to redis-cli
```
docker run -it \             # Run interactive terminal mode
  --link chat-redis:redis \  # Link redis as alias of chat-redis container
  --rm redis \               # Remove docker container when it exist
  redis-cli \                # Run redis-cli
  -h redis \                 # Connect to redis hostname
  -p 6379                    # To port
```

### Setup server
```
npm init -y
npm i express cors socket.io @socket.io/redis-adapter ioredis nodemon
```
1. Create express server
2. Create http server
3. Bind server with socket.io
4. Setup cors for socket.io
```js
const io = socketIO(server, {
  cors: {
    origins: ["*"],
  },
});
```
5. Create pub/sub redis clients
```js
const pubClient = new Redis();
const subClient = new Redis();
```
6. Setup adapter for socket.io
```js
io.adapter(createAdapter(pubClient, subClient));
```
7. Handle socket events
```js
io.on("connection", (socket) => { ... })
```
8. 3 types of emiting messages
```js
socket.emit("message", message);             // Emit to current connection
io.emit("message", message);                 // Emit broadcast
socket.broadcast.emit("message", message);   // Emit broadcast expect sender
```
### Start two instances of the server
```
PORT=3001 nodemon ./src/index.js
PORT=3002 nodemon ./src/index.js
```

### Setup client
```
npm create vite@latest
cd ./<promect-name>
npm i
npm i socket.io-client
```
1. Write component that have two forms, one for server port, one for sending message and list of incomed messages
2. Connect to socket which user input and save socket in state
```jsx
const newSocket = socketIOClient(`http://localhost:${port}`);
setSocket(newSocket);
```
3. Listen messages and update message list state
```js
newSocket.on("message", (message) => {
  setMessages((prevMessages: any) => [...prevMessages, message]);
});
```
4. Disconnect after component unmount
```js
React.useEffect(() => {
  return () => {
    if (socket) socket.disconnect();
  };
}, []);
```
### Run client and make two tabs
```
npm run dev
```
1. On one tab connect to 3001 port on another to 3002
2. Put messages to each browser
3. You should see the same messages on both

## Results
During this lab, we successfully designed and built a simple chat application using JavaScript, Node.js, Socket.IO and Redis that can be scalable on several instances.

## Discussion and conclusion

## Furhter readings as resources
Rooms <br />
Namespaces <br />
Authorization <br />
Notifications <br />
History <br />
Files <br />
