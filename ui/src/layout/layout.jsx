import React from 'react';
import AppFooterBar from "./AppFooterBar.jsx";
import AppMenu from "./AppMenu";
import {useNavigate} from "react-router-dom";
import Login from "../screens/login";
import {Container} from "@mui/material";

const Layout =({children})=>{

    return (
           <>
                <AppMenu />
                <div style={{width:'100%'}} className={'flex justify-content-center'} >
                    <Container style={{width:'100%',padding: '5%'}}>
                        {children}
                    </Container>
                </div>
           </>

    )
}

export default Layout;