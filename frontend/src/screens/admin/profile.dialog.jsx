import {Dialog} from "primereact/dialog";

const ProfileDialog =({visible, setVisible,data})=>{

    return (
        <>
            <Dialog header={()=><div
                style={{width:'90%', backgroundColor:'forestgreen', padding: '20px', borderRadius:20, color:'white', margin: 10}}
            >{data?.lastName +' '+data?.firstName}</div>} visible={visible} onHide={() => setVisible(false)}
                    style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <table>
                    <tr>
                        <th>Property</th>
                        <th>Value</th>
                    </tr>
                    <tr>
                        <td>First Name</td>
                        <td>{data?.firstName}</td>
                    </tr>
                    <tr>
                        <td>Last Name</td>
                        <td>{data?.lastName}</td>
                    </tr>
                    <tr>
                        <td>User Level</td>
                        <td>{data?.userLevel}</td>
                    </tr>
                    <tr>
                        <td>User Roles</td>
                        <td>{data?.roles}</td>
                    </tr>
                    <tr>
                        <td>User Privileges</td>
                        <td>{data?.privileges}</td>
                    </tr>
                    <tr>
                        <td>Date Created</td>
                        <td>{data?.dateCreated}</td>
                    </tr>

                </table>
            </Dialog>
        </>
    )
}

export default ProfileDialog;