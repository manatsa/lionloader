import React from 'react';
import useLoginContext from "../../context/use.login.context";
import {useJwt} from "react-jwt";
import {useNavigate} from "react-router-dom";

const Renewals =()=>{
    const {token}=useLoginContext();
    const {isExpired} =useJwt(token);
    const navigate=useNavigate();

    if(!token || isExpired){
        navigate("/")
    }

    return (
        <>
            <div>Renewals</div>
        </>
    )
}

export default Renewals;