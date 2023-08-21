import axios from "axios";

const baseApiUrl = process.env.REACT_APP_BASE_URL_API;

export const handleApiError=(err)=>{
    if (err?.response?.status === 401) {
        alert("Authentication failed.");
      } else if (err?.response?.status === 417) {
        alert("Server error");
      } else {
        alert("Some error occurred. Please retry. If issue persists please contact the Admin");
      }
}

export const callLogin = (data) => {
  return axios({
    method: "post",
    url: `${baseApiUrl}/users/login`,
    data,
    headers: {
      XApiKey: "AuthTokenCheck",
    },
  });
};

export const createLoad = (data) => {
  return axios({
    method: "post",
    url: `${baseApiUrl}/users/addLoad`,
    data,
    headers: {
      XApiKey: "AuthTokenCheck",
    },
  });
};

export const loadActiveBrokers=()=>{
    return axios({
        method:"get",
        url:`${baseApiUrl}/admin/activeBrokers`,
        headers: {
            XApiKey: "AuthTokenCheck",
          }
    });
}

export const getLoadOnId=(loadNumber)=>{
    return axios({
        method:'get',
        url:`${baseApiUrl}/users/load/${loadNumber}`,
        headers: {
            XApiKey: "AuthTokenCheck",
          }
    });
}