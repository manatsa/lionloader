import React, {useRef, useState} from 'react';
import {Tooltip} from "primereact/tooltip";
import {ProgressBar} from "primereact/progressbar";
import {Tag} from "primereact/tag";
import {Button} from "primereact/button";
import {FileUpload} from "primereact/fileupload";
import {useFormikContext} from "formik";
import {classNames} from "primereact/utils";
import showToast from "../../notifications/showToast.js";
import {Toast} from "primereact/toast";
import AppErrorMessage from "./AppErrorMessage.jsx";

const  AppFilesUploader = ({name, ...otherProps}) =>{
    const [totalSize, setTotalSize] = useState(0);
    const [image, setImage] = useState('');
    const fileUploadRef = useRef(null);
    const fileMaxSize=5000000;
    const toast=useRef(null);
    const {touched, errors, values, setFieldValue } =useFormikContext();
    const isFormFieldInvalid = (name) => !!(touched[name] && errors[name]);

    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        showToast(toast, 'success', 'Success',  'File Uploaded' );
    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / fileMaxSize;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 5 MB</span>
                    <ProgressBar value={value} showValue={false} style={{width: '10rem', height: '12px'}}/>
                </div>
            </div>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-file mt-0 p-0" style={{
                    fontSize: '1.2em',
                    borderRadius: '50%',
                    backgroundColor: 'var(--surface-b)',
                    color: 'var(--surface-d)'
                }}/>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} >
                    Drag and Drop File Here
                </span>
            </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    const onFileChangeHandler = async (event) => {
        const reader = new FileReader();

        const file1 = event.files[0];
        setTotalSize(file1.size)
        let blob1 = await fetch(file1.objectURL).then((r) => r.blob());

        //reader.readAsDataURL(blob1);
        reader.readAsBinaryString(blob1)
        reader.onloadend = function () {
            const base64data2 = btoa(reader.result.replace("data:", "").replace(/^.+,/, ""));
            setFieldValue(name, base64data2);
            setImage(base64data2);
        }
        showToast(toast, 'success', 'File Upload','File uploaded successfully!');
        //fileUploadRef?.current?.clear();
    };

    return (
        <div>
            <Toast ref={toast} />
            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

               <div className="grid" style={{width:'100%'}}>
                   <div className={`${!image?'col-12 p-3':'col-6 sx:col-12 p-3'}`}>
                       <FileUpload ref={fileUploadRef} name={'pictures'} maxFileSize={fileMaxSize} multiple={false}
                          onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear}
                          headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                          chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions}
                          className={classNames({ 'p-invalid': isFormFieldInvalid(name) })} style={{width:'100%'}}
                          customUpload uploadHandler={onFileChangeHandler} {...otherProps} onClear={onTemplateClear}/>
                       {/*<InputText type={'file'} multiple={true} style={{width:'100%'}} {...otherProps} name={name} value={values[name]} onChange={onFileChangeHandler} />*/}
                       {/*<FileUpload mode="basic" name={name} accept="image/*" customUpload uploadHandler={onFileChangeHandler} />*/}
                   </div>
                   {image && <div className="col-6 sx:col-12">
                       <img src={`data:image/png;base64,${image}`} className={'col-12 h-full'} height={300} alt={'Product Image'} />
                   </div>}
                   <AppErrorMessage message={errors[name]} visible={touched[name]} />

            </div>
        </div>
    )
}


export default AppFilesUploader;