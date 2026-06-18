import axios from "axios";
import Cookies from "js-cookie";

// sending login and password to get user data with JWT tokens
export const userLogin = async (login, password) => {
  return await axios({
    method: "post",
    url: "http://127.0.0.1:8000/api/user/login/",
    data: {
      email: login,
      password: password,
    },
  })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      throw error;
    });
};

// register user
export const registerUser = async (data) => {
  return await axios({
    method: "post",
    url: "http://127.0.0.1:8000/api/user/register/",
    data: data,
  })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      throw error;
    });
};

// receive all the users from database based on query search
export const getUsers = async (query) => {
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/search/users/q=${query}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("userData"))["access"]}`,
    },
  })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      throw error;
    });
};

// send invite to friends list
export const inviteFriend = async (user_id) => {
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/request/friend/invite/${user_id}/`,
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("userData"))["access"]}`,
    },
  })
    .then(function (response) {
      console.log(response.data);
      return response;
    })
    .catch(function (error) {
      return error;
    });
};

export const editProfile = async (data) => {
  return await axios({
    method: "post",
    url: "http://127.0.0.1:8000/api/user/edit/",
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("userData"))["access"]}`,
    },
    data: data,
  })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error;
    });
};

// get user informations
export const getProfile = async (id = null) => {
  let url = `http://127.0.0.1:8000/api/user/profile/`;
  if (id) {
    url += `${id}/`;
  }
  return await axios({
    method: "get",
    url: url,
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("userData"))["access"]}`,
    },
  })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
};

// accept invite to friends list
export const acceptFriendInvitation = async (user_id) => {
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/request/friend/accept/${user_id}/`,
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("userData"))["access"]}`,
    },
  })
    .then(function (response) {
      console.log(response.data);
      return response;
    })
    .catch(function (error) {
      return error;
    });
};

// accept invite to friends list
export const getAllFriendRequests = async () => {
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/request/friend/all-requests/`,
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("userData"))["access"]}`,
    },
  })
    .then(function (response) {
      console.log(response.data);
      return response;
    })
    .catch(function (error) {
      return error;
    });
};

export const deleteFriend = async (id) => {
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/user/delete/${id}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("userData"))["access"]}`,
    },
  })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error;
    });
};

export const getAllFriends = async () => {
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/user/get/allFriends/`,
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("userData"))["access"]}`,
    },
  })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error;
    });
};
