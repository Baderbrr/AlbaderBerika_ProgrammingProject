import React, { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../../features/loginSlice";

const LoginModal = ({ userData, loading, error, isAuthenticated }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [show, setShow] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ login: email, password: password }));
  };
  return (
    <>
      <Modal
        show={show}
        centered={true}
        className="loginModal"
        onHide={() => setShow(false)}
        backdrop="static"
      >
        <Modal.Header style={{ justifyContent: "center" }}>
          <Modal.Title>You must be logged in to use application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email">
              <Form.Label className="d-flex justify-content-center">
                Email
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                className="text-center mb-3"
                value={email}
                onChange={handleEmailChange}
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label className="d-flex justify-content-center">
                Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                className="text-center"
                value={password}
                onChange={handlePasswordChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column-reverse" }}>
            {loading && <Spinner animation="border" />}
            {error && (
              <Alert className="mt-2" variant="danger">
                {error} try later
              </Alert>
            )}
            <Button
              variant="dark"
              onClick={handleSubmit}
              style={{ width: "100%" }}
            >
              Login
            </Button>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <p>Don't have account ?</p>
            <p
              style={{
                textDecoration: "underline",
                marginLeft: "4px",
                cursor: "pointer",
              }}
              onClick={() => navigate("/register")}
            >
              Register
            </p>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LoginModal;
