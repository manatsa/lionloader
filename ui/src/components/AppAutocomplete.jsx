import React, {useState} from 'react';
import {AutoComplete} from "primereact/autocomplete";


const AppAutocomplete=({formik,items,name,multiple, placeholder, dropdown})=>{
    const [filtered, setFiltered]=useState(items);
    const [inputValue, setInputValue] = useState(null);
    const autoRef=React.createRef();

    const search=(e)=>{
        let suggestionsList;

        if (!e.query.trim().length) {
            suggestionsList = [...items];
        } else {
            suggestionsList = [...items].filter((list) => {
                return list.name.toLowerCase().startsWith(e.query.toLowerCase());
            });
        }

        console.lo
        setFiltered( suggestionsList );
    }
    return(
        <>
            <AutoComplete
                field="name"
                ref={autoRef}
                multiple={multiple}
                value={!formik.values['id'] && !multiple?formik.values[name]?.name:formik?.values[name]}
                suggestions={filtered}
                minLength={1}
                dropdown={dropdown}
                completeMethod={search}
                placeholder={placeholder}
                className="w-full md:w-20rem"
                onChange={(e) => formik.setFieldValue(name,e.value)}
                /*onFocus={(e) => {
                    if (!inputValue && !formik['name']) {
                        autoRef.current.onDropdownClick(e, "");
                    }
                }}
                onKeyUp={(e) => setInputValue( e.target.value)}*/
            />
        </>
    )
}

export default AppAutocomplete;