using AutoMapper;
using chuyennganh.Application.App.CategoryApp.Query.Queries;
using chuyennganh.Application.Repositories.CategoryRepo;
using chuyennganh.Domain.Entities;
using MediatR;

namespace chuyennganh.Application.App.CategoryApp.Query.Handlers
{
    public class GetByIdCategoryRequestHandler : IRequestHandler<GetByIdCategoryRequest, Category>
    {
        private readonly ICategoryRepository categoryRepository;
        private readonly IMapper mapper;

        public GetByIdCategoryRequestHandler(ICategoryRepository categoryRepository, IMapper mapper)
        {
            this.categoryRepository = categoryRepository;
            this.mapper = mapper;
        }
        public async Task<Category> Handle(GetByIdCategoryRequest request, CancellationToken cancellationToken)
        {
            var category = await categoryRepository.GetByIdAsync(request.Id!);
            return mapper.Map<Category>(category);
        }
    }
}
