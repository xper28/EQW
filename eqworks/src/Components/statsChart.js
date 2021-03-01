import React, { Component } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";
import { Button } from "reactstrap";

class StatsChart extends Component {
  state = {
    stats: null,
    showClicks: true,
    showImpressions: true,
    showRevenue: true,
    tooltip: [
      <div className="custom-tooltip">
        <p className="label"></p>
      </div>,
    ],
  };

  componentDidMount() {
    fetch("/stats/daily")
      .then((response) => response.json())
      .then((data) => this.formatDailyDates(data))
      .then((data) => this.scaleImpressions(data))
      .then((data) => this.setState({ stats: data }));
  }

  formatDailyDates(rawData) {
    for (let i in rawData) {
      rawData[i].date = moment(rawData[i].date).format("dd, DD MMM Y");
    }
    return rawData;
  }

  scaleImpressions(rawData) {
    for (let i in rawData) {
      rawData[i].impressions = rawData[i].impressions / 1000;
    }
    return rawData;
  }

  clicksToggle = () => {
    let current = this.state.showClicks;
    this.setState({ showClicks: !current });
  };

  impressionsToggle = () => {
    this.setState({ showImpressions: !this.state.showImpressions });
  };

  revenueToggle = () => {
    this.setState({ showRevenue: !this.state.showRevenue });
  };

  createLines() {
    let lines = [];
    if (this.state.showClicks) {
      lines.push(
        <Line
          name="Clicks"
          type="monotone"
          dataKey="clicks"
          stroke="#FF5733"
          activeDot={{ r: 8 }}
        />
      );
      this.state.tooltip.push();
    }

    if (this.state.showImpressions) {
      lines.push(
        <Line
          name="Impressions (in thousands)"
          type="monotone"
          dataKey="impressions"
          stroke="#FFC300"
          activeDot={{ r: 8 }}
        />
      );
    }

    if (this.state.showRevenue) {
      lines.push(
        <Line
          name="Revenue"
          type="monotone"
          dataKey="revenue"
          stroke="#900C3F"
          activeDot={{ r: 8 }}
        />
      );
    }
    return lines;
  }

  render() {
    return (
      <div style={{ width: "100%" }}>
        <ResponsiveContainer
          className="chartContainer"
          width="80%"
          height={500}
        >
          <LineChart
            className="statsChart"
            width={500}
            height={300}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            data={this.state.stats}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {this.createLines()}
          </LineChart>
        </ResponsiveContainer>
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

export default StatsChart;
