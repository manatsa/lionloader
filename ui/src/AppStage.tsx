import React, {Suspense, useRef} from "react";
import Loader from "./query/Loader/Loader";
import Layout from "./layout/layout";
import  showToast from './notifications/showToast';
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {QueryCache, QueryClient, QueryClientProvider, QueryErrorResetBoundary} from "@tanstack/react-query";
import {ErrorBoundary} from "react-error-boundary";
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import {BrowserRouter} from "react-router-dom";


const AppStage: React.FC = (props): React.ReactElement => {
    const toast= useRef(null);
    const client = new QueryClient({
        defaultOptions:{
            queries:{
                suspense: true,
                refetchOnWindowFocus: false,
                staleTime:0,
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
    const App=React.lazy(()=>import('./App'));



    return <>
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
                        <Suspense fallback={<Loader isLoading={true} />} >
                            <BrowserRouter>
                                <Layout>
                                    <App/>
                                </Layout>
                            </BrowserRouter>
                        </Suspense>
                    </ErrorBoundary>
                )}
            </QueryErrorResetBoundary>
        </QueryClientProvider>

    </>;
}

export default AppStage;
