import React from "react";
import AppErrorMessage from "./AppErrorMessage.jsx";
import { useFormikContext } from "formik";
import {InputText} from "primereact/inputtext";
import {classNames} from "primereact/utils";
import {RadioButton} from "primereact/radiobutton";

const AppFormTextField=({name, label,items, vertical, ...otherProps})=> {
  const {touched, errors, values, setFieldValue } =useFormikContext();

  return (
    <>
    <div className={'col-12 p-3'}>
        <span className="">

            <label className={'sm:col-12 md:col-3'} htmlFor={name}>{label}</label>
            <div className="card flex justify-content-center sm:col-12 md:col-9">
                <div className={`flex ${vertical?'flex-column':'flex-row'} gap-3`}>
                    {items.map((item) => {
                        return (
                            <div key={item.key} className="flex align-items-center">
                                <RadioButton inputId={item.name} name={item.name} value={values[name]} onChange={(e) => setFieldValue(name, e.value)}
                                             checked={values[name] === item.name} {...otherProps} />
                                <label htmlFor={item.name} className="ml-2">{item.name}</label>
                            </div>
                        );
                    })}
                </div>
        </div>
        </span>
      <AppErrorMessage message={errors[name]} visible={touched[name]} />
    </div>

    </>
  );
}


export default AppFormTextField;
