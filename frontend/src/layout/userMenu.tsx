import React from 'react';
import {Button} from "primereact/button";

const UserMenu =({login, userMenu}) => {
    return (
        <Button label={(login?.lastName || '') + ' ' + (login?.firstName || '')} outlined={true} severity={"success"}
                rounded text raised style={{fontSize: '1rem', opacity: 0.9, color: "forestgreen"}} icon="pi pi-user"
                onClick={(e) => userMenu.current.toggle(e)}/>
    )
}
    export default UserMenu;

