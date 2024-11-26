using chuyennganh.Application.App.ProductApp.Command;
using chuyennganh.Application.App.ProductApp.Query.Queries;
using MediatR;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc;

namespace chuyennganh.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {

        [HttpDelete("/delete-product")]
        public static async Task<IResult> Delete(int id, IMediator mediator)
        {
            var command = new DeleteProductCommand { Id = id };
            var result = await mediator.Send(command);
            if (result.IsSuccess)
            {
                return TypedResults.Ok(result);
            }
            return TypedResults.BadRequest(result);
        }

        [HttpPost("/create-product")]
        public static async Task<IResult> Post([FromBody] CreateProductCommand request, IMediator mediator)
        {
            var results = await mediator.Send(request);
            if (results.IsSuccess)
            {
                return TypedResults.Ok(results);
            }
            return TypedResults.BadRequest(results);
        }


        [HttpPut("/update-product")]
        public static async Task<IResult> Put(int id, [FromBody] UpdateProductCommand request, IMediator mediator)
        {
            request.Id = id; 
            var results = await mediator.Send(request);
            if (results.IsSuccess)
            {
                return TypedResults.Ok(results);
            }
            return TypedResults.BadRequest(results);
        }

        [HttpGet("/get-name-product")]
        public static async Task<IResult> GetByNameProduct(string productname, IMediator mediator)
        {
            var query = new GetByNameProductQueris { ProductName = productname };
            var results = await mediator.Send(query);
            if (results != null && results.Any())
            {
                return TypedResults.Ok(results);
            }
            return TypedResults.NotFound("Không có sản phẩm nào.");
        }

        [HttpGet("/get-product-by-id")]
        public static async Task<IResult> GetById(int id, IMediator mediator)
        {
            var query = new GetProductByIDQueris { Id = id };
            var result = await mediator.Send(query);
            return TypedResults.BadRequest(result);
        }

        [HttpGet("/get-products")]
        public static async Task<IResult> GetAll(IMediator mediator)
        {
            var query = new GetAllProductQueris();
            var result = await mediator.Send(query);
            if (result != null && result.Any())
            {
                return TypedResults.Ok(result);
            }
            return TypedResults.NotFound("Không có sản phẩm nào."); 
        }

        [HttpGet("/get-product-detail")]
        public static async Task<IResult> GetProductDetail(int? id, IMediator mediator)
        {
                var command = new GetProductDeatilRequest();
                command.Id = id;
                var result = await mediator.Send(command);
                return TypedResults.Ok(result);
        }
    }
}
