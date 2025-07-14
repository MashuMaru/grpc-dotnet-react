
using Grpc.Core;
using GRPCPrototype.Library.Services;

namespace GRPCPrototype.Library.GrpcHandlers;
public class GreeterHandler(IGreeterService greeterService) : Greeter.GreeterBase
{
    public override async Task<HelloReply> SayHello(HelloRequest request, ServerCallContext context)
    {
        if (string.IsNullOrEmpty(request.Name))
            throw new RpcException(new Status(StatusCode.InvalidArgument, "Name is required"));

        if (request.Name.ToLower() == "forbidden")
            throw new RpcException(new Status(StatusCode.PermissionDenied, "Forbidden"));

        return await greeterService.SayHello(request);
    }
}