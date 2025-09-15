'use client';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function MyChart() {
  const options: Highcharts.Options = {
    chart: { type: 'line' },
    title: { text: 'Demo Highcharts' },
    xAxis: { categories: ['T1', 'T2', 'T3', 'T4'] },
    series: [
      {
        type: 'line',
        name: '2025',
        data: [5, 5, 15, 6],
      },
      {
        type: 'line',
        name: '2025',
        data: [6, 4, 25, 4],
      },
    ],
  };
  

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
