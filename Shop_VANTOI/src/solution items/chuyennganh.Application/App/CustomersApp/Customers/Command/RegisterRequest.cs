﻿using chuyennganh.Application.Response;
using MediatR;

namespace chuyennganh.Application.App.CustomersApp.Customers.Command
{
    public class RegisterRequest : IRequest<ServiceResponse>
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? ConfirmPassword { get; set; }
    }
}
