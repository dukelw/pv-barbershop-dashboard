/* eslint-disable perfectionist/sort-imports */
/* eslint-disable no-prototype-builtins */
/* eslint-disable consistent-return */
import axios from 'axios';
import Cookies from 'js-cookie';

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
  findAllFreeBarberStart,
  findAllFreeBarberSuccess,
  findAllFreeBarberFailure,
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
import {
  createServiceFailure,
  createServiceStart,
  createServiceSuccess,
  deleteServiceFailure,
  deleteServiceStart,
  deleteServiceSuccess,
  getAllServicesFailure,
  getAllServicesStart,
  getAllServicesSuccess,
  getServiceFailure,
  getServiceStart,
  getServiceSuccess,
  updateServiceFailure,
  updateServiceStart,
  updateServiceSuccess,
} from './serviceSlice';
import {
  createAppointmentFailure,
  createAppointmentStart,
  createAppointmentSuccess,
  deleteAppointmentFailure,
  deleteAppointmentStart,
  deleteAppointmentSuccess,
  findAllAppointmentsFailure,
  findAllAppointmentsStart,
  findAllAppointmentsSuccess,
  updateAppointmentFailure,
  updateAppointmentStart,
  updateAppointmentSuccess,
} from './appointmentSlice';
import {
  createInventoryFailure,
  createInventoryStart,
  createInventorySuccess,
  deleteInventoryFailure,
  deleteInventoryStart,
  deleteInventorySuccess,
  getAllInventorysFailure,
  getAllInventorysStart,
  getAllInventorysSuccess,
  getInventoryFailure,
  getInventoryStart,
  getInventorySuccess,
  updateInventoryFailure,
  updateInventoryStart,
  updateInventorySuccess,
} from './inventorySlice';
import {
  createInvoiceFailure,
  createInvoiceStart,
  createInvoiceSuccess,
  getAllInvoicesFailure,
  getAllInvoicesStart,
  getAllInvoicesSuccess,
  getInvoiceFailure,
  getInvoiceStart,
  getInvoiceSuccess,
  updateInvoiceFailure,
  updateInvoiceStart,
  updateInvoiceSuccess,
} from './invoiceSlice';

const REACT_APP_BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;

