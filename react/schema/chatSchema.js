import PropTypes from 'prop-types';

const chatAreaPropTypes = {
    chatMessages: PropTypes.arrayOf(PropTypes.shape()),
    selectedUser: PropTypes.shape({
        id: PropTypes.number.isRequired,
        userId: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        mi: PropTypes.string,
        avatarUrl: PropTypes.string.isRequired,
    }),
    useForm: PropTypes.func,
    sendMessage: PropTypes.func,
};

const chatUserPropTypes = {
    users: PropTypes.shape({
        id: PropTypes.number.isRequired,
        userId: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        mi: PropTypes.string,
        avatarUrl: PropTypes.string.isRequired,
    }),
    chatMessages: PropTypes.arrayOf(PropTypes.shape()),
};

const userMessagePropTypes = {
    messages: PropTypes.shape({
        id: PropTypes.number,
        message: PropTypes.shape({
            type: PropTypes.string,
            value: PropTypes.string,
        }),
        to: PropTypes.shape({
            id: PropTypes.number.isRequired,
            userId: PropTypes.number.isRequired,
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
            mi: PropTypes.string,
            avatarUrl: PropTypes.string.isRequired,
        }),
        from: PropTypes.string,
        sendOn: PropTypes.string,
    }),
    chatMessages: PropTypes.arrayOf(PropTypes.shape()),
};

export { chatAreaPropTypes, chatUserPropTypes, userMessagePropTypes };
