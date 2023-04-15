/*import React, {useRef, useState} from 'react';
import "./menu.bar.css";
import {useNavigate} from 'react-router-dom';
import useLoginContext from "../context/use.login.context";
import {useJwt} from "react-jwt";
import {Toast} from "primereact/toast";
import showToast from "../notifications/showToast";
import {Menu} from "primereact/menu";
import {Button} from "primereact/button";
import ProfileDialog from "../screens/admin/profile.dialog";
import {Toolbar} from "primereact/toolbar";
import ChangePasswordDialog from "../screens/admin/change.password.dialog";

export default function  AppMenuBar() {
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
                navigate("/")
            }
        }
];

    const underwritingItems = [
                {
                    label: 'New Business',
                    icon: 'pi pi-fw pi-plus',
                    command: ()=>{
                        if(token && !isExpired){
                            navigate("/new/business")
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
                        }else{
                            showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                        }
                    }
                },
            ]

    const financeItems= [
                {
                    label: 'Receipts',
                    icon: 'pi pi-fw pi-dollar',
                    command: ()=>{
                        if(token && !isExpired){
                            navigate("/receipts")
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
                        }else{
                            showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                        }
                    }
                }
            ]

    const generalItems= [
                {
                    label: 'User Admin',
                    icon: 'pi pi-fw pi-users',
                    command: ()=>{
                        if(token && !isExpired){
                            navigate("/users")
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
                            navigate("/settings")
                        }else{
                            showToast(toast,"error", "Error 401: Access Denied","You are not authorized to access this resource, please login with privileged account.");
                        }
                    }

                }

            ];

    const startContent = (<>
            <i className="pi  p-toolbar-separator mr-2" />
            <i className="pi  p-toolbar-separator mr-2" />
            <i className="pi  p-toolbar-separator mr-2" />
            <img alt="logo" src={process.env.PUBLIC_URL+"logo.png"} height="40" className="mr-2" />
            <i className="pi  p-toolbar-separator mr-2" />
            <Button label={'Home'} severity={'success'} text raised style={{color:"white"}} icon={'pi pi-home'} onClick={()=>navigate('/home')} />
            <i className="pi  p-toolbar-separator mr-2" />
            <Button label={'Underwriting Admin'} outlined={true} severity={"success"}  text raised style={{color:"white" }} icon="pi pi-file-import" onClick={(e) => underwritingMenu.current.toggle(e)} />
            <i className="pi  p-toolbar-separator mr-2" />
            <Button label={'Finance Admin'} outlined={true} severity={"success"}  text raised style={{color:"white" }} icon="pi pi-dollar" onClick={(e) => financeMenu.current.toggle(e)} />
            <i className="pi  p-toolbar-separator mr-2" />
            <Button label={'General Admin'} outlined={true} severity={"success"}  text raised style={{color:"white" }} icon="pi pi-map" onClick={(e) => generalMenu.current.toggle(e)} />
        </>);
    const endContent = <>
        <Button label={(login?.lastName || '')+' '+(login?.firstName||'')} outlined={true} severity={"success"} rounded text raised style={{fontSize:'1rem',opacity:0.9, color:"white" }} icon="pi pi-user" onClick={(e) => userMenu.current.toggle(e)} />
        <i className="pi  p-toolbar-separator mr-2" /><i className="pi  p-toolbar-separator mr-2" /><i className="pi  p-toolbar-separator mr-2" />
    </>

    return (
        <div className="card">
            {/!*<Menubar model={items} start={start} end={end} style={{color:"white", fontWeight:"bolder"}} />*!/}
            <div className="card" >
                <Toolbar start={startContent} end={endContent} style={{backgroundColor:'forestgreen'}}/>
            </div>
            <Menu model={userMenuItems} popup ref={userMenu} color={'green'} style={{backgroundColor: "transparent"}} />
            <Menu model={underwritingItems} popup ref={underwritingMenu} color={'green'}  />
            <Menu model={financeItems} popup ref={financeMenu} color={'green'} style={{color:'green'}}  />
            <Menu model={generalItems} popup ref={generalMenu} color={'green'} />
            <Toast ref={toast} position={'center'}/>
            <ProfileDialog visible={profileVisible} setVisible={setProfileVisible} data={login} />
            <ChangePasswordDialog visible={changePasswordVisible} setVisible={setChangePasswordVisible} data={login} />
        </div>
    )
}*/

import React, {useRef, useState} from 'react';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import {Menu} from "primereact/menu";
import {Button} from "primereact/button";
import {useNavigate} from "react-router-dom";
import {useJwt} from "react-jwt";
import useLoginContext from "../context/use.login.context";
import showToast from "../notifications/showToast";
import {Toast} from "primereact/toast";
import ProfileDialog from "../screens/admin/profile.dialog.jsx";
import ChangePasswordDialog from "../screens/admin/change.password.dialog.jsx";
import "./menu.bar.css";
import Logo from '../assets/logo.png';

export default function AppMenuBar() {
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
                navigate("/")
            }
        }
    ];

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
        },
        {

            label: 'Underwriting Admin',
            icon: 'pi pi-fw pi-folder-open',
            items: [
                {
                    label: 'New Business',
                    icon: 'pi pi-fw pi-plus',
                    command: ()=>{
                        if(token && !isExpired){
                            navigate("/new/business")
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
            items: [
                {
                    label: 'Receipts',
                    icon: 'pi pi-fw pi-paperclip',
                    command: ()=>{
                        if(token && !isExpired){
                            navigate("/receipts")
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
            items: [
                {
                    label: 'Users',
                    icon: 'pi pi-fw pi-users',
                    command: ()=>{
                        if(token && !isExpired){
                            navigate("/users")
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
                            navigate("/roles")
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
                            navigate("/privileges")
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
                            navigate("/settings")
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

    const start = <><i className="pi  p-menu-separator mr-2" style={{width:'3vw'}} />
        <a href={'#'} onClick={()=>navigate("/home")} ><img alt="logo" src={Logo} height="40" className="mr-2" /></a>
    </>;
    const endContent = <>
            <Button label={(login?.lastName || '')+' '+(login?.firstName||'')} outlined={true} severity={"success"} rounded text raised style={{fontSize:'1rem',opacity:0.9, color:"forestgreen" }} icon="pi pi-user" onClick={(e) => userMenu.current.toggle(e)} />
            <i className="pi  p-menu-separator mr-2" style={{width:'3vw'}} />
    </>

    return (
        <div  style={{width:'100%'}}>
            <Menubar model={items} start={start} end={endContent}  />
            <Menu model={userMenuItems} popup ref={userMenu} color={'green'} style={{backgroundColor: "white", color:'var(--primary-color-text)'}} />
            <Toast ref={toast} position={'center'}/>
            <ProfileDialog visible={profileVisible} setVisible={setProfileVisible} data={login} />
            <ChangePasswordDialog visible={changePasswordVisible} setVisible={setChangePasswordVisible} data={login} />
        </div>
    )
}

