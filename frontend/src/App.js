import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import EventChart from "./Components/eventChart";
import StatsChart from "./Components/statsChart";
import CDTable from "./Components/cdTable";
import GeoMap from "./Components/map";

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <p className="title" style={{ color: "#FFFFFF", fontSize: 24 }}>
          EQWorks Frontend Stream Submission: Zack Hassan
        </p>
      </nav>
      <EventChart />
      <StatsChart />
      <CDTable />
      <GeoMap />
    </div>
  );
}

export default App;
