import React, {useState} from 'react';
import {Button} from "primereact/button";
import AppForm from "../../../components/form/AppForm.jsx";
import AppFormTextField from "../../../components/form/AppFormTextField.jsx";
import AppFormTextArea from "../../../components/form/AppFormTextArea.jsx";
import {Field} from "formik";
import AppFormInputNumber from "../../../components/form/AppFormInputNumber.jsx";

const ProductStep1 =({initValues, validationSchema, onNextStep, onBack, token})=>{

    return (
        <>
            <div className={'grid md:p-10'}>
                <AppForm
                    onSubmit={onNextStep}
                    initialValues={initValues}
                    validationSchema={validationSchema}
                    isFirstStep={true}
                    onBack={onBack}
                >

                    <Field name={'name'} as={AppFormTextField} label={'Product Name'} />

                    <Field  name={'description'} as={AppFormTextArea} label={'Product Description'} />

                    <Field  name={'price'} as={AppFormInputNumber}  label={'Product Price'} mode="currency" currency="USD"  suffix={' USD'} />

                    <Field  name={'tags'} as={AppFormTextField} label={'Product Tags'} placeholder={'Comma(,) Separated Tags'} />

                </AppForm>
            </div>
        </>
    )
}

export default ProductStep1;