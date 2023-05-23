import React, {memo, useCallback} from 'react';
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
import styled from "@emotion/styled";
import {useState, useEffect} from "react";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import ChartSpace from "./chart/AnomalyChart";
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import AnomalyChart from "./chart/AnomalyChart";


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
const DatePickerWrapper = styled.div`
  color: red;

  input {
    padding: 9px;
  }

  label + div {
    padding: 8px 14px 8px 8px;
  }
`

interface Option {
    value: number;
    label: string;
}

const prefixedConverter = (period: string) => {

}

enum Period {
    "1 Hour",
    "2 Hours",
    "6 Hours",
    "12 Hours",
    "1 Day",
    "1 Week",
    "1 Month"

}


function AnomalyReport() {


    const [hosts, setHosts] = useState([]);
    const [services, setServices] = useState([]);
    const [metrics, setMetrics] = useState([]);

    const [hostSelected, setHostSelected] = useState(false);
    const [serviceSelected, setServiceSelected] = useState(false);
    const [host, setHost] = useState("");
    const [service, setService] = useState("");
    const [metric, setMetric] = useState("");

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [tPeriod, setTPeriod] = useState(null);
    const [filter, setFilter] = useState(null);


    const [errors, setErrors] = useState({
        host: "",
        service: "",
        metric: "",
    });


    useEffect(() => {
        loadHosts().then(r => true);
    }, []);

    const periodChanged = useCallback((value: number) => {
        const now = Date.now();
        switch (value) {
            case Period["1 Hour"]:
                const oneHourAgo = now - 3600000;
                // @ts-ignore
                setFromDate(oneHourAgo / 1000); // milliseconds => seconds
                // @ts-ignore
                setToDate(now / 1000);
                break;
            case Period["2 Hours"]:
                const twoHourAgo = now - (2 * 3600000);
                // @ts-ignore
                setFromDate(twoHourAgo / 1000);
                // @ts-ignore
                setToDate(now / 1000);
                break;
            case  Period["6 Hours"]:
                const sixHourAgo = now - (6 * 3600000);
                // @ts-ignore
                setFromDate(sixHourAgo / 1000);
                // @ts-ignore
                setToDate(now / 1000);
                break;
            case  Period["12 Hours"]:
                const twlHourAgo = now - (12 * 3600000);
                // @ts-ignore
                setFromDate(twlHourAgo / 1000);
                // @ts-ignore
                setToDate(now / 1000);
                break;
            case  Period["1 Day"]:
                const oneDayAgo = now - (24 * 3600000);
                // @ts-ignore
                setFromDate(oneDayAgo / 1000);
                // @ts-ignore
                setToDate(now / 1000);
                break;
            case  Period["1 Week"]:
                const oneWeekAgo = now - (7 * 24 * 3600000);
                // @ts-ignore
                setFromDate(oneWeekAgo / 1000);
                // @ts-ignore
                setToDate(now / 1000);
                break;
            case  Period["1 Month"]: // Here a one month refer to 30 days. Need to change it in future or not?
                const oneMonth = now - (30 * 7 * 24 * 3600000);
                // @ts-ignore
                setFromDate(oneMonth / 1000);
                // @ts-ignore
                setToDate(now / 1000);
                break;
            default:
                console.log("Do nothing");
        }
        // @ts-ignore
        setTPeriod(value);
    }, []);

    const loadHosts = async () => {
        let response;
        try {
            response = await fetch(
                "./modules/AnomalyDetection/api/anomaly/host/",
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
    const onSelectionHost = async (data: string) => {
        setHostSelected(data !== "");
        setHost(data);
        let response;
        try {
            response = await fetch(
                "./modules/AnomalyDetection/api/anomaly/service/",
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
                "./modules/AnomalyDetection/api/anomaly/metrics/",
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
        };
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === "")
    }
    const onSelectMetric = (data: string) => {
        setMetric(data);
    }
    const onSubmitForm = async () => {
        // Validation
        if (!isValid()) {
            return;
        }
        // @ts-ignore
        setFilter(Date.now());

    }

    return (
        <ThemeProvider theme={theme}>
            <Paper elevation={0} style={{marginTop: '1rem', padding: "10px 15px"}}>
                <Typography variant="h6" style={{marginBottom: 20}}>Anomaly Monitor</Typography>
                <form onSubmit={
                    (e) => {
                        e.preventDefault();
                        onSubmitForm().then(r => true);
                    }}>
                    <Grid container spacing={5}>
                        <Grid item xs={6}>
                            <Typography variant="caption" style={{marginBottom: 20}}>Metrics</Typography>
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
                        <Grid item xs={6}>
                            <Paper sx={{paddingBottom: "10px"}}>
                                <Grid container spacing={2} sx={{paddingLeft: "15px", paddingRight: "15px"}}>
                                    <Grid item xs={8}>

                                        <Typography variant="caption" style={{marginBottom: 20}}>Date
                                            Range</Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePickerWrapper>
                                                        <DateTimePicker label="From" onChange={
                                                            (value, context) => {
                                                                // @ts-ignore
                                                                setFromDate(value.$d.getTime() / 1000);
                                                            }
                                                        }/>
                                                    </DatePickerWrapper>
                                                </LocalizationProvider>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePickerWrapper>
                                                        <DateTimePicker label="To" onChange={
                                                            (value, context) => {
                                                                // @ts-ignore
                                                                setToDate(value.$d.getTime() / 1000);
                                                            }
                                                        }/>
                                                    </DatePickerWrapper>
                                                </LocalizationProvider>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={2}>

                                        <Typography variant="caption" style={{marginBottom: 20}}>Prefixed</Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Autocomplete
                                                    renderInput={(params) => <TextField {...params}
                                                                                        label={"time"}
                                                    />}
                                                    options={Object.keys(Period).map((key, index) => {
                                                        return {
                                                            label: key,
                                                            value: index
                                                        }
                                                    })
                                                    }
                                                    onChange={(event, value, reason, details) => {
                                                        // @ts-ignore
                                                        periodChanged(value?.value);
                                                    }}

                                                ></Autocomplete>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={1} sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}>
                                        <Button sx={{marginTop: "15px"}} variant={"contained"}
                                                onClick={onSubmitForm}>Filter</Button>
                                    </Grid>

                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            <Paper elevation={0} style={{marginTop: '1rem', padding: "10px 15px"}}>
                {metric ? (

                    <AnomalyChart metric={metric} host={host} service={service} from={fromDate} to={toDate}
                                  period={tPeriod} filter={filter}/>

                ) : (
                    <Box sx={{
                        padding: "15px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }} height={300}>

                        <QueryStatsIcon sx={{
                            width: 64,
                            color: "#2b2b2b",
                            fontSize: 60,

                        }}/>
                        <Box></Box>
                        <Typography variant={"h5"} sx={{color: "#2b2b2b", marginTop: 0, marginLeft: "10px"}}> Please
                            select a Metric</Typography>

                    </Box>
                )}
            </Paper>
        </ThemeProvider>
    );
}

export default AnomalyReport;
