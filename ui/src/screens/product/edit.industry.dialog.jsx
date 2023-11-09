import React, {useEffect, useRef, useState} from 'react';
import * as yup from 'yup';
import {useFormik} from "formik";
import {Toast} from "primereact/toast";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import { classNames } from 'primereact/utils';
import {useNavigate} from "react-router-dom";
import {ProgressSpinner} from "primereact/progressspinner";
import {useMutation} from "@tanstack/react-query";
import doUpdate from "../../query/doUpdate.js";
import {InputTextarea} from "primereact/inputtextarea";

const EditIndustryDialog=({openNewIndustryDialog,setEditIndustryDialogVisible, selectedIndustry, token, setIndustrysData, showErrorFeedback, showSuccessFeedback})=>{

    const toast=useRef(null);
    const navigate=useNavigate();
    const [roles, setRoles] = useState(null);
    const [indicator, setIndicator] = useState(false)
    const {mutate, error,data, isLoading, isError, isSuccess} = useMutation({
        mutationFn:data=>doUpdate('/api/industry/',token,data?.id,data?.industry),
        onError: error=>{
            setIndicator(false)
            showErrorFeedback(error);
        },
        onMutate: ()=>setIndicator(true),
        onSuccess:(data)=>{
            setIndicator(false)
            setIndustrysData(data);
            showSuccessFeedback();
        }
    });


    const initialValues={
        id:selectedIndustry?.id ||'',
        name:selectedIndustry?.name||'',
        description: selectedIndustry?.description || '',
    }

    const validationSchema=yup.object().shape({
        name: yup.string().required("Please enter industry name."),
        description: yup.string(),
    })
    const onSubmit= (values)=>{
        const industry={...values};
        mutate({id:values['id'],industry})
        formik.resetForm();
        setEditIndustryDialogVisible(false)

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
                    <div className={'col-12'}>
                        <span className="p-float-label">
                            <InputText id="name" name="name" value={formik.values['name']} onChange={(e) => {formik.setFieldValue('name', e.target.value);}}
                               className={classNames({ 'p-invalid': isFormFieldInvalid('name') })} style={{width:'100%'}}
                            />
                            <label htmlFor="name">Industry Name</label>
                        </span>
                        {getFormErrorMessage('name')}
                    </div>
                    <div className={'col-12'}>
                        <span className="p-float-label">
                            <InputTextarea id="description" name="description" value={formik.values['description']} onChange={(e) => {formik.setFieldValue('description', e.target.value);}}
                               className={classNames({ 'p-invalid': isFormFieldInvalid('description') })} style={{width:'100%'}} autoResize rows={3}
                            />
                            <label htmlFor="description">Industry Description</label>
                        </span>
                        {getFormErrorMessage('description')}
                    </div>

                </div>

                <br/>
                <div className={'flex justify-content-around'}>
                    <Button  severity={'danger'} outlined={true} type="button" label="Close" onClick={()=>setEditIndustryDialogVisible(false)} />
                    <Button  severity={'warning'} outlined={true} type="button" label="Clear" onClick={()=>formik.resetForm()} />
                    <Button  severity={'success'} outlined={true} type="submit" label="Save" />
                </div>
            </form>
        </>
    )
}

export default EditIndustryDialog;