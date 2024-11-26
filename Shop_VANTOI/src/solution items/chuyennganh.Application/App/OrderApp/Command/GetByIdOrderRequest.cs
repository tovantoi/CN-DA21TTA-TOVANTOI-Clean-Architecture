using chuyennganh.Application.App.DTOs;
using MediatR;

namespace chuyennganh.Application.App.OrderApp.Command
{
    public class GetByIdOrderRequest : IRequest<OrderDTO>
    {
        public int? Id { get; set; }
    }
}
