using AutoMapper;
using chuyennganh.Application.App.CouponApp.Command;
using chuyennganh.Application.App.CouponApp.Query.Queries;
using chuyennganh.Application.App.ProductApp.Query.Queries;
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
            if (result.IsSuccess)
            {
                return TypedResults.Ok(result);
            }
            return TypedResults.BadRequest(result);
        }
        [HttpGet("/get-code-coupon")]
        public static async Task<IResult> GetByCodeCoupon(string couponcode, IMediator mediator)
        {
            var query = new GetByNameCouponRequest { Code = couponcode };
            var results = await mediator.Send(query);
            if (results != null)
            {
                return TypedResults.Ok(results);
            }
            return TypedResults.NotFound("Không có sản phẩm nào.");
        }
    }
}