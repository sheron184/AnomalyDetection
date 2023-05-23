import React, {useEffect, useMemo, useState} from 'react';
import MaterialReactTable, {type MRT_ColumnDef} from 'material-react-table';
import DeleteIcon from '@mui/icons-material/Delete';
import NewIcon from '@mui/icons-material/Add';
import {Box, ThemeProvider} from "@mui/system";
import {createTheme} from "@mui/material/styles";
import {blue, red} from "@mui/material/colors";
import {Avatar, Button, Chip, Grid,} from "@mui/material";
import EditNoteIcon from '@mui/icons-material/EditNote';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: "#628c00",
        },
        secondary: {
            main: red[500],
        },
    },
});
let contactList:any[] = [];
let contactGroupList: any[] = [];

function ListMetric() {
    const [metrics, setMetrics] = useState([])

    const loadData = async () => {
        let response;
        try {
            response = await fetch(
                "./modules/AnomalyDetection/api/",
                {
                    method: "GET"
                }
            );
        } catch (e) {
            console.log(e);
        }
        const data = await response?.json();
        try{
            let response = await fetch(
                "./modules/AnomalyDetection/api/contact/",
                {
                    method: "GET"
                }
            );
            contactList = await response?.json();

        }catch (e) {

        }
        try{
            let response = await fetch(
                "./modules/AnomalyDetection/api/contact/group",
                {
                    method: "GET"
                }
            );
            contactGroupList = await response?.json();

        }catch (e) {

        }
        setMetrics(data);
    }
    useEffect(() => {
        loadData();



    }, []);

    const onDelete = async (id: any) => {
        if (confirm("Are you sure?")) {
            let response;
            try {
                response = await fetch(
                    "./modules/AnomalyDetection/api/?id=" + id,
                    {
                        method: "DELETE"
                    }
                );
            } catch (e) {
                console.log(e);
            }
            const data = await response?.json();
            loadData();
        }
    }

    const columns = useMemo<MRT_ColumnDef<Object>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Metric Name',
            },

            {
                accessorKey: 'host_name',
                header: 'Host Name',
            },

            {
                accessorKey: 'service_name',
                header: 'Service Name',
            },
            {
                accessorKey: 'metric_name',
                header: 'Metric Name',
            },
            {
                accessorKey: 'contact_id',
                header: 'Contacts',
                Cell: props => {
                    // @ts-ignore
                    let emails = props.cell.getValue().split('_').map((k:any)=>{
                        // @ts-ignore
                        return contactList.find((o)=>{
                            return o.value == k;
                        }).label;
                    });

                    let truncatedEmails = emails.slice(0,2).join(', ');
                    let moreEmailsCount = emails.length - 2;
            
                    return (
                        <>
                            {truncatedEmails}
                            {moreEmailsCount > 0 &&
                                // <span style={{marginLeft: 5}}>+{moreEmailsCount}</span>
                                <span style={{
                                    marginLeft: 5,
                                    backgroundColor: '#0077c5',
                                    borderRadius: '10px',
                                    padding: '0px 5px',
                                    color: 'white'}}>
                                    <span style={{fontWeight: 'bold'}}>+
                                        {moreEmailsCount}
                                    </span>
                                </span>
                            }
                        </>);                    
                }
            },
            {
                accessorKey: 'contact_group_id',
                header: 'Contact Groups',
                Cell: props => {
                    // @ts-ignore
                    let groups = props.cell.getValue().split('_').map((k:any)=>{
                        // @ts-ignore
                        return contactGroupList.find((o)=>{
                            return o.value == k;
                        }).label;
                    });
                    
                    let truncatedGroups = groups.slice(0,2).join(', ');
                    let moreGroupsCount = groups.length - 2;
            
                    return (
                        <>
                            {truncatedGroups}
                            {moreGroupsCount > 0 &&
                                <span style={{
                                    marginLeft: 5,
                                    backgroundColor: '#0077c5',
                                    borderRadius: '10px',
                                    padding: '0px 5px',
                                    color: 'white'}}>
                                    <span style={{fontWeight: 'bold'}}>+
                                        {moreGroupsCount}
                                    </span>
                                </span>
                            }
                        </>
                    );
                }
            },
            {
                accessorKey: 'notification_status',
                header: 'Notification',
                Cell: props => <Chip label={props.cell.getValue() === '0' ? "Inactive" : "Active"}
                                     color={props.cell.getValue() === '0' ? "warning" : "primary"}/>
            },
            {

                accessorKey: 'status',
                header: 'Status',
                Cell: props => <Chip label={props.cell.getValue() === '0' ? "Inactive" : "Active"}
                                     color={props.cell.getValue() === '0' ? "warning" : "primary"}/>
            },
            {
                accessorKey: 'id',
                header: 'Action',
                Cell: props =>
                    <>
                        <Chip clickable={true} onClick={(e) => {
                            onDelete(props.cell.getValue()).then(r => true);
                        }} avatar={<Avatar color={"danger"}><DeleteIcon style={{fontSize: 13}}/></Avatar>}
                              label="DELETE"/>
                        <Chip sx={{marginLeft: '7px'}} clickable={true} onClick={(e,) => {
                            // Add section param and reload
                            const url = new URL(window.location.href);
                            const searchParams = new URLSearchParams(url.search);
                            searchParams.set('s', '2');
                            // @ts-ignore
                            searchParams.set("id", props.cell.getValue());
                            url.search = searchParams.toString();
                            window.location.href = url.toString();
                        }} avatar={<Avatar color={"info"}><EditNoteIcon/></Avatar>} label={"EDIT"}/>
                    </>
            },
        ],
        [],
    );

    const redirect = () => {
        const currentUrlParams = new URLSearchParams(window.location.search);
        currentUrlParams.set('s', '1');
        window.location.href = `${window.location.origin}${window.location.pathname}?${currentUrlParams.toString()}`;
    }

    return <ThemeProvider theme={theme}>

        <Grid container spacing={2} sx={{
            padding: "15px 15px 0;"
        }}>
            <Grid item xs={8}>
                <Button style={{
                    backgroundColor:blue[500]
                }} variant={"contained"} onClick={redirect} startIcon={<NewIcon/>}>
                    Add
                </Button>
            </Grid>

        </Grid>
            <Box sx={{
                        position: "top",
                        top: 0,
                        left: 0,
                        padding: "10px",
                        width: "100%",
                        //height: "100%", 
                        overflowX: "auto",
                        //overflowY: "auto",
                        '@media (min-width: 601px)': { // media query for screens wider than 600px
                        width: "calc(100vw - 50px)",
                        //height: "calc(100vw - 75px)",
                        },
                    }}>
             <MaterialReactTable columns={columns} data={metrics} layoutMode="grid"/>
        </Box>
    </ThemeProvider>;
}

export default ListMetric;