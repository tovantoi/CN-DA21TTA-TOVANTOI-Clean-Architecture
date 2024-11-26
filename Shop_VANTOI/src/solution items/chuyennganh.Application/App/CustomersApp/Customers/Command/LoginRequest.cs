using chuyennganh.Application.Response;
using MediatR;

namespace chuyennganh.Application.App.CustomersApp.Customers.Command
{
    public class LoginRequest : IRequest<ServiceResponse>
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }
}
