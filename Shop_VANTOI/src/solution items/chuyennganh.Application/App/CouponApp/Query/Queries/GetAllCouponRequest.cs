using chuyennganh.Domain.Entities;
using MediatR;

namespace chuyennganh.Application.App.CouponApp.Query.Queries
{
    public class GetAllCouponRequest : IRequest<List<Coupon>>
    {
    }
}
