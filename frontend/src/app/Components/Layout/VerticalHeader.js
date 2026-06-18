import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BsDot } from "react-icons/bs";
import { Link } from "react-router-dom";
import { logout } from "../../../features/loginSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function VerticalHeader() {
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.authUserData.userData);

  const logoutHandle = () => {
    dispatch(logout());
    window.location.reload();
  };

  return (
    <Col className="VerticalHeader">
      <Row className="mb-5 Logo">Chat app</Row>
      <Row>
        <p>
          <BsDot size={32} />
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            Home
          </Link>
        </p>
        <p>
          <BsDot size={32} />
          <Link to="/chat" style={{ textDecoration: "none", color: "white" }}>
            Chat
          </Link>
        </p>
        <p>
          <BsDot size={32} />
          <Link
            to={`/profile/${id}`}
            style={{ textDecoration: "none", color: "white" }}
          >
            Profile
          </Link>
        </p>
        <p>
          <BsDot size={32} />
          <Link
            to={`/friend_requests`}
            style={{ textDecoration: "none", color: "white" }}
          >
            Requests
          </Link>
        </p>
        <p>
          <BsDot size={32} />
          <Link
            onClick={logoutHandle}
            style={{
              textDecoration: "none",
              color: "white",
            }}
          >
            Logout
          </Link>
        </p>
      </Row>
    </Col>
  );
}

export default VerticalHeader;
