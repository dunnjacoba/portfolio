import React, { useCallback, useState, useEffect, useContext } from 'react';
import { chatAreaPropTypes } from '../../../schema/chatSchema';
import { GrSend } from 'react-icons/gr';
import { Card, Row, Col, Form } from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import logger from 'debug';
import Loader from './Loader';
import { messagesService } from '../../../services/messagesService';
import UserMessage from '../../../components/messenges/UserMessage';
import ContextHolder from '../../../helpers/ContextHolder';

const _logger = logger.extend('ChatArea');

const ChatArea = (props) => {
    const currentUser = useContext(ContextHolder).user;
    const [loading, setLoading] = useState(false);
    const [userMessages, setUserMessages] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messageToSend, setMessageToSend] = useState({
        message: '',
        subject: '',
        recipientId: 0,
        senderId: currentUser.id,
        dateSent: new Date().toLocaleDateString(),
        dateRead: new Date().toLocaleDateString(),
    });
    const [toUser, setToUser] = useState({
        id: 1,
        userId: 0,
        firstName: '',
        lastName: '',
        mi: '',
        avatarUrl: '',
    });

    const getMessagesForUser = useCallback(() => {
        if (toUser) {
            setLoading(true);
            setTimeout(() => {
                setUserMessages([
                    ...messages.filter(
                        (m) =>
                            (m.recipientId === toUser.id && m.senderId === currentUser.id) ||
                            (toUser.id === m.senderId && m.recipientId === currentUser.id)
                    ),
                ]);
                setLoading(false);
            }, 750);
        }
    }, [toUser]);

    useEffect(() => {
        allMessages();
        setToUser(props.selectedUser);
    }, [props.selectedUser]);

    useEffect(() => {
        getMessagesForUser();
    }, [getMessagesForUser]);

    const handleChange = (e) => {
        const thisMessage = e.target.value;
        setMessageToSend((prevState) => {
            let cm = { ...prevState };
            cm.message = thisMessage;
            cm.senderId = currentUser.id;
            cm.recipientId = props.selectedUser.id;
            return cm;
        });
    };

    const sendMessage = () => {
        props.messageChat(messageToSend.recipientId, messageToSend).then(addMessageSuccess).catch(addMessageErr); //messagesService.addMessage(messageToSend)
    };

    const addMessageSuccess = (response) => {
        _logger(response);
        resetField();
    };

    const resetField = () => {
        setMessageToSend((prevState) => {
            let cm = { ...prevState };
            cm.message = '';
            cm.senderId = currentUser.id;
            cm.recipientId = props.selectedUser.id;
            return cm;
        });
    };

    const addMessageErr = (err) => {
        _logger(err);
    };
    const allMessages = () => {
        messagesService.getAllMessages(0, 100).then(onAllMessagesSuccess).catch(onAllMessagesErr);
    };

    const onAllMessagesSuccess = (response) => {
        setMessages(response.item.pagedItems);
    };

    const onAllMessagesErr = (err) => {
        _logger(err);
    };

    const MapMessages = (message) => {
        return <UserMessage key={message.id} currentUser={currentUser} message={message} toUser={toUser} />;
    };

    return (
        <>
            <Card>
                <Card.Body className="position-relative px-0 pb-0">
                    {loading && <Loader />}

                    <SimpleBar style={{ height: '538px', width: '100%' }}>
                        <ul className="conversation-list px-3">{userMessages.map(MapMessages)}</ul>
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
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-sm-auto">
                                            <div className="btn-group">
                                                <button
                                                    onClick={props.SendMessage(messageToSend)}
                                                    type="submit"
                                                    className="btn btn-success chat-send btn-block">
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
