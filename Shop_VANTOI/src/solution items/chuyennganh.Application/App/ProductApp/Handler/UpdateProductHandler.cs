using AutoMapper;
using chuyennganh.Application.App.ProductApp.Command;
using chuyennganh.Application.App.ProductApp.Validators;
using chuyennganh.Application.Repositories.CategoryRepo;
using chuyennganh.Application.Repositories.ProductRepo;
using chuyennganh.Application.Response;
using chuyennganh.Application.Response.ProductsRP;
using chuyennganh.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;

namespace chuyennganh.Application.App.ProductApp.Handler
{
    public class UpdateProductHandler : IRequestHandler<UpdateProductCommand, ServiceResponse>
    {
        private readonly IProductRepository productRepository;
        private readonly ICategoryRepository categoryRepository;
        private readonly IProductCategoryRepository productCategoryRepository;
        private readonly IMapper mapper;
        private readonly ILogger<UpdateProductHandler> logger;
        //private readonly IWebHostEnvironment webHostEnvironment;

        public UpdateProductHandler(IProductRepository productRepository, IMapper mapper, ILogger<UpdateProductHandler> logger, ICategoryRepository categoryRepository, IProductCategoryRepository productCategoryRepository)
        {
            this.productRepository = productRepository;
            this.mapper = mapper;
            this.logger = logger;
            this.categoryRepository = categoryRepository;
            this.productCategoryRepository = productCategoryRepository;
            // this.webHostEnvironment = webHostEnvironment;
        }
        public async Task<ServiceResponse> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
        {
            var response = new ServiceResponse();
            await using (var transaction = productRepository.BeginTransaction())
            {
                try
                {
                    var validator = new UpdateProductValidator();
                    var validationResult = await validator.ValidateAsync(request, cancellationToken);
                    var product = await productRepository.GetByIdAsync(request.Id!);
                    if (request.CategoryIds is not null && request.CategoryIds.Any()) await categoryRepository.CheckIdsExistAsync(request.CategoryIds.ToList());

                    var dubCategoryId = request.CategoryIds.GroupBy(id => id).Where(g => g.Count() > 1).Select(g => g.Key).ToList();
                    if (!validationResult.IsValid)
                    {
                        response.IsSuccess = false;
                        response.Message = "Update Failed";
                        response.Errors = validationResult.Errors?.Select(e => e.ErrorMessage).ToList() ?? new List<string>();
                        logger.LogWarning("Validation failed for UpdateProductRequest: {Errors}", response.Errors);
                        return response;
                    }
                    if (request.CategoryIds is not null)
                    {
                        var existingProduct = productCategoryRepository.FindAll(x => x.ProductId == request.Id).ToList();
                        productCategoryRepository.RemoveMultiple(existingProduct);
                    }
                    product.ProductCategories = request.CategoryIds?.Distinct().Select(categoryId => new ProductCategory
                    {
                        ProductId = product.Id,
                        CategoryId = categoryId
                    }).ToList() ?? product.ProductCategories;

                   
                    if (product == null)
                    {
                        response.IsSuccess = false;
                        response.Message = "Product not found";
                        logger.LogWarning("Update failed for UpdateProductRequest: Product not found with ID: {Id}", request.Id);
                        return response;
                    }
                   
                    mapper.Map(request, product);
                    await productRepository.UpdateAsync(product);
                    await productRepository.SaveChangeAsync();

                    await transaction.CommitAsync(cancellationToken);
                    logger.LogInformation("product updated successfully with ID: {Id}", product.Id);

                    return new ProductRespose(product);
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync(cancellationToken);
                    response.IsSuccess = false;
                    response.Message = $"An error occurred: {ex.Message}";
                    logger.LogError(ex, "An error occurred while creating product");
                    return response;
                }

            }
        }
    }
}
