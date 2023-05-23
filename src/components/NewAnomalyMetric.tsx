import React from 'react';
import {
    Autocomplete,
    Button,
    FormControlLabel,
    Grid,
    Paper, Switch,
    TextareaAutosize,
    TextField,
    Typography
} from "@mui/material";
import {createTheme} from '@mui/material/styles';
import {red, blue} from '@mui/material/colors';
import {Box, ThemeProvider} from "@mui/system";
import {useState, useEffect} from "react";
// import AlertBx from "./dialog/AlertBx";


const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: blue[500],
        },
        secondary: {
            main: red[500],
        },
    },
});


function NewAnomalyMetric() {

    interface Option {
        value: number;
        label: string;
    }

    const [hosts, setHosts] = useState([]);
    const [services, setServices] = useState([]);
    const [metrics, setMetrics] = useState([]);
    const [contacts, setContacts] = useState<Option[]>([]);
    const [cGroups, setCGroups] = useState<Option[]>([]);
    const [hostSelected, setHostSelected] = useState(false);
    const [serviceSelected, setServiceSelected] = useState(false);
    const [host, setHost] = useState("");
    const [service, setService] = useState("");
    const [metric, setMetric] = useState("");
    const [contact, setContact] = useState<Option[]>([]);
    const [cGroup, setCGroup] = useState<Option[]>([]);
    const [mName, setMName] = useState("");
    const [unit, setUnit] = useState("");
    const [notifications, setNotifications] = useState(1);
    const [status, setStatus] = useState(1);
    const [comment, setComment] = useState("");

    const [errors, setErrors] = useState({
        host: "",
        service: "",
        name: "",
        metric: "",
        contact: "",
        contactGroup: ""

    });


    useEffect(() => {
        loadHosts().then(r => true);
        loadContacts().then(r => true);
        loadContactGroups().then(r => true);
    }, []);


    const loadHosts = async () => {
        let response;
        try {
            response = await fetch(
                "./modules/AnomalyDetection/api/host/",
                {
                    method: "GET"
                }
            );
        } catch (e) {
            console.log(e);
        }
        const data = await response?.json();
        data && setHosts(data);
        setServices([]);
        setMetrics([]);
    }
    const loadContacts = async () => {
        let response;
        try {
            response = await fetch(
                "./modules/AnomalyDetection/api/contact/",
                {
                    method: "GET"
                }
            );
        } catch (e) {
            console.log(e);
        }
        const data = await response?.json();
        const users = [];
        users.push({
            label : "Select All",
            value : ""
        });

        data && setContacts([...users,...data]);
    }
    const loadContactGroups = async () => {
        let response;
        try {
            response = await fetch(
                "./modules/AnomalyDetection/api/contact/group/",
                {
                    method: "GET"
                }
            );
        } catch (e) {
            console.log(e);
        }
        const groups = [];
        groups.push({
            label : "Select All",
            value : ""
        });
        const data = await response?.json();

        data && setCGroups([...groups, ...data]);
    }
    const onSelectionHost = async (data: string) => {
        setHostSelected(data !== "");
        setHost(data);
        let response;
        try {
            response = await fetch(
                "./modules/AnomalyDetection/api/service/",
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
            );
            const serviceList = await response?.json();
            serviceList && setServices(serviceList);
        } catch (e) {
            console.log(e);
        }
        setMetrics([]);
    }
    const onSelectService = async (data: string) => {
        setServiceSelected(data !== "");
        setService(data); // This takes some time cannot use immediately
        let response;
        const payload = {
            "host": host,
            "service": data
        }
        try {
            response = await fetch(
                "./modules/AnomalyDetection/api/metrics/",
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)

                }
            );
            const metric_list = await response?.json();
            metric_list && setMetrics(metric_list);
        } catch (e) {

        }
    }
    const isValid = () => {
        const newErrors = {
            host: host === "" ? "Host is required" : "",
            service: service === "" ? "Service is required" : "",
            metric: metric === "" ? "Metric is required" : "",
            contact: contact.length === 0 ? "Contact is required" : "",
            name: mName === "" ? "Name is required" : "",
            contactGroup: cGroup.length === 0 ? "Contact group is required" : "",
        };
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === "")
    }
    const onSelectMetric = (data: string) => {
        setMetric(data);
    }
    const bulkContactAdd = ()=>{
        if(confirm("Are you sure you want to add all contact?")) {
            setContact(contacts.filter((k) => k.label != "Select All"));
        }
    }
    const bulkContactGroupAdd = ()=>{
        if(confirm("Are you sure you want to add all contact groups?")) {
            setCGroup(cGroups.filter((k) => k.label != "Select All"));
        }
    }
    const onSubmitForm = async () => {
        // Validation
        if (!isValid()) {
            return;
        }

        let response;
        const payload = {
            "name": mName,
            "comment": comment,
            "host": host,
            "service": service,
            "metric": metric,
            "contact": contact,
            "cgroup" :  cGroup,
            "unit" : unit,
            "status": status,
            "notification": notifications
        }
        try {
            response = await fetch(
                "./modules/AnomalyDetection/api/",
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)

                }
            );
            const json_rsp = await response?.json();
            console.log(json_rsp);
        } catch (e) {
        }

        const currentUrlParams = new URLSearchParams(window.location.search);
        currentUrlParams.set('s', '0');
        const newUrl = `${window.location.origin}${window.location.pathname}?${currentUrlParams.toString()}`;
        window.location.href = newUrl;
    }

    return (
        <ThemeProvider theme={theme}>
            <Paper elevation={0} style={{marginTop: '1rem', padding: "10px 15px"}}>
                <Typography variant="h5" style={{marginBottom: 20}}>Add a Metric to Anomaly Detect </Typography>
                <form onSubmit={
                    (e) => {
                        e.preventDefault();
                        onSubmitForm();
                    }}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Typography variant="subtitle1">Metric Name </Typography>
                        </Grid>
                        <Grid item xs={8} style={{marginBottom: 10}}>
                            <TextField
                                placeholder={"example: xxxx"}
                                variant="outlined"
                                size="small"
                                sx={{height: '36px'}}
                                onChange={(e) => {
                                    setMName(e.target.value);
                                }}
                                error={Boolean(errors.name)}
                                helperText={errors.name}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="subtitle1">Unit </Typography>
                        </Grid>
                        <Grid item xs={8} style={{marginBottom: 10}}>
                            <TextField
                                placeholder={"Unit"}
                                variant="outlined"
                                size="small"
                                sx={{height: '36px'}}
                                onChange={(e) => {
                                    setUnit(e.target.value);
                                }}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <Typography variant="subtitle1">Linked Host Services <sup
                                style={{color: "red"}}>*</sup></Typography>
                            <Typography variant="caption" color={"dimgrey"}>Choose a Service if you want a specific
                                metric for alert.</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Autocomplete
                                        renderInput={(params) => <TextField {...params} label={"Host"}
                                                                            error={Boolean(errors.host)}
                                                                            helperText={errors.host}/>}
                                        options={hosts}
                                        onChange={(event, value, reason, details) => onSelectionHost(value ?? "")}
                                    ></Autocomplete>
                                </Grid>
                                <Grid item xs={4}>
                                    <Autocomplete disabled={!hostSelected}
                                                  renderInput={(params) => <TextField {...params} label={"Services"}
                                                                                      error={Boolean(errors.service)}
                                                                                      helperText={errors.service}/>}
                                                  options={services}
                                                  onChange={(event, value, reason, details) => onSelectService(value ?? "")}
                                    ></Autocomplete>
                                </Grid>
                                <Grid item xs={4}>
                                    <Autocomplete disabled={!serviceSelected}
                                                  renderInput={(params) => <TextField {...params} label={"Metric"}
                                                                                      error={Boolean(errors.metric)}
                                                                                      helperText={errors.metric}/>}
                                                  options={metrics}
                                                  onChange={(event, value, reason, details) => onSelectMetric(value ?? "")}
                                    ></Autocomplete>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Typography variant="subtitle1">Notifications</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <FormControlLabel control={<Switch defaultChecked onChange={(e) => {
                                        setNotifications( e.target.checked  ? 1 : 0);
                                    }}/>} label="Enable"/>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Typography variant="subtitle1">Status</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <FormControlLabel control={<Switch defaultChecked onChange={(e) => {
                                        setStatus( e.target.checked ? 1 : 0);

                                    }}/>} label="Active"/>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Typography variant="subtitle1">Linked Contact<sup
                                        style={{color: "red"}}>*</sup></Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Autocomplete
                                        renderInput={(params) => <TextField {...params} label={"contact"}
                                                                            error={Boolean(errors.contact)}
                                                                            helperText={errors.contact}/>}
                                        limitTags={2}
                                        value={contact}
                                        options={contacts}
                                        multiple={true}
                                        onChange={(event, value, reason, details) => {
                                            setContact(value)
                                        }}
                                        renderOption={
                                            (props, option, d) => {
                                                if(option.label == "Select All"){
                                                    return <li style={{padding: "7px 10px", textAlign: "right", backgroundColor: "rgba(33,150,243,0.2)"}}><Button variant={"contained"} onClick={bulkContactAdd}>Select All</Button> </li>
                                                }else{
                                               return  <li {...props} style={{padding: "5px 10px"}}>{option.label}</li>
                                                }
                                            }
                                        }
                                    ></Autocomplete>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Typography variant="subtitle1">Linked Contact Group <sup
                                        style={{color: "red"}}>*</sup></Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Autocomplete
                                        renderInput={(params) => <TextField {...params} label={"Contact Groups"}
                                                                            error={Boolean(errors.contactGroup)}
                                                                            helperText={errors.contactGroup}/>}
                                        limitTags={2}
                                        options={cGroups}
                                        value={cGroup}
                                        multiple={true}
                                        onChange={(event, value, reason, details) => {
                                            setCGroup(value)
                                        }}
                                        renderOption={
                                            (props, option, d) => {
                                                if(option.label == "Select All"){
                                                    return <li style={{padding: "7px 10px", textAlign: "right", backgroundColor: "rgba(33,150,243,0.2)"}}><Button variant={"contained"} onClick={bulkContactGroupAdd}>Select All</Button> </li>
                                                }else{
                                                    return  <li {...props} style={{padding: "5px 10px"}}>{option.label}</li>
                                                }
                                            }
                                        }
                                    ></Autocomplete>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="subtitle1">Comment</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                fullWidth={true}
                                placeholder="Description... "
                                variant="outlined"
                                size="small"
                                sx={{height: '36px'}}
                                multiline={true}
                                rows={3}
                                onChange={(e) => {
                                    setComment(e.target.value);
                                }}
                                style={{marginBottom: 20}}
                            />
                        </Grid>
                        <Grid item sx={{height: 100}}>
                            <Box sx={{display: "flex", alignItems: "flex-end", height: "100%"}}>
                                <Button type="submit" variant="contained" color="primary">
                                    Submit
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
                {/*<AlertBx />*/}
            </Paper>
        </ThemeProvider>
    );
}

export default NewAnomalyMetric;
