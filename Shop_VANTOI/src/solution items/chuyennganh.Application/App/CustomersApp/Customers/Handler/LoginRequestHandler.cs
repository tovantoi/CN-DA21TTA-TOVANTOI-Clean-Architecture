using AutoMapper;
using chuyennganh.Application.App.CustomersApp.Customers.Command;
using chuyennganh.Application.App.CustomersApp.Validators;
using chuyennganh.Application.Repositories.CustomerRPRepo;
using chuyennganh.Application.Response;
using chuyennganh.Domain.ExceptionEx;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace chuyennganh.Application.App.CustomersApp.Customers.Handler
{
    public class LoginRequestHandler : IRequestHandler<LoginRequest, ServiceResponse>
    {
        private readonly ICustomerRepository customerRepository;
        private readonly IMapper mapper;

        public LoginRequestHandler(ICustomerRepository customerRepository, IMapper mapper)
        {
            this.customerRepository = customerRepository;
            this.mapper = mapper;
        }

        public async Task<ServiceResponse> Handle(LoginRequest request, CancellationToken cancellationToken)
        {
            await using (var transaction = customerRepository.BeginTransaction())
            {
                try
                {
                    var validator = new LoginRequestValidator();
                    var validationResult = await validator.ValidateAsync(request, cancellationToken);
                    validationResult.ThrowIfInvalid();

                    var customer = await customerRepository.FindAll(u => u.Email == request.Email).FirstOrDefaultAsync(cancellationToken);
                    if (customer is null) customer.ThrowNotFound();

                    if (!customer.IsActive)
                    {
                        return new ServiceResponse
                        {
                            IsSuccess = false,
                            StatusCode = StatusCodes.Status403Forbidden,
                        };
                    }

                    bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, customer.Password);
                    if (!isPasswordValid)
                    {
                        return new ServiceResponse
                        {
                            IsSuccess = false,
                            StatusCode = StatusCodes.Status401Unauthorized,
                        };
                    }

                    await transaction.CommitAsync(cancellationToken);
                    return ServiceResponse.Success("Đăng nhập thành công");
                }
                catch (System.Exception ex)
                {
                    await transaction.RollbackAsync(cancellationToken);
                    throw;
                }
            }
        }
    }
}
