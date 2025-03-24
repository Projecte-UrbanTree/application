import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface WorkReport {
  id: number;
  observation: string;
  spent_fuel: number;
  report_status: number;
  report_incidents: string;
  work_order_id: number;
}

const WorkReportsList = () => {
  const { id } = useParams<{ id: string }>();
  const [workReport, setWorkReport] = useState<WorkReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkReports = async () => {
      try {
        const response = await axios.get(`/api/admin/work-reports/${id}`);
        setWorkReport(response.data);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        setLoading(false);
      }
    };

    fetchWorkReports();
  }, [id]);

  if (loading) return <div>Cargando reportes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="work-reports-container">
      <h2>Reportes de Trabajo {id}</h2>
      {workReport && (
        <div>
          <p>
            <strong>Observación:</strong> {workReport.observation}
          </p>
          <p>
            <strong>Combustible gastado:</strong> {workReport.spent_fuel}
          </p>
          <p>
            <strong>Estado del reporte:</strong> {workReport.report_status}
          </p>
          <p>
            <strong>Incidentes del reporte:</strong>{' '}
            {workReport.report_incidents}
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkReportsList;
