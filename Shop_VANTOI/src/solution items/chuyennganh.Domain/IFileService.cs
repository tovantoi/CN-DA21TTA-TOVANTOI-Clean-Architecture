using chuyennganh.Domain.Enumerations;

namespace chuyennganh.Domain
{
    public interface IFileService
    {
        string GetFileExtensionFromBase64(string base64String);
        Task<string> UploadFile(string fileName, string base64String, AssetType type);
    }
}