import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import {GreeterClient} from "../generated/Greeter.client";

const apiUrl = import.meta.env.VITE_API_URL;
const transport = new GrpcWebFetchTransport({
    baseUrl: apiUrl
})

export const greeterClient = new GreeterClient(transport);