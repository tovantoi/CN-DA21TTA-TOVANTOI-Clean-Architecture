using chuyennganh.Application.Response;
using MediatR;
using System.Text.Json.Serialization;

namespace chuyennganh.Application.App.CustomersApp.Customers.Command
{
    public class ResendOTPRequest : IRequest<ServiceResponse>
    {
        [JsonIgnore]
        public string? Email { get; set; }
    }
}