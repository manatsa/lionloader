import React from 'react';
import {useJwt} from "react-jwt";
import {useNavigate} from "react-router-dom";
import {getLogin} from "../../auth/check.login";

const Receipts=()=>{

    const {token}=getLogin();
    const {isExpired} =useJwt(token);
    const navigate=useNavigate();

    if(!token || isExpired){
        navigate("/")
    }

    return (
        <>
            <div>Receipts</div>
        </>
    )
}

export default Receipts;