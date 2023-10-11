import axios from "axios";
import { logOut } from "./validation";
const baseApiUrl = process.env.REACT_APP_BASE_URL_API;
const apiKey = process.env.REACT_APP_API_KEY

export const handleApiError=(err)=>{
    if (err?.response?.status === 401) {
        alert("Your current Session is expired. Please login to continue");
        logOut();
        window.location.href="/Primate-CRM-FE/login"
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
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  });
};

export const register=(data)=>{
  return axios({
    method:"post",
    url:`${baseApiUrl}/admin/register`,
    data,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  });
};

export const createLoad = (data) => {
  return axios({
    method: "post",
    url: `${baseApiUrl}/users/addLoad`,
    data,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  });
};

export const loadActiveBrokers=()=>{
    return axios({
        method:"get",
        url:`${baseApiUrl}/admin/activeBrokers`,
        headers:{
          XApiKey: apiKey,
          PToken: sessionStorage.getItem("token")
        }
    });
}

export const loadAllBrokers=()=>{
  return axios({
      method:"get",
      url:`${baseApiUrl}/admin/brokers`,
      headers:{
        XApiKey: apiKey,
        PToken: sessionStorage.getItem("token")
      }
  });
}

export const getLoadOnId=(loadNumber)=>{
    return axios({
        method:'get',
        url:`${baseApiUrl}/users/load/${loadNumber}`,
        headers:{
          XApiKey: apiKey,
          PToken: sessionStorage.getItem("token")
        }
    });
}

export const getBrokerOnId=(brokerId)=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/users/broker/${brokerId}`,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  })
}

export const getLoadForBroker =(brokerId)=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/users/loads/ForBroker/${brokerId}`,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  })
}

export const uploadAgencyData=(data)=>{
  return axios({
    method:'post',
    url:`${baseApiUrl}/admin/uploadAgencyData`,
    data,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  })
}

export const processInvoices=()=>{
  return axios({
    method:'patch',
    url:`${baseApiUrl}/admin/processInvoices`,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  })
}

export const getAllShippers=()=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/Admin/allShippers`,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  })
}

export const getAllShippersForBroker=(brokerId)=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/users/shippers/forBroker/${brokerId}`,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  })
}

export const getShipper=(shipperId)=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/users/shipper/${shipperId}`,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  })
}


export const addShipper=(data)=>{
  return axios({
    method:'post',
    url:`${baseApiUrl}/users/createShipper`,
    data:data,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  })
}

export const editShipper= (id,payload)=>{
  return axios({
    method:'patch',
    url:`${baseApiUrl}/users/editShipper/${id}`,
    data:payload,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  })

}

export const editLoad= (loadNumber,load)=>{
  return axios({
    method:'patch',
    url:`${baseApiUrl}/users/updateLoad/${loadNumber}`,
    data:load,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  })
}

export const editBroker= (brokerId,data)=>{
  return axios({
    method:'patch',
    url:`${baseApiUrl}/users/editProfile/${brokerId}`,
    data:data,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  })
}

export const deleteLoad= (loadNumber)=>{
  return axios({
    method:'delete',
    url:`${baseApiUrl}/users/remove/load/${loadNumber}`,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  })
}

export const deleteShipper= (shipperId)=>{
  return axios({
    method:'delete',
    url:`${baseApiUrl}/users/remove/shipper/${shipperId}`,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  })
}

export const getBrokerProfile=(brokerId)=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/users/broker/${brokerId}`,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  })
}

export const getCurrency=()=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/admin/currencies`,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  })
}

export const getAllLoads=()=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/admin/allLoads`,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  })
}

export const getPrepInvoice=(brokerId)=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/users/invoice/${brokerId}/prepare`,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  })
}

export const generateInvoice=(preInvoice)=>{
   return axios({
    method:'post',
    url:`${baseApiUrl}/users/createInvoice`,
    data:preInvoice,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
   })
}

export const getPastInvoicesForBroker=(brokerId)=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/users/${brokerId}/pastInvoices`,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  })
}

export const getAllGeneratedInvoices=()=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/admin/allInvoices`,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  })
}

export const sendOtp=(email)=>{
  return axios({
    method:'post',
    url:`${baseApiUrl}/users/otp/send?emailId=${email}`,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  })
}

export const validateOtp=(email,otp)=>{
  return axios({
    method:'post',
    url:`${baseApiUrl}/users/otp/validate?emailId=${email}&otp=${otp}`,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  })
}

export const resetPassword=(data)=>{
  return axios({
    method:'post',
    url:`${baseApiUrl}/users/otpValidate/resetPassword`,
    data:data,
    headers:{
      XApiKey: apiKey,
      PToken: sessionStorage.getItem("token")
    }
  })
}