import React, {useEffect, useRef, useState} from 'react';
import * as yup from 'yup';
import {useFormik} from "formik";
import {Toast} from "primereact/toast";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import { classNames } from 'primereact/utils';
import {ProgressSpinner} from "primereact/progressspinner";
import {useMutation} from "@tanstack/react-query";
import {Fieldset} from "primereact/fieldset";

const Register=({setRegisterDialogVisible,showErrorFeedback, showSuccessFeedback})=>{

    const toast=useRef(null);
    const [indicator, setIndicator] = useState(false)
    const {mutate, error,data, isLoading, isError, isSuccess} = useMutation({
        mutationFn:data=>doUpdate('/api/register/',token,data?.id,data?.user),
        onError: error=>{
            setIndicator(false)
            showErrorFeedback(error);
        },
        onMutate: ()=>setIndicator(true),
        onSuccess:(data)=>{
            setIndicator(false)
            showSuccessFeedback();
        }
    });


    const initialValues={
        id:'',
        firstName:'',
        lastName: '',
        userName: '',
        active: true,
        email:'',
        phone:'',
    }

    const validationSchema=yup.object().shape({
        firstName: yup.string().required("Please enter user's first name."),
        lastName: yup.string().required("Please enter user's last name."),
        userName: yup.string().required("Please enter user's username.").min(4,'Minimum length for a username is 4 characters. '),
        active: yup.boolean(),
        email: yup.string().email('Please enter a valid email').required("Email address is required."),
        phone: yup.string().required('Phone number is required.').min(5,'Your phone number is too short. Min is 5 characters').max(16,'The phone number is too long. Max is 16 characters.')
    })
    const onSubmit= (values)=>{

        const userLevel='';
        const user={...values, userLevel};
        mutate({id:values['id'],user})
        formik.resetForm();
        setRegisterDialogVisible(false)

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
            <Fieldset legend={"Registration Form"}>
                <form onSubmit={formik.handleSubmit} className="flex flex-column gap-2 p-3" >
                    <div className={'grid'}>
                        <div className={'col-12'}>
                        <span className="p-float-label">
                            <InputText id="firstName" name="firstName" value={formik.values['firstName']} onChange={(e) => {formik.setFieldValue('firstName', e.target.value);}}
                                       className={classNames({ 'p-invalid': isFormFieldInvalid('firstName') })} style={{width:'100%'}}
                            />
                            <label htmlFor="firstName">First Name</label>
                        </span>
                            {getFormErrorMessage('firstName')}
                        </div>
                        <div className={'col-12'}>
                        <span className="p-float-label">
                            <InputText id="lastName" name="lastName" value={formik.values['lastName']} onChange={(e) => {formik.setFieldValue('lastName', e.target.value);}}
                                       className={classNames({ 'p-invalid': isFormFieldInvalid('lastName') })} style={{width:'100%'}}
                            />
                            <label htmlFor="lastName">Last Name</label>
                        </span>
                            {getFormErrorMessage('lastName')}
                        </div>
                        <div className={'col-12'}>
                        <span className="p-float-label">
                            <InputText id="userName" name="userName" value={formik.values['userName']} onChange={(e) => {formik.setFieldValue('userName', e.target.value)}}
                                       className={classNames({ 'p-invalid': isFormFieldInvalid('userName') })} style={{width:'100%'}}
                            />
                            <label htmlFor="userName">Username</label>
                        </span>
                            {getFormErrorMessage('userName')}
                        </div>
                        <div className={'col-12'}>
                        <span className="p-float-label">
                            <InputText id="email" name="email" value={formik.values['email']} onChange={(e) => {formik.setFieldValue('email', e.target.value)}}
                                       className={classNames({ 'p-invalid': isFormFieldInvalid('email') })} style={{width:'100%'}}
                            />
                            <label htmlFor="email">Email Address</label>
                        </span>
                            {getFormErrorMessage('email')}
                        </div>
                        <div className={'col-12'}>
                        <span className="p-float-label">
                            <InputText id="phone" name="phone" value={formik.values['phone']} onChange={(e) => {formik.setFieldValue('phone', e.target.value)}}
                                       className={classNames({ 'p-invalid': isFormFieldInvalid('phone') })} style={{width:'100%'}}
                            />
                            <label htmlFor="phone">Mobile Number</label>
                        </span>
                            {getFormErrorMessage('phone')}
                        </div>


                    </div>

                    <br/>
                    <div className={'flex justify-content-around'}>
                        <Button  severity={'danger'} outlined={true} type="button" label="Close" onClick={()=>setRegisterDialogVisible(false)} />
                        <Button  severity={'warning'} outlined={true} type="button" label="Clear" onClick={()=>formik.resetForm()} />
                        <Button  severity={'success'} outlined={true} type="submit" label="Save" />
                    </div>
                </form>
            </Fieldset>

        </>
    )
}

export default Register;