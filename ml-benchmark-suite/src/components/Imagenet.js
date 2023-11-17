import { useEffect, useState } from "react";
import axios from "axios";

import "./imagenet.css";
import Sort from "../sort.png";


import { useNavigate } from "react-router-dom";




const Imagenet = () => {

    const [data, setData] = useState([])
    const [selectedProcessor, setSelectedProcessor] = useState("");
    const [selectedSystem, setSelectedSystem] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const [selectedFramework, setSelectedFramework] = useState("");
    const [selectedAccelerator, setSelectedAccelerator] = useState("");
    const [sortOn, setSortOn] = useState("");
    const [order, setOrder] = useState(1);
    const [systems, setSystems] = useState([]);
    const [processors, setProcessors] = useState([]);
    const [models, setModels] = useState([]);
    const [frameworks, setFrameworks] = useState([]);
    const [accelerators, setAccelerators] = useState([]);
    const navigate = useNavigate();

    const handleSortToggle = (column) => {
      if (column === sortOn) {
        setOrder(-order);
      } else {
        setSortOn(column);
      }
    };

    const handleTableEntryClick =  (id) => {
      navigate(`/imagenet/${id}`);
    }

    const getUniqueValues = async (columns) => {
      for (const columnName of columns) {
        const res = await axios.get(
          `https://transcription.kurg.org:27017/bench/get_unique_values?column=${columnName}`
        );
        const { data } = res;  
        if (columnName === "model") {
          setModels(data);
        } else if (columnName === "framework") {
          setFrameworks(data);
        }
        else if (columnName === "accelerator") {
          setAccelerators(data);
        }
        else if (columnName === "system") {
          setSystems(data);
        }
        else if (columnName === "processor") {
          setProcessors(data);
        }
      }
    };
  
    const getData = async () => { 
        const res =  await axios.get("https://transcription.kurg.org:27017/bench/get_data");
        console.log(res);
        const {data} = res;
        setData(data)
    }


    useEffect(() => {
        getData()
        getUniqueValues(["model", "framework", "accelerator", "processor", "system"]);
    }, []);

    useEffect(() => {
      const getResults = async () => {  
        const body = {
          selectedSystem,
          selectedProcessor,
          selectedModel,
          selectedFramework, 
          selectedAccelerator,
          sortOn, 
          order};
        console.log(body);
        const res = await axios.post("https://transcription.kurg.org:27017/bench/get_by_model", body);
     
        setData(res.data)
  
      };
      getResults();
    }, [selectedSystem, selectedProcessor, selectedModel, selectedFramework, selectedAccelerator, sortOn, order]);

    return (
      <div>
        <div className="p-4">
            <h1>ImageNet Benchmark</h1>
            <div className="d-flex justify-content-between">
              <div>
                <label for="models"></label>
                  <select
                    value={selectedModel}
                    id="models"
                    name="models"
                    onChange={(event) => setSelectedModel(event.target.value)}
                  >
                    <option value="">Select a model</option>
                    {models.map((value) => (
                      <option key={value} value={value}>
                        {value}
                    </option>
                  ))}
                  </select>

                <label for="frameworks"></label>
                  <select
                    value={selectedFramework}
                    id="frameworks"
                    name="frameworks"
                    onChange={(event) => setSelectedFramework(event.target.value)}
                  >
                    <option value="">Select a Framework</option>
                    {frameworks.map((value) => (
                      <option key={value} value={value}>
                        {value}
                    </option>
                  ))}
                  </select>
                
                <label for="accelerators"></label>
                  <select
                    value={selectedAccelerator}
                    id="accelerators"
                    name="accelerators"
                    onChange={(event) => {
                      setSelectedAccelerator(event.target.value);
                    }}
                  >
                    <option value="">Select a Accelerator</option>
                    {accelerators.map((value) => (
                      <option key={value} value={value}>
                        {value}
                    </option>
                  ))}
                  </select>
                
                <label for="systems"></label>
                  <select
                    value={selectedSystem}
                    id="systems"
                    name="systems"
                    onChange={(event) => {
                      setSelectedSystem(event.target.value)
                    }}
                  >
                    <option value="">Select a System</option>
                    {systems.map((value) => (
                      <option key={value} value={value}>
                        {value}
                    </option>
                  ))}
                  </select>
                
                <label for="processors"></label>
                  <select
                    value={selectedProcessor}
                    id="processors"
                    name="processors"
                    onChange={(event) => {
                      setSelectedProcessor(event.target.value);
                    }}
                  >
                    <option value="">Select a Processor</option>
                    {processors.map((value) => (
                      <option key={value} value={value}>
                        {value}
                    </option>
                  ))}
                  </select>
              </div>
              <div className="d-flex">
                <div>
                <label for="order"></label>
                  <select 
                    id="order" 
                    name="order" 
                    value={order}
                    onChange={(event) => setOrder(event.target.value)}
                  >
                    <option value={1}>Ascending</option>
                    <option value={-1}>Descending</option>
                  </select>
                </div>
              </div>
            </div>
            
      <table >
        <thead>
          <tr>
            <th class="align-center">System</th>
            <th class="align-center">Processor</th>
            <th class="align-center">Accelerator</th>
            <th class="align-center">Model</th>
            <th class="align-center">Framework</th>
            <th class="align-center">Version</th>
            <th class="align-center">Precision</th>
            <th className="sortable-header"  onClick={ () => {handleSortToggle("latency")}}>
              Latency
              <img className="sort-icon" src={Sort} alt="Sort Icon" />
            </th>
            <th className="sortable-header"  onClick={ () => {handleSortToggle("accuracy") }}>
              Accuracy
              <img className="sort-icon" src={Sort} alt="Sort Icon" />
            </th>
            <th className="sortable-header"  onClick={ () => {handleSortToggle("cpu_usage") }}>
              Cpu Usage
              <img className="sort-icon" src={Sort} alt="Sort Icon" />
            </th>
            <th className="sortable-header"  onClick={ () => {handleSortToggle("memory") }}>
                Memory
                <img className="sort-icon" src={Sort} alt="Sort Icon" />
            </th>
            <th className="sortable-header"  onClick={ () => {handleSortToggle("power") }}> 
              Power
              <img className="sort-icon" src={Sort} alt="Sort Icon" />
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={index} onClick={() => 
              handleTableEntryClick(item._id)}>
              <td>{item.system}</td>
              <td>{item.processor}</td>
              <td>{item.accelerator}</td>
              <td>{item.model}</td>
              <td>{item.framework}</td>
              <td>{item.version}</td>
              <td>{item.precision}</td>
              <td className="align-right">{item.latency}</td>
              <td className="align-right">{item.accuracy}</td>
              <td className="align-right">{item.cpu_usage}</td>
              <td className="align-right">{item.memory}</td>
              <td className="align-right">{item.power}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
    )
}
export default Imagenet;
