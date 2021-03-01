import React, { Component } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "../App.css";
import moment from "moment";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { Button } from "reactstrap";

const createClusterIcon = function (cluster) {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: "marker-cluster-custom",
    iconSize: L.point(40, 40, true),
  });
};

class GeoMap extends Component {
  state = {
    data: {},
    currDay: null,
    showClicks: true,
    showImpressions: false,
    showRevenue: false,
  };

  componentDidMount() {
    fetch("/combined_data/geo")
      .then((response) => response.json())
      .then((data) => this.formatDates(data))
      .then((data) => this.setState({ data: data, currDay: data[0].date }));
  }

  formatDates(rawData) {
    for (let i in rawData) {
      rawData[i].date = moment(rawData[i].date).format("dd, DD MMM Y");
    }
    return rawData;
  }

  createMarkers() {
    let markers = [];
    let data = this.state.data;
    for (let i in data) {
      if (data[i].date === this.state.currDay) {
        if (this.state.showClicks) {
          //Create icon with size based on value
          let icon = L.divIcon({
            className: "marker-clicks-custom",
            iconSize: L.point(40, 40, false),
          });
          markers.push(
            <Marker
              key={data[i].poi_id}
              position={[data[i].lat, data[i].lon]}
              icon={icon}
              onClick={() => {}}
            >
              <Popup>
                POI: {data[i].name}
                <br />
                Clicks: {data[i].clicks}
              </Popup>
            </Marker>
          );
        }

        if (this.state.showImpressions) {
          //Create icon with size based on value
          let icon = L.divIcon({
            className: "marker-impressions-custom",
            iconSize: L.point(40, 40, false),
          });
          markers.push(
            <Marker
              key={data[i].poi_id}
              position={[data[i].lat, data[i].lon]}
              icon={icon}
              onClick={() => {}}
            >
              <Popup>
                POI: {data[i].name}
                <br />
                Impressions: {data[i].impressions}
              </Popup>
            </Marker>
          );
        }
        if (this.state.showRevenue) {
          //Create icon with size based on value
          let icon = L.divIcon({
            className: "marker-revenue-custom",
            iconSize: L.point(40, 40, false),
          });
          markers.push(
            <Marker
              key={data[i].poi_id}
              position={[data[i].lat, data[i].lon]}
              icon={icon}
              onClick={() => {}}
            >
              <Popup>
                POI: {data[i].name}
                <br />
                Revenue: {data[i].revenue}
              </Popup>
            </Marker>
          );
        }
      }
    }
    return markers;
  }

  clicksToggle = () => {
    let current = this.state.showClicks;
    this.setState({
      showClicks: true,
      showImpressions: false,
      showRevenue: false,
    });
  };

  impressionsToggle = () => {
    this.setState({
      showClicks: false,
      showImpressions: true,
      showRevenue: false,
    });
  };

  revenueToggle = () => {
    this.setState({
      showClicks: false,
      showImpressions: false,
      showRevenue: true,
    });
  };

  render() {
    return (
      <div style={{ width: "80%", margin: 10 }}>
        {console.log("hello", typeof this.state.data)}
        <MapContainer
          className="markercluster-map"
          center={[50.6, -105.3]}
          zoom={5}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <MarkerClusterGroup
            spiderfyDistanceMultiplier={1}
            showCoverageOnHover={true}
            iconCreateFunction={createClusterIcon}
          >
            {this.createMarkers()}
          </MarkerClusterGroup>
        </MapContainer>
        <div style={{ display: "flex", flexDirection: "row", margin: 2 }}>
          <Button
            style={{
              color: "#FF5733",
              backgroundColor: "white",
              border: "2px solid #FF5733",
              margin: "1px",
            }}
            onClick={() => {
              this.clicksToggle();
            }}
          >
            Clicks
          </Button>
          <Button
            style={{
              color: "#FFC300",
              backgroundColor: "white",
              border: "2px solid #FFC300",
              margin: "1px",
            }}
            onClick={() => {
              this.impressionsToggle();
            }}
          >
            Impressions
          </Button>
          <Button
            style={{
              color: "#900C3F",
              backgroundColor: "white",
              border: "2px solid #900C3F",
              margin: "1px",
            }}
            onClick={() => {
              this.revenueToggle();
            }}
          >
            Revenue
          </Button>
        </div>
      </div>
    );
  }
}

export default GeoMap;
