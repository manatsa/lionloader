import React, {useState, createRef} from "react";
import AppErrorMessage from "./AppErrorMessage.jsx";
import {useFormikContext} from "formik";
import {AutoComplete} from "primereact/autocomplete";
import {classNames} from "primereact/utils";

const AppFormAutoComplete=({name, label, items,multiple,dropdown, ...otherProps})=> {
    const {touched, errors, values, setFieldValue } =useFormikContext();
    const [filtered, setFiltered]=useState(items||[]);
    const isFormFieldInvalid = (name) => !!(touched[name] && errors[name]);

    const search=(e)=>{
        let suggestionsList;

        if (!e.query.trim().length) {
            suggestionsList = [...items];
        } else {
            suggestionsList = [...items].filter((list) => {
                return list?.name?.toLowerCase()?.includes(e.query.toLowerCase());
            });
        }

        setFiltered( suggestionsList );
    }

  return (
    <>
    <div className={'col-12'}>
        <span className="p-float-label col-12">
                <AutoComplete id={name} name={name}  onChange={(e) => {setFieldValue(name, e.value);}} inputMode={'search'}
                    className={classNames({ 'p-invalid': isFormFieldInvalid(name) },'w-full md:w-20rem' )} dropdown={dropdown} completeMethod={search}
                    multiple={multiple}   value={!values['id'] && !multiple?values[name]?.name:values[name]} {...otherProps} suggestions={filtered}
                />
            <label htmlFor={name}>{label}</label>
        </span>
      <AppErrorMessage message={errors[name]} visible={touched[name]} />
    </div>

    </>
  );
}


export default AppFormAutoComplete;
