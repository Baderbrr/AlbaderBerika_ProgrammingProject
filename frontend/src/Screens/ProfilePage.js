import React from "react";
import ColumnLayout from "../app/Components/Layout/ColumnLayout";
import ProfileMiddleColumn from "../app/Components/Layout/Columns/ProfileColumn/ProfileMiddleColumn";

function ProfilePage() {
  return (
    <ColumnLayout
      RightColumnExist={false}
      middleColumn={<ProfileMiddleColumn />}
    />
  );
}

export default ProfilePage;
