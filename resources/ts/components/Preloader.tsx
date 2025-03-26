import logo from '@images/logo.png';

export default function Preloader({ bg_white = true }) {
  return (
    <div
      className={`flex items-center justify-center ${bg_white ? 'h-screen bg-white' : 'm-6xl'}`}>
      <img src={logo} alt="Logo" className="w-48 md:w-64 fade-animation" />
    </div>
  );
}
