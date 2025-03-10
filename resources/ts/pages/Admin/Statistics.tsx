import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { ProgressSpinner } from 'primereact/progressspinner';
import axiosClient from '@/api/axiosClient';

export default function Stats() {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [days, setDays] = useState<string[]>([]);
    const [tasksDoneCount, setTasksDoneCount] = useState<number[]>([]);
    const [tasksNotDoneCount, setTasksNotDoneCount] = useState<number[]>([]);
    const [hoursWorked, setHoursWorked] = useState<number[]>([]);
    const [fuelConsumption, setFuelConsumption] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await axiosClient.get('/admin/statistics', {
                params: {
                    from_date: fromDate,
                    to_date: toDate,
                },
            });
            setDays(res.data.days);
            setTasksDoneCount(res.data.tasksDoneCount);
            setTasksNotDoneCount(res.data.tasksNotDoneCount);
            setHoursWorked(res.data.hoursWorked);
            setFuelConsumption(res.data.fuelConsumption);
        } catch {}
        setIsLoading(false);
    };

    useEffect(() => {
        setFromDate('');
        setToDate('');
    }, []);

    const options = {
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
    };

    const dataTasks = {
        labels: days,
        datasets: [
            { label: 'Tareas hechas', data: tasksDoneCount },
            { label: 'Tareas pendientes', data: tasksNotDoneCount },
        ],
    };

    const dataHours = {
        labels: days,
        datasets: [{ label: 'Horas trabajadas', data: hoursWorked }],
    };

    const dataFuel = {
        labels: days,
        datasets: [{ label: 'Combustible consumido', data: fuelConsumption }],
    };

    return (
        <>
            <div className="mb-4 flex gap-2 items-end">
                <div className="flex flex-col">
                    <label>Fecha inicio</label>
                    <input
                        type="date"
                        className="border rounded px-2 py-1"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <label>Fecha fin</label>
                    <input
                        type="date"
                        className="border rounded px-2 py-1"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>
                <button
                    onClick={fetchData}
                    className="bg-blue-600 text-white px-4 py-2 rounded">
                    Filtrar
                </button>
            </div>
            {isLoading && (
                <div className="flex items-center justify-center my-4">
                    <ProgressSpinner
                        style={{ width: '40px', height: '40px' }}
                    />
                </div>
            )}
            {!isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                        className="bg-white rounded p-6 border border-gray-300"
                        style={{ height: '300px' }}>
                        <Chart type="bar" data={dataTasks} options={options} />
                    </div>
                    <div
                        className="bg-white rounded p-6 border border-gray-300"
                        style={{ height: '300px' }}>
                        <Chart type="bar" data={dataHours} options={options} />
                    </div>
                    <div
                        className="bg-white rounded p-6 border border-gray-300"
                        style={{ height: '300px' }}>
                        <Chart type="bar" data={dataFuel} options={options} />
                    </div>
                    <div
                        className="bg-white rounded p-6 border border-gray-300"
                        style={{ height: '300px' }}>
                        <Chart
                            type="bar"
                            data={{
                                labels: days,
                                datasets: [
                                    { label: 'Otra métrica', data: [2, 4, 1] },
                                ],
                            }}
                            options={options}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
