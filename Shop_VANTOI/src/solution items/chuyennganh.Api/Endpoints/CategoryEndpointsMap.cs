using chuyennganh.Api.Controllers;

namespace chuyennganh.Api.Endpoints
{
    public static class CategoryEndpointsMap
    {
        public static IEndpointRouteBuilder MapCategoryEndpoints(this IEndpointRouteBuilder app)
        {
            var category = app.MapGroup("/minimal/api");

            category.MapPost("/create-category", CategoryController.CreateCategory);

            //category.MapDelete("/{id:int}", CategoryController.Delete);

            category.MapPut("/update-category", CategoryController.UpdateCategory);
            return app;
        }
    }
}
