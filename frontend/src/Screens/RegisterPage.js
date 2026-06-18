import React from "react";
import { useSelector } from "react-redux";
import RegisterModal from "../app/Components/Modals/RegisterModal";
function RegisterPage() {
  const { userData, loading, error } = useSelector(
    (state) => state.authUserData
  );
  return <RegisterModal userData={userData} loading={loading} error={error} />;
}

export default RegisterPage;
