import jwtDecode from "jwt-decode";

export const loggedInUserId= ()=> {
    let params= decodeJwtToken(sessionStorage.getItem("token"))
    if(params && params?.brokerId)
        return parseInt(params.brokerId);
    else
        return NaN;
}

export const loggedInUserRole= ()=> {
    let params= decodeJwtToken(sessionStorage.getItem("token"))
    if(params?.role==="Admin")
        return parseInt(1);
    else if(params?.role==="User")
        return parseInt(2);
    else
        return NaN;
}

export const setUserAndRole=(jwtToken)=>{
    sessionStorage.setItem("token",jwtToken)
}

const decodeJwtToken=(token)=>{
    if(token){
        let decoded= jwtDecode(token);
        return {role:decoded.UserRole,brokerId:decoded.BrokerId ,expiry:decoded.exp}
    }
}

export const logOut=()=>{
    sessionStorage.removeItem("token");
}

export const checkPermissionToNavigation=(data)=>{
    if(loggedInUserRole()===1){
        return true;
    }
    if(data?.brokerId===loggedInUserId()){
        return true;
    }
    return false;
}


