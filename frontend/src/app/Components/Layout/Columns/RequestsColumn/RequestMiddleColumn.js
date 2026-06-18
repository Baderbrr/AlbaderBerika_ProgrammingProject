import React, { useEffect, useState } from "react";
import FriendComponent from "../FriendColumn/FriendComponent";
import { getAllFriendRequests } from "../../../../../api";

function RequestMiddleColumn() {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    getAllFriendRequests().then(function (response) {
      if (response.status === 200) {
        setFriendRequests(response.data);
      }
    });
  }, []);

  return (
    <div>
      {friendRequests.length === 0 ? (
        <h1>You don't have any friend requests</h1>
      ) : (
        friendRequests?.map((request) => (
          <FriendComponent friend={request.request_from} key={request.id} />
        ))
      )}
    </div>
  );
}

export default RequestMiddleColumn;
