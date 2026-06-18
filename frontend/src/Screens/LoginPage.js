import React from "react";
import { useSelector } from "react-redux";
import LoginModal from "../app/Components/Modals/LoginModal";

function LoginPage() {
  const { userData, loading, error, isAuthenticated } = useSelector(
    (state) => state.authUserData
  );

  return (
    <LoginModal
      userData={userData}
      loading={loading}
      error={error}
      isAuthenticated={isAuthenticated}
    />
  );
}

export default LoginPage;
