import React, {useRef} from 'react';
import {useJwt} from "react-jwt";
import {useNavigate} from "react-router-dom";
import {getLogin} from "../../auth/check.login";
import AppFileUploader from "../../components/AppFileUploader.jsx";
import showToast from "../../notifications/showToast.js";
import {Toast} from "primereact/toast";
import AppFilesUploader from "../../components/AppFilesUploader.jsx";

const NewBusiness =()=>{

    const {token}=getLogin();
    const {isExpired} =useJwt(token);
    const navigate=useNavigate();
    const toast=useRef(null);

    if(!token || isExpired){
        navigate("/")
    }

    const setShowUploadToast=(type,summary, detail)=>{
        showToast(toast,type,summary, detail);
    }

    return (
        <>
            <Toast ref={toast} />
            {/*<AppFileUploader setFilePath={()=>alert('hi')} token={token} setShowUploadToast={setShowUploadToast} />*/}
           <AppFilesUploader token={token} />
        </>
    )
}

export default NewBusiness;