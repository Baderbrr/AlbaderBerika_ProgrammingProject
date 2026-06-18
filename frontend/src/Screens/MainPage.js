import React from "react";
import ColumnLayout from "../app/Components/Layout/ColumnLayout";
import FriendsMiddleColumn from "../app/Components/Layout/Columns/FriendColumn/FriendsMiddleColumn";

function MainPage() {
  return (
    <ColumnLayout
      middleColumn={<FriendsMiddleColumn />}
      RightColumnExist={false}
    />
  );
}

export default MainPage;
