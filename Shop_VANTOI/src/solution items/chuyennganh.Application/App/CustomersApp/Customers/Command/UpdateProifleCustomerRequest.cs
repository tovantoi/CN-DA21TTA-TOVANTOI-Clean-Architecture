using chuyennganh.Application.Response;
using MediatR;

namespace chuyennganh.Application.App.CustomersApp.Customers.Command
{
    public class UpdateProifleCustomerRequest : IRequest<ServiceResponse>
    {
        public int? Id { get; set; }
        public string? FirstName { get; set; }
        public string? ImageData { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public bool? IsActive { get; set; }
    }
}