import {Dialog} from "primereact/dialog";
import {Typography} from "@mui/material";
import {useRef, useState} from "react";
import {Password} from "primereact/password";
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import useLoginContext from "../../context/use.login.context";
import postToAPI from "../../api/postToAPI";
import showToast from "../../notifications/showToast";



const ChangePasswordDialog =({visible, setVisible,data})=>{
    const[newPassword, setNewPassword] = useState('');
    const[indicator, setIndicator]=useState(false);
    const toast=useRef(null)
    const {token}=useLoginContext();

    const changePasswordSubmit= async (body)=>{
        const response = await postToAPI(token, '/users/changePassword',JSON.stringify(body),setIndicator);
        showToast(toast,'success','Action Feedback',"Password changed successfully!")
        setVisible(false);
    }

    return (
        <>
            <Dialog header={()=><div
                style={{width:'90%', backgroundColor:'forestgreen', padding: '20px', borderRadius:20, color:'white', margin: 10}}
            >
                {data?.lastName +' '+data?.firstName}</div>} visible={visible} onHide={() => setVisible(false)}
                    style={{ width: '30vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>

                <Toast ref={toast}/>
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
                                rows={5}
                                inputStyle={{width:'100%'}}
                                style={{width:'100%'}}
                                cols={30}
                                value={newPassword}
                                feedback={false}
                                onChange={e=>setNewPassword(e.target.value)}
                                autoFocus={true}
                                toggleMask={true}
                            />
                            <label htmlFor="newPass" style={{width:'100%'}}>Password</label>
                        </span>
                        <br/>
                        <br/>
                        <div style={{width:'100%'}} align={'center'} >
                            <Button label="Submit" type="button" icon="pi pi-check" severity={'success'} outlined onClick={()=>{
                                const body={"userId":data?.id,"newPassword":newPassword}
                                if(!newPassword || newPassword?.length<6){
                                    showToast(toast,'error','Invalid Data','Your password is too short. Expecting at least 6 characters!');
                                }else{
                                    changePasswordSubmit(body);
                                    setNewPassword('');
                                }

                            }} style={{width:'100%'}}/>
                        </div>

                    </div>
                </div>

            </Dialog>
        </>
    )
}

export default ChangePasswordDialog;