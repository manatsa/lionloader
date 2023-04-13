import React, {useEffect, useRef, useState} from 'react';
import * as yup from 'yup';
import {useFormik} from "formik";
import {Toast} from "primereact/toast";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import { classNames } from 'primereact/utils';
import {Dropdown} from "primereact/dropdown";
import {Grid} from "@mui/material";
import {Checkbox} from "primereact/checkbox";
import GetFromAPI from "../../api/getFromAPI";
import useLoginContext from "../../context/use.login.context";
import {useJwt} from "react-jwt";
import {useNavigate} from "react-router-dom";
import {MultiSelect} from "primereact/multiselect";
import {ProgressSpinner} from "primereact/progressspinner";
import PostToApi from "../../api/postToAPI";
import showToast from "../../notifications/showToast";

const EditUserDialog=({openNewUserDialog,setEditUserDialogVisible, user})=>{

    const toast=useRef(null);
    const {token, login}=useLoginContext();
    const {isExpired} =useJwt(token);
    const navigate=useNavigate();
    const[indicator, setIndicator]=useState(false);
    const [roles, setRoles] = useState([]);

    const pullData=async ()=>{
        const r= await GetFromAPI(token, 'api/roles/', setIndicator);
        setRoles(r)
        return r;
    }
    useEffect( ()=>{
        const data=pullData();
    },[user])

    const userLevels=[
        {name:'USER', code:'USER'},
        {name:'ADMIN', code:'ADMIN'},
        {name:'MANAGER', code:'MANAGER'},
        {name:'EXECUTIVE',code:'EXECUTIVE'}
    ]

    const roleObject=roles?.map(r=>{
        return {name:r, code:r};
    })
    const initialValues={
        id:user?.id ||'',
        firstName:user?.firstName||'',
        lastName: user?.lastName || '',
        userName: user?.userName || '',
        active: user?.active || false,
        userLevel: {name:user?.userLevel, code:user?.userLevel} || {},
        roles: user?.roles || [],
    }

    const validationSchema=yup.object().shape({
        firstName: yup.string().required("Please enter user's first name."),
        lastName: yup.string().required("Please enter user's last name."),
        userName: yup.string().required("Please enter user's username.").min(4,'Minimum length for a username is 4 characters. '),
        active: yup.boolean(),
        userLevel: yup.string().required("Please select user's level."),
        roles: yup.array().min(1,'You must select at least one role for the user!').nonNullable()
    })
    const onSubmit= (values)=>{
        const roles=values['roles']?.map(r=>r?.name)
        const user={...values, roles};
        PostToApi(token, 'api/users/',JSON.stringify(user),setIndicator).then(res=>{
            if(res?.status===200 || res?.status===201){
                showToast(toast, 'success', 'User Creation',`User ${res?.data?.userName} was created successfully!`);
            }else{
                console.log(res)
                showToast(toast, 'error', 'User Creation Error',`User created error!`);
            }
        }).catch(error=>{
            showToast(toast, 'error', 'User Creation Error',`User created error :: ${error}`);
        });

        formik.resetForm();
    }

    const formik=useFormik({
        initialValues,validationSchema,onSubmit
    })

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };

    return (
        <>
            <Toast ref={toast} />
            {indicator && <div className="card flex justify-content-center"> <ProgressSpinner style={{zIndex:1000}}/></div>}
            <form onSubmit={formik.handleSubmit} className="flex flex-column gap-2" >
                <div className={'grid'}>
                    <div className={'col-12 md:col-6'}>
                        <span className="p-float-label">
                    <InputText id="firstName" name="firstName" value={formik.values['firstName']} onChange={(e) => {formik.setFieldValue('firstName', e.target.value);}}
                               className={classNames({ 'p-invalid': isFormFieldInvalid('firstName') })} style={{width:'100%'}}
                    />
                    <label htmlFor="firstName">User First Name</label>
                </span>
                        {getFormErrorMessage('firstName')}
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <span className="p-float-label">
                    <InputText id="lastName" name="lastName" value={formik.values['lastName']} onChange={(e) => {formik.setFieldValue('lastName', e.target.value);}}
                               className={classNames({ 'p-invalid': isFormFieldInvalid('lastName') })} style={{width:'100%'}}
                    />
                    <label htmlFor="lastName">User Last Name</label>
                </span>
                        {getFormErrorMessage('lastName')}
                    </div>

                    <div className={'col-12 md:col-6'}>
                        <span className="p-float-label">
                            <InputText id="userName" name="userName" value={formik.values['userName']} onChange={(e) => {formik.setFieldValue('userName', e.target.value); console.log(e.target.value);}}
                                       className={classNames({ 'p-invalid': isFormFieldInvalid('userName') })} style={{width:'100%'}}
                            />
                            <label htmlFor="userName">User Username</label>
                        </span>
                        {getFormErrorMessage('userName')}
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <span className="p-float-label">
                            <Dropdown name="userLevel" value={{name:formik.values['userLevel'],code:formik.values['userLevel']}} options={userLevels} optionLabel="name" placeholder="Select user level"
                                      onChange={(e) =>{formik.setFieldValue('userLevel', e.value?.name);}} style={{width:'100%'}}
                            />
                                    {getFormErrorMessage('city')}
                                    <label htmlFor="userLevel">User Level</label>
                        </span>
                        {getFormErrorMessage('userLevel')}
                    </div>

                    <div className={'col-12 md:col-6'}>
                        <div className="flex align-items-center">
                            <Checkbox inputId="" name="activate" value={formik.values['active']} onChange={e => formik.setFieldValue('active', !e.value) } checked={formik.values['active']} />
                            <label htmlFor="activate" className="ml-2">Activate</label>
                        </div>
                        {getFormErrorMessage('active')}
                    </div>

                    <div className={'col-12 md:col-6'}>
                        <span className="p-float-label">
                            <MultiSelect name={'roles'} value={formik.values['roles']} onChange={(e) => formik.setFieldValue('roles',e.value)} options={roleObject} optionLabel="name"
                                         placeholder="Select User Roles" maxSelectedLabels={3} className="w-full md:w-20rem" />
                            <label htmlFor="roles">User Roles</label>
                        </span>
                        {getFormErrorMessage('roles')}
                    </div>
                </div>

                <br/>
                <div className={'flex justify-content-end'}>
                    <Button  severity={'success'} outlined={true} type="submit" label="Save" />
                </div>
            </form>
        </>
    )
}

export default EditUserDialog;