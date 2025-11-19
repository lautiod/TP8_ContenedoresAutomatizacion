# ===== Build =====
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copio solo los csproj para aprovechar cache
COPY Backend/Backend/EmployeeCrudApi.csproj Backend/Backend/
RUN dotnet restore Backend/Backend/EmployeeCrudApi.csproj

# Copio el resto del código y compilo
COPY Backend/ Backend/
RUN dotnet publish Backend/Backend/EmployeeCrudApi.csproj -c Release -o /app/publish /p:UseAppHost=false

# ===== Runtime =====
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Puertos típicos
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# (Opcional) TZ para logs consistentes
ENV TZ=Etc/UTC

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "EmployeeCrudApi.dll"]

