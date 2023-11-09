import React, {useEffect, useRef} from 'react';
import "./accordions.css"
import {useNavigate} from 'react-router-dom';
import {useJwt} from "react-jwt";
import {Box, Container} from "@mui/material";
import AppCarousel from "./app.carousel.jsx";
import Zimnat1 from '../assets/zimnat.png';
import Zimnat2 from '../assets/zimnat-logo.png';
import Zimnat3 from '../assets/zimnat-vehicle.png';
import {getLogin} from "../auth/check.login";
import {Toast} from "primereact/toast";


const Home = () => {

    const {token, login}=getLogin();
    const {isExpired} =useJwt(token);
    const navigate=useNavigate();
    const toast=useRef(null)

    useEffect(()=>{
        if(!token || isExpired ){
            navigate("/")
        }else {
            /*if(!login['privileges']?.includes('ADMIN')){
                showToast(toast,'error','Error 401: Access Denied','You do not have access to this resource!');
                window.history.back();
            }*/
        }
    },[])


    const items=[
        {
            title:'Underwriting Module',
            description:'Underwriting',
            image: Zimnat1
        },
        {
            title:'Finance Module',
            description:'Finance module does bulk upload of payments made to our service providers like panel beaters, assessors, etc.',
            image: Zimnat2
        },
        {
            title:'Administration Module',
            description:'admin',
            image: Zimnat3
        }
    ]

    return (
        <>
            <Container style={{width:'100%'}}>
                <Toast ref={toast} position={'center'} />
                <Box style={{width:'100%'}}>
                    <AppCarousel items={items} />
                </Box>
            </Container>
        </>
    )
}

export default Home;
