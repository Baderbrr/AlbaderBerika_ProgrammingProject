import React, { useState, useEffect } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { getUsers } from "../../../../../api";
import { Dropdown } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import FriendComponent from "./FriendComponent";
import { getAllFriends } from "../../../../../api";

function FriendsMiddleColumn() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { userData } = useSelector((state) => state.authUserData);
  // const { friends } = useSelector((state) => state.authUserData);
  const [friends, setFriends] = useState([])

  const onSearch = async (query) => {
    // Make an API call to search for results based on the query
    // and update the results state with the response
    await getUsers(query)
      .then((data) => setResults(data))
      .catch(function (error) {
        throw error;
      });
  };
  useEffect(() => {
    if (query !== "") {
      const delayDebounceFn = setTimeout(() => {
        onSearch(query);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [query]);

  useEffect(() =>{
    getAllFriends().then(function(response){
      if(response.status === 200){
        setFriends(response.data)
        console.log(response.data)
        sessionStorage.setItem("friends", JSON.stringify(response.data));
      }
    })
  }, [])

  const handleSearch = (event) => {
    setQuery(event.target.value);
  };

  return (
    <>
      <Form style={{ maxWidth: "400px" }} className="mx-auto mt-3">
        <Form.Control
          type="text"
          placeholder="Look for friends"
          className="mr-sm-2 rounded-pill mb-3 text-center"
          style={{
            background: "black",
            borderWidth: "3px",
            color: "whitesmoke",
          }}
          value={query}
          onChange={handleSearch}
        />
      </Form>
      <Dropdown>
        {results?.length > 0 &&
          results.map((result, index) => (
            <Dropdown.Item key={index} style={{ textAlign: "center" }}>
              <h4 onClick={() => navigate(`/profile/${result.id}`)}>
                <Image
                  style={{
                    width: "100px",
                    height: "100px",
                    marginRight: "15px",
                  }}
                  src={
                    "https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg"
                  }
                  roundedCircle
                />
                {result.first_name} {result.last_name}
              </h4>
            </Dropdown.Item>
          ))}
      </Dropdown>
      {friends.length === 0 ? (
        <h1>You have no friends yet!</h1>
      ) : (
        <div style={{ marginTop: "5vh" }}>
          <Row>
            {friends?.map((friend) => (
              <Col md={6} key={friend.id}>
                <FriendComponent friend={friend} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </>
  );
}

export default FriendsMiddleColumn;
