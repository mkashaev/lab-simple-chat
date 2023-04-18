import React from "react";
import socketIOClient from "socket.io-client";

const App = () => {
  const [messages, setMessages] = React.useState<any>([]);
  const [messageInput, setMessageInput] = React.useState<string>("");
  const [socket, setSocket] = React.useState<any>(null);
  const [port, setPort] = React.useState<string>("");

  React.useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.emit("message", messageInput);
      setMessageInput("");
    }
  };

  const connectOnPort = () => {
    const newSocket = socketIOClient(`http://localhost:${port}`);
    setSocket(newSocket);
    newSocket.on("message", (message) => {
      setMessages((prevMessages: any) => [...prevMessages, message]);
    });
  };

  return (
    <div>
      <div>
        <label htmlFor="room-port">Inter Room Port</label>
        <br />
        <input
          id="room-port"
          type="text"
          value={port}
          onChange={(event) => setPort(event.target.value)}
        />
        <button onClick={connectOnPort}>Connect</button>
      </div>
      <div>
        <label htmlFor="text">Inter Text</label>
        <br />
        <input
          id="text"
          type="text"
          value={messageInput}
          onChange={(event) => setMessageInput(event.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div>
        {messages.map((message: any, index: number) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    </div>
  );
};

export default App;
