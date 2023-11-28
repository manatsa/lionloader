import React, {createRef, useEffect, useRef, useState} from 'react';
import {useJwt} from "react-jwt";
import {useLocation, useNavigate} from "react-router-dom";
import showToast from "../../notifications/showToast";
import {Toast} from "primereact/toast";
import {ProgressSpinner} from "primereact/progressspinner";
import { Button } from 'primereact/button';
import {InputText} from "primereact/inputtext";
import {Dialog} from "primereact/dialog";
import {Drawer, Tab, Tabs, Typography} from "@mui/material";
import {doFetch} from "../../query/doFetch.js";
import {getLogin} from "../../auth/check.login";
import EditProductDialog from "./edit.product.dialog.jsx";
import {Tag} from "primereact/tag";
import {DataView, DataViewLayoutOptions} from "primereact/dataview";
import {SpeedDial} from "primereact/speeddial";
import {Fieldset} from "primereact/fieldset";
import {OverlayPanel} from "primereact/overlaypanel";
import Box from "@mui/material/Box";
import { SupervisorAccountOutlined, DescriptionOutlined } from '@mui/icons-material';
import TabPanel from "../../components/TabPanel.jsx";
import {ScrollPanel} from "primereact/scrollpanel";
import './product.css';

const Product =  () => {


    const {token, login}=getLogin();
    const toast= useRef(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openNewProductDialog, setOpenNewProductDialog] = useState(false);
    const [openViewProductDialog, setOpenViewProductDialog] = useState(false);
    const [products, setProducts]=useState([]);
    const [filteredProducts, setFilteredProducts]=useState([]);
    const [professionals, setProfessionals] = useState();
    const [filteredProfessionals, setFilteredProfessionals]=useState([]);
    const [layout, setLayout] = useState('grid');
    const [rows, setRows] = useState(6);
    const [searchValue, setSearchValue] = useState('');
    const [activeTab, setActiveTab] =useState(0);
    const [showSideBar, setShowSideBar] = useState(true);
    const [industry, setIndustry] = useState(null)

    const productDataOverlayRef=createRef();
    const professionalDataOverlayRef = createRef();


    const [selectedCategories, setCategories] = useState([])

    const drawerWidth = 240;
    const location = useLocation();
    const paramArr = location['search']?.split('?');
    let refreshParam=null;
    if(paramArr && paramArr?.length>0){
        refreshParam=paramArr[1]?.split('=')[1];
    }

    let {data, error, isError, isLoading }=doFetch('/api/products/',token,['get',refreshParam,'product']);
    let industryMutation =doFetch('/api/category/',token,['get','industry']);
    let categoryMutation =doFetch('/api/category/',token,['get','category']);


    const logins=login && login!=='undefined' ? JSON.parse(login) : null;

    useEffect(()=>{
        let prods=data?.map(d=>{
            return {...d,userName:d?.createdBy?.userName,category:d?.category?.name, owner:d?.owner?.userName, industry:d?.category?.industry?.name};
        })

        setFilteredProducts(prods);
        setProducts(prods)
    },[data])

    const cols = [
        { field: 'name', header: 'CATEGORY NAME' },
        { field: 'description', header: 'CATEGORY DESCRIPTION' },
        { field: 'category', header: 'CATEGORY NAME' },
        { field: 'owner', header: 'OWNER NAME' },
        { field: 'active', header: 'ACTIVE' },
        { field: 'dateCreated', header: 'DATE CREATED' },
        { field: 'userName', header: 'CREATED BY' },

    ];

    const viewProduct = () => {
        setOpenViewProductDialog(true)
    };

    const editProduct = () => {
        setOpenNewProductDialog(true)
    };

    const deleteProduct = () => {
        toast.current.show({ severity: 'info', summary: 'product deleted', detail: selectedProduct.name });
    };

    const openNew=()=>{
        setOpenNewProductDialog(true);
    }

    const addInventory=()=>{
        setOpenNewProductDialog(true);
    }

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(exportColumns, products);
                doc.save('products.pdf');
            });
        });
    };

    const refresh=(data)=>{
        let prods=data?.map(d=>{
            return {...d,userName:d?.createdBy?.userName,category:d?.category?.name, owner:d?.owner?.userName};
        })
        setProducts(prods)
    }

    const showSuccessFeedback=()=>{
        showToast(toast,'success','Operation Feedback','Operation completed successfully!')
    }

    const showErrorFeedback=(error)=>{
        showToast(toast,'error','Operation Feedback',error.toString())
    }

    const getSeverity = (product) => {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    const productListItems = (product) => {

        const op = createRef();
        const isProductAdmin=product?.owner?.toLowerCase()===logins?.userName?.toLowerCase() || logins?.roles?.includes('ADMIN');

        const productHeader=(
            <div className={'flex flex-row surface-200 border-round border-0 p-2'} onClick={e=>op?.current?.toggle(e)}>
                <i className="pi pi-calculator p-1" style={{ color: 'forestgreen' }}></i>
                <div className="text-2xl font-bold p-1 text-green-800">{product.name}</div>
            </div>
        )

        return (
            <div className="col-12" key={product?.id} >
                <Fieldset legend={productHeader}>
                    <div className="flex col-12 flex-row sx:flex-column justify-content-between " >
                        <img className="w-4 shadow-2 border-round col-12 h-12rem" alt={product.name}
                             src={`data:image/bmp;base64,${product?.picture}`} onClick={e=>op?.current?.toggle(e)}
                            // onMouseLeave={e=>op?.current?.toggle(e)} onMouseEnter={e=>op?.current?.toggle(e)}
                        />
                        <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                                <p className="text-xl font-italic font-light text-500">{product.description}</p>
                                {/*<Rating value={product.rating} readOnly cancel={false}></Rating>*/}
                                <div className={'col-12 flex flex-row'}>
                                    {
                                        product.tags?.split(',').map(tag=>{
                                            return(
                                                <Tag className={'m-1'} key={`tag-list-${tag}`} value={tag} severity={getSeverity(product)}></Tag>
                                            )
                                        })
                                    }
                                </div>
                                <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="font-semibold">{product.category}</span>
                                </span>
                                </div>
                            </div>
                            <div className="flex flex-row sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                <span className="text-2xl font-semibold">${product.price?.toFixed(2)}</span>
                                <div className="flex flex-1 flex-row p-5 gap-5">
                                    {isProductAdmin && <Button icon="pi pi-plus p-4" className="p-button-rounded"  severity={'secondary'}
                                                               onClick={event => {
                                                                   setSelectedProduct(product);
                                                                   openNew();
                                                               }} /> }
                                    <Button icon="pi pi-eye p-4" className="p-button-rounded" severity={'info'}
                                            onClick={event => {
                                                setSelectedProduct(product);
                                                viewProduct();
                                            }} />
                                    {isProductAdmin && <Button icon="pi pi-pencil p-4" className="p-button-rounded" severity={'danger'}
                                                               onClick={event => {
                                                                   setSelectedProduct(product);
                                                                   editProduct();
                                                               }} /> }
                                    <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={product.inventoryStatus === 'OUTOFSTOCK'}></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fieldset>

                <OverlayPanel ref={op}>
                    <img className="w-full shadow-2 border-round col-12 h-full" src={`data:image/bmp;base64,${product?.picture}`} alt={product.name} />
                </OverlayPanel>
            </div>
        );
    };

    const productGridItems = (product) => {
        const op = createRef();

        console.log(product)
        const isProductAdmin=(product?.owner?.toLowerCase()===logins?.userName?.toLowerCase() || logins?.roles?.includes('ADMIN'));

        const items = [
            {
                label: 'Add Inventory',
                icon: 'pi pi-plus',
                classname:'success',
                command: () => {
                    setSelectedProduct(product);
                    addInventory()
                }
            },
            {
                label: 'Edit Product',
                icon: 'pi pi-pencil',
                classname: 'secondary',
                command: () => {
                    setSelectedProduct(product);
                    editProduct()
                }
            },
            {
                label: 'Deactivate Product',
                icon: 'pi pi-times',
                classname: 'danger',
                command: () => {
                    setSelectedProduct(product);
                    deleteProduct()
                }
            },
            {
                label: 'View Product',
                icon: 'pi pi-eye',
                command: () => {
                    setSelectedProduct(product);
                    viewProduct()
                }
            }
        ];

        const productHeader=(
            <div className={'flex flex-row surface-200 border-round border-0 p-2'} onClick={e=>op?.current?.toggle(e)}>
                <i className="pi pi-calculator p-1" style={{ color: 'forestgreen' }}></i>
                <div className="text-2xl font-bold p-1 text-orange-500">{product.name}</div>
            </div>
        )
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={product?.id} >
                <Fieldset className="p-4 border-2 surface-border surface-card border-round" legend={productHeader}>
                    <p className="text-sm font-italic text-blue-600">{product.description}</p>
                    <div className="flex flex-column align-items-center gap-3">
                        <img className="w-9 shadow-2 border-round col-12 h-9rem" alt={product.name}
                             src={`data:image/bmp;base64,${product?.picture}`} onClick={e=>op?.current?.toggle(e)}
                             // onMouseLeave={e=>op?.current?.toggle(e)} onMouseEnter={e=>op?.current?.toggle(e)}
                        />

                        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                            <div className="flex align-items-center justify-content-start">
                                <span className="text-2xl font-semibold text-orange-700">${product.price?.toFixed(2)}</span>
                            </div>
                            <div>
                                <span className="font-bold text-2xl p-1">{product?.industry}</span>
                                <div className="flex flex-row">
                                    <i className={'pi pi-tag p-1'} style={{color:'forestgreen'}} />
                                    <span className="font-semibold p-1">{product.category}</span>
                                </div>
                            </div>

                        </div>

                        {/*<Rating value={product.rating} readOnly cancel={false}></Rating>*/}
                        <div className={'col-12 flex flex-row'}>
                            {
                                product.tags?.split(',').map(tag=>{
                                    return(
                                        <div className="flex flex-row">
                                            <Tag className={'m-1'} key={`tag-grid-${tag}`} value={tag} severity={'success'}></Tag>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <OverlayPanel ref={op}>
                        <img className="w-full shadow-2 border-round col-12 h-full" src={`data:image/bmp;base64,${product?.picture}`} alt={product.name} />
                    </OverlayPanel>


                        <div style={{position: 'relative'}} className={'flex justify-content-around align-items-end'}>

                            <Button icon="pi pi-eye" className="p-button-rounded" onClick={()=>{
                                setSelectedProduct(product);
                                setOpenViewProductDialog(true)
                            }} severity={'info'}></Button>
                            <div>
                                {isProductAdmin &&
                                    <SpeedDial model={items} key={'speedBtn' + product?.name} radius={120} direction="up"
                                       style={{right: 0, bottom: 0, padding: 0, margin: 0}}
                                       buttonClassName="p-button-outlined" showIcon="pi pi-ellipsis-v"
                                       hideIcon="pi pi-times"/>
                                }
                            </div>
                            <Button icon="pi pi-shopping-cart" className="p-button-rounded bg-orange-600"></Button>
                    </div>

                </Fieldset>

            </div>
        );
    };

    const itemTemplate = (product, layout) => {
        if (!product) {
            return;
        }

        if (layout === 'list'){
            setRows(4);
            return productListItems(product);
        }
        else if (layout === 'grid') {
            setRows(6)
            return productGridItems(product);
        }
    };

    const productHeader = () => {
        return (
            <div  >
                <Box sx={{mt:11}} className={'xl:hidden lg:hidden md:hidden'}></Box>
                <div className="flex flex-grow-1 justify-content-around my-3 ">
                    <div className="flex flex-wrap gap-1">
                        {logins && token && <Button label="" rounded icon="pi pi-plus" severity="success" onClick={openNew}/>}
                        <span className="p-input-icon-right">
                        <InputText  value={searchValue} onChange={event => {
                            setSearchValue(event.target.value)
                            let ps=[...products];
                            let filteredProducts=ps.filter(p=>p?.name?.toLowerCase()?.includes(event.target.value?.toLowerCase())|| p?.description?.includes(event.target.value))
                            setFilteredProducts(filteredProducts);
                        }} placeholder="Keyword Search" variant={'standard'} className="p-inputtext-sm"/>
                    </span>
                        {logins && token &&
                            <div style={{width:'100%', flex:1, flexDirection:'row', justifyContent:'space-around'}}>
                                <Button type="button" label={'PDF'} icon="pi pi-download" severity="danger" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
                            </div>
                        }
                    </div>
                    <div className={'flex flex-row justify-content-around'}>
                        <DataViewLayoutOptions className={'p-2'} layout={layout}  onChange={(e) => {
                            const lay=e.value;
                            if(lay==='grid'){
                                setRows(6)
                            }else{
                                setRows(3)
                            }
                            setLayout(e.value)
                        }} />
                    </div>
                </div>

            </div>
        );
    };

    const professionalHeader = () => {
        return (
            <div  >
                <Box sx={{mt:11}} className={'xl:hidden lg:hidden md:hidden'}></Box>
                <div className="flex flex-grow-1 justify-content-around my-3 ">
                    <div className="flex flex-wrap gap-1">
                        {logins && token && <Button label="" rounded icon="pi pi-plus" severity="success" onClick={openNew}/>}
                        <span className="p-input-icon-right">
                        <InputText  value={searchValue} onChange={event => {
                            setSearchValue(event.target.value)
                            let ps=[...products];
                            let filteredProducts=ps.filter(p=>p?.name?.toLowerCase()?.includes(event.target.value?.toLowerCase())|| p?.description?.includes(event.target.value))
                            setFilteredProducts(filteredProducts);
                        }} placeholder="Keyword Search" variant={'standard'} className="p-inputtext-sm"/>
                    </span>
                        {logins && token &&
                            <div style={{width:'100%', flex:1, flexDirection:'row', justifyContent:'space-around'}}>
                                <Button type="button" label={'PDF'} icon="pi pi-download" severity="danger" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
                            </div>
                        }
                    </div>
                    <div className={'flex flex-row justify-content-around'}>
                        <DataViewLayoutOptions className={'p-2'} layout={layout}  onChange={(e) => {
                            const lay=e.value;
                            if(lay==='grid'){
                                setRows(6)
                            }else{
                                setRows(3)
                            }
                            setLayout(e.value)
                        }} />
                    </div>
                </div>

            </div>
        );
    };


    const switchTabs=(tabIndex)=>{
        setActiveTab(tabIndex)
        if(tabIndex===0) {
            let productsData = doFetch('/api/products/', token, ['get', refreshParam, 'product']);
            setProducts(productsData?.data)
        }else if(tabIndex===1){
            let professionalsData = doFetch('/api/professionals/', token, ['get', refreshParam, 'professional']);
            setProfessionals(professionalsData?.data||[]);
            setFilteredProfessionals(professionalsData?.data||[])
        }
    }

    const onSelectIndustry=(industry)=>{

    }


    return (
        <>
            <Toast ref={toast} position={'center'} />
            {isLoading && <div className="card flex justify-content-center"> <ProgressSpinner style={{zIndex:1000}}/></div>}

            <div className="grid">
                {/*industry strip */}
                <div className="col-12">

                </div>
                <div className="col col-12">
                    <Tabs value={activeTab} onChange={(e, value)=>switchTabs(value)} className={'mt-0'} sx={{mt:11}} >
                        <Tab label={"Product List"} iconPosition={'start'} icon={<DescriptionOutlined />}  style={{color:'dodgerblue'}}/>
                        <Tab label={"Professional Services"} iconPosition={'start'} icon={<SupervisorAccountOutlined />} style={{color:'dodgerblue'}}/>
                    </Tabs>
                    <TabPanel value={activeTab} index={0}>
                        <div className="card flex flex-row">
                            <div className="col-2 pt-5">
                                <div className="flex-auto">
                                    <ScrollPanel style={{ width: '100%' }} className="custom-scrollbar">
                                        <div className="card flex flex-column">
                                            {
                                                industryMutation?.data?.map(industry=>{
                                                    return <div className={'col-12'}><Button className={'col-12'} icon="pi pi-bolt" label={industry?.name} onClick={(e) =>onSelectIndustry(industry)} /></div>
                                                })
                                            }
                                        </div>
                                    </ScrollPanel>
                                </div>
                            </div>
                            <div className={'col-10'}>
                                <DataView  value={filteredProducts} itemTemplate={itemTemplate} layout={layout} header={productHeader()} rows={rows} paginator={true} />
                            </div>
                        </div>
                        <OverlayPanel ref={productDataOverlayRef}>
                            <img src={'https://primefaces.org/cdn/primereact/images/product/bamboo-watch.jpg'} alt="Bamboo Watch"></img>
                        </OverlayPanel>
                    </TabPanel>
                    <TabPanel value={activeTab} index={1}>
                        <div className="card flex flex-row">
                            <div className="col-2 pt-5">
                                <div className="flex-auto">
                                    <ScrollPanel style={{ width: '100%' }} className="custom-scrollbar">
                                        <div className="card flex flex-column">
                                            {
                                                industryMutation?.data?.map(industry=>{
                                                    return <div className={'col-12'}><Button className={'col-12'} icon="pi pi-bolt" label={industry?.name} onClick={(e) =>onSelectIndustry(industry)} /></div>
                                                })
                                            }
                                        </div>
                                    </ScrollPanel>
                                </div>
                            </div>
                            <div className={'col-10'}>
                            <DataView  value={filteredProfessionals} itemTemplate={itemTemplate} layout={layout} header={professionalHeader()} rows={rows} paginator={true} />

                            </div>
                        </div>
                    </TabPanel>
                </div>
            </div>




            <Dialog header={()=>{
                return <div style={{textDecoration:'underline', textDecorationColor:'forestgreen', paddingLeft:20, paddingRight:10}}>
                    <Typography component="h1" variant="h3" color={'green'}>
                        {selectedProduct && selectedProduct?.id ? selectedProduct?.name:"New Product"}
                    </Typography>
                </div>
            }} visible={openNewProductDialog} style={{ width: '60vw' }} sx={{width:'100%'}} onHide={() => setOpenNewProductDialog(false)}>

                <EditProductDialog
                    token={token}
                    refreshProducts={refresh}
                    selectedProduct={selectedProduct}
                    showErrorFeedback={showErrorFeedback}
                    showSuccessFeedback={showSuccessFeedback}
                    setOpenNewProductDialog={setOpenNewProductDialog}
                />


            </Dialog>

            <Dialog header={()=>{
                return <div style={{textDecoration:'underline', textDecorationColor:'forestgreen', paddingLeft:20, paddingRight:10}}>
                    <Typography component="h1" variant="h4" color={'green'}>
                        {'VIEW PRODUCT :: '+selectedProduct?.name+ ' - '} <small>{selectedProduct?.description}</small>
                    </Typography>
                </div>
            }} visible={openViewProductDialog} style={{ width: '75vw' }} onHide={() => setOpenViewProductDialog(false)}>
                <div className={'flex sx:flex-column md:justify-content-between col-12'}>
                    <div className="col-6">
                        <img className="w-9 shadow-2 border-round col-12 h-full" src={`data:image/bmp;base64,${selectedProduct?.picture}`} alt={selectedProduct?.name} />
                    </div>
                    <div className="col-6 surface-100">
                        <div className="grid col-8">
                            <div className="col-6 sm:col-6">Name</div>
                            <div className="col-6 sm:col-6">{selectedProduct?.name}</div>

                            <div className="col-6 sm:col-6">Description</div>
                            <div className="col-6 sm:col-6">{selectedProduct?.description}</div>

                            <div className="col-6 sm:col-6">Active</div>
                            <div className="col-6 sm:col-6">{selectedProduct?.active?.toString()}</div>

                            <div className="col-6 sm:col-6">Owner</div>
                            <div className="col-6 sm:col-6">{selectedProduct?.owner}</div>

                            <div className="col-6 sm:col-6">Price</div>
                            <div className="col-6 sm:col-6">{selectedProduct?.price}</div>

                            <div className="col-6 sm:col-6">Tags</div>
                            <div className="col-6 sm:col-6">{selectedProduct?.tags}</div>

                            <div className="col-6 sm:col-6">Effect Date</div>
                            <div className="col-6 sm:col-6">{selectedProduct?.effectiveDate?.toLocaleString()?.split('T')[0]}</div>

                            <div className="col-6 sm:col-6">Promotions</div>
                            <div className="col-6 sm:col-6"><Button label={'Promotions'} onClick={()=>alert('Promotion')} /></div>

                            {/*<div className="col-6 sm:col-6">Product Active</div>
                            <div className="col-6 sm:col-6">{selectedProduct?.active?.toString()}</div>*/}

                            <div className="col-6 sm:col-6">Date Created</div>
                            <div className="col-6 sm:col-6">{selectedProduct?.dateCreated}</div>

                            <div className="col-6 sm:col-6">Created By</div>
                            <div className="col-6 sm:col-6">{selectedProduct?.createdBy?.userName?.toString()}</div>
                        </div>
                    </div>

                </div>
            </Dialog>

        </>
    )
}



export default Product;
