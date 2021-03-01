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

class EventChart extends Component {
  state = {
    dailyData: null,
  };

  componentDidMount() {
    fetch("/events/daily")
      .then((response) => response.json())
      .then((data) => this.formatDailyDates(data))
      .then((data) => this.setState({ dailyData: data }));
  }

  formatDailyDates(rawData) {
    for (let i in rawData) {
      rawData[i].date = moment(rawData[i].date).format("dd, DD MMM Y");
    }
    return rawData;
  }

  render() {
    return (
      <div style={{ width: "100%" }}>
        <ResponsiveContainer width="80%" height={500}>
          <LineChart
            width={500}
            height={300}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            data={this.state.dailyData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              name="Events"
              type="monotone"
              dataKey="events"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default EventChart;
