import React from 'react';
import {Button} from "primereact/button";
import {Menubar} from "primereact/menubar";
import {Menu} from "primereact/menu";
import {Toast} from "primereact/toast";
import ProfileDialog from "../screens/admin/profile.dialog.jsx";
import ChangePasswordDialog from "../screens/admin/change.password.dialog.jsx";
import {useNavigate} from "react-router-dom";
import Logo from '../assets/logo.png'

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
    <div className="card" style={{position:'fixed', bottom:0, width:'100%'}}>
        <Menubar  start={start} end={endContent} style={{border:'0.1px solid forestgreen', color: 'forestgreen', marginLeft:0, marginRight:0}} />
    </div>
)
}

export default AppFooterBar;


