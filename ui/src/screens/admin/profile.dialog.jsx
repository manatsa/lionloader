import {Dialog} from "primereact/dialog";

const ProfileDialog =({visible, setVisible,data})=>{

    return (
        <>
            <Dialog header={()=><div
                style={{width:'90%', backgroundColor:'forestgreen', padding: '20px', borderRadius:20, color:'white', margin: 10}}
            >{data?.lastName +' '+data?.firstName}</div>} visible={visible} onHide={() => setVisible(false)}
                    style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <div className="grid">
                    <div className="col-6 md:col-5">
                        First Name
                    </div>
                    <div className="col-6 md:col-5">
                        {data?.firstName}
                    </div>
                    <div className="col-6 md:col-5">
                        Last Name
                    </div>
                    <div className="col-6 md:col-5">
                        {data?.lastName}
                    </div>
                    <div className="col-6 md:col-5">
                        User Level
                    </div>
                    <div className="col-6 md:col-5">
                        {data?.userLevel}
                    </div>
                    <div className="col-6 md:col-5">
                        User Roles
                    </div>
                    <div className="col-6 md:col-5">
                        {data?.roles}
                    </div>
                    <div className="col-6 md:col-5">
                        User Privileges
                    </div>
                    <div className="col-6 md:col-5">
                        {data?.privileges}
                    </div>
                    <div className="col-6 md:col-5">
                        Date Created
                    </div>
                    <div className="col-6 md:col-5">
                        {data?.dateCreated}
                    </div>
                    <div className="col-6">
                        Created By
                    </div>
                    <div className="col-6">
                        {data?.createdBy}
                    </div>
                </div>

            </Dialog>
        </>
    )
}

export default ProfileDialog;