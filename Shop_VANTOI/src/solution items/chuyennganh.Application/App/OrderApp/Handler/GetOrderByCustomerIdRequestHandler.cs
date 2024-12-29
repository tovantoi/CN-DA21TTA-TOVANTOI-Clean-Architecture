﻿using chuyennganh.Application.App.DTOs;
using chuyennganh.Application.App.OrderApp.Command;
using chuyennganh.Application.Repositories.OrderRepo;
using chuyennganh.Domain.ExceptionEx;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace chuyennganh.Application.App.OrderApp.Handler
{
    public class GetOrderByCustomerIdRequestHandler : IRequestHandler<GetOrderByCustomerIdRequest, List<OrderDTO>>
    {
        private readonly IOrderRepository orderRepository;

        public GetOrderByCustomerIdRequestHandler(IOrderRepository orderRepository)
        {
            this.orderRepository = orderRepository;
        }

        public async Task<List<OrderDTO>> Handle(GetOrderByCustomerIdRequest request, CancellationToken cancellationToken)
        {
            var orders = orderRepository
        .FindAll(o => o.CustomerId == request.Id)
        .Include(o => o.OrderItems)
        .ThenInclude(oi => oi.Product)
        .Include(o => o.CustomerAddress)
        .Include(o => o.Customer)
        .Include(o => o.Coupon)
        .ToList();

            if (orders is null) orders.ThrowNotFound();

            var orderDtos = orders.Select(order => new OrderDTO
            {
                Id = order.Id,
                Email = order.Customer?.Email,
                Status = order.Status,
                Coupon = order.Coupon != null ? new CouponDTO
                {
                    Id = order.Coupon.Id,
                    Description = order.Coupon.Description,
                    Discount = order.Coupon.Discount
                } : null,
                Address = order.CustomerAddress != null ? new CustomerAddressDTO
                {
                    Id = order.CustomerAddress.Id,
                    Address = order.CustomerAddress.Address,
                    FullName = order.CustomerAddress.FullName,
                    Phone = order.CustomerAddress.Phone,
                    Province = order.CustomerAddress.Province,
                    District = order.CustomerAddress.District,
                    Ward = order.CustomerAddress.Ward
                } : null,
                OrderItems = order.OrderItems?.Select(oi => new OrderItemDTO
                {
                    ProductId = oi.ProductId ?? 0,
                    Quantity = oi.Quantity ?? 0,
                    ProductName = oi.Product?.ProductName ?? "Unknown",
                    ImagePath = oi.Product?.ImagePath ?? "Unknown"
                }).ToList(),
                TotalPrice = order.TotalPrice ?? 0,
            }).ToList();

            return orderDtos;
        }
    }
}