import "./Navbar.css"
import Collabora from "../collabora.png";


const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg header">
            <div className="container-fluid">
                {/* <a className="navbar-brand" href="https://openfir.st/meetmlbench"><b>MLBench</b></a> */}
                <a className="navbar-brand" href="https://openfir.st/meetmlbench" target="_blank" rel="noopener noreferrer">
                    <b>MLBench</b>
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" 
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {
                            
                            window.location.href === 'https://makaveli10.github.io/MLBench/#' ?
                                <>
                                    <li className="nav-item">
                                        <a className="nav-link active" aria-current="page" href="#/"><b>Home</b></a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#/imagenet">Imagenet</a>
                                    </li>
                                </>
                            :
                            (
                                window.location.href === 'https://makaveli10.github.io/MLBench/#/imagenet' ? 
                                    <>
                                        <li className="nav-item">
                                            <a className="nav-link" aria-current="page" href="#/">Home</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link active" href="#/imagenet"><b>Imagenet</b></a>
                                        </li>
                                    </>
                                :
                                    <>
                                        <li className="nav-item">
                                            <a className="nav-link" aria-current="page" href="#/">Home</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#/imagenet">Imagenet</a>
                                        </li>
                                    </>
                            )
                        }
                    </ul>
                </div>
                <div className="navbar-logo">
                <a href={"https://www.collabora.com/"} target="_blank" rel="noopener noreferrer">
                    <img className="logo" src={Collabora} alt="Collabora Logo" />
                </a>
                </div>
            </div>
      </nav>
    )
}

export default Navbar;