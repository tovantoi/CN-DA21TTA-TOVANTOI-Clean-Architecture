using AutoMapper;
using chuyennganh.Application.App.CustomersApp.Validators;
using chuyennganh.Application.App.CustomersApp.Customers.Command;
using chuyennganh.Application.Repositories.CustomerRPRepo;
using chuyennganh.Application.Response;
using chuyennganh.Domain;
using chuyennganh.Domain.Enumerations;
using chuyennganh.Domain.ExceptionEx;
using MediatR;


namespace chuyennganh.Application.App.CustomersApp.Customers.Handler
{
    public class UpdateCustomerProfileRequestHandler : IRequestHandler<UpdateProifleCustomerRequest, ServiceResponse>
    {
        private readonly ICustomerRepository customerRepository;
        private readonly IMapper mapper;
        private readonly IFileService fileService;

        public UpdateCustomerProfileRequestHandler(ICustomerRepository customerRepository, IMapper mapper, IFileService fileService)
        {
            this.customerRepository = customerRepository;
            this.mapper = mapper;
            this.fileService = fileService;
        }

        public async Task<ServiceResponse> Handle(UpdateProifleCustomerRequest request, CancellationToken cancellationToken)
        {
            await using (var transaction = customerRepository.BeginTransaction())
            {
                try
                {
                    var validator = new CustomerProfileValidator();
                    var validationResult = await validator.ValidateAsync(request, cancellationToken);
                    validationResult.ThrowIfInvalid();

                    var customer = await customerRepository.GetByIdAsync(request.Id!);
                    if (customer is null) customer.ThrowNotFound();
                    customer.FirstName = request.FirstName ?? customer.FirstName;
                    customer.LastName = request.LastName ?? customer.LastName;
                    customer.PhoneNumber = request.PhoneNumber ?? customer.PhoneNumber;
                    if (request.ImageData is not null)
                    {
                        string fileName = Path.GetFileName(customer.AvatarImagePath) is { } name &&
                        Path.GetExtension(name)?.ToLowerInvariant() == fileService.GetFileExtensionFromBase64(request.ImageData)?.ToLowerInvariant() ? name : $"{customer.Id}{fileService.GetFileExtensionFromBase64(request.ImageData)}";
                        customer.AvatarImagePath = await fileService.UploadFile(fileName, request.ImageData, AssetType.CUSTOMER);
                    }

                    await customerRepository.UpdateAsync(customer);
                    await customerRepository.SaveChangeAsync();
                    await transaction.CommitAsync(cancellationToken);
                    return ServiceResponse.Success("Cập nhật thành công");
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync(cancellationToken);
                    throw;
                }
            }
        }
    }
}
