import React, { useState, useEffect, useContext } from "react";
import { chatAreaPropTypes } from "../../../schema/chatSchema";
import { GrSend } from "react-icons/gr";
import { Card, Row, Col, Form } from "react-bootstrap";
import SimpleBar from "simplebar-react";
import logger from "debug";
import Loader from "./Loader";
import { messagesService } from "../../../services/messagesService";
import UserMessage from "../../../components/messages/UserMessage";
import ContextHolder from "../../../helpers/ContextHolder";
import userProfileServices from "../../../services/userProfileSerivce";

const _logger = logger.extend("ChatArea");

const ChatArea = (props) => {
  const currentUser = useContext(ContextHolder).user;
  const [currentProfile, setCurrentProfile] = useState();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageToSend, setMessageToSend] = useState({
    message: "",
    subject: "",
    recipientId: 0,
    senderId: currentUser.id,
    dateSent: new Date().toLocaleDateString(),
    dateRead: new Date().toLocaleDateString(),
  });
  const [toUser, setToUser] = useState({
    id: 1,
    userId: 0,
    firstName: "",
    lastName: "",
    mi: "",
    avatarUrl: "",
  });

  useEffect(() => {
    getProfileData(currentUser.id);
  }, [currentUser]);

  useEffect(() => {
    setToUser(props.selectedUser);
    getMessages(props.selectedUser?.userId);
  }, [props.selectedUser]);

  const handleChange = (e) => {
    const thisMessage = e.target.value;
    setMessageToSend((prevState) => {
      let cm = { ...prevState };
      cm.message = thisMessage;
      cm.senderId = currentUser.id;
      cm.recipientId = props.selectedUser?.userId;
      return cm;
    });
  };

  const getProfileData = () => {
    userProfileServices
      .getProfileByUserProfileId(currentUser?.id)
      .then(getCurrentProfileSuccess)
      .catch(getCurrentProfileErr);
  };

  const getCurrentProfileSuccess = (response) => {
    setCurrentProfile(response.data.item);
  };

  const getCurrentProfileErr = (err) => _logger(err);

  const getMessages = (userId) => {
    messagesService
      .messagesByRece(0, 1000, userId)
      .then(onGetMessagesSuccess)
      .catch(onGetMessagesErr);
  };

  const onGetMessagesSuccess = (response) => {
    setLoading(true);
    setTimeout(() => {
      setMessages(response.item.pagedItems);
      setLoading(false);
    }, 650);
  };

  const onGetMessagesErr = () => {
    setLoading(true);
    setTimeout(() => {
      setMessages([]);
      setLoading(false);
    }, 650);
  };

  const MapMessages = (message) => {
    return (
      <UserMessage
        key={message.id}
        currentUser={currentProfile}
        message={message}
        toUser={toUser}
      />
    );
  };

  const setTheMessage = () => {
    _logger(messageToSend);
    props.SendMessage(messageToSend);
    setMessageToSend((prevState) => {
      let cm = { ...prevState };
      cm.message = "";
      return cm;
    });
    messagesService
      .addMessage(messageToSend)
      .then(addMessageSuccess)
      .catch(addMessageErr);
    setMessages((prevState) => {
      let nm = [...prevState];
      nm.push(messageToSend);
      return nm;
    });
  };

  const addMessageSuccess = (response) => {
    _logger(response);
  };

  const addMessageErr = (err) => {
    _logger.error(err);
  };

  return (
    <>
      <Card>
        <Card.Body className="position-relative px-0 pb-0">
          {loading && <Loader />}

          <SimpleBar style={{ height: "538px", width: "100%" }}>
            <ul className="conversation-list px-3">
              {messages.map(MapMessages)}
            </ul>
          </SimpleBar>

          <Row className="px-3 pb-3">
            <Col>
              <div className="mt-2 bg-light p-3 rounded">
                <Form noValidate name="chat-form" id="chat-form">
                  <div className="row">
                    <div className="col mb-2 mb-sm-0">
                      <Form.Control
                        type="text"
                        name="message"
                        className="border-0, bg-light col-4"
                        placeholder="Enter your text"
                        value={messageToSend.message}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-sm-auto">
                      <div className="btn-group">
                        <button
                          type="button"
                          onClick={setTheMessage}
                          disabled={!toUser || !messageToSend.message}
                          className="btn btn-success chat-send btn-block"
                        >
                          <GrSend />
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

ChatArea.propTypes = chatAreaPropTypes;

export default ChatArea;
