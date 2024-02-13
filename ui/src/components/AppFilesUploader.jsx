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
import {Dropdown} from "primereact/dropdown";

const  AppFilesUploader = ({token}) =>{
    const [totalSize, setTotalSize] = useState(0);
    const [indicator, setIndicator] = useState(false);
    const [rows, setRows] = useState(null);
    const [columns, setColumns] = useState(null);
    const [showHeader, setShowHeader] = useState(true);
    const fileUploadRef = useRef(null);
    const fileMaxSize=50000000;
    const toast=useRef(null);
    const [file, setFile]= useState(null)
    const [rowsNum, setRowsNum] = useState(0);
    const [agent, setAgent]= useState(null)
    const [currency, setCurrency]= useState({label:'USD', code:'USD'})
    const agents=[
        {label:'ALERTSURE CONSULTANC', code:'T3'},
        {label: 'BANCABCHARARE', code: 'T7'}
    ]

    const currencies=[
        {label:'USD', code:'USD'},
        {label: 'ZWL', code: 'ZWL'}
    ]

    const {mutate, error,data, isLoading, isError, isSuccess} = useMutation({
        mutationFn: (data)=>  fetch(`/api/upload/`, {
            method: 'POST',
            headers: {
                'Authorization': "Bearer " + token,
            },
            body: data?.file,
        }).then(res=>{
            console.log(res)
            return res
        })
        ,
        onError: error=>{
            setIndicator(false)
            console.log('ERROR:: ',error)
            showToast(toast,'error', 'Operation Failed!', error?.toString());
        },
        onMutate: ()=>setIndicator(true),
        onSuccess:(data)=>{
            console.log(data)
            showToast(toast,data?.code<300?'success':'error', 'Operation Feedback!',data?.message);
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
                    {!file &&(
                        <div className={'flex align-items-center justify-items-center'}>
                            <span className="p-float-label">
                                <Dropdown autoFocus  id={'agents'} value={agent} onChange={(e) => setAgent(e.value)} options={agents} optionLabel="label"
                                          filter showClear placeholder="Select an agent" className="w-full md:w-14rem" />
                                <label htmlFor="agents">Select Agent</label>
                            </span>
                            <span className="p-float-label ml-3">
                                <Dropdown autoFocus  id={'agents'} value={currency} onChange={(e) => setCurrency(e.value)} options={currencies} optionLabel="label"
                                filter showClear placeholder="Select currency" className="w-full md:w-14rem" />
                                <label htmlFor="agents">Select Currency</label>
                            </span>
                        </div>
                        )
                        }

                        {file && <span style={{fontWeight: "bolder"}}>Last Edited::{file?.lastModifiedDate?.toLocaleString()}</span>}
                    {rows?.length>0 && <span> Size::{(rows?.length -1)} items </span>}
                    <span style={{fontWeight:"bolder"}}>{formatedValue} / 50 MB</span>
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
        setFile(file);
        fileUploadRef?.current?.clear();
        setIndicator(true);
        ExcelRenderer(file, (err, resp) => {
            if(err){
                // console.log(err);
                setIndicator(false)
                showToast(toast, 'error','File Reading Error', err.toString())
            }
            else{

                // console.log(  resp.rows)
                    setColumns(resp.cols);
                    setRows(resp.rows);
                    setIndicator(false)
                showToast(toast, 'info','File Reading Status', 'Spreadsheet read successfully!')

            }
        });


    };

    const doUpload=()=>{
        setIndicator(true)
        let filename=file?.name;
        if(agent?.code) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append("agent", agent?.code)
            formData.append("broker", agent?.label)
            formData.append("currency", currency?.code)
            setColumns([]);
            setRows([]);
            setFile(null)
            setShowHeader(true)
            // mutate({id:null, file:formData})
            fetch(`/api/upload/`, {
                method: 'POST',
                headers: {
                    'Authorization': "Bearer " + token,
                },
                body: formData,
            }).then(response => response?.blob())
                .then(blob => {
                    try {
                        const blobUrl = window.URL.createObjectURL(blob)
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = blobUrl;
                        a.download = agent?.label.replace(" ","_")+"_"+ filename;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(blobUrl);
                        setIndicator(false)
                    } catch (e) {
                        console.log(e);
                        setIndicator(false)
                    }
                })
        }else{
            showToast(toast,"error","Undefined Agent","Please select and agent first!")
            setFile(null)
            setIndicator(false)
            setRows([])
            setColumns([])
        }

    }

    const speedItems = [
        {
            label: 'Clear',
            icon: 'pi pi-undo',
            color:'success',
            command: () => {
                setColumns([]);
                setRows([]);
                setFile(null)
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
                doUpload();

            }
        },


    ];

    return (
        <div>
            <Toast ref={toast}/>
            {indicator && <ProgressSpinner title={'Please wait...'} />}
            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Preview" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

               <div className="grid" style={{width:'100%'}}>
                   {showHeader &&
                           <div className="col-12">
                               <FileUpload ref={fileUploadRef} name="demo[]" accept={['.xls']} maxFileSize={fileMaxSize}
                                   onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear}
                                   onClear={onTemplateClear}
                                   headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                                   chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions}
                                   customUpload uploadHandler={onFileChangeHandler}/>
                           </div>

                   }

                {rows?.length>1 && columns?.length>1 && <div style={{ width: '100%', height: '80vh', overflowY:'scroll', overflowX:'scroll' }} sx={{height:'200px'}} >
                    <SpeedDial model={speedItems} type="quarter-circle" direction="up-left" transitionDelay={80} showIcon="pi pi-bars" hideIcon="pi pi-times" buttonClassName="p-button-outlined" style={{right:`10px`, bottom:`10px`}} />
                    <OutTable data={rows} columns={columns} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" />
                </div>}

            </div>
        </div>
    )
}


export default AppFilesUploader;