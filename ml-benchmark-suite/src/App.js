
// import './App.css';
// import Header from './components/Header';
// import { Link } from "react-router-dom";

// import Overview from './components/Overview';
// import Offcanvas from 'react-bootstrap/Offcanvas';
// import { useEffect, useState } from 'react';
// import {
//   BrowserRouter,
//   Route,
//   Routes,
//   useNavigate,
// } from "react-router-dom";
// import TableDetail from './components/TableDetailCharts';
// import Imagenet from './components/Imagenet';

// function RedirectComponent({pathName}){
//   const navigate = useNavigate();
//   useEffect(() => {
//     navigate(pathName, { replace: true });
//   },[navigate])
//   return ""
// }

// function App() {
//   const [show, setShow] = useState(false);
//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   const handleMLBenchClick = () => {
//     window.open('https://www.github.com/collabora/mlbench', '_blank');
//   };

//   return (
//     <div className="App">
//       <Header handleClose={handleClose} handleShow={handleShow} />
//       <BrowserRouter>
//         <Routes>
//           <Route path="/MLBench" element={<RedirectComponent pathName={"/MLBench/imagenet"}/>} />
//           <Route path="/MLBench/imagenet" element={<Imagenet />}/>
//           <Route path="/MLBench/imagenet/:id" element={<TableDetail />} />
//           <Route path="/MLBench/overview" element={<Overview />} />
//         </Routes>
//       </BrowserRouter>
//       <Offcanvas show={show} onHide={handleClose}>
//         <Offcanvas.Header closeButton>
//           <Offcanvas.Title class="clickable-logo" onClick={handleMLBenchClick}>MLBench</Offcanvas.Title>
//         </Offcanvas.Header>
//         <Offcanvas.Body>
//           <ul>
//             <li>
//               <a
//                 className="menu-options d-flex align-items-center justify-content-start"
//                 href={"/MLBench/overview"}
//               >
//                 Overview
//               </a>
//             </li>
//             <li>
//               <a
//                 className="menu-options d-flex align-items-center justify-content-start"
//                 href={"/MLBench/imagenet"}
//               >
//                 ImageNet
//               </a>
//             </li>
//             {/* <li>Coco</li>
//             <li>LibriSpeech</li> */}
//           </ul>
//         </Offcanvas.Body>
//       </Offcanvas>
//     </div>
//   );
// };

// export default App;


import './App.css';
import './components/Overview.css';


const App = () => {
  return (
    <div className="App">
      <div className="overview-container">
            <header className="overview-header">
                <h1 className="overview-title">Welcome to MLBench</h1>
                <p className="overview-description">
                    MLBench is your gateway to benchmarking machine learning models and hardware configurations.
                    MLBench is a comprehensive benchmark suite designed to help you perform benchmark tests and analyze performance metrics for various machine learning models and hardware configurations.
                    With MLBench, you can conduct rigorous performance evaluations, collect essential data points such as temperature, memory usage, power consumption, CPU and GPU utilization, and more. 
                    The collected data is then meticulously visualized through interactive charts, offering valuable insights into the performance of your machine learning models and systems.
                </p>
            </header>
            <section className="overview-section">
                <h2 className="overview-subtitle">Getting Started</h2>
                <p className="overview-description">
                    Begin your journey with MLBench in just a few steps:
                </p>
                <ul className="overview-list">
                    <li><strong>1.</strong> <a className="overview-link" href="https://github.com/collabora/MLBench" target="_blank" rel="noopener noreferrer">Visit MLBench on GitHub&nbsp;</a> to initiate benchmark tests.</li>
                    <li><strong>2.</strong> Customize benchmark configurations, including your machine learning model and hardware settings.</li>
                    <li><strong>3.</strong> Execute benchmarks to gather comprehensive performance data.</li>
                    <li><strong>4.</strong> Share your results for validation and inclusion in the MLBench benchmark suite.</li>
                </ul>
            </section>
            <section className="overview-section">
                <h2 className="overview-subtitle">Understanding the Results</h2>
                <p className="overview-description">
                    MLBench provides detailed insights into system performance:
                </p>
                <ul className="overview-list">
                    <li><strong>System:</strong> Hardware specifications.</li>
                    <li><strong>Model:</strong> Machine learning model details.</li>
                    <li><strong>Framework:</strong> ML framework used.</li>
                    <li><strong>Precision:</strong> Weight precision of the model.</li>
                    <li><strong>Utilization:</strong> CPU and GPU usage metrics.</li>
                    <li><strong>Memory:</strong> Memory consumption analysis.</li>
                    <li><strong>Power:</strong> Power consumption during benchmarking.</li>
                    <li><strong>Temperature:</strong> System temperature data.</li>
                </ul>
            </section>
            <section className="overview-section">
                <h2 className="overview-subtitle">Exploring Detailed Results</h2>
                <p className="overview-description">
                    Dive into interactive charts for a deeper analysis of performance metrics over time. Click on any benchmark result to access the detailed view. This view includes interactive line charts illustrating the performance metrics over time. Analyze the charts to gain deeper insights into how the system behaves during the benchmark run.
                </p>
            </section>
            <section className="overview-section">
                <h2 className="overview-subtitle">Support and Assistance</h2>
                <p className="overview-description">
        Need assistance or have questions? Our dedicated support team is ready to assist you. Feel free to reach out at{" "}
        <a className="overview-link" href="mailto:marcus.edel@collabora.com">marcus.edel@collabora.com</a>{" "}
        or{" "}
        <a className="overview-link" href="mailto:vineet.suryan@collabora.com">vineet.suryan@collabora.com</a>. We'll be glad to assist you. Happy benchmarking with MLBench!
    </p>
            </section>
        </div>
    </div>
  );
}

export default App;
