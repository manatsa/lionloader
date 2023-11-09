import React, {useEffect} from 'react';
import {decodeToken, useJwt} from "react-jwt";
import {useNavigate} from "react-router-dom";

const CheckLogin=({children})=>{
    const token=localStorage.getItem('token');
    const login=localStorage.getItem('login');
    const navigate= useNavigate();
    if(!token && token?.length<10){
        navigate('/')
    }
    return <> {children} </>
}

const getLogin=()=>{
    const token=localStorage.getItem('token');
    const login=localStorage.getItem('login');
    return {token,login};
}

export   {CheckLogin, getLogin};