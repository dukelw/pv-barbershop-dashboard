/* eslint-disable perfectionist/sort-imports */
/* eslint-disable consistent-return */
import axios from 'axios';

import {
  userSigninStart,
  userSigninSuccess,
  userSigninFailure,
  userSignupStart,
  userSignupSuccess,
  userSignupFailure,
  userLogoutStart,
  userLogoutSuccess,
  userLogoutFailure,
  findUserStart,
  findUserSuccess,
  findUserFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  changePasswordStart,
  changePasswordSuccess,
  changePasswordFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  findAllUsersStart,
  findAllUsersSuccess,
  findAllUsersFailure,
} from './userSlice';
import {
  uploadAudioFailure,
  uploadAudioStart,
  uploadAudioSuccess,
  uploadImageFailure,
  uploadImageStart,
  uploadImageSuccess,
} from './uploadSlice';
import {
  createCommentFailure,
  createCommentStart,
  createCommentSuccess,
  deleteCommentFailure,
  deleteCommentStart,
  deleteCommentSuccess,
  getChildrenFailure,
  getChildrenStart,
  getChildrenSuccess,
  getParentFailure,
  getParentStart,
  getParentSuccess,
} from './commentSlice';
import {
  createNotificationFailure,
  createNotificationStart,
  createNotificationSuccess,
  getAllNotificationsFailure,
  getAllNotificationsStart,
  getAllNotificationsSuccess,
  updateNotificationFailure,
  updateNotificationStart,
  updateNotificationSuccess,
} from './notificationSlice';
import {
  createSliderFailure,
  createSliderStart,
  createSliderSuccess,
  deleteSliderFailure,
  deleteSliderStart,
  deleteSliderSuccess,
  getActiveSlidersFailure,
  getActiveSlidersStart,
  getActiveSlidersSuccess,
  getAllSlidersFailure,
  getAllSlidersStart,
  getAllSlidersSuccess,
  getByCollectionFailure,
  getByCollectionStart,
  getByCollectionSuccess,
  getCollectionsFailure,
  getCollectionsStart,
  getCollectionsSuccess,
  getSliderFailure,
  getSliderStart,
  getSliderSuccess,
  toggleSliderFailure,
  toggleSliderStart,
  toggleSliderSuccess,
  updateSliderFailure,
  updateSliderStart,
  updateSliderSuccess,
} from './sliderSlice';

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

// Start user
export const signin = async (user, dispatch, navigate) => {
  dispatch(userSigninStart());
  try {
    const res = await axios.post(`${REACT_APP_BASE_URL}user/signin`, user);
    const refreshToken = res.data.metadata.tokens.refreshToken;
    localStorage.setItem('refreshToken', refreshToken);
    dispatch(userSigninSuccess(res.data));
    const role = res.data.metadata.user.user_role;
    if (role === 'customer') {
      navigate('/');
    } else {
      navigate('/workbench');
    }
  } catch (error) {
    dispatch(userSigninFailure());
    return false;
  }
};

export const signup = async (user, dispatch, navigate) => {
  dispatch(userSignupStart());
  try {
    const res = await axios.post(`${REACT_APP_BASE_URL}user/signup`, user);
    const refreshToken = res.data?.metadata?.metadata?.tokens?.refreshToken;
    localStorage.setItem('refreshToken', refreshToken);
    dispatch(userSignupSuccess());
    navigate('/signin');
  } catch (error) {
    dispatch(userSignupFailure());
    return false;
  }
};

export const logout = async (accessToken, userID, dispatch, navigate, axiosJWT) => {
  dispatch(userLogoutStart());
  try {
    await axiosJWT.post(
      `${REACT_APP_BASE_URL}user/logout`,
      {},
      {
        headers: {
          authorization: accessToken,
          user: userID,
        },
      }
    );
    dispatch(userLogoutSuccess());
    window.location.href = 'http://localhost:3000/signin';
  } catch (error) {
    dispatch(userLogoutFailure());
  }
};

