//using AutoMapper;
//using chuyennganh.Application.Repositories.OrderRepo;
//using MediatR;
//using NhaThuoc.Application.DTOs;
//using NhaThuoc.Application.Request.Order;
//using NhaThuoc.Domain.Entities;
//using NhaThuoc.Share.DependencyInjection.Extensions;

//namespace NhaThuoc.Application.Handlers.Order
//{
//    public class GetByIdOrderRequestHandler : IRequestHandler<GetByIdOrderRequest, OrderDTO>
//    {
//        private readonly IOrderRepository orderRepository;
//        private readonly IMapper mapper;

//        public GetByIdOrderRequestHandler(IOrderRepository orderRepository, IMapper mapper)
//        {
//            this.orderRepository = orderRepository;
//            this.mapper = mapper;
//        }
//        public async Task<OrderDTO> Handle(GetByIdOrderRequest request, CancellationToken cancellationToken)
//        {
//            var order = await orderRepository.FindSingleAsync(o => o.Id == request.Id, o => o.OrderItems, o => o.CustomerAddress, o => o.Customer, o => o.Coupon);
//            if (order is null) order.ThrowNotFound();

//            var orderDto = new OrderDTO
//            {
//                Id = order.Id,
//                Email = order.Customer?.Email,
//                Status = order.Status,
//                Coupon = order.Coupon != null ? new CouponDTO
//                {
//                    Id = order.Coupon.Id,
//                    Description = order.Coupon.Description,
//                    Discount = order.Coupon.Discount
//                } : null,
//                Address = order.CustomerAddress != null ? new CustomerAddressDTO
//                {
//                    Id = order.CustomerAddress.Id,
//                    Address = order.CustomerAddress.Address,
//                    FullName = order.CustomerAddress.FullName,
//                    Phone = order.CustomerAddress.Phone,
//                    Province = order.CustomerAddress.Province,
//                    District = order.CustomerAddress.District,
//                    Ward = order.CustomerAddress.Ward
//                } : null,
//                OrderItems = order.OrderItems?.Select(oi => new OrderItemDTO
//                {
//                    ProductId = oi.ProductId ?? 0,
//                    Quantity = oi.Quantity ?? 0
//                }).ToList(),
//                TotalPrice = order.TotalPrice ?? 0,
//            };

//            return orderDto;
//        }
//    }
//}
