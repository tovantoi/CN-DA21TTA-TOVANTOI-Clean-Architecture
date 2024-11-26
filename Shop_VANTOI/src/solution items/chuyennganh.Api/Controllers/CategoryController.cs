using AutoMapper;
using chuyennganh.Application.App.CategoryApp.Command;
using chuyennganh.Application.App.CategoryApp.Query.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace chuyennganh.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        [HttpPost("/create-category")]
        public static async Task<IResult> CreateCategory([FromBody] CreateCategoryRequest request, IMediator mediator, IMapper mapper)
        {
                var command = mapper.Map<CreateCategoryRequest>(request);
                var result = await mediator.Send(command);
                return TypedResults.BadRequest(result);
        }

        [HttpPut("/update-category")]
        public static async Task<IResult> UpdateCategory(int? id, [FromBody] UpdateCategoryRequest request, IMediator mediator, IMapper mapper)
        {
                var command = mapper.Map<UpdateCategoryRequest>(request);
                command.Id = id;
                var result = await mediator.Send(command);
                return TypedResults.BadRequest(result);
        }

        [HttpGet("/get-category-by-id")]
        public static async Task<IResult> GetByIdCategory(int id, IMediator mediator, IMapper mapper)
        {
                var command = new GetByIdCategoryRequest();
                command.Id = id;
                var result = await mediator.Send(command);
                return TypedResults.BadRequest(result);
        }

        [HttpGet("/get-categories")]
        public static async Task<IResult> GetAllCategory(IMediator mediator, IMapper mapper)
        {
                var command = new GetAllCategoryRequest();
                var result = await mediator.Send(command);
                return TypedResults.BadRequest(result);
        }
    }
}
