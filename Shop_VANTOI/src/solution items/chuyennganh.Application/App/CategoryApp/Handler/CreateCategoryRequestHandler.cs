using AutoMapper;
using chuyennganh.Application.App.CategoryApp.Command;
using chuyennganh.Application.App.CategoryApp.Validators;
using chuyennganh.Application.Repositories.CategoryRepo;
using chuyennganh.Application.Response;
using chuyennganh.Domain;
using chuyennganh.Domain.Entities;
using chuyennganh.Domain.Enumerations;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace chuyennganh.Application.App.CategoryApp.Handler
{
    public class CreateCategoryRequestHandler : IRequestHandler<CreateCategoryRequest, ServiceResponse>
    {
        private readonly ICategoryRepository categoryRepository;
        private readonly IMapper mapper;
        private readonly IFileService fileService;

        public CreateCategoryRequestHandler(ICategoryRepository categoryRepository, IMapper mapper, IFileService fileService)
        {
            this.categoryRepository = categoryRepository;
            this.mapper = mapper;
            this.fileService = fileService;
        }

        public async Task<ServiceResponse> Handle(CreateCategoryRequest request, CancellationToken cancellationToken)
        {
            await using (var transaction = categoryRepository.BeginTransaction())
            {
                try
                {
                    var validator = new CreateCategoryRequestValidator();
                    var validationResult = await validator.ValidateAsync(request, cancellationToken);

                    var category = mapper.Map<Category>(request);
                    if (request.ImageData is not null)
                    {
                        var fileName = $"a{fileService.GetFileExtensionFromBase64(request.ImageData)}";
                        var path = await fileService.UploadFile(fileName, request.ImageData, AssetType.CAT_IMG);
                        category.ImagePath = path;
                    }

                    await categoryRepository.AddAsync(category);
                    await categoryRepository.SaveChangeAsync();
                    await transaction.CommitAsync(cancellationToken);
                    return ServiceResponse.Success("Tạo thành công");
                }
                catch (Exception e)
                {
                    await transaction.RollbackAsync(cancellationToken);
                    return new ServiceResponse
                    {
                        IsSuccess = false,
                        StatusCode = StatusCodes.Status500InternalServerError,
                    };
                }
            }
        }
    }
}