using chuyennganh.Domain.Entities;
using MediatR;

namespace chuyennganh.Application.App.ProductApp.Query.Queries
{
    public class GetAllProductQueris : IRequest<List<Product>>
    {
    }
}
