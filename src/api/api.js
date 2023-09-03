import axios from "axios";
const baseApiUrl = process.env.REACT_APP_BASE_URL_API;
const apiKey = process.env.REACT_APP_API_KEY
const headers={
    XApiKey: apiKey
  }

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
    headers: headers,
  });
};

export const register=(data)=>{
  return axios({
    method:"post",
    url:`${baseApiUrl}/admin/register`,
    data,
    headers:headers
  });
};

export const createLoad = (data) => {
  return axios({
    method: "post",
    url: `${baseApiUrl}/users/addLoad`,
    data,
    headers: headers,
  });
};

export const loadActiveBrokers=()=>{
    return axios({
        method:"get",
        url:`${baseApiUrl}/admin/activeBrokers`,
        headers: headers
    });
}

export const getLoadOnId=(loadNumber)=>{
    return axios({
        method:'get',
        url:`${baseApiUrl}/users/load/${loadNumber}`,
        headers: headers
    });
}

export const getBrokerOnId=(brokerId)=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/users/broker/${brokerId}`,
    headers:headers
  })
}

export const getLoadForBroker =(brokerId)=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/users/getLoadsForBroker/${brokerId}`,
    headers:headers
  })
}

export const uploadAgencyData=(data)=>{
  return axios({
    method:'post',
    url:`${baseApiUrl}/admin/uploadAgencyData`,
    data,
    headers:headers
  })
}

export const processInvoices=()=>{
  return axios({
    method:'patch',
    url:`${baseApiUrl}/admin/processInvoices`,
    headers:headers
  })
}

export const getAllShippers=()=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/users/shippers`,
    headers:headers
  })
}

export const addShipper=(data)=>{
  return axios({
    method:'post',
    url:`${baseApiUrl}/users/createShipper`,
    data:data,
    headers:headers
  })
}

export const editLoad= (loadNumber,load)=>{
  return axios({
    method:'patch',
    url:`${baseApiUrl}/users/updateLoad/${loadNumber}`,
    data:load,
    headers:headers
  })
}