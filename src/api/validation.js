const loggedInUserId= sessionStorage.getItem("UserId");
const loggedInUserRole= sessionStorage.getItem("Role");

export const checkPermissionToNavigation=(data)=>{
    if(parseInt(loggedInUserRole)===1){
        return true;
    }
    if(data?.brokerId===parseInt(loggedInUserId)){
        return true;
    }
    return false;
}