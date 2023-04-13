import React, {useEffect, useRef, useState} from 'react';
import useLoginContext from "../../context/use.login.context";
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
import EditUserDialog from "./edit.user.dialog.jsx";
import {Dialog} from "primereact/dialog";
import {Typography} from "@mui/material";

const Users =  () => {

    const {token, login}=useLoginContext();
    const {isExpired} =useJwt(token);
    const navigate=useNavigate();
    const toast= useRef(null);
    const[indicator, setIndicator]=useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [openNewUserDialog, setOpenNewUserDialog] = useState(null);
    const [users, setUsers]=useState([]);
    const dt = useRef(null);
    const cm = useRef(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        firstName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        lastName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        userName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        active: { value: null, matchMode: FilterMatchMode.IN },
        dateCreated: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        userLevel: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

    });

    useEffect(()=>{
        if(!token || isExpired ){
            navigate("/")
        }else if(!login?.privileges?.includes('ADMIN')){
            showToast(toast,'error','Error 401: Access Denied','You do not have access to this resource!');
            window.history.back();
        }
    })


    const viewUser = (user) => {
        toast.current.show({ severity: 'info', summary: 'user Selected', detail: user.userName });
    };

    const pullData=async ()=>{
        const r= await GetFromAPI(token, 'api/users/', setIndicator);
        setUsers(r)
        return r;
    }
    useEffect( ()=>{
        const data=pullData();
    },[])

    const cols = [
        { field: 'id', header: 'ID' },
        { field: 'firstName', header: 'FIRST NAME' },
        { field: 'lastName', header: 'LAST NAME' },
        { field: 'userName', header: 'USERNAME' },
        { field: 'userLevel', header: 'USER LEVEL' },
        { field: 'roleString', header: 'USER ROLES' },
        { field: 'activeString', header: 'ACTIVE' },
        { field: 'dateCreated', header: 'DATE CREATED' },
        { field: 'createdBy', header: 'CREATED BY' },

    ];

    const editUser = (user) => {
        toast.current.show({ severity: 'info', summary: 'user edited', detail: user.userName });
    };

    const deleteUser = (user) => {
        toast.current.show({ severity: 'info', summary: 'user deleted', detail: user.userName });
    };

    const openNew=()=>{
        setOpenNewUserDialog(true);
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
                <h2 className="m-0">User List</h2>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" variant={'standard'}/>
                </span>
            </div>
        );
    };

    const menuModel = [
        { label: 'View', icon: 'pi pi-fw pi-hourglass', command: () => viewUser(selectedUser) },
        { label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => editUser(selectedUser) },
        { label: 'Delete', icon: 'pi pi-fw pi-times', command: () => deleteUser(selectedUser) }
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, users);
                doc.save('users.pdf');
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



    return (
        <>
            <Toast ref={toast} position={'center'} />
            {indicator && <div className="card flex justify-content-center"> <ProgressSpinner style={{zIndex:1000}}/></div>}
            <div className="card">
                <Tooltip target=".export-buttons>button" position="bottom" />
                <ContextMenu model={menuModel} ref={cm} onHide={() => setSelectedUser(null)} />
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}/>
                <DataTable ref={dt} value={users}  tableStyle={{ minWidth: '50rem' }} paginator={true} rows={10} header={renderHeader}
                           filters={filters} filterDisplay="menu" globalFilterFields={['firstName', 'lastName', 'userName', 'active', 'dateCreated','userLevel']}
                           onContextMenu={(e) => cm.current.show(e.originalEvent)} stripedRows={true}
                           rowsPerPageOptions={[10, 25, 50]} dataKey="id" resizableColumns showGridlines
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           contextMenuSelection={selectedUser} onContextMenuSelectionChange={(e) => setSelectedUser(e.value)}>
                    {cols?.map((col,index)=>{
                        return <Column key={index}  field={col?.field} header={col?.header} />
                    })
                    }

                </DataTable>

                <Dialog header={()=>{
                    return <div style={{textDecoration:'underline', textDecorationColor:'forestgreen', paddingLeft:20, paddingRight:10}}>
                        <Typography component="h1" variant="h3" color={'green'}>
                            {selectedUser && selectedUser?.id ? selectedUser?.firstName+''+selectedUser?.lastName:"New User"}
                        </Typography>
                    </div>
                }} visible={openNewUserDialog} style={{ width: '80vw' }} onHide={() => setOpenNewUserDialog(false)}>
                    <EditUserDialog user={selectedUser} setEditUserDialogVisible={setOpenNewUserDialog} openNewUserDialog={openNewUserDialog}/>
                </Dialog>

            </div>
        </>
    )
}

export default Users;
