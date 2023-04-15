import React, {useRef, useState} from 'react';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import { Toast } from 'primereact/toast';
import showToast from "../notifications/showToast";
import {useNavigate} from 'react-router-dom';
import useLoginContext from "../context/use.login.context";
import {Password} from "primereact/password";
import {useSend} from "../hooks/useSend.js";


export default function Login() {
    const { token, setToken, setLogin } = useLoginContext();
    const toast = useRef(null);
    const [logged, setLogged] = useState(false);
    const navigate= useNavigate();


    const handleSubmit = async (event) => {
        event.preventDefault();
        const datas = new FormData(event.currentTarget);
        const login={ username: datas.get("username"),password: datas.get("password")};
        const response = await axios
            .post("api/authenticate", JSON.stringify(login), {
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 60000,
                timeoutErrorMessage:
                    "Connection to server could not be established!\nPlease check your internet connectivity.",
            })
            .catch(async function (error) {
                const ex = await JSON.stringify(error.toJSON())?.split(',')[0]?.split(':')[1];
                console.log(ex)
                showToast(toast,'error', 'Login Failed', ex )
            });

        // const {data, error, isError, isLoading }=useSend('/api/roles/',token, JSON.stringify(login),'get-roles');

        if(token || response?.status===200 || response?.statusText==='OK') {
            setToken(response?.data?.token);
            setLogin(response?.data);
            showToast(toast, 'success', 'Login Message', "You have successfully logged in!", 'center')
            setLogged(true);
            navigate("/home")
        }else{
            setLogged(false);
            showToast(toast,'error', 'Login Failed','Error Message::'+response?.message )
        }

    };

    return (
        <Container component="main" maxWidth="sm">
            <Toast ref={toast} position={'top-center'}/>

                <Box sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
                     style={{
                         border: '5px solid green',
                         borderWidth: '5px',
                         borderRadius: '20px',
                         padding:'20px',
                         backgroundColor: "white"
                     }}
                >
                    <Typography component="h1" variant="h3" color={'green'}>
                        <span className={'success'}><span className="pi pi-sign-in" style={{fontSize: '2rem'}} /> Sign in: {logged}</span>
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Enter username"
                            name="username"
                            autoComplete="username"
                            variant={'standard'}
                            color={'success'}
                            autoFocus
                        />
                        <Password
                            minLength={6}
                            maxLength={16}
                            color={'green'}
                            inputStyle={{width:'100%'}}
                            style={{width:'100%'}}
                            required
                            name="password"
                            id="password"
                            toggleMask={true}
                        /><br/>
                        <FormControlLabel
                            control={<Checkbox value="remember" color="success" variant={'standard'}/>}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant={'outlined'}
                            color={'success'}
                            sx={{mt: 3, mb: 2}}
                            // style={{flex:1, justifyContent:"space-around"}}
                        >
                            <i className="pi pi-lock-open flex flex-start" />  <span>&nbsp; &nbsp; &nbsp;Login</span>
                        </Button>

                    </Box>
                </Box>
        </Container>
    );
}