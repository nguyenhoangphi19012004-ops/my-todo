"use client";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function F1LineRaceChart() {
  const options: Highcharts.Options = {
    chart: {
      type: "line",
      animation: true,
    },
    title: {
      text: "F1 2012 Top Ten Drivers",
      align: "left",
    },
    xAxis: {
      title: { text: "Round #" },
      tickInterval: 2,
    },
    yAxis: {
      title: { text: "Points" },
    },
    legend: {
      align: "center",
      layout: "horizontal",
    },
    tooltip: {
      shared: true,
      crosshairs: [true, true],
      valueSuffix: " Points",
    },
    plotOptions: {
      series: {
        marker: {
          enabled: true,
          radius: 3,
        },
        dataLabels: {
          enabled: true,
          formatter: function () {
            // Hiển thị tên + giá trị ở điểm cuối
            if (this.point.index === this.series.data.length - 1) {
              return this.series.name;
            }
            return "";
          },
        },
      },
    },
    series: [
      {
        type: "line",
        name: "Sebastien Vettel",
        color: "#00bfff",
        data: [0, 18, 30, 40, 60, 90, 120, 150, 200, 280],
      },
      {
        type: "line",
        name: "Fernando Alonso",
        color: "#00008b",
        data: [0, 35, 60, 80, 100, 140, 160, 190, 220, 270],
      },
      {
        type: "line",
        name: "Kimi Raikkonen",
        color: "#32cd32",
        data: [0, 16, 40, 60, 90, 120, 150, 180, 200, 210],
      },
      {
        type: "line",
        name: "Lewis Hamilton",
        color: "#ff4500",
        data: [0, 30, 50, 70, 110, 140, 160, 170, 190, 200],
      },
      {
        type: "line",
        name: "Mark Webber",
        color: "#ba55d3",
        data: [0, 24, 45, 65, 95, 120, 140, 160, 170, 180],
      },
      {
        type: "line",
        name: "Felipe Massa",
        color: "#20b2aa",
        data: [0, 0, 10, 20, 40, 70, 100, 130, 150, 160],
      },
      {
        type: "line",
        name: "Romain Grosjean",
        color: "#dc143c",
        data: [0, 0, 15, 25, 50, 70, 80, 90, 100, 110],
      },
      {
        type: "line",
        name: "Jenson Button",
        color: "#4169e1",
        data: [0, 25, 40, 55, 70, 90, 120, 140, 160, 170],
      },
      {
        type: "line",
        name: "Nico Rosberg",
        color: "#ff8c00",
        data: [0, 0, 5, 15, 25, 30, 40, 50, 55, 60],
      },
      {
        type: "line",
        name: "Sergio Perez",
        color: "#00ced1",
        data: [0, 22, 35, 45, 60, 80, 90, 100, 110, 120],
      },
      {
        type: "line",
        name: "Sergio Perez",
        color: "#d10003ff",
        data: [0, 400, 35, 45, 70, 3, 100, 10, 110, 120],
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
