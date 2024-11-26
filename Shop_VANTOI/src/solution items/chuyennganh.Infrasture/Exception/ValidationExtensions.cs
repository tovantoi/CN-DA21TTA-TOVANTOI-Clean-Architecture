using FluentValidation.Results;
using Microsoft.AspNetCore.Http;

namespace chuyennganh.Infrasture.Exception
{
    public static class ValidationExtensions
    {
        public static void ThrowIfInvalid(this ValidationResult validationResult)
        {
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                throw new ShopException(StatusCodes.Status400BadRequest, errors);
            }
        }

        public static void ThrowNotFound<T>(this T entity, string? errorMessage = null)
        {
            if (entity is null)
            {
                var entityTypeName = typeof(T).Name;
                errorMessage = $"{entityTypeName} is not found!";
                throw new ShopException(StatusCodes.Status404NotFound, new List<string> { errorMessage });
            }
        }

        public static void ThrowConflict<T>(this T entity, string? errorMessage = null)
        {
            if (entity is not null)
            {
                var entityTypeName = typeof(T).Name;
                errorMessage = $"{entityTypeName} is conflict";
                throw new ShopException(StatusCodes.Status409Conflict, new List<string> { errorMessage });
            }
        }
    }
}