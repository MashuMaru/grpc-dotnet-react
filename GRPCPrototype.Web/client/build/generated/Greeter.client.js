import { Greeter } from "./Greeter";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service greeter.Greeter
 */
export class GreeterClient {
    _transport;
    typeName = Greeter.typeName;
    methods = Greeter.methods;
    options = Greeter.options;
    constructor(_transport) {
        this._transport = _transport;
    }
    /**
     * @generated from protobuf rpc: SayHello
     */
    sayHello(input, options) {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
}
