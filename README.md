# Love Memory — Kỷ niệm bên nhau

Next.js + TypeScript + Prisma + PostgreSQL.

## Chạy local

```bash
npm install
npx prisma generate
npm run dev
```

Mở http://localhost:3000

## Cấu hình database

Tạo `.env.local` từ `.env.example` và điền `DATABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_SECRET`.

Sau đó chạy:

```bash
npx prisma db push
npx prisma generate
npm run dev
```

## Trang quản trị

Mở http://localhost:3000/admin/login

Đăng nhập bằng `ADMIN_PASSWORD` trong `.env.local`.

Trang quản trị hiện cho phép chỉnh sửa:

- Tên hai người
- Ngày bắt đầu
- Mô tả
- Ảnh bìa bằng URL
- Tiêu đề trang chủ
- Lời giới thiệu
- Câu quote

Dữ liệu được lưu trong PostgreSQL thông qua Prisma.
