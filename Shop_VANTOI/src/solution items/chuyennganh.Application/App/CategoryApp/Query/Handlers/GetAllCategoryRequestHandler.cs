using AutoMapper;
using chuyennganh.Application.App.CategoryApp.Query.Queries;
using chuyennganh.Application.Repositories.CategoryRepo;
using chuyennganh.Domain.Entities;
using MediatR;

namespace chuyennganh.Application.App.CategoryApp.Query.Handlers
{
    public class GetAllCategoryRequestHandler : IRequestHandler<GetAllCategoryRequest, List<Category>>
    {
        private readonly ICategoryRepository categoryRepository;
        private readonly IMapper mapper;

        public GetAllCategoryRequestHandler(ICategoryRepository categoryRepository, IMapper mapper)
        {
            this.categoryRepository = categoryRepository;
            this.mapper = mapper;
        }

        public async Task<List<Category>> Handle(GetAllCategoryRequest request, CancellationToken cancellationToken)
        {
            var category = categoryRepository.FindAll();

            return mapper.Map<List<Category>>(category);
        }
    }
}
