import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import { BsGear } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { getProfile } from "../../../../../api";
import Spinner from "react-bootstrap/Spinner";
import { inviteFriend } from "../../../../../api";
import { acceptFriendInvitation } from "../../../../../api";
import EditProfileModal from "./EditProfileModal";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { acceptFriendInvite } from "../../../../../features/loginSlice";
import { deleteFriend } from "../../../../../api";
import { deleteFriendReducer } from "../../../../../features/loginSlice";

function ProfileMiddleColumn() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [data, setData] = useState();
  const [spinner, setSpinner] = useState(true);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [inviteAFriendButton, setInviteAFriendButton] = useState(false);
  const [friendInvitationExists, setFriendIvitationExists] = useState(false);
  const [
    friendInvitationFromRequestedUserExists,
    setFriendInvitationFromRequestedUserExists,
  ] = useState(false);
  const [deleteFriendButton, setDeleteFriendButton] = useState(false)

  const { id: authenticated_user_id } = useSelector(
    (state) => state.authUserData.userData
  );

  const inviteHandler = () => {
    inviteFriend(id).then(function (response) {
      console.log(response);
      if (response.status === 200 || response.status === 201) {
        setInviteAFriendButton(false);
        setFriendIvitationExists(true);
      }
    });
  };

  const deleteHandler = () =>{
    deleteFriend(id).then(function(response){
      if(response.status === 200){
        setDeleteFriendButton(false)
        dispatch(deleteFriendReducer(id))
      }
    })
  }

  const acceptInvitationHandler = () => {
    acceptFriendInvitation(id).then((response) => {
      if (response.status === 200) {
        dispatch(acceptFriendInvite(response.data));
        setEditProfileModal(false);
        setInviteAFriendButton(false);
        setFriendIvitationExists(false);
        setFriendInvitationFromRequestedUserExists(false);
      }
    });
  };

  const closeModal = () => {
    setEditProfileModal(false);
  };

  useEffect(() => {
    getProfile(id)
      .then((data) => {
        if (data !== undefined) {
          setData(data);
          setSpinner(false);
          if (
            !data.is_friend &&
            !data.authenticated_user &&
            !data.friend_invitation_exists &&
            !data.friend_invitation_from_requested_user_exists
          ) {
            setInviteAFriendButton(true);
          } else if (data.friend_invitation_exists) {
            setFriendIvitationExists(true);
          } else if (data.friend_invitation_from_requested_user_exists) {
            setFriendInvitationFromRequestedUserExists(true);
          }else if (data.is_friend){
            setDeleteFriendButton(true)
          }
        }
      })
      .catch(function (error) {
        throw error;
      });
  }, [id]);
  return spinner ? (
    <Spinner />
  ) : (
    <Container>
      <EditProfileModal
        hide={closeModal}
        show={editProfileModal}
        userInfo={data}
      />
      <Row
        style={{
          backgroundColor: "rgb(102, 174, 255)",
          height: "25vh",
          position: "relative",
        }}
      >
        <Row
          style={{
            backgroundColor: "rgb(0, 140, 255)",
            height: "15vh",
            position: "relative",
            marginLeft: "0px",
          }}
        >
          <div style={{ display: "flex" }}>
            {inviteAFriendButton && (
              <Button
                style={{
                  marginLeft: "83%",
                  maxWidth: "10vw",
                  maxHeight: "3vw",
                  marginTop: "8px",
                }}
                variant="dark"
                onClick={() => inviteHandler()}
              >
                Invite a friend
              </Button>
            )}
            {friendInvitationExists && (
              <p
                style={{
                  marginLeft: "83%",
                  maxWidth: "10vw",
                  maxHeight: "3vw",
                  marginTop: "5px",
                }}
              >
                Friend invitation already sent
              </p>
            )}
            {friendInvitationFromRequestedUserExists && (
              <Button
                style={{
                  marginLeft: "83%",
                  maxWidth: "8vw",
                  maxHeight: "4vw",
                  marginTop: "5px",
                }}
                onClick={() => acceptInvitationHandler()}
              >
                Accept friend request
              </Button>
            )}
            {deleteFriendButton && (
             <Button
             style={{
               marginLeft: "83%",
               maxWidth: "8vw",
               maxHeight: "6vw",
               marginTop: "5px",
             }}
             onClick={() => deleteHandler()}
           >
             Delete Friend
           </Button>
            )

            }
            {data.id === authenticated_user_id && (
              <Button
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "3%",
                  maxWidth: "10px",
                  backgroundColor: "rgb(0, 140, 255)",
                  border: "none",
                }}
              >
                <BsGear
                  size={24}
                  onClick={() => setEditProfileModal((prev) => !prev)}
                />
              </Button>
            )}
          </div>
        </Row>
        {/* set alt later to Image component */}
        <Row>
          <Col style={{ maxWidth: "22vh", maxHeight: "22vh" }}>
            <Image
              style={{
                position: "absolute",
                bottom: "0",
                maxHeight: "22vh",
                maxWidth: "22vh",
                borderRadius: "10%",
              }}
              src={
                "https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg"
              }
            />
          </Col>
          <Col>
            <h2
              className="ProfileName"
              style={{
                color: "white",
                position: "absolute",
                top: "5vh",
              }}
            >
              {data.first_name} {data.last_name}
            </h2>
            <Row
              style={{ justifyContent: "right" }}
              xxl={12}
              lg={12}
              md={3}
              sm={1}
            >
              <Col className="ProfilePostsColumn"></Col>
              <Col className="ProfileFollowersColumn"></Col>
              <Col className="ProfileFollowingColumn">
                <Row>
                  <h2 style={{ textAlign: "center" }}>
                    Friends: {data.number_of_friends}
                  </h2>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Row>
      <Row style={{ marginTop: "3vw" }}>
        <h1 style={{ marginTop: "1vw", marginLeft: "1vw", fontSize: "32px" }}>
          About
        </h1>
        <h3 style={{ marginTop: "1vw", marginLeft: "1vw", fontSize: "22px" }}>
          {data.bio}
        </h3>
      </Row>
    </Container>
  );
}

export default ProfileMiddleColumn;
