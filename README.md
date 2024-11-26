# RESTful API và Kiến Trúc Clean Architecture với .NET Core để Xây Dựng Module Backend cho Website Bán Đồ Thời Trang

## Tổng Quan Dự Án

Đề tài này tập trung vào việc sử dụng **RESTful API** và **kiến trúc Clean Architecture** với **.NET Core** để xây dựng module backend cho một website bán đồ thời trang. Mục tiêu chính là tạo ra một hệ thống backend linh hoạt, có khả năng mở rộng và dễ bảo trì để quản lý sản phẩm, đơn hàng và người dùng. Bằng cách sử dụng RESTful API, chúng tôi đảm bảo việc giao tiếp giữa các thành phần được liền mạch, và nhờ áp dụng Clean Architecture, hệ thống sẽ luôn duy trì tính mô-đun và dễ dàng thay đổi.

## Cấu Trúc Dự Án

Hệ thống backend tuân theo các nguyên tắc của **Clean Architecture**, chia ứng dụng thành nhiều tầng với trách nhiệm rõ ràng, giúp giảm thiểu sự phụ thuộc giữa các thành phần và tăng cường tính bảo trì. Cấu trúc của hệ thống bao gồm:

- **Domain Layer**: Chứa logic nghiệp vụ cốt lõi và các thực thể (entity).
- **Application Layer**: Quản lý các use case, bao gồm các lệnh (commands) và truy vấn (queries), sử dụng **MediatR** để áp dụng mẫu Command Query Responsibility Segregation (CQRS).
- **Infrastructure Layer**: Cung cấp truy cập dữ liệu sử dụng **Entity Framework Core (EF Core)** và tích hợp với các dịch vụ bên ngoài.
- **Presentation Layer (API)**: Cung cấp các endpoint RESTful để thực hiện các thao tác CRUD cho sản phẩm, đơn hàng và người dùng.

## Công Nghệ Sử Dụng

- **.NET Core**: Nền tảng phát triển đa nền tảng được sử dụng để tạo các API web hiệu suất cao.
- **Entity Framework Core (EF Core)**: Một Object-Relational Mapper (ORM) giúp đơn giản hóa việc thao tác với cơ sở dữ liệu bằng cách ánh xạ các bảng trong cơ sở dữ liệu thành các đối tượng trong mã nguồn.
- **MediatR**: Thư viện được sử dụng để triển khai mẫu CQRS, đảm bảo việc tách biệt giữa các lệnh và truy vấn để tăng cường tính linh hoạt.
- **RESTful API**: Cung cấp quyền truy cập vào chức năng của backend thông qua các phương thức HTTP như GET, POST, PUT, và DELETE.

## Tính Năng Chính

1. **Quản Lý Sản Phẩm**: Các endpoint RESTful để tạo, cập nhật, xóa và xem thông tin sản phẩm, hỗ trợ quản lý danh mục sản phẩm cho cửa hàng thời trang.
2. **Quản Lý Đơn Hàng**: Cho phép thực hiện các thao tác CRUD để quản lý đơn hàng của khách hàng, đảm bảo khả năng xử lý, cập nhật và theo dõi đơn hàng.
3. **Quản Lý Người Dùng**: Quản lý tài khoản người dùng, bao gồm đăng ký, xác thực và quản lý hồ sơ cá nhân.
4. **Kiến Trúc Clean Architecture**: Đảm bảo mỗi module trong hệ thống hoạt động độc lập, giúp tăng cường khả năng kiểm thử, bảo trì và mở rộng.

## Nguyên Tắc Kiến Trúc

### Kiến Trúc Clean
- **Domain Layer**: Định nghĩa các thực thể và quy tắc nghiệp vụ cốt lõi, độc lập với các lớp khác.
- **Application Layer**: Quản lý các use case và luồng công việc, xử lý lệnh và truy vấn mà không cần biết chi tiết về giao diện người dùng hoặc hạ tầng.
- **Infrastructure Layer**: Triển khai các repository sử dụng EF Core, cung cấp truy cập vào dữ liệu lưu trữ.
- **Presentation Layer**: Cung cấp giao diện hệ thống cho các client bên ngoài thông qua giao diện RESTful.

### Thiết Kế RESTful API
API tuân theo các nguyên tắc REST tiêu chuẩn để tạo điều kiện cho việc giao tiếp giữa các phần của hệ thống và với các ứng dụng client. Các endpoint bao gồm:

- **/products**: Xử lý các thao tác với sản phẩm (GET, POST, PUT, DELETE).
- **/orders**: Quản lý đơn hàng của khách hàng (GET, POST, PUT, DELETE).
- **/users**: Quản lý người dùng, đăng ký và xác thực (GET, POST, PUT, DELETE).

## Hướng Dẫn Cài Đặt

1. **Yêu Cầu Hệ Thống**:
   - **.NET SDK** phiên bản 6 trở lên.
   - **SQL Server** hoặc bất kỳ cơ sở dữ liệu hỗ trợ bởi **Entity Framework Core**.
   - Công cụ quản lý mã nguồn như **Git**.

2. **Cài Đặt và Chạy Ứng Dụng**:
   - Clone repository về máy của bạn:
     ```sh
     git clone <repository-url>
     ```
   - Điều hướng vào thư mục của dự án và khôi phục các package:
     ```sh
     cd FashionBackend
     dotnet restore
     ```
   - Cập nhật chuỗi kết nối cơ sở dữ liệu trong file `appsettings.json`.
   - Chạy lệnh migrate để tạo cơ sở dữ liệu:
     ```sh
     dotnet ef database update
     ```
   - Chạy ứng dụng:
     ```sh
     dotnet run
     ```



