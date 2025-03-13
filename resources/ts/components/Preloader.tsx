import logo from '@images/logo.png';

export default function Preloader() {
    return (
        <div className="flex items-center justify-center w-full h-full">
            <img
                src={logo}
                alt="Logo"
                className="w-48 md:w-64 fade-animation"
            />
        </div>
    );
}
