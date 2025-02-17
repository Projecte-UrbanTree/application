import { Chart } from 'primereact/chart';

export default function Users() {
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Demo Data',
        backgroundColor: '#42A5F5',
        borderColor: '#1E88E5',
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div
          className="bg-white rounded p-6 mb-8 border border-gray-300"
          style={{ height: '200px' }}>
          <Chart type="bar" data={chartData} options={options} />
        </div>
        <div
          className="bg-white rounded p-6 mb-8 border border-gray-300"
          style={{ height: '200px' }}>
          <Chart type="bar" data={chartData} options={options} />
        </div>
        <div
          className="bg-white rounded p-6 mb-8 border border-gray-300"
          style={{ height: '200px' }}>
          <Chart type="bar" data={chartData} options={options} />
        </div>
        <div
          className="bg-white rounded p-6 mb-8 border border-gray-300"
          style={{ height: '200px' }}>
          <Chart type="bar" data={chartData} options={options} />
        </div>
      </div>
    </>
  );
}
