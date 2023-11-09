import React, {createRef, useState} from 'react';
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import Login from "../screens/login.jsx";
import './app.menu.css'
import {Toast} from "primereact/toast";
import EditUserDialog from "../screens/admin/edit.user.dialog.jsx";
import showToast from "../notifications/showToast.js";
import Register from "../screens/Register.jsx";

const UserMenu =({login, userMenu, changeColor}) => {
    const logins=(login && login!=='undefined')?JSON.parse(login):null;
    const [openLoginDialog, setOpenLoginDialog] = useState(false);
    const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
    const toast=createRef();

    const showSuccessFeedback=()=>{
        showToast(toast,'success','Operation Feedback','Operation completed successfully!')
    }

    const showErrorFeedback=(error)=>{
        showToast(toast,'error','Operation Feedback',error.toString())
    }

    return (
        <>
            <Toast ref={toast} position={'center'} />
            <div className="flex flex-grow-1 col-4   flex flex-row justify-content-end">
                <div className={'sm:flex-column row-gap-8 sm:row-gap-1'}>
                    <Button className={'px-2'} label={'Register'} text={true} style={{color:'white'}} onClick={()=>{
                        setOpenRegisterDialog(true)
                    }} />
                    <Button className={'px-2'} label={'Sign In'} text={true} style={{color:'white'}} onClick={()=>{
                        setOpenLoginDialog(true)
                    }} />
                </div>

                <div className={'sm:col-0'}>
                    <Button label={(logins?.lastName || '') + ' ' + (logins?.firstName || '')} outlined={true} severity={"success"}
                            rounded text raised style={{fontSize: '1rem', opacity: 0.9, color: changeColor?"white":"forestgreen"}} icon="pi pi-user"
                            onClick={(e) => userMenu.current.toggle(e)}/>
                </div>


            </div>
            <Dialog visible={openLoginDialog} style={{ borderRadius: '40px' }} sx={{width:'100%'}} onHide={() => setOpenLoginDialog(false)}>
                <Login showLoginDialog={setOpenLoginDialog}/>
            </Dialog>

            <Dialog visible={openRegisterDialog} style={{ borderRadius: '40px' }} sx={{width:'100%'}} onHide={() => setOpenRegisterDialog(false)}>
                <Register showSuccessFeedback={showSuccessFeedback} showErrorFeedback={showErrorFeedback} setRegisterDialogVisible={setOpenRegisterDialog}  />
            </Dialog>


        </>

    )
}
    export default UserMenu;

