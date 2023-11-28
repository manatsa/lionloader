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
import EditUserDialog from "./edit.user.dialog.jsx";
import {Dialog} from "primereact/dialog";
import {Typography} from "@mui/material";
import {useFetch} from "../../query/useFetch.js";
import {getLogin} from "../../auth/check.login";
import ViewUserDialog from "./view.user.dialog.jsx";
import {useMutation} from "@tanstack/react-query";
import doUpdate from "../../query/doUpdate.js";
import {Password} from "primereact/password";
import {confirmPopup, ConfirmPopup} from "primereact/confirmpopup";

const Users =  () => {

    const {token, login}=getLogin();
    const {isExpired} =useJwt(token);
    const navigate=useNavigate();
    const toast= useRef(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [openNewUserDialog, setOpenNewUserDialog] = useState(false);
    const [openViewUserDialog, setOpenViewUserDialog] = useState(false);
    const [resetPasswordDialog, setResetPasswordDialog] = useState(false);
    const [newPassword, setNewPassword] = useState(null);
    const [indicator, setIndicator] = useState(false);
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

    const {mutate, error,data, isLoading, isError, isSuccess} = useMutation({
        mutationFn:data=>doUpdate(`/api/users/activateDeactivate/`,token,data?.id,selectedUser),
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

    const restPasswordMutation = useMutation({
        mutationFn:data=>doUpdate(`/api/users/resetPassword/`,token,data?.id,selectedUser),
        onError: error=>{
            setIndicator(false)
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

    const userData=useFetch('/api/users/',token,['get','users']);
    useEffect(()=>{
        setUsers(userData?.data);
    },[userData?.data])

    const cols = [
        { field: 'firstName', header: 'FIRST NAME' },
        { field: 'lastName', header: 'LAST NAME' },
        { field: 'userName', header: 'USERNAME' },
        { field: 'userLevel', header: 'USER LEVEL' },
        { field: 'roleString', header: 'USER ROLES' },
        { field: 'activeString', header: 'ACTIVE' },
        { field: 'dateCreated', header: 'DATE CREATED' },
        { field: 'createdBy', header: 'CREATED BY' },

    ];

    const viewUser = () => {
        setOpenViewUserDialog(true);
    };

    const editUser = () => {
        setOpenNewUserDialog(true);
    };

    const toggleActive = () => {
        mutate({id:selectedUser?.id,selectedUser});
    };

    const showResetPassword = () => {
        setResetPasswordDialog(true)
    };

    const resetPassword=()=>{
        setResetPasswordDialog(false);
        restPasswordMutation.mutate({id:selectedUser?.id, password: newPassword})
    }

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
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search"/>
                </span>
            </div>
        );
    };

    const menuModel = [
        { label: 'View', icon: 'pi pi-fw pi-hourglass', command: () => viewUser() },
        { label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => editUser() },
        { label: 'Toggle Active', icon: 'pi pi-fw pi-times', command: () => toggleActive() },
        { label: 'Reset Password', icon: 'pi pi-fw pi-sync', command: () => showResetPassword() }
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const exportCSV = (selectionOnly) => {
        dt?.current.exportCSV({ selectionOnly });
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc?.autoTable(exportColumns, users);
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

    const refresh=(data)=>{
        setUsers(data);
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
                <DataTable ref={dt} value={users}  tableStyle={{ minWidth: '50rem' }} paginator={true} rows={5} header={renderHeader}
                           filters={filters} filterDisplay="menu" globalFilterFields={['firstName', 'lastName', 'userName', 'active', 'dateCreated','userLevel']}
                           onContextMenu={(e) => cm['current'].show(e.originalEvent)} stripedRows={true}
                           rowsPerPageOptions={[5,10, 25, 50]} dataKey="id" resizableColumns showGridlines
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
                            {selectedUser && selectedUser?.id ? selectedUser?.firstName+' '+selectedUser?.lastName:"New User"}
                        </Typography>
                    </div>
                }} visible={openNewUserDialog} style={{ width: '80vw' }} onHide={() => setOpenNewUserDialog(false)}>
                    <EditUserDialog selectedUser={selectedUser} setEditUserDialogVisible={setOpenNewUserDialog} openNewUserDialog={openNewUserDialog}
                                    token={token} setUsers={refresh} showSuccessFeedback={showSuccessFeedback} showErrorFeedback={showErrorFeedback}/>
                </Dialog>

                <Dialog header={()=>{
                    return <div style={{textDecoration:'underline', textDecorationColor:'forestgreen', paddingLeft:20, paddingRight:10}}>
                        <Typography component="h1" variant="h3" color={'green'}>
                            {selectedUser?.firstName+' '+selectedUser?.lastName}
                        </Typography>
                    </div>
                }} visible={openViewUserDialog} style={{ width: '80vw' }} onHide={() => setOpenViewUserDialog(false)}>
                    <ViewUserDialog user={selectedUser} setShowViewUserDialog={setOpenViewUserDialog} />
                </Dialog>

                <Dialog header={()=><div
                    style={{width:'90%', backgroundColor:'forestgreen', padding: '20px', borderRadius:20, color:'white', margin: 10}}
                >
                    {'Reset password for ::'+selectedUser?.lastName +' '+selectedUser?.firstName+'?'}</div>} visible={resetPasswordDialog} onHide={() => setResetPasswordDialog(false)}
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

export default Users;
