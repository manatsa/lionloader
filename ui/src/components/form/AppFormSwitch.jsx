import React from "react";
import AppErrorMessage from "./AppErrorMessage.jsx";
import { useFormikContext } from "formik";
import {InputSwitch} from "primereact/inputswitch";

const AppFormSwitch=({name, label, ...otherProps})=> {
  const {touched, errors, values, setFieldValue } =useFormikContext();

  return (
    <>
    <div className={'col-12 p-3'}>
        <span className="" >
            <label className={'sm:col-12 md:col-4'} htmlFor={name}>{label}</label>
            <InputSwitch className={'sm:col-12 md: col-8'} checked={values[name]} onChange={(e) => setFieldValue(name,e.value)} {...otherProps} />
        </span>
      <AppErrorMessage message={errors[name]} visible={touched[name]} />
    </div>

    </>
  );
}


export default AppFormSwitch;
