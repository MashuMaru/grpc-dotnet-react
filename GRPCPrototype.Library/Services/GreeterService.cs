namespace GRPCPrototype.Library.Services;

public interface IGreeterService
{
    Task<HelloReply> SayHello(HelloRequest request);
}

public class GreeterService : IGreeterService
{
    public Task<HelloReply> SayHello(HelloRequest request)
    {
        return Task.FromResult(new HelloReply
        {
            Message = $"Hello, {request.Name}! Your name is {request.Name.Length} characters long!",
            Complex = new Complex
            {
                Id = 1,
                Name = request.Name + " Doe",
                Date = DateTime.UtcNow.ToLongDateString()
            }
        });
    }
}