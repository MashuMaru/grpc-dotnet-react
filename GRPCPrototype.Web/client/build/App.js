import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import dotnetLogo from './assets/Microsoft_.NET_logo.png';
import grpcLogo from './assets/GRPC.png';
import './App.css';
import React from 'react';
import { toast } from "react-fox-toast";
import { greeterClient } from "./grpc-services/grpcService";
function App() {
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [complexData, setComplexData] = useState(undefined);
    const [name, setName] = useState('');
    const handleSayHello = async () => {
        setLoading(true);
        greeterClient.sayHello({ name })
            .then((data) => {
            toast.success("Successfully interfaced with gRPC Service");
            setMessage(data.response.message);
            setComplexData(data.response.complex);
        })
            .catch((err) => {
            toast.error(err.message);
            setMessage('Error calling gRPC service');
        })
            .finally(() => {
            setLoading(false);
        });
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", null,
            React.createElement("a", { href: "https://vite.dev", target: "_blank" },
                React.createElement("img", { src: viteLogo, className: "logo", alt: "Vite logo" })),
            React.createElement("a", { href: "https://react.dev", target: "_blank" },
                React.createElement("img", { src: reactLogo, className: "logo react", alt: "React logo" })),
            React.createElement("a", { href: "https://react.dev", target: "_blank" },
                React.createElement("img", { src: dotnetLogo, className: "logo react", alt: "dotenet logo" })),
            React.createElement("a", { href: "https://react.dev", target: "_blank" },
                React.createElement("img", { src: grpcLogo, className: "logo react", alt: "grpc logo" }))),
        React.createElement("h1", null, "Vite + React + .NET + gRPC"),
        React.createElement("div", { className: "card" },
            React.createElement("input", { type: "text", placeholder: "Enter name", value: name, onChange: (e) => setName(e.target.value), disabled: loading }),
            React.createElement("button", { onClick: handleSayHello, disabled: loading }, loading ? 'Loading...' : 'Send via gRPC')),
        React.createElement("div", { className: "result" }, message && React.createElement("p", null,
            React.createElement("strong", null, "Message:"),
            " ",
            message)),
        React.createElement("div", { className: "result" }, complexData && (React.createElement(React.Fragment, null,
            React.createElement("p", null,
                React.createElement("strong", null, "Complex Data Result:")),
            React.createElement("pre", { style: {
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: "center"
                } }, JSON.stringify(complexData, null, 2)))))));
}
export default App;
