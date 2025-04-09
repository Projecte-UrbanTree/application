import logo from '@images/logo.png';

export default function Preloader() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <img
        src={logo}
        alt="Logo"
        className="block w-48 md:w-64 fade-animation"
      />
      <div className="flex items-center justify-center mt-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    </div>
  );
}
