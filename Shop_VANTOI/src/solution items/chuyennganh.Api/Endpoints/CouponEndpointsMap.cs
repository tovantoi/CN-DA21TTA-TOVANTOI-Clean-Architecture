using chuyennganh.Api.Controllers;

namespace chuyennganh.Api.Endpoints
{
    public static class CouponEndpointsMap
    {
        public static IEndpointRouteBuilder MapCouponEndpoints(this IEndpointRouteBuilder app)
        {
            var customers = app.MapGroup("/minimal/api");

            customers.MapPost("/create-coupon", CouponController.CreateCoupon);

            return app;
        }
    }
}
