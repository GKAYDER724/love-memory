import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import AdminCoupleForm from "@/components/AdminCoupleForm";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  // Query thêm relation memories để truyền đầy đủ các mốc kỷ niệm cho Form
  const couple = await prisma.couple.findUnique({
    where: { slug: "main" },
    include: {
      memories: {
        orderBy: { memoryDate: "asc" },
      },
    },
  });

  return (
    <main className="admin-page">
      <div className="admin-wrap">
        <header className="admin-header">
          <div>
            <div className="admin-eyebrow">OUR STORY · ADMIN</div>
            <h1>Quản trị kỷ niệm</h1>
            <p>Chỉnh sửa nội dung hiển thị trên trang chính.</p>
          </div>
          <a href="/" className="admin-outline-button">Xem website ↗</a>
        </header>
        <AdminCoupleForm couple={couple} />
      </div>
    </main>
  );
}