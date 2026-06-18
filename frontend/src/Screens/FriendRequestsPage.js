import React from "react";
import ColumnLayout from "../app/Components/Layout/ColumnLayout";
import RequestMiddleColumn from "../app/Components/Layout/Columns/RequestsColumn/RequestMiddleColumn";

function FriendRequestsPage() {
  return (
    <ColumnLayout
      RightColumnExist={false}
      middleColumn={<RequestMiddleColumn />}
    />
  );
}

export default FriendRequestsPage;
