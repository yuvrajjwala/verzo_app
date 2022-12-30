import axios from "axios";

const URL = {
  DEVELOPMENT: "https://vervoer-backend.herokuapp.com/",
  DEVELOPMENT_DRYCLEANING: "https://vervover-dry-cleaning.herokuapp.com/api/",
  PRODUCTION: "http://165.22.62.238/api/",
  // PRODUCTION: 'http://18.212.85.170:6000/',
  TEST: "https://vervover-dry-cleaning.herokuapp.com/",
};

export const BASE_URL = `${URL.TEST}`;
export const BASE_API_URL = `${URL.DEVELOPMENT_DRYCLEANING}`;

export const END_POINT = {
  GET_DRY_CLEANING_SHOP: `${BASE_URL}shop/get-all-shops`,
  GET_DRY_CLEANING_SERVICES: `${BASE_API_URL}shop/get-shop-services`,
  GET_DRY_CLEANING_SHOP_DETAIL: `${BASE_API_URL}shop/get-shop-by-id`,
  ADD_SERVICE_TO_CART: `${BASE_API_URL}booking/add-services-to-cart`,
  ADD_USER_ADDRESS: `${BASE_API_URL}user/add-new-user-address`,
  GET_USER_BY_ID: `${BASE_API_URL}user/get-user-by-id`,
};

export const GETCALL = async (apiUrl, token = null) => {
  let headerObj = {};
  if (token) {
    headerObj = {
      ...headerObj,
      "x-access-token": token,
    };
  }
  let getCallRes = await axios.get(`${BASE_URL}${apiUrl}`, {
    headers: headerObj,
  });
  return {
    status: getCallRes.status,
    responseData: getCallRes.data,
  };
};

export const POSTCALL = async (apiUrl, bodyData, token = null, type = null) => {
  let headerObj = {};
  if (token) {
    headerObj = {
      ...headerObj,
      "x-access-token": token,
    };
  }
  if (type == "media") {
    headerObj = {
      ...headerObj,
      "Content-Type": "multipart/form-data",
    };
  }

  let postCallRes = await axios.post(
    "https://vervover-dry-cleaning.herokuapp.com/" + apiUrl + "/",
    bodyData,
    { headers: headerObj }
  );
  return {
    status: postCallRes.status,
    responseData: postCallRes.data,
  };
};