export const loggedInUserId= ()=> {
    return parseInt(sessionStorage.getItem("UserId"));
}
export const loggedInUserRole= ()=> {
    return parseInt(sessionStorage.getItem("Role"));
}

export const setUserAndRole=(userId,roleId)=>{
    sessionStorage.setItem("Role", roleId);
    sessionStorage.setItem("UserId", userId);
}

export const logOut=()=>{
    sessionStorage.removeItem("UserId");
    sessionStorage.removeItem("Role");
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