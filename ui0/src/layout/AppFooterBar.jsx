import React from 'react';
import {Button} from "primereact/button";
import {Menubar} from "primereact/menubar";
import {Menu} from "primereact/menu";
import {Toast} from "primereact/toast";
import ProfileDialog from "../screens/admin/profile.dialog.jsx";
import ChangePasswordDialog from "../screens/admin/change.password.dialog.jsx";
import {useNavigate} from "react-router-dom";
import Logo from '../assets/logo.png'
import CssBaseline from "@mui/material/CssBaseline";
import {AppBar} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu.js";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const AppFooterBar = () =>{
const navigate=useNavigate();
const endContent = <>
    <a href={'#'} onClick={()=>navigate("/home")}>
        <img alt="logo" src={Logo} height="40" className="mr-2" onClick={()=>navigate("/home")} />
    </a>
    <i className="pi  p-menu-separator mr-2" style={{width:'3vw'}} />
</>
    const start=<>
        <i className="pi  p-menu-separator mr-2" style={{width:'3vw'}} />
        <small >Copyright &copy; 2023. All rights reserved. </small>
    </>

return (
    <div className="card" style={{width:'100%'}}>
        {/*<Menubar  start={start} end={endContent} style={{border:'0.1px solid forestgreen', color: 'forestgreen', margin:'2%'}} />*/}
        <Box sx={{ display: 'flex' }} className={'appBar'}>
            <CssBaseline />
            <AppBar component="nav" color={'success'} >
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        <a href={''} onClick={()=>navigate("/home")} style={{color:'white'}}> ZIMNAT LION INSURANCE </a>
                    </Typography>

                </Toolbar>
            </AppBar>
        </Box>
    </div>
)
}

export default AppFooterBar;


