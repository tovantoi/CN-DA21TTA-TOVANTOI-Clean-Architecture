using AutoMapper;
using chuyennganh.Application.App.ProductApp.Command;
using chuyennganh.Application.App.ProductApp.Validators;
using chuyennganh.Application.Repositories.CategoryRepo;
using chuyennganh.Application.Repositories.ProductRepo;
using chuyennganh.Application.Response;
using chuyennganh.Application.Response.ProductsRP;
using chuyennganh.Domain;
using chuyennganh.Domain.Entities;
using chuyennganh.Domain.Enumerations;
using MediatR;
using Microsoft.Extensions.Logging;

public class CreateProductHandler : IRequestHandler<CreateProductCommand, ServiceResponse>
{
    private readonly IProductRepository productRepository;
    private readonly ICategoryRepository categoryRepository;
    private readonly IMapper mapper;
    private readonly ILogger<CreateProductHandler> logger;
    private readonly IFileService fileService;

    public CreateProductHandler(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository,
        IMapper mapper,
        ILogger<CreateProductHandler> logger,
        IFileService fileService)
    {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.mapper = mapper;
        this.logger = logger;
        this.fileService = fileService;
    }

    public async Task<ServiceResponse> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var response = new ServiceResponse();

        await using (var transaction = categoryRepository.BeginTransaction())
        {
            try
            {
                 var product = mapper.Map<Product>(request);
                if (request.CategoryIds is not null && request.CategoryIds.Any()) await categoryRepository.CheckIdsExistAsync(request.CategoryIds.ToList());

                var dubCategoryId = request.CategoryIds!.GroupBy(id => id).Where(g => g.Count() > 1).Select(g => g.Key).ToList();

                var validator = new CreateProductValidator();
                var validationResult = await validator.ValidateAsync(request, cancellationToken);

                if (!validationResult.IsValid)
                {
                    response.IsSuccess = false;
                    response.Message = "Create Failed";
                    response.Errors = validationResult.Errors?.Select(e => e.ErrorMessage).ToList() ?? new List<string>();
                    logger.LogWarning("Validation failed for CreateProductCommand: {Errors}", response.Errors);
                    return response;
                }
                if (request.ImageData is not null)
                {
                    var fileName = $"a{fileService.GetFileExtensionFromBase64(request.ImageData)}";
                    var path = await fileService.UploadFile(fileName, request.ImageData, AssetType.PRODUCT_IMG);
                    product.ImagePath = path;
                }
                product.ProductCategories = request.CategoryIds?.Distinct().Select(categoryId => new ProductCategory
                {
                    ProductId = product.Id,
                    CategoryId = categoryId
                }).ToList();
                await productRepository.AddAsync(product);
                await categoryRepository.SaveChangeAsync();

                await transaction.CommitAsync(cancellationToken);
                return ServiceResponse.Success("Tạo thành công");
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
