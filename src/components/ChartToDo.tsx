"use client";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type ChartProps = {
  data: { date: string; count: number }[];
};

export default function ChartToDo({ data }: ChartProps) {
  const options: Highcharts.Options = {
    title: { text: "Todo created by date" },
    xAxis: {
      categories: data.map((d) => d.date),
    },
    yAxis: {
      title: { text: "Số lượng todos" },
    },
    series: [
      {
        type: "line",
        name: "Todos",
        data: data.map((d) => d.count),
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
