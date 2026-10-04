import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Không được phép." }, { status: 401 });
  }

  // Lấy couple kèm theo danh sách những ngày đáng nhớ (memories)
  const couple = await prisma.couple.findUnique({
    where: { slug: "main" },
    include: {
      memories: {
        orderBy: { memoryDate: "asc" },
      },
    },
  });

  return NextResponse.json(couple);
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Không được phép." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const person1Name = String(body.person1Name ?? "").trim();
  const person2Name = String(body.person2Name ?? "").trim();
  const startDate = new Date(String(body.startDate ?? ""));

  if (!person1Name || !person2Name || Number.isNaN(startDate.getTime())) {
    return NextResponse.json(
      { error: "Vui lòng nhập đầy đủ tên hai người và ngày bắt đầu hợp lệ." },
      { status: 400 }
    );
  }

  // Chuẩn hóa mảng memories truyền từ client lên
  const rawMemories = Array.isArray(body.memories) ? body.memories : [];
  const validMemories = rawMemories
    .map((m: any) => {
      const title = String(m?.title ?? "").trim();
      const content = String(m?.content ?? "").trim();
      const mDate = new Date(String(m?.memoryDate ?? ""));
      if (!title || !content || Number.isNaN(mDate.getTime())) return null;

      return {
        title,
        content,
        memoryDate: mDate,
        location: String(m?.location ?? "").trim() || null,
        coverImage: String(m?.coverImage ?? "").trim() || null,
      };
    })
    .filter(Boolean) as Array<{
      title: string;
      content: string;
      memoryDate: Date;
      location: string | null;
      coverImage: string | null;
    }>;

  // Cập nhật hoặc tạo mới Couple cùng danh sách memories
  const couple = await prisma.couple.upsert({
    where: { slug: "main" },
    update: {
      person1Name,
      person2Name,
      startDate,
      description: String(body.description ?? "").trim() || null,
      coverImage: String(body.coverImage ?? "").trim() || null,
      heroTitle: String(body.heroTitle ?? "").trim() || "Kỷ niệm của chúng ta.",
      heroSubtitle:
        String(body.heroSubtitle ?? "").trim() ||
        "Một nơi nhỏ để lưu giữ những ngày đã đi qua.",
      quote:
        String(body.quote ?? "").trim() ||
        "Có những người bước vào cuộc đời mình rất nhẹ nhàng, nhưng lại để lại cả một câu chuyện.",
      memories: {
        deleteMany: {}, // Xóa danh sách mốc cũ để làm mới
        create: validMemories, // Tạo mới lại danh sách mốc từ form
      },
    },
    create: {
      slug: "main",
      person1Name,
      person2Name,
      startDate,
      description: String(body.description ?? "").trim() || null,
      coverImage: String(body.coverImage ?? "").trim() || null,
      heroTitle: String(body.heroTitle ?? "").trim() || "Kỷ niệm của chúng ta.",
      heroSubtitle:
        String(body.heroSubtitle ?? "").trim() ||
        "Một nơi nhỏ để lưu giữ những ngày đã đi qua.",
      quote:
        String(body.quote ?? "").trim() ||
        "Có những người bước vào cuộc đời mình rất nhẹ nhàng, nhưng lại để lại cả một câu chuyện.",
      memories: {
        create: validMemories,
      },
    },
    include: {
      memories: {
        orderBy: { memoryDate: "asc" },
      },
    },
  });

  return NextResponse.json(couple);
}