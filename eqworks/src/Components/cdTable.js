import React, { Component } from "react";
import { MDBDataTable } from "mdbreact";
import moment from "moment";

const columns = [
  {
    label: "POI Name",
    field: "name",
    sort: "asc",
    width: 150,
  },
  {
    label: "POI ID",
    field: "poi_id",
    sort: "asc",
    width: 150,
  },
  {
    label: "Date",
    field: "date",
    sort: "asc",
    width: 150,
  },
  {
    label: "Clicks",
    field: "clicks",
    width: 150,
  },
  {
    label: "Impressions",
    field: "impressions",
    width: 150,
  },
  {
    label: "Revenue",
    field: "revenue",
    width: 150,
  },
  {
    label: "Events",
    field: "events",
    width: 150,
  },
];

class CDTable extends Component {
  state = { data: {} };

  componentDidMount() {
    fetch("/combined_data")
      .then((response) => response.json())
      .then((data) => this.formatDates(data))
      .then((data) => this.makeData(data));
  }

  makeData(data) {
    let temp = { columns: columns, rows: data };
    this.setState({ data: temp });
  }

  formatDates(rawData) {
    for (let i in rawData) {
      rawData[i].date = moment(rawData[i].date).format("dd, DD MMM Y");
    }
    return rawData;
  }

  render() {
    return (
      <div
        style={{
          width: "80%",
          margin: 10,
        }}
      >
        <MDBDataTable striped bordered small data={this.state.data} />
      </div>
    );
  }
}

export default CDTable;
