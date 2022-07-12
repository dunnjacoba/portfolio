import React, { useCallback, useState, useEffect } from 'react';
import { chatAreaPropTypes } from '../../../schema/chatSchema';
import { GrSend } from 'react-icons/gr';
import { Card, Row, Col, Form } from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import logger from 'debug';
import Loader from './Loader';
import { messagesService } from '../../../services/messagesService';
import UserMessage from '../../../components/messenges/UserMessage';

const _logger = logger.extend('ChatArea');

const ChatArea = ({ selectedUser }) => {
    const [loading, setLoading] = useState(false);
    const [userMessages, setUserMessages] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messageToSend, setMessageToSend] = useState({
        message: 'chat',
        subject: '',
        recipientId: 6,
        senderId: 626,
        dateSent: new Date().toLocaleDateString(),
        dateRead: new Date().toLocaleDateString(),
    });
    const [toUser] = useState({
        id: 1,
        userId: 0,
        firstName: '',
        lastName: '',
        mi: '',
        avatarUrl: '',
    });

    const getMessagesForUser = useCallback(() => {
        if (selectedUser) {
            setLoading(true);
            setTimeout(() => {
                setUserMessages([
                    ...messages.filter(
                        (m) =>
                            (m.recipientId === toUser.id && m.senderId === selectedUser.id) ||
                            (toUser.id === m.senderId && m.recipientId === selectedUser.id)
                    ),
                ]);
                setLoading(false);
            }, 750);
        }
    }, [selectedUser, toUser]);

    useEffect(() => {
        allMessages();
    }, []);

    useEffect(() => {
        getMessagesForUser();
    }, [getMessagesForUser]);

    const handleSubmit = (e) => {
        e.preventDefault();
        _logger(e.target[0].value);
        setMessageToSend((prevState) => {
            let cm = { ...prevState };
            cm.message = e.target[0].value;
            return cm;
        });
        sendMessage(messageToSend);
    };

    const sendMessage = (msg) => {
        messagesService.addMessage(msg).then(addMessageSuccess).catch(addMessageErr);
    };

    const addMessageSuccess = (response) => {
        _logger(response);
    };

    const addMessageErr = (err) => {
        _logger(err);
    };

    const MapMessages = (message, index) => {
        return <UserMessage key={index} message={messages} toUser={toUser} />;
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
                                <Form noValidate name="chat-form" id="chat-form" onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col mb-2 mb-sm-0">
                                            <Form.Control
                                                type="text"
                                                name="newMessage"
                                                className="border-0, bg-light"
                                                placeholder="Enter your text"
                                                key="newMessage"
                                            />
                                        </div>
                                        <div className="col-sm-auto">
                                            <div className="btn-group">
                                                <button type="submit" className="btn btn-success chat-send btn-block">
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
