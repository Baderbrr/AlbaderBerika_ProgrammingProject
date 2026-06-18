import React, { useState, useEffect, useRef } from "react";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AiOutlineSend } from "react-icons/ai";
import { Col, Row } from "react-bootstrap";
import MessageComponent from "./MessageComponent";
import "./style.css";

function ChatMiddleColumnComponent({ conversation_id }) {
  const { id, access: access_token } = useSelector(
    (state) => state.authUserData.userData
  );
  const [receivedMessages, setReceivedMessages] = useState([]);
  const socketRef = useRef(null);
  const messageContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the container
    messageContainerRef.current.scrollTop =
      messageContainerRef.current.scrollHeight;
  }, [receivedMessages]);

  useEffect(() => {
    // Create a new WebSocket instance
    const socket = new WebSocket(
      `ws://127.0.0.1:8000/chat/ws/${conversation_id}/?token=${access_token}`
    );

    // Assign the socket to the ref variable
    socketRef.current = socket;

    // Event handler for successful connection
    socket.onopen = () => {
      console.log("Websocket connection established");
    };

    // Event handler for receiving messages from the server
    socket.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setReceivedMessages((prev) => [...prev, newMessage]);
      console.log(event.data);
    };

    // Event handler for WebSocket errors
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Event handler for WebSocket connection closure
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Clean up the WebSocket connection when the component is unmounted
    return () => {
      socket.close();
    };
  }, [conversation_id, access_token]);

  const sendMessage = (msg) => {
    const data = {
      owner: id,
      message: msg,
    };
    const jsonData = JSON.stringify(data);
    socketRef.current.send(jsonData);
  };

  console.log("received", receivedMessages);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "90vh",
        marginTop: "40px",
      }}
    >
      <div
        className="messages-container"
        style={{
          maxHeight: "80vh",
          overflow: "auto",
        }}
        ref={messageContainerRef}
      >
        {receivedMessages.map((message) => (
          <MessageComponent data={message} key={message.timestamp} />
        ))}
        <div style={{ position: "fixed", bottom: "0", width: "40vw" }}>
          <Row>
            <Col lg={11}>
              <Form>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Control
                    style={{
                      backgroundColor: "rgb(31, 38, 38",
                      border: "none",
                      color: "white",
                    }}
                    as="textarea"
                    rows={1}
                    // onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                </Form.Group>
              </Form>
            </Col>
            <Col style={{ padding: "0" }}>
              <AiOutlineSend
                size={34}
                style={{ marginTop: "4px" }}
                color="rgb(229, 161, 242"
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default ChatMiddleColumnComponent;
