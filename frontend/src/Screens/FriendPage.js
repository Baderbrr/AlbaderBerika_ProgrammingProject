import React from "react";
import ColumnLayout from "../app/Components/Layout/ColumnLayout";
import FriendsMiddleColumn from "../app/Components/Layout/Columns/FriendColumn/FriendsMiddleColumn";

function FriendPage() {
  return (
    <ColumnLayout
      middleColumn={<FriendsMiddleColumn />}
      SearchTagsGroupsExist={false}
    />
  );
}

export default FriendPage;
