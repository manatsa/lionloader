import React, {useEffect, useRef, useState} from "react";
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
import {PrimaryColor} from "../components/Constants.jsx";






export default function AppMenu() {

    const [open, setOpen] = React.useState(false);
    const navigate=useNavigate();
    const {token, login} = getLogin();
    const {isExpired} = useJwt(token);
    const toast = useRef(null);
    const userMenu = useRef(null);
    const [appName, setAppName]= useState('');
    const [logged, setLogged] = useState(false);

    // alert(login!=='undefined')
    useEffect(()=>{
        setAppName("A . B . M")
        setLogged(true)
    },[appName,login])

    const [profileVisible, setProfileVisible]= useState(false);
    const [changePasswordVisible, setChangePasswordVisible]= useState(false);

    const userMenuItems =
        [
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
    const items =
        [
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
            expanded: login && login!=='undefined' &&  JSON.parse(login || {})?.roles?.includes('ADMIN'),
            items: [
                {
                    label: 'Users',
                    icon: 'pi pi-fw pi-users',
                    command: ()=>{
                        if(token && login && login!=='undefined' && !isExpired && JSON.parse(login)?.roles?.includes('ADMIN')){
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
                        if(token && login && login!=='undefined' && !isExpired && JSON.parse(login)?.roles?.includes('ADMIN')){
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
                        if(token && login && login!=='undefined' && !isExpired && JSON.parse(login)?.roles?.includes('ADMIN')){
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
                        if(token && login && login!=='undefined' && !isExpired && JSON.parse(login)?.roles?.includes('ADMIN')){
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

            label: 'Industry Admin',
            icon: 'pi pi-fw pi-folder-open',
            expanded: login && login!=='undefined' &&  JSON.parse(login||{})?.roles?.includes('UNDERWRITING'),
            items: [
                {
                    label: 'Industry Admin',
                    icon: 'pi pi-fw pi-plus',
                    command: ()=>{
                        if(token && !isExpired){
                            navigate("/industry")
                            setOpen(false)
                        }else{
                            showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                            navigate("/")
                        }
                    }
                },
                {
                    label: 'Category',
                    icon: 'pi pi-fw pi-undo',
                    command: ()=>{
                        if(token && !isExpired){
                            navigate("/category")
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
            label: 'Product Admin',
            icon: 'pi pi-fw pi-dollar',
            expanded: login && login!=='undefined' && JSON.parse(login || {})?.roles?.includes('FINANCE'),
            items: [
                {
                    label: 'Product Admin',
                    icon: 'pi pi-fw pi-paperclip',
                    command: ()=>{
                        if(token && !isExpired){
                            navigate("/product");
                            setOpen(false);
                        }else{
                            showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                        }
                    }
                },
                {
                    label: 'Subscriptions',
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


    ];

    const showSuccessFeedback=()=>{
        showToast(toast,'success','Operation Feedback','Operation completed successfully!')
    }

    const showErrorFeedback=(error)=>{
        showToast(toast,'error','Operation Feedback',error.toString())
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar component="nav" style={{backgroundColor:PrimaryColor}}>
                <Toolbar>
                    <div className={' flex flex-row align-items-center'}>
                        <IconButton
                            size="medium"
                            edge="start"
                            style={{color:'white'}}
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
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            className={'flex justify-content-center sx:col-0'}
                        >
                            <a className={'sx:col-0'} href={''} onClick={()=>navigate("/")} style={{color:'white'}}> {appName} </a>
                        </Typography>
                    </div>


                    <div className={'flex flex-1  justify-content-end}'}>
                        <UserMenu userMenu={userMenu} login={login} changeColor={true} />
                    </div>
                </Toolbar>
            </AppBar>

            <Menu model={userMenuItems} popup ref={userMenu} color={'green'} style={{backgroundColor: "white", color:PrimaryColor}} />
            <Toast ref={toast} position={'center'}/>
            <ProfileDialog visible={profileVisible} setVisible={setProfileVisible} data={login && login!=='undefined'?JSON.parse(login):null} />
            <ChangePasswordDialog  setChangePasswordVisible={setChangePasswordVisible} selectedUser={login && login!=='undefined'?JSON.parse(login):null}
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