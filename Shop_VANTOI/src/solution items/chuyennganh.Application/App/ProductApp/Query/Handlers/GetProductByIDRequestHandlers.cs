using AutoMapper;
using chuyennganh.Application.App.ProductApp.Query.Queries;
using chuyennganh.Application.Repositories.ProductRepo;
using chuyennganh.Application.Response;
using chuyennganh.Domain.Entities;
using chuyennganh.Domain.ExceptionEx;
using MediatR;

namespace chuyennganh.Application.App.ProductApp.Query.Handlers
{
    public class GetProductByIDRequestHandlers : IRequestHandler<GetProductByIDQueris, Product>
    {
        private readonly IProductRepository productRepository;
        private readonly IMapper mapper;
        public GetProductByIDRequestHandlers(IProductRepository productRepository, IMapper mapper)
        {
            this.productRepository = productRepository;
            this.mapper = mapper;
        }

        public async Task<Product> Handle(GetProductByIDQueris request, CancellationToken cancellationToken)
        {
            var response = new ServiceResponse();
            var product = await productRepository.GetByIdAsync(request.Id!);
            if (product is null) product.ThrowNotFound();
            return mapper.Map<Product>(product);
        }
    }
}
