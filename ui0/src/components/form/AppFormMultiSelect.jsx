import React from "react";
import AppErrorMessage from "./AppErrorMessage.jsx";
import { useFormikContext } from "formik";
import {InputText} from "primereact/inputtext";
import {classNames} from "primereact/utils";
import {MultiSelect} from "primereact/multiselect";

const AppFormTextField=({name, label, items, ...otherProps})=> {
  const {touched, errors, values, setFieldValue } =useFormikContext();

  return (
    <>
    <div className={'col-12 p-3'}>
        <span className="p-float-label">
            <MultiSelect id={name} name={name} options={items} value={values[name]} onChange={(e) => {setFieldValue(name, e.value);}}
                optionLabel="name" className="w-full md:w-20rem" style={{width:'100%'}} {...otherProps}
            />
            <label htmlFor={name}>{label}</label>
        </span>
      <AppErrorMessage message={errors[name]} visible={touched[name]} />
    </div>

    </>
  );
}


export default AppFormTextField;
