import { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { editProfile } from "../../../../../api";

function EditProfileModal({ hide, show, userInfo }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickName, setNickName] = useState("");
  //   const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");

  const handleFileChange = (e) => {
    console.log("changefile");
    console.log(e);
    const file = e.target.files[0];
    console.log(file);
    // setAvatar(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("first_name", firstName);
    data.append("last_name", lastName);
    data.append("nick_name", nickName);
    data.append("bio", bio);
    // data.append("avatar", avatar);
    editProfile(data).then(function (response) {
      if (response.status === 200) {
        hide();
        window.location.reload();
      }
    });
  };

  return (
    <Modal
      show={show}
      centered={true}
      className="loginModal"
      onHide={() => hide()}
    >
      <Modal.Header style={{ justifyContent: "center" }}>
        <Modal.Title>Edit your profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              placeholder={userInfo.first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              placeholder={userInfo.last_name}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="nickname">
            <Form.Label>Nickname</Form.Label>
            <Form.Control
              type="text"
              name="nickname"
              placeholder={userInfo.nick_name}
              onChange={(e) => setNickName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="bio">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="bio"
              placeholder={userInfo.bio ? userInfo.bio : ""}
              onChange={(e) => setBio(e.target.value)}
            />
          </Form.Group>

          {/* <Form.Group controlId="avatar">
            <Form.Label>Avatar</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group> */}
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
          <Button
            variant="dark"
            onClick={handleSubmit}
            style={{ width: "100%" }}
          >
            Save
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default EditProfileModal;
