using AutoMapper;
using chuyennganh.Application.App.CustomersApp.Customers.Query.Queries;
using chuyennganh.Application.Repositories.CustomerRPRepo;
using chuyennganh.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace chuyennganh.Application.App.CustomersApp.Customers.Query.Handlers
{
    public class GetAllCustomerRequestHandler : IRequestHandler<GetAllCustomerRequest, List<Customer>>
    {
        private readonly ICustomerRepository customerRepository;
        private readonly IMapper mapper;

        public GetAllCustomerRequestHandler(ICustomerRepository customerRepository, IMapper mapper)
        {
            this.customerRepository = customerRepository;
            this.mapper = mapper;
        }

        public async Task<List<Customer>> Handle(GetAllCustomerRequest request, CancellationToken cancellationToken)
        {
            var customers = await customerRepository
                                 .FindAll(u => u.Role == 0)
                                 .ToListAsync(cancellationToken);

            return mapper.Map<List<Customer>>(customers);
        }
    }
}
