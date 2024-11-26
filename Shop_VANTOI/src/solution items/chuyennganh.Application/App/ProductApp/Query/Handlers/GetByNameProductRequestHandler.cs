using AutoMapper;
using chuyennganh.Application.App.ProductApp.Query.Queries;
using chuyennganh.Application.Repositories.ProductRepo;
using chuyennganh.Application.Response;
using chuyennganh.Domain.Entities;
using chuyennganh.Domain.ExceptionEx;
using MediatR;

namespace chuyennganh.Application.App.ProductApp.Query.Handlers
{
    public class GetByNameProductRequestHandler : IRequestHandler<GetByNameProductQueris, List<Product>>
    {
        private readonly IProductRepository productRepository;
        private readonly IMapper mapper;

        public GetByNameProductRequestHandler(IProductRepository productRepository, IMapper mapper)
        {
            this.productRepository = productRepository;
            this.mapper = mapper;
        }
        public async Task<List<Product>> Handle(GetByNameProductQueris request, CancellationToken cancellationToken)
        {
            var response = new ServiceResponse();
            var product = productRepository.FindAll(x => x.ProductName!.ToLower().Contains(request.ProductName!.ToLower())).ToList();
            if (product is null) product.ThrowNotFound();
            return mapper.Map<List<Product>>(product);
        }
    }
}
