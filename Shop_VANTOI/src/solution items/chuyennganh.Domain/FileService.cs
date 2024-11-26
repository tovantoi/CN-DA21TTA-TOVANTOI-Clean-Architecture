﻿using chuyennganh.Application.Response;
using chuyennganh.Domain.Enumerations;
using chuyennganh.Domain.ExceptionEx;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;

namespace chuyennganh.Domain
{
    public class FileService : IFileService
    {
        private readonly HttpClient httpClient;
        private readonly string assetServerUrl;

        public FileService(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            assetServerUrl = configuration["AssetsService:AssetServer"];

            var handler = new HttpClientHandler();
            handler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true;

            httpClient = new HttpClient(handler) { BaseAddress = new Uri(assetServerUrl) };
        }

        public async Task<string> UploadFile(string fileName, string base64String, AssetType type)
        {
            try
            {
                var requestContent = new
                {
                    FileName = fileName,
                    Content = GetBase64Data(base64String),
                    AssetType = (int)type
                };
                var jsonContent = new StringContent(JsonSerializer.Serialize(requestContent), Encoding.UTF8, "application/json");
                HttpResponseMessage response = await httpClient.PostAsync($"{assetServerUrl}/upload", jsonContent);

                if (!response.IsSuccessStatusCode)
                {
                    throw new ShopException(StatusCodes.Status400BadRequest, new List<string> { "Validate Fail" });
                }

                var result = await response.Content.ReadFromJsonAsync<ServiceResponse>();

                return result.Data;
            }
            catch (HttpRequestException)
            {         
                throw new ShopException(StatusCodes.Status500InternalServerError);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public string GetBase64Data(string base64String) => base64String.Split(",")[1];

        public string GetFileExtensionFromBase64(string base64String)
        {
            var mime = GetMimeTypeFromBase64(base64String);
            var mimeTypes = new Dictionary<string, string>
            {
                { "image/jpeg", ".jpg" },
                { "image/png", ".png" },
                { "image/gif", ".gif" },
                { "image/bmp", ".bmp" },
                { "image/webp", ".webp" },
            };
            if (mimeTypes.ContainsKey(mime)) return mimeTypes[mime];
            return string.Empty;
        }

        private string GetMimeTypeFromBase64(string base64String)
        {
            if (base64String.Contains(","))
            {
                var mimeType = base64String.Split(',')[0];
                mimeType = mimeType.Split(':')[1].Split(';')[0];
                return mimeType;
            }

            return null;
        }
    }
}