import React from "react";
import { Button } from 'primereact/button';
import { useEffect } from "react";

const App: React.FC = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Hello, World from React and Tailwind CSS!</h1>
            <Button label="Click Me" onClick={() => alert('Hello, World!')} />
        </div>
    );
};

export default App;
