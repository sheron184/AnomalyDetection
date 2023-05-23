import React, {memo, useCallback, useEffect, useRef, useState} from 'react';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import {Simulate} from "react-dom/test-utils";
import {Button, Grid, Skeleton, Typography} from "@mui/material";
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import CsvDownloader from 'react-csv-downloader';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import {Box} from "@mui/system";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import CelebrationIcon from '@mui/icons-material/Celebration';


import loadedData = Simulate.loadedData;

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

// @ts-ignore
export const options = {
    responsive: true,
    plugins: {
        title: {
            display: false,
            text: 'Anomaly Chart',
        },
        legend: {
            display: false
        }
    },
    scales: {
        xAxis: {
            display: false
        }
    }
};

interface ChartData {
    host: any;
    service: any;
    metric: any;
    from: any,
    to: any,
    period: any,
    filter: any,
}

function AnomalyChart(props: ChartData) {
    const [vals, setVals] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [rawData, setRawData] = useState([]);
    const [highlight, setHighlight] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    let ref = useRef(null);

    const asyncFnComputeDate = () => {
        // do whatever you need async
        return Promise.resolve(rawData.map((d: any) => {
            return {
                "timestamp": d[0],
                "value": d[1]
            }
        }));
    };

    const loadAnomaly = async () => {
        setIsLoading(true);
        let response;
        // @ts-ignore
        response = await fetch(
            //sipmon.metric.PDC-SRV-GRPDC1.Memory.Used_Memory
            `./modules/AnomalyDetection/api/anomaly?metric=sipmon.metric.${props.host.label}.${props.service.label}.${props.metric.label}`,
            // `./modules/AnomalyDetection/api/anomaly?metric=sipmon.metric.PDC-SRV-GRPDC1.Memory.Used_Memory`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        );
        // Filtering
        const json_rsp = await response?.json();
        let anomaly_series = json_rsp.results;
        if (props.from !== null) {
            let c = 1;
            anomaly_series = anomaly_series.filter((k: any) => {
                return k[0] > parseInt(props.from); // getTime()/1000 => Epoch time
            });
        }
        if (props.to !== null) {
            anomaly_series = anomaly_series.filter((k: any) => {
                return k[0] < parseInt(props.to); // getTime()/1000 => Epoch time
            });
        }

        setRawData(json_rsp.results);
        const tempHolder = anomaly_series.map((k: any) => k[1]);
        setVals(tempHolder);
        setLabels(anomaly_series.map((k: any) => k[0].toString()));

        let anoma_set: any = [1682620388, 1682621292, 1682622194, 1682623117, 1682624018, 1682624921, 1682625826, 1682626727, 1682627628, 1682628534, 1682629435, 1682662857,
            1682663757, 1682664659, 1682665559, 1682666462, 1682667363, 1682668263, 1682669163]; // This is received by an API call

        setHighlight(anomaly_series.map((k: any) => {
            return anoma_set.indexOf(k[0]) !== -1 ? Math.max(...tempHolder) : null;
        }));

    }
    useEffect(() => {
        loadAnomaly().then(r => true).finally(() => {
            setIsLoading(false);
        })
        // Refreshing scene...
        // const intervalId = setInterval(loadAnomaly, 10000);
        // return () => clearInterval(intervalId);

    }, [props.filter, props.metric, props.service, props.host]);

    const chartDownload = useCallback(() => {
        const link = document.createElement('a');
        link.download = "Anomaly-chart.png";
        // @ts-ignore
        link.href = ref.current.toBase64Image();
        link.click();
    }, []);

    return isLoading ? (
        <Box sx={{
            padding: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }} height={300}>
            <Typography variant={"h5"} sx={{color: "#2b2b2b", marginTop: 0, marginRight: "10px"}}> Loading </Typography>
            <Skeleton animation="wave" variant="circular" width={10} height={10} sx={{marginRight: "5px"}}/>
            <Skeleton animation="wave" variant="circular" width={10} height={10} sx={{marginRight: "5px"}}/>
            <Skeleton animation="wave" variant="circular" width={10} height={10} sx={{marginRight: "5px"}}/>

        </Box>
    ) : (
        vals.length > 0 ?
            <>
                <Grid container sx={{
                    justifyContent: "flex-end",
                }}>
                    <AssessmentRoundedIcon sx={{color: "#5e5e5e"}} onClick={chartDownload}/>
                    <CsvDownloader datas={asyncFnComputeDate} filename={"data.csv"}>
                        <DescriptionRoundedIcon sx={{color: "#5e5e5e"}}/>
                    </CsvDownloader>
                </Grid>

                <Line ref={ref} options={options} data={{
                    labels,
                    datasets: [
                        {
                            fill: true,
                            label: "Anomaly",
                            data: highlight,
                            backgroundColor: 'rgba(235, 162, 53, 0.5)',
                            pointRadius: 0
                        },
                        {
                            fill: true,
                            label: 'Anomaly',
                            data: vals,
                            borderColor: 'rgb(53, 162, 235)',
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        },
                    ],
                }}/>
            </>
            :
            <Box sx={{
                padding: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }} height={300}>

                <CelebrationIcon sx={{
                    width: 64,
                    color: "#2b2b2b",
                    fontSize: 60,

                }}/>
                <Box></Box>
                <Typography variant={"h5"} sx={{color: "#2b2b2b", marginTop: 0, marginLeft: "10px"}}> Awesome!, No
                    Anomaly Found. </Typography>

            </Box>
    );
}


export default memo(AnomalyChart);