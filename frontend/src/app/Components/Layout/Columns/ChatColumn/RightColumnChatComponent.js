import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FriendComponent from "../FriendColumn/FriendComponent";
import { getAllFriends } from "../../../../../api";
// This component works as a friend list
function RightColumnChatComponent() {
  // const { friends } = useSelector((state) => state.authUserData);
  const [friends, setFriends] = useState([])

  useEffect(() =>{
    getAllFriends().then(function(response){
      if(response.status === 200){
        setFriends(response.data)
      }
    })
  }, [])

  return (
    <div>
      {friends.map((friend) => (
        <FriendComponent
          friend={friend}
          key={friend.id}
          onClickOpenChat={true}
        />
      ))}
    </div>
  );
}

export default RightColumnChatComponent;
