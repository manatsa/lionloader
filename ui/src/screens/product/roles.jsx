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
import {Dialog} from "primereact/dialog";
import {Typography} from "@mui/material";
import EditRoleDialog from "./edit.role.dialog.jsx";
import {useFetch} from "../../query/useFetch.js";
import {getLogin} from "../../auth/check.login";

const Roles =  () => {

    const {token, login}=getLogin();
    const {isExpired} =useJwt(token);
    const navigate=useNavigate();
    const toast= useRef(null);
    const[indicator, setIndicator]=useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [openNewRoleDialog, setOpenNewRoleDialog] = useState(false);
    const [openViewRoleDialog, setOpenViewRoleDialog] = useState(false);
    const [roles, setRoles]=useState([]);
    const dt = useRef(null);
    const cm = useRef(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
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

    const viewRole = () => {
        setOpenViewRoleDialog(true)
    };

    const {data, error, isError, isLoading }=useFetch('/api/roles/',token,['get','roles']);

    useEffect(()=>{
        setRoles(data)
    },[data])

    const cols = [
        { field: 'name', header: 'ROLE NAME' },
        { field: 'active', header: 'ACTIVE' },
        { field: 'dateCreated', header: 'DATE CREATED' },
        { field: 'privilegeString', header: 'PRIVILEGES' },

    ];

    const editRole = () => {
        setOpenNewRoleDialog(true)
    };

    const deleteRole = () => {
        toast.current.show({ severity: 'info', summary: 'role deleted', detail: selectedRole.name });
    };

    const openNew=()=>{
        setOpenNewRoleDialog(true);
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
                <h2 className="m-0">Roles List</h2>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" variant={'standard'}/>
                </span>
            </div>
        );
    };

    const menuModel = [
        { label: 'View', icon: 'pi pi-fw pi-hourglass', command: () => viewRole() },
        { label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => editRole() },
        { label: 'Delete', icon: 'pi pi-fw pi-times', command: () => deleteRole() }
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(exportColumns, roles);
                doc.save('roles.pdf');
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
        setRoles(data);
        // setRoles(data);
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
                <DataTable ref={dt} value={roles}  tableStyle={{ minWidth: '50rem' }} paginator={true} rows={5} header={renderHeader}
                           filters={filters} filterDisplay="menu" globalFilterFields={['name', 'privileges',  'active', 'dateCreated']}
                           onContextMenu={(e) => cm.current.show(e.originalEvent)} stripedRows={true}
                           rowsPerPageOptions={[5,10, 25, 50]} dataKey="id" resizableColumns showGridlines
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           contextMenuSelection={selectedRole} onContextMenuSelectionChange={(e) => setSelectedRole(e.value)}>
                    {cols?.map((col,index)=>{
                        return <Column key={index}  field={col?.field} header={col?.header} />
                    })
                    }

                </DataTable>

                <Dialog header={()=>{
                    return <div style={{textDecoration:'underline', textDecorationColor:'forestgreen', paddingLeft:20, paddingRight:10}}>
                        <Typography component="h1" variant="h3" color={'green'}>
                            {selectedRole && selectedRole?.id ? selectedRole?.name:"New Role"}
                        </Typography>
                    </div>
                }} visible={openNewRoleDialog} style={{ width: '70vw' }} onHide={() => setOpenNewRoleDialog(false)}>
                    <EditRoleDialog role={selectedRole} setEditRoleDialogVisible={setOpenNewRoleDialog} openNewUserDialog={openNewRoleDialog}
                                    token={token} setRolesData={refresh} showSuccessFeedback={showSuccessFeedback} showErrorFeedback={showErrorFeedback}/>
                </Dialog>

                <Dialog header={()=>{
                    return <div style={{textDecoration:'underline', textDecorationColor:'forestgreen', paddingLeft:20, paddingRight:10}}>
                        <Typography component="h1" variant="h3" color={'green'}>
                            {'VIEW ROLE :: '+selectedRole?.name}
                        </Typography>
                    </div>
                }} visible={openViewRoleDialog} style={{ width: '60vw' }} onHide={() => setOpenViewRoleDialog(false)}>
                   <div className={'grid'}>
                       <div className="col-4">Role Name</div>
                       <div className="col-4">{selectedRole?.name}</div>
                       <div className="col-4">&nbsp;</div>

                       <div className="col-4">Role privileges</div>
                       <div className="col-4">{selectedRole?.privileges?.map(p=>p?.name+', ')}</div>
                       <div className="col-4">&nbsp;</div>

                       <div className="col-4">Role Active</div>
                       <div className="col-4">{selectedRole?.active}</div>
                       <div className="col-4">&nbsp;</div>

                       <div className="col-4">Date Created</div>
                       <div className="col-4">{selectedRole?.dateCreated}</div>
                       <div className="col-4">&nbsp;</div>

                       <div className="col-4">Created By</div>
                       <div className="col-4">{selectedRole?.createdBy?.toString()}</div>
                       <div className="col-4">&nbsp;</div>
                   </div>
                </Dialog>

            </div>
        </>
    )
}

export default Roles;
