import React, {useRef, useState} from 'react';
import {Tooltip} from "primereact/tooltip";
import {ProgressBar} from "primereact/progressbar";
import {Tag} from "primereact/tag";
import {Button} from "primereact/button";
import {FileUpload} from "primereact/fileupload";
import showToast from "../notifications/showToast.js";
import {Toast} from "primereact/toast";
import {useMutation} from "@tanstack/react-query";
import {ProgressSpinner} from "primereact/progressspinner";
import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import './excel.css';
import {SpeedDial} from "primereact/speeddial";

const  AppFilesUploader = ({token}) =>{
    const [totalSize, setTotalSize] = useState(0);
    const [indicator, setIndicator] = useState(false);
    const [rows, setRows] = useState(null);
    const [columns, setColumns] = useState(null);
    const [showHeader, setShowHeader] = useState(true);
    const fileUploadRef = useRef(null);
    const fileMaxSize=5000000;
    const toast=useRef(null);

    const {mutate, error,data, isLoading, isError, isSuccess} = useMutation({
        mutationFn: (data)=>  fetch(`/api/upload/`, {
            method: 'POST',
            headers: {
                'Authorization': "Bearer " + token,
            },
            body: data?.file,
        }).then(res=>res.json())
        ,
        onError: error=>{
            setIndicator(false)
            console.log('ERROR:: ',error)
            showToast(toast,'error', 'Operation Failed!', error?.toString());
        },
        onMutate: ()=>setIndicator(true),
        onSuccess:(data)=>{
            alert(data?.length)
            showToast(toast,'success', 'Operation Success!','Operation was successful.');
            setIndicator(false)

        }
    });

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

    const onFileChangeHandler = (e) => {
        const file = e.files[0];
        /*const formData = new FormData();
        formData.append('file', file);
        mutate({id:null, file:formData})*/
        fileUploadRef?.current?.clear();
        ExcelRenderer(file, (err, resp) => {
            if(err){
                console.log(err);
                showToast(toast, 'error','File Reading Error', err.toString())
            }
            else{

                    setColumns(resp.cols);
                    setRows(resp.rows);
                showToast(toast, 'info','File Reading Status', 'Spreadsheet read successfully!')

            }
        });


    };

    const speedItems = [
        {
            label: 'Clear',
            icon: 'pi pi-undo',
            color:'success',
            command: () => {
                setColumns([]);
                setRows([]);
                setShowHeader(true)
            }
        },
        {
            label: 'Focus Content',
            icon: `pi ${showHeader?'pi-window-maximize':'pi-window-minimize'}`,
            command: () => {
                setShowHeader(!showHeader);
            }
        },
        {
            label: 'Upload',
            icon: 'pi pi-upload',
            command: () => {
                showToast(toast, 'info', 'Uploading Now', 'Data id being uploaded' );
            }
        },


    ];

    return (
        <div>
            <Toast ref={toast}/>
            {indicator && <ProgressSpinner title={'Please wait...'} />}
            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

               <div className="grid" style={{width:'100%'}}>
                   {showHeader &&
                           <div className="col-12">
                               <FileUpload ref={fileUploadRef} name="demo[]" accept={['.csv,.xls, .xlsx']} maxFileSize={fileMaxSize}
                                   onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear}
                                   onClear={onTemplateClear}
                                   headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                                   chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions}
                                   customUpload uploadHandler={onFileChangeHandler}/>
                           </div>

                   }

                {rows?.length>1 && columns?.length>1 && <div style={{ width: '100%', height: '400px', overflowY:'scroll', overflowX:'scroll' }} sx={{height:'200px'}} >
                    <SpeedDial model={speedItems} type="quarter-circle" direction="up-left" transitionDelay={80} showIcon="pi pi-bars" hideIcon="pi pi-times" buttonClassName="p-button-outlined" style={{right:`10px`, bottom:`10px`}} />
                    <OutTable data={rows} columns={columns} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" />
                </div>}

            </div>
        </div>
    )
}


export default AppFilesUploader;