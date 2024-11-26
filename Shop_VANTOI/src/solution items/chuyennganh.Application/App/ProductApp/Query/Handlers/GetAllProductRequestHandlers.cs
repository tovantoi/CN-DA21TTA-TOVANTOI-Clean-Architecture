using AutoMapper;
using Castle.Core.Resource;
using chuyennganh.Application.App.ProductApp.Query.Queries;
using chuyennganh.Application.Repositories.ProductRepo;
using chuyennganh.Domain.Entities;
using chuyennganh.Domain.ExceptionEx;
using MediatR;

namespace chuyennganh.Application.App.ProductApp.Query.Handlers
{
    public class GetAllProductRequestHandlers : IRequestHandler<GetAllProductQueris, List<Product>>
    {
        private readonly IProductRepository productRepository;
        private readonly IMapper mapper;
        public GetAllProductRequestHandlers(IProductRepository productRepository, IMapper mapper)
        {
            this.mapper = mapper;
            this.productRepository = productRepository;
        }


        public async Task<List<Product>> Handle(GetAllProductQueris request, CancellationToken cancellationToken)
        {
            var products = await productRepository.GetAll();
            if (products is null) products.ThrowNotFound();
            return mapper.Map<List<Product>>(products);
        }
    }
}
