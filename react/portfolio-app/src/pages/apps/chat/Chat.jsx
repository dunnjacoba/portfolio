import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import ChatUsers from "./ChatUsers";
import ChatArea from "./ChatArea";
import debug from "debug";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const _logger = debug.extend("ChatApp");

const ChatApp = () => {
  const [selectedUser, setSelectedUser] = useState();
  const [chatMessages, setChatMessages] = useState([]);
  const [conn, setConn] = useState();
  useEffect(async () => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${API_HOST_PREFIX}/chatHub`)
      .withAutomaticReconnect([0, 0, 10001])
      .configureLogging(LogLevel.Information)
      .build();

    startHubConnection(connection);

    connection.on("ReceiveConnId", (connId) => {
      _logger(connId);
    });

    connection.on("ReceiveMessage", (message) => {
      var newMessage = JSON.parse(message);
      setChatMessages(() => {
        let cm = [];
        cm.push(newMessage.Message);
        return cm;
      });
      _logger(newMessage);
      _logger(chatMessages);
    });
  }, []);

  const startHubConnection = (conn) => {
    conn.start().then(() => {
      setConn(conn);
      _logger("Conn", conn);
    });
  };

  const constructJSON = (message) => {
    SendMessage(
      JSON.stringify({
        From: conn.connectionId,
        To: selectedUser?.userId ? selectedUser.userId : "",
        Message: message,
      })
    );
  };

  const SendMessage = (message) => {
    if (conn?.state === "Connected") {
      conn.invoke("SendMessageAsync", message);
      _logger("Sent", message);
    }
  };

  return (
    <>
      <Row>
        <Col xxl={3} xl={{ span: 6, order: 1 }}>
          <ChatUsers
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        </Col>

        <Col xxl={6} xl={{ span: 6, order: 2 }}>
          <ChatArea
            selectedUser={selectedUser}
            chatMessages={chatMessages}
            SendMessage={constructJSON}
          />
        </Col>
      </Row>
    </>
  );
};

export default ChatApp;
