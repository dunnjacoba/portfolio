import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import classnames from "classnames";
import SimpleBar from "simplebar-react";
import userProfileServices from "../../../services/userProfileSerivce";
import { chatUserPropTypes } from "../../../schema/chatSchema";
import Loader from "./Loader";
import logger from "debug";

const _logger = logger.extend("ChatUsers");

const ChatUsers = (props) => {
  const groupFilters = ["All", "Favorties", "Friends"];
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("All");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      userProfileServices
        .getProfiles(0, 100)
        .then(onGetProfilesSuccess)
        .catch(onGetProfilesErr);
      setLoading(false);
    }, 750);
  }, []);

  const onGetProfilesSuccess = (response) => {
    setUser(() => {
      let ud = [...user];
      ud = response.data.item.pagedItems;
      return ud;
    });
  };

  const onGetProfilesErr = (err) => {
    _logger(err);
  };

  const filterUsers = (e, group) => {
    if (setSelectedGroup(group)) {
      setUser(
        group !== "All"
          ? [...user].filter(
              (u) => u.groups.toLowerCase().indexOf(group.toLowerCase()) >= 0
            )
          : [...user]
      );
    } else if (e.target.value) {
      const text = e.target.value;
      setUser(
        text
          ? [...user].filter(
              (u) => u.firstName.toLowerCase().indexOf(text.toLowerCase()) >= 0
            )
          : [...user]
      );
    } else {
      setUser([...user]);
    }
  };

  const activateUser = (user) => {
    _logger(user);
    props.setSelectedUser(user);
  };

  return (
    <>
      {loading && <Loader />}
      <Card>
        <Card.Body className="p-0">
          <ul className="nav nav-tabs nav-bordered">
            {groupFilters.map((group, index) => {
              return (
                <li
                  key={index}
                  className="nav-item"
                  onClick={() => filterUsers(group)}
                >
                  <Link
                    to="#"
                    className={classnames("nav-link", "py-2", {
                      active: selectedGroup === group,
                    })}
                  >
                    {group}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="tab-content">
            <div className="tab-pane show active">
              <div className="app-search p-3">
                <div className="form-group position-relative">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="People, groups & messages..."
                    onChange={filterUsers}
                  />
                  <span className="mdi mdi-magnify search-icon"></span>
                </div>
              </div>

              <SimpleBar
                className="px-3"
                style={{ maxHeight: "550px", width: "100%" }}
              >
                {user.map((user, index) => {
                  return (
                    <Link
                      to="#"
                      key={index}
                      className="text-body"
                      onClick={() => {
                        activateUser(user);
                      }}
                    >
                      <div
                        className={classnames(
                          "d-flex",
                          "align-items-start",
                          "mt-1",
                          "p-2",
                          "border",
                          "shadow",
                          {
                            "bg-light": user?.id === props.selectedUser?.id,
                          }
                        )}
                      >
                        <img
                          src={user.avatarUrl}
                          className="me-2 rounded-circle"
                          height="48"
                          width="48"
                          alt=""
                        />

                        <div className="w-100 overflow-hidden">
                          <h5 className="mt-0 mb-0 font-14">
                            <span className="float-end text-muted font-12">
                              {user.lastMessageOn}
                            </span>
                            {user.firstName}
                          </h5>
                          <p className="mt-1 mb-0 text-muted font-14">
                            <span className="w-25 float-end text-end">
                              {user.totalUnread && (
                                <span className="badge badge-danger-lighten">
                                  {user.totalUnread}
                                </span>
                              )}
                            </span>
                            <span className="w-100">{user.lastName}</span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </SimpleBar>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

ChatUsers.propTypes = chatUserPropTypes;

export default ChatUsers;
