# GRPCPrototype: Fullstack gRPC-Web with .NET 8 + React + Vite

This guide documents how to build a fullstack application with:

- .NET 8 gRPC backend
- React + Vite frontend
- gRPC-Web via `@protobuf-ts` for browser support
- Unified build + deploy through `GRPCPrototype.Web`

---

## Solution Structure

```
GRPCPrototype.sln
├── GRPCPrototype.Library/        # Shared code + .proto files
├── GRPCPrototype.Web/            # .NET 8 gRPC backend + React frontend
│   ├── client/                   # React + Vite frontend source
│   └── wwwroot/                  # Vite build output
└── .gitignore
```

---

## Step 1: Create Class Library

```bash
dotnet new classlib -n GRPCPrototype.Library
dotnet sln add GRPCPrototype.Library/GRPCPrototype.Library.csproj
```

---

## Step 2: Add gRPC Support to Backend

```bash
dotnet add GRPCPrototype.Library package Grpc.AspNetCore
dotnet add GRPCPrototype.Library package Grpc.AspNetCore.Web
dotnet add GRPCPrototype.Library package Google.Protobuf
dotnet add GRPCPrototype.Library package Grpc.Tools
dotnet add GRPCPrototype.Web reference ../GRPCPrototype.Library
```

---

## Step 3: Create the React Frontend in `client/`

From inside `GRPCPrototype.Web`:

```bash
npm create vite@latest client -- --template react-ts
cd client
npm install
```

This sets up the React + TypeScript Vite project inside `GRPCPrototype.Web/client`.

---

## Step 4: Create a `.proto` File

Create `GRPCPrototype.Library/Protos/greeter.proto`:

```proto
syntax = "proto3";

package greeter;

service Greeter {
  rpc SayHello (HelloRequest) returns (HelloReply);
}

message HelloRequest {
  string name = 1;
}

message HelloReply {
  string message = 1;
}
```

Update `GRPCPrototype.Library.csproj`:

```xml
<ItemGroup>
  <Protobuf Include="Protos\*.proto" GrpcServices="Server" />
</ItemGroup>
```

---

## Step 5: Configure gRPC + Static Files in `Program.cs`

```csharp
app.UseGrpcWeb();
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGrpcService<GreeterService>().EnableGrpcWeb(); // When created service.
app.MapFallbackToFile("index.html");
```

---

## Step 6: Configure Vite

In `GRPCPrototype.Web/client/vite.config.ts`:

```ts
import * as path from "node:path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../wwwroot',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5002,
    host: '0.0.0.0',
    hmr: {
      protocol: 'ws',  // Ensure HMR works properly
    },
    proxy: {
      '/api': process.env.VITE_BASE_URL,
    }
  }
})
```

---

## Step 7: Auto-Build UI in .NET Build

In `GRPCPrototype.Web.csproj`:

```xml
<Target Name="PrepublishFrontend" BeforeTargets="Build">
  <Exec Command="npm install" WorkingDirectory="client" />
  <Exec Command="npm run build" WorkingDirectory="client" />
</Target>
```

---

## Step 8: Set Up TypeScript gRPC Codegen (`@protobuf-ts`)

Install packages:

```bash
cd client
npm install @protobuf-ts/plugin @protobuf-ts/runtime @protobuf-ts/runtime-rpc @protobuf-ts/grpcweb-transport
```

Add script to `package.json`:

```json
"scripts": {
  "gen-proto": "rm -rf src/generated && mkdir -p src/generated && protoc -I=../../GRPCPrototype.Library/Protos --ts_out=src/generated ../../GRPCPrototype.Library/Protos/*.proto"
}
```

Generate TypeScript code:

```bash
npm run gen-proto
```

---

## Step 9: Create gRPC Client in React

```ts
// client/src/grpc-services/grpcService.ts
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import {GreeterClient} from "../generated/Greeter.client";

const apiUrl = import.meta.env.VITE_API_URL;
const transport = new GrpcWebFetchTransport({
    baseUrl: apiUrl
})

export const greeterClient = new GreeterClient(transport);
```

---

## Step 10: Call gRPC from a React Component

```tsx
import { useState } from "react";
import { greeterClient } from "../grpc-services/grpcService";

export function HelloCaller() {
  const [response, setResponse] = useState("");

  const callSayHello = async () => {
    const result = await greeterClient.sayHello({ name: "Matthew" });
    setResponse(result.response.message);
  };

  return (
    <div>
      <button onClick={callSayHello}>Call gRPC</button>
      <p>{response}</p>
    </div>
  );
}
```

---

## Step 11: tsconfig Fix for TypeScript 5.4+

In `client/tsconfig.json`:

```json
{
  "compilerOptions": {
    ...
    "erasableSyntaxOnly": false
  }
}
```

---

## Step 12: Deploying to Azure (Optional)

When hosted on Azure or AWS (App Service, Container App, etc.), navigating to your app URL (e.g. `https://yourapp.azurewebsites.net`) will:

- Serve the React frontend from `wwwroot/`
- Proxy gRPC-Web calls to your .NET backend

---
