import React, {useRef, useState} from 'react';
import {Container} from "@mui/material";
import {useMutation} from "@tanstack/react-query";
import doUpdate from "../query/doUpdate.js";
import showToast from "../notifications/showToast.js";
import Loader from "../query/Loader/Loader";
import uploadFile from "../query/uploadFile.js";
import {ProgressSpinner} from "primereact/progressspinner";

const AppFileUploader=({token,setFilePath, setShowUploadToast})=>{

    const [selectedFile, setSelectedFile]= useState(null);
    const [indicator, setIndicator] = useState(false);

    const {mutate, error,data, isLoading, isError, isSuccess} = useMutation({
        mutationFn:data=>{
            console.log(data)
            uploadFile(`/api/upload/`,token, data, setShowUploadToast)
        },
        onError: error=>{
            setIndicator(false)
            console.log('ERROR:: ',error)
           setShowUploadToast('error', 'Operation Failed!', error?.toString());
        },
        onMutate: ()=>setIndicator(true),
        onSuccess:(data)=>{
            setShowUploadToast('success', 'Operation Success!','Operation was successful.');
            setIndicator(false)
        }
    });

    const onFileChangeHandler = (e) => {
        e.preventDefault();
        let file=e.target.files[0]
        setSelectedFile(file)
            console.log(file)
        const formData = new FormData();
        formData.append('file', file);
        fetch(`/api/upload/`, {
            method: 'POST',
            headers: {
                'Authorization': "Bearer " + token,
            },
            body: formData,
        }).then(res=>{
            if(res.ok){
                setShowUploadToast('success','Upload Status','File upload was successful!');
            }else{
                setShowUploadToast('error','Upload Status','File upload was not successful!');
            }
        });

        //mutate({id:null, file:formData})

    };

    return(
        <>
            <Container>
                {indicator && <ProgressSpinner title={'Please wait...'} />}
                <div className="grid">
                    <div className="w-12">
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <input type="file" className="form-control" name="file" onChange={onFileChangeHandler}/>
                        </span>
                    </div>
                </div>
            </Container>
        </>
    )
}

export  default AppFileUploader