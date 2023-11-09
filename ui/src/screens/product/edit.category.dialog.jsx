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
import {doFetch} from "../../query/doFetch.js";
import doUpdate from "../../query/doUpdate.js";
import {InputTextarea} from "primereact/inputtextarea";
import AppAutocomplete from "../../components/AppAutocomplete.jsx";

const EditCategoryDialog=({setEditCategoryDialogVisible, selectedCategory, token, setCategorysData, showErrorFeedback, showSuccessFeedback})=>{

    const toast=useRef(null);
    const [indicator, setIndicator] = useState(false)
    const {mutate} = useMutation({
        mutationFn:data=>doUpdate('/api/category/',token,data?.id,data?.category),
        onError: error=>{
            setIndicator(false)
            showErrorFeedback(error);
        },
        onMutate: ()=>setIndicator(true),
        onSuccess:(data)=>{
            setIndicator(false)
            setCategorysData(data);
            showSuccessFeedback();
        }
    });

    const industryMutation=doFetch('/api/industry/',token, ['get',selectedCategory?.id,'industry'])


    const initialValues={
        id:selectedCategory?.id ||'',
        name:selectedCategory?.name||'',
        industry:{name:selectedCategory?.industry?.name,id:selectedCategory?.industry?.id} || undefined,
        description: selectedCategory?.description || '',
    }

    const validationSchema=yup.object().shape({
        name: yup.string().required("Please enter category name."),
        industry: yup.object().required("Please select industry name for this category."),
        description: yup.string(),
    })

    const onSubmit= (values)=>{
        const category={...values,...{industry:values['industry']?.id}};
        mutate({id:values['id'],category})
        formik.resetForm();
        setEditCategoryDialogVisible(false)

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
                            <label htmlFor="name">Category Name</label>
                        </span>
                        {getFormErrorMessage('name')}
                    </div>
                    <div className={'col-12'}>
                        <span className="p-float-label">
                            <InputTextarea id="description" name="description" value={formik.values['description']} onChange={(e) => {formik.setFieldValue('description', e.target.value);}}
                               className={classNames({ 'p-invalid': isFormFieldInvalid('description') })} style={{width:'100%'}} autoResize rows={3}
                            />
                            <label htmlFor="description">Category Description</label>
                        </span>
                        {getFormErrorMessage('description')}
                    </div>

                    <div className={'col-12'}>
                        <span className="p-float-label">
                            {/*<AppAutocomplete name={'industry'} multiple={false} formik={formik} items={industryMutation?.data}  placeholder={'Select Industry'} dropdown={true} />
                            <label htmlFor="industry">Category Industry</label>*/}
                            <AppAutocomplete name={'industry'} items={industryMutation?.data} formik={formik} multiple={false} placeholder={'Select Industry'} dropdown={true} />
                            <label htmlFor="userLevel">Category Industry</label>
                        </span>
                        {getFormErrorMessage('industry')}
                    </div>

                </div>

                <br/>
                <div className={'flex justify-content-around'}>
                    <Button  severity={'danger'} outlined={true} type="button" label="Close" onClick={()=>setEditCategoryDialogVisible(false)} />
                    <Button  severity={'warning'} outlined={true} type="button" label="Clear" onClick={()=>formik.resetForm()} />
                    <Button  severity={'success'} outlined={true} type="submit" label="Save" />
                </div>
            </form>
        </>
    )
}

export default EditCategoryDialog;