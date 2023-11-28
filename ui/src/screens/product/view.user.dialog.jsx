import React from 'react';
import {Panel} from "primereact/panel";
import {Container} from "@mui/material";
import {Splitter, SplitterPanel} from "primereact/splitter";
import {Button} from "primereact/button";

const ViewUserDialog=({setShowViewUserDialog, user})=>{
console.log(user)
    return(
        <>
            <Container >
                <Panel header={`${user?.firstName} ${user?.lastName}`} className={'success'}>
                    <table>
                        <thead>
                            <th>Property</th>
                            <th>Value</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td>First Name</td>
                                <td>${user?.firstName}</td>
                            </tr>
                            <tr>
                                <td>Last Name</td>
                                <td>${user?.lastName}</td>
                            </tr>
                            <tr>
                                <td>User Name</td>
                                <td>${user?.userName}</td>
                            </tr>
                            <tr>
                                <td>User Level</td>
                                <td>${user?.userLevel}</td>
                            </tr>
                            <tr>
                                <td>Active</td>
                                <td>${user?.active?.toString()}</td>
                            </tr>
                            <tr>
                                <td>User Roles</td>
                                <td>${user?.roles?.map(r=>r?.name+', ')}</td>
                            </tr>
                            <tr>
                                <td>Date Created</td>
                                <td>${user?.dateCreated}</td>
                            </tr>
                            <tr>
                                <td>Created By</td>
                                <td>${user?.createdBy}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className={'flex justify-content-end'}>
                        <Button  severity={'success'} outlined={true} type="button" label="Close" onClick={()=>setShowViewUserDialog(false)} />
                    </div>
                </Panel>
            </Container>
        </>
    )
}

export default ViewUserDialog;