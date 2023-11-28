import React from 'react';
import {Button} from "primereact/button";

const UserMenu =({login, userMenu, changeColor}) => {
    const logins=(login)?JSON.parse(login):null;

    return (
        <Button label={(logins?.lastName || '') + ' ' + (logins?.firstName || '')} outlined={true} severity={"success"}
                rounded text raised style={{fontSize: '1rem', opacity: 0.9, color: changeColor?"white":"forestgreen"}} icon="pi pi-user"
                onClick={(e) => userMenu.current.toggle(e)}/>
    )
}
    export default UserMenu;

