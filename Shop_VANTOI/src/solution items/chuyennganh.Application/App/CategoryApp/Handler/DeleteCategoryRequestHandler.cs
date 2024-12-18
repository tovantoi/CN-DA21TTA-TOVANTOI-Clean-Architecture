using AutoMapper;
using chuyennganh.Application.App.CategoryApp.Command;
using chuyennganh.Application.App.CategoryApp.Validators;
using chuyennganh.Application.Repositories.CategoryRepo;
using chuyennganh.Application.Repositories.ProductRepo;
using chuyennganh.Application.Response;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;

namespace chuyennganh.Application.App.CategoryApp.Handler
{
    public class DeleteCategoryRequestHandler : IRequestHandler<DeleteCategoryRequest, ServiceResponse>
    {
        private readonly ICategoryRepository categoryRepository;
        private readonly IMapper mapper;
        private readonly ILogger<DeleteCategoryRequestHandler> logger;

        public DeleteCategoryRequestHandler(IProductRepository productRepository, IMapper mapper, ILogger<DeleteCategoryRequestHandler> logger, ICategoryRepository categoryRepository)
        {
            this.mapper = mapper;
            this.logger = logger;
            this.categoryRepository = categoryRepository;
        }
        public async Task<ServiceResponse> Handle(DeleteCategoryRequest request, CancellationToken cancellationToken)
        {
            var response = new ServiceResponse();
            var validator = new DeleteCategoryRequestValidator();
            validator.ValidateAndThrow(request);
            await using (var transaction = categoryRepository.BeginTransaction())
            {
                try
                {
                    var product = await categoryRepository.GetByIdAsync(request.Id!.Value);
                    if (product == null)
                    {
                        response.IsSuccess = false;
                        response.Message = "Product ID not found";
                        return response;
                    }
                    await categoryRepository.DeleteAsync(request.Id.Value);
                    await categoryRepository.SaveChangeAsync();

                    transaction.Commit();

                    response.IsSuccess = true;
                    response.Message = "Delete Successful";

                    return response;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();

                    response.IsSuccess = false;
                    response.Message = $"An error occurred: {ex.Message}";
                    return response;
                }

            }
        }
    }
}
