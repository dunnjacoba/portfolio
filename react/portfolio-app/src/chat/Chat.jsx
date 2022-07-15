import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import ChatUsers from './ChatUsers';
import ChatArea from './ChatArea';
import * as helper from '../../../services/serviceHelpers';
import debug from 'debug';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const _logger = debug.extend('ChatApp');

const ChatApp = () => {
    const [selectedUser, setSelectedUser] = useState();
    const [conn, setConn] = useState();
    useEffect(async () => {
        const connection = new HubConnectionBuilder()
            .withUrl(`${helper.API_HOST_PREFIX}/chatHub`)
            .withAutomaticReconnect([0, 0, 10000])
            .configureLogging(LogLevel.Information)
            .build();

        startHubConnection(connection);

        connection.on('ReceiveConnId', (connId) => {
            _logger(connId);
        });

        connection.on('ReceiveMessage', (message) => {
            _logger(message);
        });
    }, []);

    const startHubConnection = (conn) => {
        conn.start().then(() => {
            setConn(conn);
            _logger('Conn', conn);
        });
    };

    const constructJSON = (message) => {
        _logger(message);
        return JSON.stringify({
            From: conn.innerHTML.substring(8, conn.innerHTML.length),
            To: selectedUser.Id,
            Message: message,
        });
    };
    const SendMessage = () => {
        if (conn.state) {
            conn.invoke('SendMessageAsync', (message) => {
                constructJSON(selectedUser, message);
            });
        }
    };

    return (
        <>
            <Row>
                <Col xxl={3} xl={{ span: 6, order: 1 }}>
                    <ChatUsers selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                </Col>

                <Col xxl={6} xl={{ span: 6, order: 2 }}>
                    <ChatArea selectedUser={selectedUser} SendMessage={SendMessage} />
                </Col>
            </Row>
        </>
    );
};

export default ChatApp;
