import React, {useRef, useState} from "react";
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {AppBar, Button} from "@mui/material";
import {Sidebar} from "primereact/sidebar";
import {useNavigate} from "react-router-dom";
import useLoginContext from "../context/use.login.context.js";
import {useJwt} from "react-jwt";
import showToast from "../notifications/showToast.js";
import {Toast} from "primereact/toast";
import {Menu} from "primereact/menu";
import ProfileDialog from "../screens/admin/profile.dialog.jsx";
import ChangePasswordDialog from "../screens/admin/change.password.dialog.jsx";
import UserMenu from "./userMenu";
import {PanelMenu} from "primereact/panelmenu";
import './app.menu.css'






export default function AppMenu({children}) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const navigate=useNavigate();
    const {token, setToken, login, setLogin} = useLoginContext();
    const {isExpired} = useJwt(token);
    const toast = useRef(null);
    const userMenu = useRef(null);
    const underwritingMenu = useRef(null);
    const financeMenu = useRef(null);
    const generalMenu = useRef(null);

    const [profileVisible, setProfileVisible]= useState(false);
    const [changePasswordVisible, setChangePasswordVisible]= useState(false);

    const userMenuItems = [
        {
            label: 'User Operations',
            items: [
                {
                    label: 'Profile',
                    icon: 'pi pi-users',
                    command: () => {
                        if(token && !isExpired){
                            setProfileVisible(true)
                        }else{
                            showToast(toast, 'error', 'Error 401: Access Denied','You need to log in to see profile details!')
                        }
                    }
                },
                {
                    label: 'Change Password',
                    icon: 'pi pi-sync',
                    command: () => {
                        if(token && !isExpired){
                            setChangePasswordVisible(true);
                        }else{
                            showToast(toast, 'error', 'Error 401: Access Denied','You need to log in to see profile details!')
                        }
                    }
                }
            ]
        },
        {
            separator: true
        },
        {
            label: 'Logout',
            icon: 'pi pi-fw pi-sign-out',
            command:()=>{
                setToken(null);
                setLogin(null)
                localStorage.setItem('token', null);
                navigate("/")
            }
        }
    ];
    const items = [
        {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            expanded:true,
            command:()=> {
                if(token && !isExpired){
                    navigate("/home")
                    setOpen(false)
                }else{
                    showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                    navigate("/")
                }
            }
        },
        {

            label: 'Underwriting Admin',
            icon: 'pi pi-fw pi-folder-open',
            expanded:true,
            items: [
                {
                    label: 'New Business',
                    icon: 'pi pi-fw pi-plus',
                    command: ()=>{
                        if(token && !isExpired){
                            navigate("/new/business")
                            setOpen(false)
                        }else{
                            showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                            navigate("/")
                        }
                    }
                },
                {
                    label: 'Renewals',
                    icon: 'pi pi-fw pi-undo',
                    command: ()=>{
                        if(token && !isExpired){
                            navigate("/renewals")
                            setOpen(false)
                        }else{
                            showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                        }
                    }
                },
                {
                    separator: true
                },
                {
                    label: 'Reports',
                    icon: 'pi pi-fw pi-external-link'
                }
            ]
        },
        {
            label: 'Finance Admin',
            icon: 'pi pi-fw pi-dollar',
            expanded:true,
            items: [
                {
                    label: 'Receipts',
                    icon: 'pi pi-fw pi-paperclip',
                    command: ()=>{
                        if(token && !isExpired){
                            navigate("/receipts");
                            setOpen(false);
                        }else{
                            showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                        }
                    }
                },
                {
                    label: 'Payments',
                    icon: 'pi pi-fw pi-shopping-cart',
                    command: ()=>{
                        if(token && !isExpired){
                            navigate("/payments")
                            setOpen(false);
                        }else{
                            showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                        }
                    }
                },
                {
                    separator: true
                },
                {
                    label: 'Reports',
                    icon: 'pi pi-fw pi-external-link'
                },

            ]
        },
        {
            label: 'System Admin',
            icon: 'pi pi-fw pi-slack',
            expanded:true,
            items: [
                {
                    label: 'Users',
                    icon: 'pi pi-fw pi-users',
                    command: ()=>{
                        if(token && !isExpired){
                            navigate("/users");
                            setOpen(false);
                        }else{
                            showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                        }
                    }
                },
                {
                    label: 'Roles',
                    icon: 'pi pi-fw pi-lock-open',
                    command: ()=>{
                        if(token && !isExpired){
                            navigate("/roles");
                            setOpen(false);
                        }else{
                            showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                        }
                    }
                },
                {
                    label: 'Privileges',
                    icon: 'pi pi-fw pi-wrench',
                    command: ()=>{
                        if(token && !isExpired){
                            navigate("/privileges");
                            setOpen(false);
                        }else{
                            showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                        }
                    }
                },
                {
                    label: 'Settings',
                    icon: 'pi pi-fw pi-cog',
                    command: ()=>{
                        if(token && !isExpired){
                            navigate("/settings");
                            setOpen(false);
                        }else{
                            showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                        }
                    }
                },
                {
                    separator: true
                },
                {
                    label: 'Reports',
                    icon: 'pi pi-fw pi-external-link',
                }
            ]
        },

    ];

    return (
        <Box sx={{ display: 'flex' }} className={'appBar'}>
            <CssBaseline />
            <AppBar component="nav" color={'success'} >
                <Toolbar>

                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={()=>setOpen(true)}
                    >
                        <MenuIcon style={{marginRight:10}}/>
                    </IconButton>

                    <div style={{width:'100%'}} align={'center'}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                        >
                            <a href={''} onClick={()=>navigate("/home")} style={{color:'white'}}> ZIMNAT LION INSURANCE </a>
                        </Typography>
                    </div>
                </Toolbar>
            </AppBar>

            <Menu model={userMenuItems} popup ref={userMenu} color={'green'} style={{backgroundColor: "white", color:'var(--primary-color-text)'}} />
            <Toast ref={toast} position={'center'}/>
            <ProfileDialog visible={profileVisible} setVisible={setProfileVisible} data={login} />
            <ChangePasswordDialog visible={changePasswordVisible} setVisible={setChangePasswordVisible} data={login} />

            <div className="card flex justify-content-center">
                <Sidebar visible={open} onHide={() => setOpen(false)} className="w-full md:w-20rem lg:w-30rem" closeOnEscape={true}>
                    <div className="card flex flex-column justify-content-center">
                        <div align={'right'} style={{marginBottom:30}}>
                            <UserMenu userMenu={userMenu} login={login} />
                        </div>
                        <div className="card flex justify-content-center ">
                            <PanelMenu multiple={true} model={items} className="w-full md:w-25rem" onClick={()=>{
                                if(!token && isExpired){
                                    showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                                    navigate("/")
                                }
                            }} />
                        </div>
                    </div>
                </Sidebar>

            </div>
        </Box>
    );
}