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

const EditRoleDialog = ({openNewRoleDialog,setEditRoleDialogVisible, role}) =>{
    const toast=useRef(null);
    const {token, login}=useLoginContext();
    const {isExpired} =useJwt(token);
    const navigate=useNavigate();
    const[indicator, setIndicator]=useState(false);
    const [privileges, setPrivileges] = useState([]);

    const pullData=async ()=>{
        const res= await GetFromAPI(token, 'api/privileges/', setIndicator);
        setPrivileges(res?.map(r=>{
            return {name:r?.name, code:r?.name}
        }))
        return res;
    }
    useEffect( ()=>{
        const data=pullData();
    },[role])

    const initialValues={
        id:role?.id ||'',
        name:role?.name||'',
        privileges: role?.privileges || [],
    }

    const validationSchema=yup.object().shape({
        name: yup.string().required("Please enter role name."),
        active: yup.boolean(),
        privileges: yup.array().min(1,'You must select at least one privilege for the role!').nonNullable()
    })
    const onSubmit= (values)=>{
        let ps=values['privileges']?.map(p=>p['name'])
        let role={...values, privileges:ps};
        delete role['id']
        PostToApi(token, 'api/roles/',JSON.stringify(role),setIndicator).then(res=>{

            if(res?.status===200 || res?.status===201){
                showToast(toast, 'success', 'Role Creation',`Role ${role?.name} was created successfully!`);
            }else{
                // console.log(res)
                showToast(toast, 'error', 'Role Creation Error',res?.data);
            }
        }).catch(error=>{
            showToast(toast, 'error', 'Role Creation Error',`Role created error :: ${error}`);
        });
        formik.resetForm();
        setEditRoleDialogVisible(false)
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
                    <div className={'col-12 md:col-6'}>
                        <span className="p-float-label">
                            <InputText id="name" name="name" value={formik.values['name']} onChange={(e) => {formik.setFieldValue('name', e.target.value);}}
                                       className={classNames({ 'p-invalid': isFormFieldInvalid('name') })} style={{width:'100%'}}
                            />
                            <label htmlFor="name">Role Name</label>
                        </span>
                        {getFormErrorMessage('name')}
                    </div>

                    <div className={'col-12 md:col-6'}>
                        <span className="p-float-label">
                            <MultiSelect name={'privileges'} value={formik.values['privileges']} onChange={(e) => formik.setFieldValue('privileges',e.value)} options={privileges} optionLabel="name"
                                         placeholder="Select User Privileges" maxSelectedLabels={3} className="w-full md:w-20rem" />
                            <label htmlFor="privileges">User privileges</label>
                        </span>
                        {getFormErrorMessage('privileges')}
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

export  default  EditRoleDialog;