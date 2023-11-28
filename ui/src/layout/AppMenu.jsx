import React, {useRef, useState} from "react";
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {AppBar, Button, Icon} from "@mui/material";
import {Sidebar} from "primereact/sidebar";
import {useNavigate} from "react-router-dom";
import {useJwt} from "react-jwt";
import showToast from "../notifications/showToast.js";
import {Toast} from "primereact/toast";
import {Menu} from "primereact/menu";
import ProfileDialog from "../screens/admin/profile.dialog.jsx";
import ChangePasswordDialog from "../screens/admin/change.password.dialog.jsx";
import UserMenu from "./userMenu";
import {PanelMenu} from "primereact/panelmenu";
import './app.menu.css'
import {getLogin} from "../auth/check.login";






export default function AppMenu() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const navigate=useNavigate();
    const {token, login} = getLogin();
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
                localStorage.setItem('token', null);
                localStorage.setItem('login', null);
                setOpen(false);
                navigate("/")
            }
        }
    ];
    const items = [
        {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            expanded:false,
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
            label: 'System Admin',
            icon: 'pi pi-fw pi-slack',
            expanded:JSON.parse(login)?.roles?.includes('ADMIN'),
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
        {

            label: 'Operations Admin',
            icon: 'pi pi-fw pi-folder-open',
            expanded: JSON.parse(login)?.roles?.includes('PRODUCT') || JSON.parse(login)?.roles?.includes('ADMIN'),
            items: [
                {
                    label: 'Icecash Bulk Upload',
                    icon: 'pi pi-fw pi-sitemap',
                    command: ()=>{
                        if(token && !isExpired && JSON.parse(login)?.roles?.includes('ADMIN')){
                            navigate("/icecash")
                            setOpen(false)
                        }else{
                            showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                            navigate("/")
                        }
                    }
                },
                {
                    label: 'Bank Bulk Upload',
                    icon: 'pi pi-fw pi-server',
                    command: ()=>{
                        if(token && !isExpired && JSON.parse(login)?.roles?.includes('ADMIN')){
                            navigate("/category")
                            setOpen(false)
                        }else{
                            showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                        }
                    }
                },
                {
                    label: 'Broker Bulk Upload',
                    icon: 'pi pi-fw pi-flag',
                    command: ()=>{
                        if(token && !isExpired){
                            navigate("/product")
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



    ];

    const showSuccessFeedback=()=>{
        showToast(toast,'success','Operation Feedback','Operation completed successfully!')
    }

    const showErrorFeedback=(error)=>{
        showToast(toast,'error','Operation Feedback',error.toString())
    }

    return (
        <Box sx={{ display: 'flex' }} className={'appBar'}>
            <CssBaseline />
            <AppBar component="nav" style={{backgroundColor:'forestgreen'}} >
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={()=>{
                            if(token!==null && login!==null){
                                setOpen(true)
                            }else{
                                showToast(toast,'error','Access denied!','Please login to have access to the menu!')
                            }
                        }}
                    >
                        { login && token && <MenuIcon style={{marginRight:10}}/>}

                    </IconButton>

                    <div className={'flex justify-content-between'} style={{width:'100%'}}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            className={'flex justify-content-center'}
                        >
                            <a href={''} onClick={()=>navigate("/home")} style={{color:'white'}}> ZIMNAT LION INSURANCE </a>
                        </Typography>

                        <UserMenu userMenu={userMenu} login={login} changeColor={true} />
                    </div>
                </Toolbar>
            </AppBar>

            <Menu model={userMenuItems} popup ref={userMenu} color={'green'} style={{backgroundColor: "white", color:'var(--primary-color-text)'}} />
            <Toast ref={toast} position={'center'}/>
            <ProfileDialog visible={profileVisible} setVisible={setProfileVisible} data={JSON.parse(login)} />
            <ChangePasswordDialog  setChangePasswordVisible={setChangePasswordVisible} selectedUser={JSON.parse(login)}
                changePasswordVisible={changePasswordVisible} token={token} showSuccessFeedback={showSuccessFeedback} showErrorFeedback={showErrorFeedback} />

            <div className="card flex justify-content-center">
                <Sidebar visible={open} onHide={() => setOpen(false)} className="w-full md:w-20rem lg:w-30rem" closeOnEscape={true}>
                    <div className="card flex flex-column justify-content-center">
                        <div  style={{marginBottom:30}} className={'flex justify-content-end'}>
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