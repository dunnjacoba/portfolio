import React from "react";
import { Dropdown } from "react-bootstrap";
import { FaEllipsisV } from "react-icons/fa";
import { userMessagePropTypes } from "../../schema/chatSchema";
import classnames from "classnames";

const UserMessage = (props) => {
  if (props.message.senderId === props.toUser.userId) {
    return (
      <li
        className={classnames("clearfix", {
          odd: props.message.senderId === props.toUser.userId,
        })}
      >
        <div className="chat-avatar" height="50">
          <img src={props.toUser?.avatarUrl} className="rounded" alt="" />
          <i>{props.toUser.firstName}</i>
        </div>

        <div className="conversation-text">
          <div className="ctext-wrap">
            <p>{props.message?.message}</p>
          </div>
        </div>

        <Dropdown className="conversation-actions" align="end">
          <Dropdown.Toggle
            variant="link"
            className="btn btn-sm btn-link arrow-none shadow-none"
          >
            <FaEllipsisV />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Copy Message</Dropdown.Item>
            <Dropdown.Item>Edit</Dropdown.Item>
            <Dropdown.Item>Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </li>
    );
  } else if (props.message.recipientId === props.toUser.userId) {
    return (
      <li
        className={classnames("clearfix", {
          even: props.message.recipientId === props.currentUser?.userId,
        })}
      >
        <div className="chat-avatar" height="50">
          <img src={props.currentUser?.avatarUrl} className="rounded" alt="" />
          <i>{props.currentUser?.firstName}</i>
        </div>

        <div className="conversation-text">
          <div className="ctext-wrap">
            <p>{props.message?.message}</p>
          </div>
        </div>

        <Dropdown className="conversation-actions" align="end">
          <Dropdown.Toggle
            variant="link"
            className="btn btn-sm btn-link arrow-none shadow-none"
          >
            <FaEllipsisV />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Copy Message</Dropdown.Item>
            <Dropdown.Item>Edit</Dropdown.Item>
            <Dropdown.Item>Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </li>
    );
  } else {
    return (
      <li>
        <div className="conversation-text">
          <div className="ctext-wrap">
            <p>Start a conversation with {props.toUser.firstName}</p>
          </div>
        </div>
      </li>
    );
  }
};

UserMessage.propTypes = userMessagePropTypes;

export default UserMessage;
