import useI18n from '@/hooks/useI18n';
import logo from '@images/logo.png';

export default function Preloader({ bg_white = false }) {
  const { format } = useI18n();
  return (
    <div
      className={`fade-animation flex flex-col items-center justify-center text-center ${bg_white ? 'h-screen bg-white' : 'mt-32'}`}>
      <img src={logo} alt="Logo" className="w-48 md:w-64" />
      <span>
        {format('states.loading')}
        <span className="dots-animation"></span>
      </span>
    </div>
  );
}
