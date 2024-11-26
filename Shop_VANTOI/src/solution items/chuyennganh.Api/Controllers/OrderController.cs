using AutoMapper;
using chuyennganh.Application.App.OrderApp.Command;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace chuyennganh.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        [HttpPost("/create-order")]
        public static async Task<IResult> CreateOrder([FromBody] CreateOrderRequest request, IMediator mediator, IMapper mapper)
        {

                var command = mapper.Map<CreateOrderRequest>(request);
                var result = await mediator.Send(command);
                return TypedResults.BadRequest(result);
        }

    }
}