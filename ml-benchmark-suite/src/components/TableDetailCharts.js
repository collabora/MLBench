import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./imagenet.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

import { Line } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TableDetail = () => {
    const { id } = useParams();
    const [openModal, setOpenModal] = useState(false); // Store fetched detailed data
    const [memoryChartData, setMemoryChartData] = useState([]);
    const [powerChartData, setPowerChartData] = useState([]);
    const [temperatureChartData, setTemperatureChartData] = useState([]);
    const [cpuUsageChartData, setCpuUsageChartData] = useState([]);
    const [cpuFreqChartData, setCpuFreqChartData] = useState([]);
    const [tpuFreqChartData, setTpuFreqChartData] = useState([]);
    const [gpuFreqChartData, setGpuFreqChartData] = useState([]);
    const [gpuUsageChartData, setGpuUsageChartData] = useState([]);
    const [benchmarkData, setBenchmarkData] = useState([]);
    const predefinedColors = [
        { r: 31, g: 119, b: 180 },  // Blue
        { r: 255, g: 127, b: 14 },  // Orange
        { r: 44, g: 160, b: 44 },   // Green
        { r: 148, g: 103, b: 189 }, // Purple
        { r: 140, g: 86, b: 75 },   // Brown
        { r: 227, g: 119, b: 194 }, // Pink
        { r: 127, g: 127, b: 127 }, // Gray
        { r: 188, g: 189, b: 34 }   // Olive
      ];
  
    const chartOptionsTemperature = {
    responsive: true,
    plugins: {
        legend: {
        position: 'top',
        },
        title: {
        display: true,
        text: 'Temperature over the benchmark run',
        },
    },
    };

    const chartOptionsPower = {
    responsive: true,
    plugins: {
        legend: {
        position: 'top',
        },
        title: {
        display: true,
        text: 'Power Usage',
        },
    },
    };

    const chartOptionsMemory = {
    responsive: true,
    plugins: {
        legend: {
        position: 'top',
        },
        title: {
        display: true,
        text: 'Memory',
        },
    },
    };

    const chartOptionsCPU = {
    responsive: true,
    plugins: {
        legend: {
        position: 'top',
        },
        title: {
        display: true,
        text: 'CPU utilisation',
        },
    },
    };

    const chartOptionsCPUFreq = {
    responsive: true,
    plugins: {
        legend: {
        position: 'top',
        },
        title: {
        display: true,
        text: 'CPU Freq per core',
        },
    },
    };

    const chartOptionsTPUFreq = {
    responsive: true,
    plugins: {
        legend: {
        position: 'top',
        },
        title: {
        display: true,
        text: 'TPU Freq',
        },
    },
    };

    const chartOptionsGPUFreq = {
    responsive: true,
    plugins: {
        legend: {
        position: 'top',
        },
        title: {
        display: true,
        text: 'GPU Freq',
        },
    },
    };

    const chartOptionsGPU = {
    responsive: true,
    plugins: {
        legend: {
        position: 'top',
        },
        title: {
        display: true,
        text: 'GPU Utilisation',
        },
    },
    };

    const temperature = {
    labels: temperatureChartData.labels,
    datasets: [
        {
        label: 'Temperature (in Celsius)',
        data: temperatureChartData.data,
        borderColor: `rgb(${predefinedColors[0].r}, ${predefinedColors[0].g}, ${predefinedColors[0].b})`,
        backgroundColor: `rgba(${predefinedColors[0].r}, ${predefinedColors[0].g}, ${predefinedColors[0].b}, 0.5)`,
        tension: 0.5
        },
    ],
    };

    const memory = {
    labels: memoryChartData.labels,
    datasets: [
        {
        label: 'Memory (in MB)',
        data: memoryChartData.data,
        borderColor: `rgb(${predefinedColors[1].r}, ${predefinedColors[1].g}, ${predefinedColors[1].b})`,
        backgroundColor: `rgba(${predefinedColors[1].r}, ${predefinedColors[1].g}, ${predefinedColors[1].b}, 0.5)`,
        tension: 0.4,
        },
    ],
    };

    const power = {
    labels: powerChartData.labels,
    datasets: [
        {
        label: 'Power in W',
        data: powerChartData.data,
        borderColor: `rgb(${predefinedColors[2].r}, ${predefinedColors[2].g}, ${predefinedColors[2].b})`,
        backgroundColor: `rgba(${predefinedColors[2].r}, ${predefinedColors[2].g}, ${predefinedColors[2].b}, 0.5)`,
        tension: 0.4
        },
    ],
    };
    
    const cpu = {
    labels: cpuUsageChartData.labels,
    datasets: cpuUsageChartData.datasets,
    };

    const cpuFreq = {
    labels: cpuFreqChartData.labels,
    datasets: cpuFreqChartData.datasets,
    };

    const tpuFreq = {
    labels: tpuFreqChartData ? tpuFreqChartData.labels : [],
    datasets: [
        {
        label: 'Tpu Freq (MHz)',
        data: tpuFreqChartData ? tpuFreqChartData.data : [],
        borderColor: `rgb(${predefinedColors[3].r}, ${predefinedColors[3].g}, ${predefinedColors[3].b})`,
        backgroundColor: `rgba(${predefinedColors[3].r}, ${predefinedColors[3].g}, ${predefinedColors[3].b}, 0.5)`,
        },
    ],
    };

    const gpuFreq = {
    labels: gpuFreqChartData ? gpuFreqChartData.labels : [],
    datasets: [
        {
        label: 'Gpu Freq (MHz)',
        data: gpuFreqChartData ? gpuFreqChartData.data : [],
        borderColor: `rgb(${predefinedColors[5].r}, ${predefinedColors[5].g}, ${predefinedColors[5].b})`,
        backgroundColor: `rgba(${predefinedColors[5].r}, ${predefinedColors[5].g}, ${predefinedColors[5].b}, 0.5)`,
        },
    ],
    };

    const gpuUtil = {
    labels: gpuUsageChartData ? gpuUsageChartData.labels : [],
    datasets: [
        {
        label: 'GPU Utilisation (%)',
        data: gpuUsageChartData ? gpuUsageChartData.data : [],
        borderColor: `rgb(${predefinedColors[4].r}, ${predefinedColors[4].g}, ${predefinedColors[4].b})`,
        backgroundColor: `rgba(${predefinedColors[4].r}, ${predefinedColors[4].g}, ${predefinedColors[4].b}, 0.5)`,
        },
    ],
    };

    const handleTableEntryClick = async (id) => {
      // Fetch data
      const response = await axios.get(`https://transcription.kurg.org:27017/bench/get_data_by_id?id=${id}`);
      const { data } = response;
      const bench_data = data[0]
      console.log(bench_data)
      setBenchmarkData(bench_data)
      console.log(benchmarkData)
      

      // Fetch data based on the ID
      try {
        const response = await axios.get(`https://transcription.kurg.org:27017/bench/get_metrics?id=${id}`);
        const { data } = response;
        const maxValues = 100;

        const memoryData = data[0]["memory"];
        
        if (memoryData.length > maxValues) {
          const step = Math.floor(memoryData.length / maxValues);
          const filteredMemoryData = memoryData.filter((_, index) => index % step === 0);
          const labels = filteredMemoryData.map((_, index) => index * step);
        
          setMemoryChartData({
            labels: labels,
            data: filteredMemoryData,
          });
        } else {
          setMemoryChartData({
            labels: memoryData.map((_, index) => index),
            data: memoryData,
          });
        }

        const powerData = data[0]["power"];

        if (powerData.length > maxValues) {
          const step = Math.floor(powerData.length / maxValues);
          const filteredPowerData = powerData.filter((_, index) => index % step === 0);
          const labels = filteredPowerData.map((_, index) => index * step);

          setPowerChartData({
            labels: labels,
            data: filteredPowerData,
          });
        } else {
          setPowerChartData({
            labels: powerData.map((_, index) => index),
            data: powerData,
          });
        }
                
        const temperatureData = data[0]["temperature"];

        if (temperatureData.length > maxValues) {
          const step = Math.floor(temperatureData.length / maxValues);
          const filteredTempData = temperatureData.filter((_, index) => index % step === 0);
          const labels = filteredTempData.map((_, index) => index * step);

          setTemperatureChartData({
            labels: labels,
            data: filteredTempData,
          });
        } else {
          setTemperatureChartData({
            labels: temperatureData.map((_, index) => index),
            data: temperatureData,
          });
        }

        // Set Cpu usage data
        let interval;
        const cpuUsageData = {
          labels: [],
          datasets: []
        }
        for (let i = 0; i < data[0]["cpu_usage"][0].length+1; i++){
          let d = {}
          
          d.label = `Core ${i+1}`
          if (i===data[0]["cpu_usage"][0].length)
            d.label = "All Cores"
          
          d.data = [];
          const colorIndex = i % predefinedColors.length;
          const color = predefinedColors[colorIndex];
          d.borderColor = `rgb(${color.r}, ${color.g}, ${color.b})` // You can use your desired color logic here
          d.backgroundCoconstlor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)` // You can use your desired color logic here
          cpuUsageData.datasets.push(d)
        }

        interval = Math.ceil(data[0]["cpu_usage"].length / maxValues);
        for (let i = 0; i < data[0]["cpu_usage"].length; i+=interval) {
          const dataIndex = i < data[0]["cpu_usage"].length ? i : data[0]["cpu_usage"].length - 1;
          cpuUsageData.labels.push(dataIndex);
          let sum_cpu_usage = 0
          for (let j = 0; j < data[0]["cpu_usage"][dataIndex].length+1; j++) {
            if (j < data[0]["cpu_usage"][dataIndex].length){
              sum_cpu_usage += data[0]["cpu_usage"][dataIndex][j]
              cpuUsageData.datasets[j].data.push( data[0]["cpu_usage"][dataIndex][j] );
            }
            else{
              cpuUsageData.datasets[j].data.push( sum_cpu_usage / data[0]["cpu_usage"][dataIndex].length );
            }
          }
        }

        setCpuUsageChartData(cpuUsageData);

        // cpu freq
        const cpuFreqData = {
          labels: [],
          datasets: []
        }
        if (data[0]["cpu_freq"].length !== 0){
          for (let i = 0; i < data[0]["cpu_freq"][0].length+1; i++){
            let d = {}
            d.label = `Core ${i+1}`
            if (i===data[0]["cpu_usage"][0].length)
              d.label = "All Cores"
            d.data = [];
            const colorIndex = i % predefinedColors.length;
            const color = predefinedColors[colorIndex];
            d.borderColor = `rgb(${color.r}, ${color.g}, ${color.b})` // You can use your desired color logic here
            d.backgroundColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)` // You can use your desired color logic here
            cpuFreqData.datasets.push(d)
          }
          

          interval = Math.ceil(data[0]["cpu_freq"].length / maxValues);
          for (let i = 0; i < data[0]["cpu_freq"].length;  i += interval) {
            const dataIndex = i < data[0]["cpu_freq"].length ? i : data[0]["cpu_freq"].length - 1;
            cpuFreqData.labels.push(dataIndex);
            let sum_cpu_freq = 0
            for (let j = 0; j < data[0]["cpu_freq"][dataIndex].length+1; j++) {
              if (j < data[0]["cpu_freq"][dataIndex].length){
                sum_cpu_freq += data[0]["cpu_freq"][dataIndex][j];
                cpuFreqData.datasets[j].data.push( data[0]["cpu_freq"][dataIndex][j]);
              }
              else {
                cpuFreqData.datasets[j].data.push( sum_cpu_freq / data[0]["cpu_freq"][dataIndex].length );
              }
            }
          }
          setCpuFreqChartData(cpuFreqData);
        }

        // TPU freq
        if (data[0]["tpu_freq"] === '')
        {
          setTpuFreqChartData(null);
        }
        else {
          const tpuData = data[0]["tpu_freq"];

          if (tpuData.length > maxValues) {
            const step = Math.floor(tpuData.length / maxValues);
            const filteredTpuData = tpuData.filter((_, index) => index % step === 0);
            const labels = filteredTpuData.map((_, index) => index * step);

            setTpuFreqChartData({
              labels: labels,
              data: filteredTpuData,
            });
          } else {
            setTpuFreqChartData({
              labels: tpuData.map((_, index) => index),
              data: tpuData,
            });
          }
        }

        // GPU Freq
        if (data[0]["gpu_freq"] === '')
        {
          setGpuFreqChartData(null);
        }
        else {
          const gpuFreqData = data[0]["gpu_freq"];

          if (gpuFreqData.length > maxValues) {
            const step = Math.floor(gpuFreqData.length / maxValues);
            const filteredGpuFreqData = gpuFreqData.filter((_, index) => index % step === 0);
            const labels = filteredGpuFreqData.map((_, index) => index * step);

            setGpuFreqChartData({
              labels: labels,
              data: filteredGpuFreqData,
            });
          } else {
            setGpuFreqChartData({
              labels: gpuFreqData.map((_, index) => index),
              data: gpuFreqData,
            });
          }
        }

        // GPU Utilisation
        if (data[0]["gpu_util"] === '')
        {
          setGpuUsageChartData(null);
        }
        else {
          const gpuUtilData = data[0]["gpu_util"];

          if (gpuUtilData.length > maxValues) {
            const step = Math.floor(gpuUtilData.length / maxValues);
            const filteredGpuUtilData = gpuUtilData.filter((_, index) => index % step === 0);
            const labels = filteredGpuUtilData.map((_, index) => index * step);

            setGpuUsageChartData({
              labels: labels,
              data: filteredGpuUtilData,
            });
          } else {
            setGpuUsageChartData({
              labels: gpuUtilData.map((_, index) => index),
              data: gpuUtilData,
            });
          }
        }
        
        setOpenModal(true); // Store fetched information
      } catch (error) {
        console.error("Error fetching detailed data:", error);
      }
    };

    useEffect(() => {
      handleTableEntryClick(id);
  }, []);
    
    return (
        <div>
            {
            openModal &&
            <div>
              <div class="table-row">
                <div class="chart-info-item">
                    <strong>System:</strong> {benchmarkData.system}
                </div>
                <div class="chart-info-item">
                    <strong>Accelerator:</strong> {benchmarkData.accelerator}
                </div>
                <div class="chart-info-item">
                    <strong>Model:</strong> {benchmarkData.model}
                </div>
                <div class="chart-info-item">
                    <strong>Framework:</strong> {benchmarkData.framework}
                </div>
                <div class="chart-info-item">
                    <strong>Precision:</strong> {benchmarkData.precision}
                </div>
                <div class="chart-info-item">
                    <strong>Latency:</strong> {benchmarkData.latency}
                </div>
                <div class="chart-info-item">
                    <strong>Accuracy:</strong> {benchmarkData.accuracy}
                </div>
                <div class="chart-info-item">
                    <strong>CPU Usage:</strong> {benchmarkData.cpu_usage}
                </div>
                <div class="chart-info-item">
                    <strong>Memory:</strong> {benchmarkData.memory}
                </div>
                <div class="chart-info-item"> 
                    <strong>Power:</strong> {benchmarkData.power}
                </div>
              </div>
              <div className="modal-charts">
                <div className="chart-item">
                {temperature.datasets[0].data.length > 0 && (
                    <Line options={chartOptionsTemperature} data={temperature} />
                )}
                </div>

                <div className="chart-item">
                {memory.datasets[0].data.length > 0 && (
                    <Line options={chartOptionsMemory} data={memory} />
                )}
                </div>

                <div className="chart-item">
                {power.datasets[0].data.length > 0 && (
                    <Line options={chartOptionsPower} data={power} />
                )}
                </div>

                <div className="chart-item">
                {cpu.datasets[0].data.length > 0 && (
                    <Line options={chartOptionsCPU} data={cpu} />
                )}
                </div>

                <div className="chart-item">
                {cpuFreq.datasets[0].data.length > 0 && (
                    <Line options={chartOptionsCPUFreq} data={cpuFreq} />
                )}
                </div>

                <div className="chart-item">
                {tpuFreqChartData !== null && tpuFreq.datasets[0].data.length > 0 && (
                    <Line options={chartOptionsTPUFreq} data={tpuFreq} />
                )}
                </div>

                <div className="chart-item">
                {gpuUsageChartData !== null && gpuUtil.datasets[0].data.length > 0 && (
                    <Line options={chartOptionsGPU} data={gpuUtil} />
                )}
                </div>

                <div className="chart-item">
                {gpuFreqChartData !== null && gpuFreq.datasets[0].data.length > 0 && (
                    <Line options={chartOptionsGPUFreq} data={gpuFreq} />
                )}
                </div>
              </div>
            </div>

            }
        </div>
    )
};

export default TableDetail;