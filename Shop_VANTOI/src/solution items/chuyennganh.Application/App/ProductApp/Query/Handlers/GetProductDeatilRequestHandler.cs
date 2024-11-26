using chuyennganh.Application.App.ProductApp.Query.Queries;
using chuyennganh.Application.App.ProductApp.Validators;
using chuyennganh.Application.Repositories.ProductRepo;
using chuyennganh.Domain.Entities;
using chuyennganh.Domain.ExceptionEx;
using MediatR;

namespace chuyennganh.Application.App.ProductApp.Query.Handlers
{
    public class GetProductDeatilRequestHandler : IRequestHandler<GetProductDeatilRequest, Product>
    {
        private readonly IProductRepository productRepository;

        public GetProductDeatilRequestHandler(IProductRepository productRepository)
        {
            this.productRepository = productRepository;
        }

        public async Task<Product> Handle(GetProductDeatilRequest request, CancellationToken cancellationToken)
        {
            var validator = new GetProductDeatilRequestValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            var product = await productRepository.GetByIdAsync(request.Id);
            if (product is null) product.ThrowNotFound();
            return product;
        }
    }
}