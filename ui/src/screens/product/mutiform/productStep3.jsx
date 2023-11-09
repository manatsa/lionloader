import React, {useState} from 'react';
import AppFormSelectField from "../../../components/form/AppFormSelectField.jsx";
import AppFormCalendar from "../../../components/form/AppFormCalendar.jsx";
import AppForm from "../../../components/form/AppForm.jsx";
import {doFetch} from "../../../query/doFetch.js";
import AppFormAutocomplete from "../../../components/form/AppFormAutocomplete";
import {Field} from "formik";
import {Dropdown} from "primereact/dropdown";

const ProductStep3 =({initValues, validationSchema, onNextStep, onBack, token})=>{

    const [industry, setIndustry] = useState(null)
    const industryMutation=doFetch('/api/industry/',token,['get','industry']);
    const categoryMutation=doFetch(industry?`/api/category/industry/${industry}`:'/api/category/',token,['get',industry,'industry']);

    const {data}=doFetch('/api/users/',token,['get','users']);
    const items=data?.map(d=>{
        return {...d, name: d?.firstName+' '+d?.lastName};
    })


    return (
        <>
            <div className={'grid'}>
                <AppForm
                    initialValues={initValues}
                    validationSchema={validationSchema}
                    onSubmit={onNextStep}
                    onBack={onBack}
                >

                    <Field name={'owner'} as={AppFormAutocomplete} style={{width:'100%'}} field={'name'} items={items} label={'Select Owner'} dropdown={false} />

                    <div className={'col-12 p-3'}>
                        <span className="p-float-label">
                        <Dropdown options={industryMutation?.data||[]} value={industry} optionValue={'id'} optionLabel={'name'} onChange={e=>{
                            setIndustry(e.value)
                        }} style={{width:'100%', marginTop:5, marginBottom:5}} />
                            <label>Select Industry</label>
                        </span>
                    </div>

                    {/*<Field name={'industry'} as={AppFormMultiSelect} items={industryMutation.data} label={'Select Industries'} display={'chip'}/>
*/}
                    <Field name={'category'} as={AppFormSelectField} options={categoryMutation?.data || []} optionValue={'id'} optionLabel={'name'} label={'Category'} />

                    <AppFormCalendar name={'effectiveDate'} label={'Product Effective Date'} dateFormat={'dd/mm/yy'} />

                </AppForm>
            </div>
        </>
    )
}

export default ProductStep3;