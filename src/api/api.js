import axios from "axios";
import { logOut } from "./validation";
const baseApiUrl = process.env.REACT_APP_BASE_URL_API;
const apiKey = process.env.REACT_APP_API_KEY

const headers=()=>{
  return {
    XApiKey: apiKey,
    PToken: sessionStorage.getItem("token")
  }
}

export const handleApiError=(err)=>{
  console.log(err);
    if (err?.response?.status === 401) {
        alert("Your current Session is expired. Please login to continue");
        logOut();
        window.location.href="/login"
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
    headers:headers()
  });
};

export const register=(data)=>{
  return axios({
    method:"post",
    url:`${baseApiUrl}/admin/register`,
    data,
    headers:headers()
  });
};

export const createLoad = (data) => {
  return axios({
    method: "post",
    url: `${baseApiUrl}/users/addLoad`,
    data,
    headers:headers()
  });
};

export const loadActiveBrokers=()=>{
    return axios({
        method:"get",
        url:`${baseApiUrl}/admin/activeBrokers`,
        headers:headers()
    });
}

export const loadAllBrokers=()=>{
  return axios({
      method:"get",
      url:`${baseApiUrl}/admin/brokers`,
      headers:headers()
  });
}

export const getLoadOnId=(loadNumber)=>{
    return axios({
        method:'get',
        url:`${baseApiUrl}/users/load/${loadNumber}`,
        headers:headers()
    });
}

export const getBrokerOnId=(brokerId)=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/users/broker/${brokerId}`,
    headers:headers()
  })
}

export const getLoadForBroker =(brokerId)=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/users/loads/ForBroker/${brokerId}`,
    headers:headers()
  })
}

export const uploadAgencyData=(data)=>{
  return axios({
    method:'post',
    url:`${baseApiUrl}/admin/uploadAgencyData`,
    data,
    headers:headers()
  })
}

export const processInvoices=()=>{
  return axios({
    method:'patch',
    url:`${baseApiUrl}/admin/processInvoices`,
    headers:headers()
  })
}

export const getAllShippers=()=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/Admin/allShippers`,
    headers:headers()
  })
}

export const getAllShippersForBroker=(brokerId)=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/users/shippers/forBroker/${brokerId}`,
    headers:headers()
  })
}

export const getShipper=(shipperId)=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/users/shipper/${shipperId}`,
    headers:headers()
  })
}


export const addShipper=(data)=>{
  return axios({
    method:'post',
    url:`${baseApiUrl}/users/createShipper`,
    data:data,
    headers:headers()
  })
}

export const editShipper= (id,payload)=>{
  return axios({
    method:'patch',
    url:`${baseApiUrl}/users/editShipper/${id}`,
    data:payload,
    headers:headers()
  })

}

export const editLoad= (loadNumber,load)=>{
  return axios({
    method:'patch',
    url:`${baseApiUrl}/users/updateLoad/${loadNumber}`,
    data:load,
    headers:headers()
  })
}

export const editBroker= (brokerId,data)=>{
  return axios({
    method:'patch',
    url:`${baseApiUrl}/users/editProfile/${brokerId}`,
    data:data,
    headers:headers()
  })
}

export const deleteLoad= (loadNumber)=>{
  return axios({
    method:'delete',
    url:`${baseApiUrl}/users/remove/load/${loadNumber}`,
    headers:headers()
  })
}

export const deleteShipper= (shipperId)=>{
  return axios({
    method:'delete',
    url:`${baseApiUrl}/users/remove/shipper/${shipperId}`,
    headers:headers()
  })
}

export const getBrokerProfile=(brokerId)=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/users/broker/${brokerId}`,
    headers:headers()
  })
}

export const getAllLoads=()=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/admin/allLoads`,
    headers:headers()
  })
}

export const getPrepInvoice=(brokerId)=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/users/invoice/${brokerId}/prepare`,
    headers:headers()
  })
}

export const generateInvoice=(preInvoice)=>{
   return axios({
    method:'post',
    url:`${baseApiUrl}/users/createInvoice`,
    data:preInvoice,
    headers:headers()
   })
}

export const getPastInvoicesForBroker=(brokerId)=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/users/${brokerId}/pastInvoices`,
    headers:headers()
  })
}

export const getAllGeneratedInvoices=()=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/admin/allInvoices`,
    headers:headers()
  })
}

export const sendOtp=(email)=>{
  return axios({
    method:'post',
    url:`${baseApiUrl}/users/otp/send?emailId=${email}`,
    headers:headers()
  })
}

export const validateOtp=(email,otp)=>{
  return axios({
    method:'post',
    url:`${baseApiUrl}/users/otp/validate?emailId=${email}&otp=${otp}`,
    headers:headers()
  })
}

export const resetPassword=(data)=>{
  return axios({
    method:'post',
    url:`${baseApiUrl}/users/otpValidate/resetPassword`,
    data:data,
    headers:headers()
  })
}

export const getAgencyLoadsOnStatus=(isProcessed)=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/admin/agency/loads?isProcessed=${isProcessed}`,
    headers:headers()
  })
}

export const getInvoiceOnId=(invoiceNumber)=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/users/invoice/${invoiceNumber}`,
    headers:headers()
  })
}

export const getLoadsForShipper=(shipperId)=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/users/loads/ForShipper/${shipperId}`,
    headers:headers()
  });
}

export const resolveMismatchByBroker=(loadNumber)=>{
  return axios({
    method:'post',
    url:`${baseApiUrl}/Users/resolve/mismatch/${loadNumber}`,
    headers:headers()
  });
}

export const getMarginForBroker=(brokerId)=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/users/margin/${brokerId}`,
    headers:headers()
  });
}

export const getMarginForAdmin=()=>{
  return axios({
    method:'get',
    url:`${baseApiUrl}/admin/totalMargin`,
    headers:headers()
  });
}

export const updatePaymentState=(loads, status)=>{
  return axios({
    method:'post',
    url:`${baseApiUrl}/Users/changePaymentStatus?status=${status}`,
    data: loads,
    headers:headers()
  });
}