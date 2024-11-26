# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081
EXPOSE 443

# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/solution items/chuyennganh.Api/chuyennganh.Api.csproj", "src/solution items/chuyennganh.Api/"]
COPY ["src/solution items/chuyennganh.Application/chuyennganh.Application.csproj", "src/solution items/chuyennganh.Application/"]
COPY ["src/solution items/chuyennganh.Domain/chuyennganh.Domain.csproj", "src/solution items/chuyennganh.Domain/"]
COPY ["src/solution items/chuyennganh.Infrasture/chuyennganh.Infrasture.csproj", "src/solution items/chuyennganh.Infrasture/"]
RUN dotnet restore "./src/NhaThuoc.WebApi/NhaThuoc.WebApi.csproj"
COPY . .
WORKDIR "src/solution items/chuyennganh.Api"
RUN dotnet build "./chuyennganh.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./chuyennganh.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
RUN apk add --no-cache icu-libs
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "chuyennganh.Api.dll"]