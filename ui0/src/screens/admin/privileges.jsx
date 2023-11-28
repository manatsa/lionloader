import React, {useEffect, useRef, useState} from 'react';
import {useJwt} from "react-jwt";
import {useNavigate} from "react-router-dom";
import showToast from "../../notifications/showToast";
import {Toast} from "primereact/toast";
import {ProgressSpinner} from "primereact/progressspinner";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import {ContextMenu} from "primereact/contextmenu";
import {Toolbar} from "primereact/toolbar";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import {InputText} from "primereact/inputtext";
import {Dialog} from "primereact/dialog";
import {Typography} from "@mui/material";
import EditRoleDialog from "./edit.role.dialog.jsx";
import {doFetch} from "../../query/doFetch.js";
import {getLogin} from "../../auth/check.login";
import EditPrivilegeDialog from "./edit.privilege.dialog.jsx";

const Privileges =  () => {

    const {token, login}=getLogin();
    const {isExpired} =useJwt(token);
    const navigate=useNavigate();
    const toast= useRef(null);
    const[indicator, setIndicator]=useState(false);
    const [selectedPrivilege, setSelectedPrivilege] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [OpenNewPrivilegeDialog, setOpenNewPrivilegeDialog] = useState(false);
    const [openViewPrivilegeDialog, setOpenViewPrivilegeDialog] = useState(false);
    const [privileges, setPrivileges]=useState([]);
    const dt = useRef(null);
    const cm = useRef(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
    });

    const logins=login && login!=='undefined' ? JSON.parse(login) : null;

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

    const viewRole = () => {
        setOpenViewPrivilegeDialog(true)
        toast.current.show({ severity: 'info', summary: 'role Selected', detail: selectedPrivilege.name });
    };

    const {data, error, isError, isLoading }=doFetch('/api/privileges/',token,['get','privileges']);

    useEffect(()=>{
        setPrivileges(data);
    },[data])

    const cols = [
        { field: 'name', header: 'PRIVILEGE NAME' },
        { field: 'active', header: 'ACTIVE' },
        { field: 'dateCreated', header: 'DATE CREATED' }

    ];

    const editPrivilege = () => {
        setOpenNewPrivilegeDialog(true)
    };

    const deletePrivilege = () => {
        toast.current.show({ severity: 'info', summary: 'privilege deleted', detail: selectedPrivilege.name });
    };

    const openNew = ()=>{
        setOpenNewPrivilegeDialog(true);
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
                <h2 className="m-0">Privileges List</h2>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" variant={'standard'}/>
                </span>
            </div>
        );
    };

    const menuModel = [
        { label: 'View', icon: 'pi pi-fw pi-hourglass', command: () => viewRole() },
        { label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => editPrivilege() },
        { label: 'Delete', icon: 'pi pi-fw pi-times', command: () => deletePrivilege() }
    ];

    const exportPrivilegeColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(exportPrivilegeColumns, privileges);
                doc.save('Privileges.pdf');
            });
        });
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="" rounded icon="pi pi-plus" severity="success" onClick={openNew}/>
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
        setPrivileges(data);
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
            {isLoading && <div className="card flex justify-content-center"> <ProgressSpinner style={{zIndex:1000}}/></div>}
            <div className="card">
                <Tooltip target=".export-buttons>button" position="bottom" />
                <ContextMenu model={menuModel} ref={cm} onHide={()=>null} />
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}/>
                <DataTable ref={dt} value={privileges}  tableStyle={{ minWidth: '50rem' }} paginator={true} rows={5} header={renderHeader}
                           filters={filters} filterDisplay="menu" globalFilterFields={['name', 'privileges',  'active', 'dateCreated']}
                           onContextMenu={(e) => cm.current.show(e.originalEvent)} stripedRows={true}
                           rowsPerPageOptions={[5,10, 25, 50]} dataKey="id" resizableColumns showGridlines
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           contextMenuSelection={selectedPrivilege} onContextMenuSelectionChange={(e) => setSelectedPrivilege(e.value)}>
                    {cols?.map((col,index)=>{
                        return <Column key={index}  field={col?.field} header={col?.header} />
                    })
                    }

                </DataTable>

                <Dialog header={()=>{
                    return <div style={{textDecoration:'underline', textDecorationColor:'forestgreen', paddingLeft:20, paddingRight:10}}>
                        <Typography component="h1" variant="h3" color={'green'}>
                            {selectedPrivilege && selectedPrivilege?.id ? selectedPrivilege?.name:"New Privilege"}
                        </Typography>
                    </div>
                }} visible={OpenNewPrivilegeDialog} style={{ width: '70vw' }} onHide={() => setOpenNewPrivilegeDialog(false)}>
                    <EditPrivilegeDialog privilege={selectedPrivilege} setEditPrivilegeDialogVisible={setOpenNewPrivilegeDialog} openNewPrivilegeDialog={OpenNewPrivilegeDialog}
                                         token={token} setPrivilegesData={refresh} showSuccessFeedback={showSuccessFeedback} showErrorFeedback={showErrorFeedback}/>
                </Dialog>

                <Dialog header={()=>{
                    return <div style={{textDecoration:'underline', textDecorationColor:'forestgreen', paddingLeft:20, paddingRight:10}}>
                        <Typography component="h1" variant="h3" color={'green'}>
                            {selectedPrivilege && selectedPrivilege?.id ? selectedPrivilege?.name:"Selected Role"}
                        </Typography>
                    </div>
                }} visible={openViewPrivilegeDialog} style={{ width: '60vw' }} onHide={() => setOpenViewPrivilegeDialog(false)}>
                    {/*<EditRoleDialog role={selectedPrivilege} setEditUserDialogVisible={setOpenNewPrivilegeDialog} openNewUserDialog={OpenNewPrivilegeDialog}/>*/}
                    <div>Viewing Role {JSON.stringify(selectedPrivilege)}</div>
                </Dialog>

            </div>
        </>
    )
}

export default Privileges;
