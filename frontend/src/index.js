import React from "react";
import { createRoot } from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { store } from "./app/store";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "./Screens/LoginPage";
import MainPage from "./Screens/MainPage";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./stylesheets/index.css";
import RegisterPage from "./Screens/RegisterPage";
import FriendPage from "./Screens/FriendPage";
import ProfilePage from "./Screens/ProfilePage";
import ChatScreen from "./Screens/ChatScreen";
import FriendRequestsPage from "./Screens/FriendRequestsPage";

const AppRouter = () => {
  const { isAuthenticated } = useSelector((state) => state.authUserData);
  const router = createBrowserRouter([
    {
      path: "/login",
      element: !isAuthenticated ? <LoginPage /> : <Navigate to="/" />,
    },
    {
      path: "/",
      element: isAuthenticated ? <MainPage /> : <Navigate to="/login" />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/friends",
      element: isAuthenticated ? <FriendPage /> : <Navigate to="/login" />,
    },
    // {
    //   path: "/profile",
    //   element: isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />,
    // },
    {
      path: "/profile/:id",
      element: isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />,
    },
    {
      path: "/chat",
      element: isAuthenticated ? <ChatScreen /> : <Navigate to="/login" />,
    },
    {
      path: "/chat/:id",
      element: isAuthenticated ? <ChatScreen /> : <Navigate to="/login" />,
    },
    {
      path: "/friend_requests",
      element: isAuthenticated ? (
        <FriendRequestsPage />
      ) : (
        <Navigate to="/login" />
      ),
    },
  ]);
  return <RouterProvider router={router} />;
};
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <Provider store={store}>
    <AppRouter />

    {/* <App /> */}
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
