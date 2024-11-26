namespace chuyennganh.Domain.ExceptionEx
{
    public class ShopException : Exception
    {
        public bool IsSuccess { get;  set; }
        public int StatusCode { get; set; }
        public List<string>? Errors { get;  set; }

        public ShopException(int statusCode, List<string>? errors = null)
            : base(errors != null && errors.Any() ? string.Join("; ", errors) : "An error occurred")
        {
            IsSuccess = false;
            StatusCode = statusCode;
            Errors = errors;
        }
    }
}
