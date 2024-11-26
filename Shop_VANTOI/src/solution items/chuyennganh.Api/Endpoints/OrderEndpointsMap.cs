using chuyennganh.Api.Controllers;

namespace chuyennganh.Api.Endpoints
{
    public static class OrderEndpointsMap
    {
        public static IEndpointRouteBuilder MapOrderEndpoints(this IEndpointRouteBuilder app)
        {
            var customers = app.MapGroup("/minimal/api");

            customers.MapPost("/create-order", OrderController.CreateOrder);

            return app;
        }
    }
}
