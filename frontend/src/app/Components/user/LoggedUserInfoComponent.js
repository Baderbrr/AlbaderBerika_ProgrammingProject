import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function LoggedUserInfoComponent() {
  const { first_name, last_name, nick_name, id } = useSelector(
    (state) => state.authUserData.userData
  );

  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        onClick={() => navigate(`/profile/${id}`)}
        style={{ cursor: "pointer" }}
      >
        <h2 style={{ fontSize: "20px", marginLeft: "5px" }}>
          You are logged as:
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={
              "https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg"
            }
            style={{
              width: "40px",
              borderRadius: "50%",
              margin: "10px",
              marginRight: "10px",
            }}
          />
          <h2 style={{ fontSize: "20px" }}>
            {first_name} {last_name}{" "}
            <p
              style={{
                color: "black",
                marginLeft: "0px",
                fontSize: "17px",
                marginTop: "3px",
                marginBottom: "2px",
              }}
            >
              {" "}
              {nick_name}
            </p>
          </h2>
        </div>
      </div>
    </div>
  );
}

export default LoggedUserInfoComponent;
