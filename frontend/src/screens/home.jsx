import React, {useEffect} from 'react';
import "./accordions.css"
import useLoginContext from "../context/use.login.context";
import {useNavigate} from 'react-router-dom';
import {useJwt} from "react-jwt";
import {Box, Container} from "@mui/material";
import AppCarousel from "./app.carousel.jsx";
import Zimnat1 from '../assets/zimnat.png';
import Zimnat2 from '../assets/zimnat-logo.png';
import Zimnat3 from '../assets/zimnat-vehicle.png';


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
                <Box style={{width:'100%'}}>
                    <AppCarousel items={items} />
                </Box>
            </Container>
        </>
    )
}

export default Home;
