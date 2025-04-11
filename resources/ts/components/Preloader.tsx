import logo from '@images/logo.png';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function Preloader() {
  return (
    <div className="flex flex-col items-center justify-center absolute inset-0 bg-white z-50">
      <img
        src={logo}
        alt="Logo"
        className="block w-48 md:w-64 fade-animation"
      />
      <ProgressSpinner
        style={{ width: '50px', height: '50px' }}
        strokeWidth="4"
      />
    </div>
  );
}