export const updateUser = async (accessToken, userID, data, dispatch, axiosJWT) => {
  dispatch(updateUserStart());
  try {
    const result = await axiosJWT.post(`${REACT_APP_BASE_URL}user/update`, data, {
      headers: {
        authorization: accessToken,
        user: userID,
      },
    });
    dispatch(updateUserSuccess());
    return result;
  } catch (error) {
    dispatch(updateUserFailure());
  }
};

export const appointAdmin = async (accessToken, userID, data, dispatch, axiosJWT) => {
  dispatch(updateUserStart());
  try {
    const result = await axiosJWT.post(`${REACT_APP_BASE_URL}user/update`, data, {
      headers: {
        authorization: accessToken,
        user: userID,
      },
    });
    dispatch(updateUserSuccess());
    return result;
  } catch (error) {
    dispatch(updateUserFailure());
  }
};

export const changePassword = async (accessToken, userID, data, dispatch, axiosJWT) => {
  dispatch(changePasswordStart());
  try {
    const res = await axiosJWT.post(`${REACT_APP_BASE_URL}user/change-password`, data, {
      headers: {
        authorization: accessToken,
        user: userID,
      },
    });
    dispatch(changePasswordSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(changePasswordFailure());
  }
};

export const findUser = async (userID, dispatch) => {
  dispatch(findUserStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}user/find/${userID}`);
    dispatch(findUserSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(findUserFailure());
  }
};

export const findAllUser = async (keySearch = '', dispatch) => {
  dispatch(findAllUsersStart());
  try {
    const link = keySearch === '' ? 'user' : `user?key=${keySearch}`;
    const res = await axios.get(`${REACT_APP_BASE_URL}${link}`);
    dispatch(findAllUsersSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(findAllUsersFailure());
  }
};

export const banUser = async (accessToken, userID, deleteID, dispatch, axiosJWT) => {
  dispatch(deleteUserStart());
  try {
    const res = await axiosJWT.delete(`${REACT_APP_BASE_URL}user/${deleteID}`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
        user: `${userID}`,
      },
    });
    dispatch(deleteUserSuccess());
    return res.data;
  } catch (error) {
    dispatch(deleteUserFailure());
    return false;
  }
};

// End user

// Upload
export const uploadImage = async (file, folderName, dispatch) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folderName', folderName);
  dispatch(uploadImageStart());
  try {
    const res = await axios.post(`${REACT_APP_BASE_URL}upload/answer-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch(uploadImageSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(uploadImageFailure());
  }
};

export const uploadAudio = async (audio, dispatch) => {
  const formData = new FormData();
  formData.append('audio', audio);
  dispatch(uploadAudioStart());
  try {
    const res = await axios.post(`${REACT_APP_BASE_URL}upload/answer-audio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch(uploadAudioSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(uploadAudioFailure());
  }
};

// End upload

// Start comment

export const getComments = async (ID, dispatch) => {
  dispatch(getParentStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}comment/answer/${ID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getParentSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching answer:', error);
    dispatch(getParentFailure());
  }
};

export const getReply = async (answerID, commentID, dispatch) => {
  dispatch(getChildrenStart());
  try {
    const link = `comment?answer_id=${answerID}&parent_comment_id=${commentID}`;
    const res = await axios.get(`${REACT_APP_BASE_URL}${link}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getChildrenSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(getChildrenFailure());
  }
};

export const createComment = async (accessToken, comment, dispatch, navigate, axiosJWT) => {
  dispatch(createCommentStart());
  try {
    const res = await axiosJWT.post(`${REACT_APP_BASE_URL}comment`, comment, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(createCommentSuccess(res.data));
  } catch (error) {
    dispatch(createCommentFailure());
  }
};

export const deleteComment = async (accessToken, userID, data, dispatch, axiosJWT) => {
  dispatch(deleteCommentStart());
  try {
    await axiosJWT.delete(`${REACT_APP_BASE_URL}comment`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
        user: `${userID}`,
      },
      data: data,
    });
    dispatch(deleteCommentSuccess());
  } catch (error) {
    dispatch(deleteCommentFailure());
  }
};

// End comment

// Start notification

export const getNotifications = async (ID, dispatch) => {
  dispatch(getAllNotificationsStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}notification/${ID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getAllNotificationsSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching answer:', error);
    dispatch(getAllNotificationsFailure());
  }
};

export const createNotification = async (accessToken, notification, dispatch, axiosJWT) => {
  dispatch(createNotificationStart());
  try {
    const res = await axiosJWT.post(`${REACT_APP_BASE_URL}notification`, notification, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(createNotificationSuccess(res.data));
  } catch (error) {
    dispatch(createNotificationFailure());
  }
};

export const markRead = async (accessToken, notification, dispatch, axiosJWT) => {
  dispatch(updateNotificationStart());
  try {
    const res = await axiosJWT.post(`${REACT_APP_BASE_URL}notification/mark-read`, notification, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(updateNotificationSuccess(res.data));
  } catch (error) {
    dispatch(updateNotificationFailure());
  }
};

// Start slider

export const getSlider = async (ID, dispatch) => {
  dispatch(getSliderStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}slider/find/${ID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getSliderSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching answer:', error);
    dispatch(getSliderFailure());
  }
};

export const getAllSliders = async (dispatch) => {
  dispatch(getAllSlidersStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}slider`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getAllSlidersSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(getAllSlidersFailure());
  }
};

export const getActiveSliders = async (dispatch) => {
  dispatch(getActiveSlidersStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}slider/find-active`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getActiveSlidersSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(getActiveSlidersFailure());
  }
};

export const getCollections = async (keySearch, dispatch) => {
  dispatch(getCollectionsStart());
  try {
    const link = keySearch === '' ? 'slider/collection' : `slider/collection?key=${keySearch}`;
    const res = await axios.get(`${REACT_APP_BASE_URL}${link}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getCollectionsSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(getCollectionsFailure());
  }
};

export const getByCollections = async (collection, dispatch) => {
  dispatch(getByCollectionStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}slider/collection/${collection}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getByCollectionSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(getByCollectionFailure());
  }
};

export const createSlider = async (accessToken, slider, dispatch, navigate, axiosJWT) => {
  dispatch(createSliderStart());
  try {
    const res = await axiosJWT.post(`${REACT_APP_BASE_URL}slider/create`, slider, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(createSliderSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(createSliderFailure());
  }
};

export const updateSlider = async (accessToken, slider, dispatch, navigate, axiosJWT) => {
  dispatch(updateSliderStart());
  try {
    const res = await axiosJWT.post(`${REACT_APP_BASE_URL}slider/update`, slider, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(updateSliderSuccess(res.data));
    navigate('/management/collection');
  } catch (error) {
    dispatch(updateSliderFailure());
  }
};

export const toggleSlider = async (accessToken, slider, dispatch, navigate, axiosJWT) => {
  dispatch(toggleSliderStart());
  try {
    const res = await axiosJWT.post(`${REACT_APP_BASE_URL}slider/toggle`, slider, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(toggleSliderSuccess(res.data));
    getCollections(dispatch);
  } catch (error) {
    dispatch(toggleSliderFailure());
    return false;
  }
};

export const deleteSlider = async (accessToken, ID, dispatch, axiosJWT) => {
  dispatch(deleteSliderStart());
  try {
    await axiosJWT.delete(
      `${REACT_APP_BASE_URL}slider/${ID}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `${accessToken}`,
        },
      }
    );
    dispatch(deleteSliderSuccess());
  } catch (error) {
    dispatch(deleteSliderFailure());
    return false;
  }
};

export const deleteCollection = async (accessToken, collection, dispatch, axiosJWT) => {
  dispatch(deleteSliderStart());
  try {
    await axiosJWT.delete(
      `${REACT_APP_BASE_URL}slider/collection/${collection}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `${accessToken}`,
        },
      }
    );
    dispatch(deleteSliderSuccess());
  } catch (error) {
    dispatch(deleteSliderFailure());
    return false;
  }
};

// End slider
