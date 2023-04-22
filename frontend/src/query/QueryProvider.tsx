import React, {useRef} from 'react';
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {Toast} from "primereact/toast";
import {QueryCache, QueryClient, QueryClientProvider, QueryErrorResetBoundary} from "@tanstack/react-query";
import showToast from "../notifications/showToast";
import Loader from "./Loader/Loader";
import {ErrorBoundary} from "react-error-boundary";
import {Button} from "primereact/button";

const QueryProvider =({children})=>{
    const toast= useRef(null);
    const client = new QueryClient({
        defaultOptions:{
            queries:{
                suspense: true,
                refetchOnWindowFocus: false,
                staleTime:1800000,
                retry: 1
            },
            mutations: {
                retry:0,
            }
        },
        queryCache: new QueryCache({
            onError: (error:any, query) => {
                     showToast(toast,'error','Data fetch error!',`${error.message} - API::${error?.response?.data?.path}`)
            },
        }),
    })


    return (
        <QueryClientProvider client={client}>
            <ReactQueryDevtools initialIsOpen={false}/>
            <Toast ref={toast} />
            <QueryErrorResetBoundary>
                {({ reset }) => (
                    <ErrorBoundary
                        fallbackRender={({ error, resetErrorBoundary }) => (
                            <div>
                                There was an error!{" "}
                                <Button  onClick={() => resetErrorBoundary()}>Try again</Button>
                                <pre style={{ whiteSpace: "normal" }}>{error.message}</pre>
                            </div>
                        )}
                        onReset={reset}
                    >

                    {children}

                    </ErrorBoundary>
                )}
            </QueryErrorResetBoundary>
        </QueryClientProvider>
    )
}

export default QueryProvider;