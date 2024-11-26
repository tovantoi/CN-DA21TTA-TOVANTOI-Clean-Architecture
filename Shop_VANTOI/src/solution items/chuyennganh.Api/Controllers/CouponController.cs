using AutoMapper;
using chuyennganh.Application.App.CouponApp.Command;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace chuyennganh.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CouponController : ControllerBase
    {
        [HttpPost("/create-coupon")]
        public static async Task<IResult> CreateCoupon([FromBody] CouponCreateRequest request, IMediator mediator, IMapper mapper)
        {

            var command = mapper.Map<CouponCreateRequest>(request);
            var result = await mediator.Send(command);
            return TypedResults.BadRequest(result);
        }

    }
}