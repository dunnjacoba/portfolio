import axios from 'axios';
import * as helper from './serviceHelpers';

const getAllMessages = (pageIndex, pageSize) => {
    const config = {
        method: 'GET',
        url: `${helper.API_HOST_PREFIX}/api/messages/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        crossdomain: true,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const addMessage = (payload) => {
    const config = {
        method: 'POST',
        url: `${helper.API_HOST_PREFIX}/api/messages`,
        data: payload,
        crossdomain: true,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const messagesByRece = (pageIndex, pageSize, userId) => {
    const config = {
        method: 'GET',
        url: `${helper.API_HOST_PREFIX}/api/messages/paginate/rece?pageIndex=${pageIndex}&pageSize=${pageSize}&recipientId=${userId}`,
        crossdomain: true,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const messagesService = {
    getAllMessages,
    addMessage,
    messagesByRece,
};

export { messagesService };
