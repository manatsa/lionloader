import React from 'react';
import useLoginContext from "../../context/use.login.context";
import {useJwt} from "react-jwt";
import {useNavigate} from "react-router-dom";

const Payments = () => {
    const {token}=useLoginContext();
    const {isExpired} =useJwt(token);
    const navigate=useNavigate();

    if(!token || isExpired){
        navigate("/")
    }

    return (
        <>
            <h2>Payments</h2>
        </>
    )
}

export default Payments;