import React, {useEffect, useRef, useState} from 'react';
import {useJwt} from "react-jwt";
import {useNavigate} from "react-router-dom";
import showToast from "../../notifications/showToast";
import {Toast} from "primereact/toast";
import {ProgressSpinner} from "primereact/progressspinner";
import GetFromAPI from "../../api/getFromAPI";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import {ContextMenu} from "primereact/contextmenu";
import {Toolbar} from "primereact/toolbar";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import {InputText} from "primereact/inputtext";
import EditIndustryDialog from "./edit.industry.dialog.jsx";
import {Dialog} from "primereact/dialog";
import {Typography} from "@mui/material";
import {useFetch} from "../../query/useFetch.js";
import {getLogin} from "../../auth/check.login";
import ViewIndustryDialog from "./view.industry.dialog.jsx";
import {useMutation} from "@tanstack/react-query";
import doUpdate from "../../query/doUpdate.js";

const Industry =  () => {

    const {token, login}=getLogin();
    const {isExpired} =useJwt(token);
    const navigate=useNavigate();
    const toast= useRef(null);
    const [selectedIndustry, setSelectedIndustry] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [openNewIndustryDialog, setOpenNewIndustryDialog] = useState(false);
    const [openViewIndustryDialog, setOpenViewIndustryDialog] = useState(false);
    const [indicator, setIndicator] = useState(false);
    const [industry, setIndustry]=useState([]);
    const dt = useRef(null);
    const cm = useRef(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        active: { value: null, matchMode: FilterMatchMode.IN },
        dateCreated: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },

    });

    const {mutate, error,data, isLoading, isError, isSuccess} = useMutation({
        mutationFn:data=>doUpdate(`/api/industry/activateDeactivate/`,token,data?.id,selectedIndustry),
        onError: error=>{
            setIndicator(false)
            console.log('ERROR:: ',error)
            showToast(toast, 'error', 'Operation Failed!', error?.toString());
        },
        onMutate: ()=>setIndicator(true),
        onSuccess:(data)=>{
            showToast(toast, 'success', 'Operation Success!','Operation was successful.');
            setIndicator(false)
        }
    });


    const logins=login ? JSON.parse(login) : null;

    useEffect(()=>{
        if(!token || isExpired ){
            navigate("/")
        }else {
            if(!logins['privileges']?.includes('ADMIN')){
                showToast(toast,'error','Error 401: Access Denied','You do not have access to this resource!');
                window.history.back();
            }
        }
    },[])

    const industryData=useFetch('/api/industrys/',token,['get','industrys']);
    useEffect(()=>{
        setIndustrys(industryData?.data);
    },[industryData?.data])

    const cols = [
        { field: 'name', header: 'INDUSTRY NAME' },
        { field: 'activeString', header: 'ACTIVE' },
        { field: 'dateCreated', header: 'DATE CREATED' },
        { field: 'createdBy', header: 'CREATED BY' },

    ];

    const viewIndustry = () => {
        setOpenViewIndustryDialog(true);
    };

    const editIndustry = () => {
        setOpenNewIndustryDialog(true);
    };

    const openNew=()=>{
        setOpenNewIndustryDialog(true);
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className={'flex flex-row justify-content-between'}>
                <h2 className="m-0">Industry List</h2>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search"/>
                </span>
            </div>
        );
    };

    const menuModel = [
        { label: 'Add', icon: 'pi pi-fw pi-add', command: () => openNew() },
        { label: 'View', icon: 'pi pi-fw pi-hourglass', command: () => viewIndustry() },
        { label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => editIndustry() },
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const exportCSV = (selectionOnly) => {
        dt?.current.exportCSV({ selectionOnly });
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc?.autoTable(exportColumns, industries);
                doc.save('industry.pdf');
            });
        });
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="" rounded icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div style={{width:'100%', flex:1, flexDirection:'row', justifyContent:'space-around'}}>
                <Button type="button" label={'CSV'} icon="pi pi-download " severity="success" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
                &nbsp;&nbsp;
                <Button type="button" label={'PDF'} icon="pi pi-download" severity="danger" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
        </div>)
    };

    const refresh=(data)=>{
        setIndustrys(data);
    }

    const showSuccessFeedback=()=>{
        showToast(toast,'success','Operation Feedback','Operation completed successfully!')
    }

    const showErrorFeedback=(error)=>{
        showToast(toast,'error','Operation Feedback',error.toString())
    }


    return (
        <>
            <Toast ref={toast} position={'center'} />
            {indicator && <div><ProgressSpinner title={'Please wait...'}/> <span> Please wait...</span></div>}
            <div className="card">
                <Tooltip target=".export-buttons>button" position="bottom" />
                <ContextMenu model={menuModel} ref={cm} onHide={() => null} />
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}/>
                <DataTable ref={dt} value={industrys}  tableStyle={{ minWidth: '50rem' }} paginator={true} rows={5} header={renderHeader}
                           filters={filters} filterDisplay="menu" globalFilterFields={['firstName', 'lastName', 'industryName', 'active', 'dateCreated','industryLevel']}
                           onContextMenu={(e) => cm['current'].show(e.originalEvent)} stripedRows={true}
                           rowsPerPageOptions={[5,10, 25, 50]} dataKey="id" resizableColumns showGridlines
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           contextMenuSelection={selectedIndustry} onContextMenuSelectionChange={(e) => setSelectedIndustry(e.value)}>
                    {cols?.map((col,index)=>{
                        return <Column key={index}  field={col?.field} header={col?.header} />
                    })
                    }

                </DataTable>

                <Dialog header={()=>{
                    return <div style={{textDecoration:'underline', textDecorationColor:'forestgreen', paddingLeft:20, paddingRight:10}}>
                        <Typography component="h1" variant="h3" color={'green'}>
                            {selectedIndustry && selectedIndustry?.id ? selectedIndustry?.firstName+' '+selectedIndustry?.lastName:"New Industry"}
                        </Typography>
                    </div>
                }} visible={openNewIndustryDialog} style={{ width: '80vw' }} onHide={() => setOpenNewIndustryDialog(false)}>
                    <EditIndustryDialog selectedIndustry={selectedIndustry} setEditIndustryDialogVisible={setOpenNewIndustryDialog} openNewIndustryDialog={openNewIndustryDialog}
                                    token={token} setIndustrys={refresh} showSuccessFeedback={showSuccessFeedback} showErrorFeedback={showErrorFeedback}/>
                </Dialog>

                <Dialog header={()=>{
                    return <div style={{textDecoration:'underline', textDecorationColor:'forestgreen', paddingLeft:20, paddingRight:10}}>
                        <Typography component="h1" variant="h3" color={'green'}>
                            {selectedIndustry?.firstName+' '+selectedIndustry?.lastName}
                        </Typography>
                    </div>
                }} visible={openViewIndustryDialog} style={{ width: '80vw' }} onHide={() => setOpenViewIndustryDialog(false)}>
                    <ViewIndustryDialog industry={selectedIndustry} setShowViewIndustryDialog={setOpenViewIndustryDialog} />
                </Dialog>

                <Dialog header={()=><div
                    style={{width:'90%', backgroundColor:'forestgreen', padding: '20px', borderRadius:20, color:'white', margin: 10}}
                >
                    {'Reset password for ::'+selectedIndustry?.lastName +' '+selectedIndustry?.firstName+'?'}</div>} visible={resetPasswordDialog} onHide={() => setResetPasswordDialog(false)}
                        style={{ width: '50vw' }} sx={{width:'100%'}} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>

                    {indicator && <div className="card flex justify-content-center"> <ProgressSpinner /></div>}
                    <div>


                            <br/>
                            <br/>
                            <div style={{width:'100%'}} className={'flex justify-content-around'} >
                                <Button label="Reject" type="button" icon="pi pi-undo" severity={'danger'} outlined  onClick={()=>setResetPasswordDialog(false)}/>
                                <Button label="Accept" type="button" icon="pi pi-check" severity={'success'} outlined  onClick={()=>resetPassword()}/>
                            </div>

                        </div>
                </Dialog>

            </div>
        </>
    )
}

export default Industry;
