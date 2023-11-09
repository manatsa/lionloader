import {Dialog} from "primereact/dialog";
import {Typography} from "@mui/material";
import {useRef, useState} from "react";
import {Password} from "primereact/password";
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import postToAPI from "../../api/postToAPI";
import showToast from "../../notifications/showToast";
import {getLogin} from "../../auth/check.login";
import {useMutation} from "@tanstack/react-query";
import doUpdate from "../../query/doUpdate.js";



const ChangePasswordDialog =({changePasswordVisible,setChangePasswordVisible,token,selectedUser, showErrorFeedback, showSuccessFeedback})=>{
    const[newPassword, setNewPassword] = useState('');
    const[indicator, setIndicator]=useState(false);
    const restPasswordMutation = useMutation({
        mutationFn:data=>doUpdate(`/api/users/changePassword/`,token,newPassword,selectedUser),
        onError: error=>{
            setIndicator(false);
            showErrorFeedback(error);
        },
        onMutate: ()=>setIndicator(true),
        onSuccess:(data)=>{
            setIndicator(false);
            showSuccessFeedback();
            setNewPassword(null)
        }
    });

    const changePasswordSubmit= async ()=>{
        setChangePasswordVisible(false);
        restPasswordMutation.mutate({id:newPassword, password: newPassword})

    }

    return (
        <>
            <Dialog header={()=><div
                style={{width:'90%', backgroundColor:'forestgreen', padding: '20px', borderRadius:20, color:'white', margin: 10}}
            >
                {selectedUser?.lastName +' '+selectedUser?.firstName}</div>} visible={changePasswordVisible} onHide={() => setChangePasswordVisible(false)}
                    style={{ width: '30vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} className={'sx:w-11 md:w-5'}>

                {indicator && <div className="card flex justify-content-center"> <ProgressSpinner /></div>}
               <div>
                    <Typography style={{fontSize: '2rem'}} color={'green'} className={'success'}>
                        Enter New Password
                    </Typography><br/><br/>
                    <div>
                        <span className="p-float-label">
                            <Password
                                inputId="newPass"
                                name="newPass"
                                min={6}
                                maxLength={16}
                                inputStyle={{width:'100%'}}
                                style={{width:'100%'}}
                                value={newPassword}
                                feedback={true}
                                onChange={e=>setNewPassword(e.target.value)}
                                autoFocus={true}
                                toggleMask={true}
                            />
                            <label htmlFor="newPass" style={{width:'100%'}}>Password</label>
                        </span>
                        <br/>
                        <br/>
                        <div style={{width:'100%'}} className={'flex justify-content-center'} >
                            <Button label="Submit" type="button" icon="pi pi-check" severity={'success'} outlined onClick={()=> changePasswordSubmit()} style={{width:'100%'}}/>
                        </div>

                    </div>
                </div>

            </Dialog>
        </>
    )
}

export default ChangePasswordDialog;