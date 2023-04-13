import React, {useEffect} from 'react';
import "./accordions.css"
import useLoginContext from "../context/use.login.context";
import {useNavigate} from 'react-router-dom';
import {useJwt} from "react-jwt";
import {Box, Container} from "@mui/material";
import AppCarousel from "./app.carousel.jsx";


const Home = () => {

    const {token}=useLoginContext();
    const {isExpired} =useJwt(token);
    const navigate=useNavigate();

    useEffect(()=>{
        if(!token || isExpired){
            navigate("/")
        }
    })


    const items=[
        {
            title:'Underwriting Module',
            description:'Underwriting',
            severity:'success',
            category: 'underwriting',
            image: import("../assets/zimnat-logo.png")
        },
        {
            title:'Finance Module',
            description:'Finance module does bulk upload of payments made to our service providers like panel beaters, assessors, etc.',
            severity:'error',
            category: 'finance',
            image: import("../assets/zimnat.png")
        },
        {
            title:'Administration Module',
            description:'admin',
            severity:'info',
            category: 'admin',
            image: import("../assets/zimnat-vehicle.png")
        }
    ]

    return (
        <>
            <Container style={{width:'100%'}}>
                <Box style={{width:'100%'}}>
                    <AppCarousel items={items} />
                </Box>
            </Container>
        </>
    )
}

export default Home;
