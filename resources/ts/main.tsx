import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PrimeReactProvider } from 'primereact/api';

const rootElement = document.getElementById("app");
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement); // This is correct for React 18+
    root.render(
        <React.StrictMode>
            <PrimeReactProvider>
                <App />
            </PrimeReactProvider>
        </React.StrictMode>
    );
}
