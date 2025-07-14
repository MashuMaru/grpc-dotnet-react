import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import dotnetLogo from './assets/Microsoft_.NET_logo.png';
import grpcLogo from './assets/GRPC.png'
import './App.css';
import { Complex } from "./generated/Greeter";
import React from 'react';
import {toast} from "react-fox-toast";
import {greeterClient} from "./grpc-services/grpcService";

function App() {
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [complexData, setComplexData] = useState<Complex | undefined>(undefined);
    const [name, setName] = useState('');

    const handleSayHello = async () => {
        setLoading(true);
        greeterClient.sayHello({ name })
          .then((data) => {
              toast.success("Successfully interfaced with gRPC Service")
              setMessage(data.response.message);
              setComplexData(data.response.complex);
          })
          .catch((err) => {
              toast.error(err.message)
              setMessage('Error calling gRPC service');
          })
          .finally(() => {
              setLoading(false);
          });
    };

    return (
      <>
          <div>
              <a href="https://vite.dev" target="_blank">
                  <img src={viteLogo} className="logo" alt="Vite logo" />
              </a>
              <a href="https://react.dev" target="_blank">
                  <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
              <a href="https://react.dev" target="_blank">
                  <img src={dotnetLogo} className="logo react" alt="dotenet logo" />
              </a>
              <a href="https://react.dev" target="_blank">
                  <img src={grpcLogo} className="logo react" alt="grpc logo" />
              </a>
          </div>

          <h1>Vite + React + .NET + gRPC</h1>

          <div className="card">
              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />

              <button onClick={handleSayHello} disabled={loading}>
                  {loading ? 'Loading...' : 'Send via gRPC'}
              </button>
          </div>

          <div className="result">
              {message && <p><strong>Message:</strong> {message}</p>}
          </div>

          <div className="result">
              {complexData && (
                <>
                    <p><strong>Complex Data Result:</strong></p>
                    <pre style={{
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: "center"
                    }}>
                        {JSON.stringify(complexData, null, 2)}
                    </pre>
                </>
              )}
          </div>
      </>
    );
}

export default App;