import React from "react";
import AppErrorMessage from "./AppErrorMessage.jsx";
import { useFormikContext } from "formik";
import {InputText} from "primereact/inputtext";
import {classNames} from "primereact/utils";

const AppFormTextField=({name, label, ...otherProps})=> {
  const {touched, errors, values, setFieldValue } =useFormikContext();
  const isFormFieldInvalid = (name) => !!(touched[name] && errors[name]);

  return (
    <>
    <div className={'col-12 p-3'}>
        <span className="p-float-label">
            <InputText id={name} name={name} value={values[name]} onChange={(e) => {setFieldValue(name, e.target.value);}}
                       className={classNames({ 'p-invalid': isFormFieldInvalid(name) })} style={{width:'100%'}} {...otherProps}
            />
            <label htmlFor={name}>{label}</label>
        </span>
      <AppErrorMessage message={errors[name]} visible={touched[name]} />
    </div>

    </>
  );
}


export default AppFormTextField;
