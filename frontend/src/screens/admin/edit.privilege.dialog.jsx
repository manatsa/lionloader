import React, {useEffect, useRef, useState} from 'react';
import useLoginContext from "../../context/use.login.context";
import {useJwt} from "react-jwt";
import {useNavigate} from "react-router-dom";
import GetFromAPI from "../../api/getFromAPI";
import {Toast} from "primereact/toast";
import {ProgressSpinner} from "primereact/progressspinner";
import {InputText} from "primereact/inputtext";
import {classNames} from "primereact/utils";
import {Dropdown} from "primereact/dropdown";
import {Checkbox} from "primereact/checkbox";
import {MultiSelect} from "primereact/multiselect";
import {Button} from "primereact/button";
import * as yup from "yup";
import PostToApi from "../../api/postToAPI";
import showToast from "../../notifications/showToast";
import {useFormik} from "formik";
import FormControlLabel from "@mui/material/FormControlLabel";

const EditPrivilegeDialog = ({openNewPrivilegeDialog,setEditPrivilegeDialogVisible, privilege}) =>{
    const toast=useRef(null);
    const {token, login}=useLoginContext();
    const {isExpired} =useJwt(token);
    const navigate=useNavigate();
    const[indicator, setIndicator]=useState(false);
    const [privileges, setPrivileges] = useState([]);

    showToast(toast, 'Role', JSON.stringify(privilege))
    const initialValues={
        id:privilege?.id ||'',
        name:privilege?.name||'',
    }

    const validationSchema=yup.object().shape({
        name: yup.string().required("Please enter role name."),
        active: yup.boolean(),
    })
    const onSubmit= (values)=>{

        PostToApi(token, 'api/privileges/',JSON.stringify(values),setIndicator).then(res=>{

            if(res?.status===200 || res?.status===201){
                showToast(toast, 'success', 'Privilege Creation',`Role ${role?.name} was created successfully!`);
            }else{
                // console.log(res)
                showToast(toast, 'error', 'Privilege Creation Error',res?.data);
            }
        }).catch(error=>{
            showToast(toast, 'error', 'Privilege Creation Error',`Role created error :: ${error}`);
        });
        formik.resetForm();
        setEditPrivilegeDialogVisible(false)
    }

    const formik=useFormik({
        initialValues,validationSchema,onSubmit
    })

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };

    const privilegeObject=privileges?.map(p=>{
        return {name:p, code:p};
    })
    return (
        <div>

            <Toast ref={toast} />
            {indicator && <div className="card flex justify-content-center"> <ProgressSpinner style={{zIndex:1000}}/></div>}
            <form onSubmit={formik.handleSubmit} className="flex flex-column gap-2" >
                <div className={'grid'}>
                    <div className={'col-12 md:col-12'}>
                        <span className="p-float-label">
                            <InputText id="name" name="name" value={formik.values['name']} onChange={(e) => {formik.setFieldValue('name', e.target.value);}}
                                       className={classNames({ 'p-invalid': isFormFieldInvalid('name') })} style={{width:'100%'}}
                            />
                            <label htmlFor="name">Role Name</label>
                        </span>
                        {getFormErrorMessage('name')}
                    </div>

                    <div className={'col-12 md:col-12'}>
                        <FormControlLabel control={<Checkbox value={formik.values['active']} color="success" variant={'standard'}/>} label="Active"
                        />
                    </div>
                </div>

                <br/>
                <div className={'flex justify-content-end'}>
                    <Button  severity={'success'} outlined={true} type="submit" label="Save" />
                </div>
            </form>
        </div>
    )
}

export  default  EditPrivilegeDialog;