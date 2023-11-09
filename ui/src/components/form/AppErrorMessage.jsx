import React from "react";

const AppErrorMessage=({message, visible,})=> {
  return message || visible ? (<small className="p-error">{message}</small> ) : null;
}


export default AppErrorMessage;
