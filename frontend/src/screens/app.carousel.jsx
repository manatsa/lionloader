import {Tag} from "primereact/tag";
import {Button} from "primereact/button";
import {Carousel} from "primereact/carousel";
import {Container} from "@mui/material";

const AppCarousel =({items})=>{

    const responsiveOptions = [
        {
            breakpoint: '1199px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '991px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1
        }
    ];


    const itemTemplate = (item) => {
        return (
            <div style={{backgroundColor:'grey', width:'100%'}}>
                <div className="mb-3" style={{padding:'30px'}}>
                    <img src={item?.image} alt={item?.category}   height={500} width={'100%'}/>
                </div>
                <div>
                    <h4 className="mb-1">{item?.title}</h4>
                    <h6 className="mt-0 mb-3">{item?.description}</h6>
                    <Tag value={item?.category} severity={item?.severity}/>
                    <div className="mt-5 flex flex-wrap gap-2 justify-content-center">
                        <Button icon="pi pi-search" className="p-button p-button-rounded" />
                        <Button icon="pi pi-star-fill" className="p-button-success p-button-rounded" />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Container style={{width:'100%'}} >
            <Carousel value={items} numVisible={1} numScroll={1} orientation="horizontal" style={{width:'100%'}}
                itemTemplate={itemTemplate} responsiveOptions={responsiveOptions} circular={true} autoplayInterval={20000} showNavigators={true}/>
        </Container>

    )
}

export default AppCarousel;