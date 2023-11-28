import React from "react";
import {ProgressSpinner} from "primereact/progressspinner";
import {Dialog, DialogContent, DialogTitle} from "@mui/material";
import './loader.css';

const Loader = (props: {isLoading:boolean}) => {
    return <>
        <div >
            <Dialog  open={props?.isLoading}
                     // BackdropProps={{
                     //    style:{
                     //        backgroundColor: 'lightgreen',
                     //        opacity: 0.05,
                     //    }
                     // }}
                title={'Loading..wait...'}

                     PaperProps={{
                         style: {
                             backgroundColor: 'transparent',
                             boxShadow: 'none',
                         },
                     }}
            >
                {/*<DialogTitle style={{backgroundColor: 'transparent'}}>Please wait...</DialogTitle>*/}
                <DialogContent style={{backgroundColor: 'transparent', border:'0px solid transparent',borderRadius:'50%'}}>
                    <ProgressSpinner />
                    <h4>Loading, please wait...</h4>
                </DialogContent>
            </Dialog>
        </div>
    </>;
}

export default Loader;
