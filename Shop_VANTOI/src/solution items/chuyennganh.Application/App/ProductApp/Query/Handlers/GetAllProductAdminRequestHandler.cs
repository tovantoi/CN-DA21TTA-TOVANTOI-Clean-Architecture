using AutoMapper;
using chuyennganh.Application.App.DTOs;
using chuyennganh.Application.App.ProductApp.Query.Queries;
using chuyennganh.Application.Repositories.ProductRepo;
using MediatR;

namespace chuyennganh.Application.App.ProductApp.Query.Handlers
{
    public class GetAllProductAdminRequestHandler : IRequestHandler<GetAllProductAdminQueris, List<ProductDTO>>
    {
        private readonly IProductRepository productRepository;
        private readonly IMapper mapper;

        public GetAllProductAdminRequestHandler(IProductRepository productRepository, IMapper mapper)
        {
            this.productRepository = productRepository;
            this.mapper = mapper;
        }

        public Task<List<ProductDTO>> Handle(GetAllProductAdminQueris request, CancellationToken cancellationToken)
        {
            var products = productRepository.FindAll().ToList();
            var productDtos = mapper.Map<List<ProductDTO>>(products);
            return Task.FromResult(productDtos);
        }
    }
}
