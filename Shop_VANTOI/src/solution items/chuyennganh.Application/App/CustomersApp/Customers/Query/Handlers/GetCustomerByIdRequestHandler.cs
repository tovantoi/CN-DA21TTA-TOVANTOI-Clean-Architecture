using AutoMapper;
using chuyennganh.Application.App.CustomersApp.Customers.Query.Queries;
using chuyennganh.Application.Repositories.CustomerRPRepo;
using chuyennganh.Domain.Entities;
using chuyennganh.Domain.ExceptionEx;
using MediatR;

namespace chuyennganh.Application.App.CustomersApp.Customers.Query.Handlers
{
    public class GetCustomerByIdRequestHandler : IRequestHandler<GetCustomerByIdCustomerRequest, Customer>
    {
        private readonly ICustomerRepository customerRepository;
        private readonly IMapper mapper;

        public GetCustomerByIdRequestHandler(ICustomerRepository customerRepository, IMapper mapper)
        {
            this.customerRepository = customerRepository;
            this.mapper = mapper;
        }

        public async Task<Customer> Handle(GetCustomerByIdCustomerRequest request, CancellationToken cancellationToken)
        {
            var customers = await customerRepository.GetByIdAsync(request.Id!);
            if (customers is null) customers.ThrowNotFound();
            return mapper.Map<Customer>(customers);
        }
    }
}