// Start user
export const signin = async (user, dispatch, navigate) => {
  dispatch(userSigninStart());
  try {
    const res = await axios.post(`${REACT_APP_BASE_URL}user/signin`, user);
    const refreshToken = res.data.metadata.tokens.refreshToken;
    const accessToken = res.data.metadata.tokens.accessToken;
    const userInformation = res.data.metadata.user;
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('accessToken', accessToken);
    Cookies.set('refreshToken', refreshToken, {
      expires: 7,
    });
    for (let key in userInformation) {
      if (userInformation.hasOwnProperty(key)) {
        Cookies.set(key, userInformation[key], {
          expires: 7,
        });
      }
    }
    dispatch(userSigninSuccess(res.data));
    const role = res.data.metadata.user.user_role;
    if (role === 'customer') {
      navigate('/');
    } else {
      window.location.href = 'http://localhost:3039';
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

export const createAccount = async (user, dispatch) => {
  dispatch(userSignupStart());
  try {
    const res = await axios.post(`${REACT_APP_BASE_URL}user/create-account`, user);
    const refreshToken = res.data?.metadata?.metadata?.tokens?.refreshToken;
    localStorage.setItem('refreshToken', refreshToken);
    dispatch(userSignupSuccess());
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
    navigate('/');
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

export const findAllBarber = async (dispatch) => {
  dispatch(findAllUsersStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}user/barber`);
    dispatch(findAllUsersSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(findAllUsersFailure());
  }
};

export const findAllFreeBarber = async (keySearch = '', startTime, endTime, dispatch) => {
  dispatch(findAllFreeBarberStart());
  try {
    let link = 'user/find-barber?';
    const params = [];

    if (keySearch) params.push(`key=${encodeURIComponent(keySearch)}`);
    if (startTime) params.push(`startTime=${encodeURIComponent(startTime)}`);
    if (endTime) params.push(`endTime=${encodeURIComponent(endTime)}`);

    link += params.join('&');

    const res = await axios.get(`${REACT_APP_BASE_URL}${link}`);
    dispatch(findAllFreeBarberSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(findAllFreeBarberFailure());
  }
};

export const banUser = async (accessToken, userID, deleteID, dispatch, axiosJWT) => {
  dispatch(deleteUserStart());
  try {
    const res = await axiosJWT.delete(`${REACT_APP_BASE_URL}user/${deleteID}/${userID}`, {
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
    const res = await axios.post(`${REACT_APP_BASE_URL}upload/image`, formData, {
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

// Start service

export const getService = async (ID, dispatch) => {
  dispatch(getServiceStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}service/${ID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getServiceSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching service:', error);
    dispatch(getServiceFailure());
  }
};

export const getAllServices = async (dispatch) => {
  dispatch(getAllServicesStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}service/all`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getAllServicesSuccess(res.data));
    console.log(res);
    return res.data.metadata;
  } catch (error) {
    dispatch(getAllServicesFailure());
  }
};

export const createService = async (accessToken, service, dispatch, navigate, axiosJWT) => {
  dispatch(createServiceStart());
  try {
    const res = await axiosJWT.post(`${REACT_APP_BASE_URL}service/create`, service, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(createServiceSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(createServiceFailure());
  }
};

export const updateService = async (accessToken, service, dispatch, navigate, axiosJWT) => {
  dispatch(updateServiceStart());
  try {
    const res = await axiosJWT.put(`${REACT_APP_BASE_URL}service/${service.service_id}`, service, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(updateServiceSuccess(res.data));
  } catch (error) {
    dispatch(updateServiceFailure());
  }
};

export const deleteService = async (accessToken, ID, dispatch, axiosJWT) => {
  dispatch(deleteServiceStart());
  try {
    await axiosJWT.delete(
      `${REACT_APP_BASE_URL}service/${ID}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `${accessToken}`,
        },
      }
    );
    dispatch(deleteServiceSuccess());
  } catch (error) {
    dispatch(deleteServiceFailure());
    return false;
  }
};

// End service

// Start appointment

export const getAppointment = async (ID, dispatch, populate) => {
  dispatch(getServiceStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}appointment/${ID}?populate=${populate}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getServiceSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching service:', error);
    dispatch(getServiceFailure());
  }
};
export const getAllAppointments = async (dispatch) => {
  dispatch(getAllServicesStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}appointment/get-all`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getAllServicesSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(getAllServicesFailure());
  }
};

export const getAllAppointmentsOfBarber = async (barberID, dispatch) => {
  dispatch(findAllAppointmentsStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}appointment/barber/${barberID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(findAllAppointmentsSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(findAllAppointmentsFailure());
  }
};

export const getAllAppointmentsOfUser = async (userPhone, dispatch) => {
  dispatch(findAllAppointmentsStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}appointment/user/${userPhone}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(findAllAppointmentsSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(findAllAppointmentsFailure());
  }
};

export const createAppointment = async (appointment, dispatch) => {
  dispatch(createAppointmentStart());
  try {
    const res = await axios.post(`${REACT_APP_BASE_URL}appointment/create`, appointment, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(createAppointmentSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(createAppointmentFailure());
  }
};

export const updateAppointment = async (accessToken, appointment, dispatch) => {
  dispatch(updateAppointmentStart());
  try {
    const res = await axios.put(
      `${REACT_APP_BASE_URL}appointment/${appointment._id}`,
      appointment,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `${accessToken}`,
        },
      }
    );
    dispatch(updateAppointmentSuccess(res.data));
  } catch (error) {
    dispatch(updateAppointmentFailure());
  }
};

export const updateAppointmentStatus = async (accessToken, appointmentID, status, dispatch) => {
  dispatch(updateAppointmentStart());
  try {
    const res = await axios.put(
      `${REACT_APP_BASE_URL}appointment/${appointmentID}/status`,
      { status },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `${accessToken}`,
        },
      }
    );
    dispatch(updateAppointmentSuccess(res.data));
  } catch (error) {
    dispatch(updateAppointmentFailure());
  }
};

export const updateAppointmentProof = async (accessToken, appointmentID, proof, dispatch) => {
  dispatch(updateAppointmentStart());
  try {
    const res = await axios.put(
      `${REACT_APP_BASE_URL}appointment/${appointmentID}/proof`,
      { complete_picture: proof },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `${accessToken}`,
        },
      }
    );
    dispatch(updateAppointmentSuccess(res.data));
  } catch (error) {
    dispatch(updateAppointmentFailure());
  }
};

export const deleteAppointment = async (accessToken, ID, dispatch) => {
  dispatch(deleteAppointmentStart());
  try {
    await axios.delete(
      `${REACT_APP_BASE_URL}appointment/${ID}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `${accessToken}`,
        },
      }
    );
    dispatch(deleteAppointmentSuccess());
  } catch (error) {
    dispatch(deleteAppointmentFailure());
    return false;
  }
};

// End appointment

// Start inventory

export const getInventory = async (ID, dispatch) => {
  dispatch(getInventoryStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}inventory/${ID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getInventorySuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    dispatch(getInventoryFailure());
  }
};

export const getAllInventories = async (dispatch) => {
  dispatch(getAllInventorysStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}inventory/all`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getAllInventorysSuccess(res.data));
    console.log(res);
    return res.data.metadata;
  } catch (error) {
    dispatch(getAllInventorysFailure());
  }
};

export const createInventory = async (accessToken, inventory, dispatch, navigate, axiosJWT) => {
  dispatch(createInventoryStart());
  try {
    const res = await axiosJWT.post(`${REACT_APP_BASE_URL}inventory/add`, inventory, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(createInventorySuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(createInventoryFailure());
  }
};

export const updateInventory = async (accessToken, inventory, dispatch, navigate, axiosJWT) => {
  dispatch(updateInventoryStart());
  try {
    const res = await axiosJWT.put(
      `${REACT_APP_BASE_URL}inventory/${inventory.inventory_id}`,
      inventory,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `${accessToken}`,
        },
      }
    );
    dispatch(updateInventorySuccess(res.data));
  } catch (error) {
    dispatch(updateInventoryFailure());
  }
};

export const deleteInventory = async (accessToken, ID, dispatch, axiosJWT) => {
  dispatch(deleteInventoryStart());
  try {
    await axiosJWT.delete(
      `${REACT_APP_BASE_URL}inventory/${ID}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `${accessToken}`,
        },
      }
    );
    dispatch(deleteInventorySuccess());
  } catch (error) {
    dispatch(deleteInventoryFailure());
    return false;
  }
};

// End inventory

// Start invoice

export const getInvoice = async (ID, dispatch) => {
  dispatch(getInvoiceStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}invoice/${ID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getInvoiceSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    dispatch(getInvoiceFailure());
  }
};

export const getAllInvoices = async (dispatch) => {
  dispatch(getAllInvoicesStart());
  try {
    const res = await axios.get(`${REACT_APP_BASE_URL}invoice/all`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(getAllInvoicesSuccess(res.data));
    console.log(res);
    return res.data.metadata;
  } catch (error) {
    dispatch(getAllInvoicesFailure());
  }
};

export const createInvoice = async (accessToken, invoice, dispatch) => {
  dispatch(createInvoiceStart());
  try {
    const res = await axios.post(`${REACT_APP_BASE_URL}invoice/create`, invoice, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(createInvoiceSuccess(res.data));
    return res.data;
  } catch (error) {
    dispatch(createInvoiceFailure());
  }
};

export const updateInvoice = async (accessToken, invoice, dispatch) => {
  dispatch(updateInvoiceStart());
  try {
    const res = await axios.put(`${REACT_APP_BASE_URL}invoice/${invoice.invoice_id}`, invoice, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${accessToken}`,
      },
    });
    dispatch(updateInvoiceSuccess(res.data));
  } catch (error) {
    dispatch(updateInvoiceFailure());
  }
};

// End invoice
