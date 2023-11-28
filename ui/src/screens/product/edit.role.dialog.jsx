import React, {useEffect, useRef, useState} from 'react';
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
import {useFetch} from "../../query/useFetch.js";
import {getLogin} from "../../auth/check.login";
import {useMutation} from "@tanstack/react-query";
import doUpdate from "../../query/doUpdate.js";
import AppAutocomplete from "../../components/AppAutocomplete.jsx";

const EditRoleDialog = ({openNewRoleDialog,setEditRoleDialogVisible, role, token,setRolesData, showSuccessFeedback, showErrorFeedback}) =>{
    const toast=useRef(null);
    const {isExpired} =useJwt(token);
    const navigate=useNavigate();
    const[indicator, setIndicator]=useState(false);
    const [privileges, setPrivileges] = useState([]);

    const {mutate, error,data, isLoading, isError, isSuccess} = useMutation({
        mutationFn:data=>doUpdate('/api/roles/',token,data?.id,data?.role),
        onError: error=>{
            setIndicator(false)
            showErrorFeedback(error);
        },
        onMutate: ()=>setIndicator(true),
        onSuccess:(data)=>{
            setIndicator(false)
            setRolesData(data)
            showSuccessFeedback()
        }
    });

    const privilegesData=useFetch('api/privileges/',token,['get',role?.name,'privileges']);
    useEffect(()=>{
        setPrivileges(privilegesData?.data?.map(r=>{
            return {name:r?.name, code:r?.name}
        }))
    },[])


    const initialValues={
        id:role?.id ||'',
        name:role?.name||'',
        privileges: role?.privileges || null,
        // active: role?.active?.toString()||''

    }

    const validationSchema=yup.object().shape({
        name: yup.string().required("Please enter role name."),
        privileges: yup.array().min(1,'You must select at least one privilege for the role!').nonNullable()
    })
    const onSubmit= (values)=>{
        let ps=values['privileges']?.map(p=>p['name'])
        let role={...values, privileges:ps};
        mutate({id:values['id'],role});
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

    const privilegeObjects=privileges?.map(p=>{
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
                    <div className={'col-12 lg:col-6'}>
                        <span className="p-float-label">
                            {/*<AppAutocomplete name={'privileges'} formik={formik} multiple={true} items={privilegeObjects} dropdown={true} placeholder={'Select role privileges'} />*/}
                            <AppAutocomplete name={'privileges'} multiple={true} formik={formik} items={privilegesData?.data}  placeholder={'Select Roles'} dropdown={true} />
                            <label htmlFor="privileges">User privileges</label>
                        </span>
                        {getFormErrorMessage('privileges')}
                    </div>
                    {/*<div className={'col-12 md:col-12'}>
                        <span className="p-float-label">
                            <AppAutocomplete name={'descruption'} multiple={false} formik={formik} items={[{name:'TRUE', code:'TRUE'}, {name:'FALSE', code:'FALSE'}]}  placeholder={'Activate Role'} dropdown={true} />
                            <label htmlFor="active">Active Role</label>
                        </span>
                    </div>*/}
                </div>

                <br/>
                <div className={'flex justify-content-around'}>
                    <Button  severity={'danger'} outlined={true} type="button" label="Close" onClick={()=>setEditRoleDialogVisible(false)} />
                    <Button  severity={'warning'} outlined={true} type="button" label="Clear" onClick={()=>formik.resetForm()} />
                    <Button  severity={'success'} outlined={true} type="submit" label="Save" />
                </div>
            </form>
        </div>
    )
}

export  default  EditRoleDialog;