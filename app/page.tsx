import Countdown from "@/components/Countdown";
import { prisma } from "@/lib/prisma";

export const revalidate = 0; // Đảm bảo luôn load dữ liệu mới nhất từ DB

type MemoryItem = {
	id?: string;
	title: string;
	content: string;
	memoryDate: Date | string;
	location?: string | null;
	coverImage?: string | null;
};

const fallback = {
	person1Name: "Người thứ nhất",
	person2Name: "Người thứ hai",
	startDate: new Date("2024-10-04T00:00:00+07:00"),
	description:
		"Một nơi nhỏ để lưu giữ những ngày đã đi qua, những khoảnh khắc không muốn quên và câu chuyện vẫn đang được viết tiếp.",
	coverImage: "",
	heroTitle: "Kỷ niệm của chúng ta.",
	heroSubtitle:
		"Một nơi nhỏ để lưu giữ những ngày đã đi qua, những khoảnh khắc không muốn quên và câu chuyện vẫn đang được viết tiếp.",
	quote:
		"Có những người bước vào cuộc đời mình rất nhẹ nhàng, nhưng lại để lại cả một câu chuyện.",
	memories: [
		{
			id: "1",
			memoryDate: new Date("2024-10-04"),
			title: "Ngày đầu tiên",
			content:
				"Một ngày tưởng như bình thường, nhưng lại trở thành điểm bắt đầu cho một câu chuyện rất riêng.",
			coverImage: null,
		},
		{
			id: "2",
			memoryDate: new Date("2025-02-14"),
			title: "Valentine đầu tiên",
			content:
				"Không cần một điều gì quá lớn lao. Chỉ cần có nhau trong một ngày đặc biệt.",
			coverImage: null,
		},
		{
			id: "3",
			memoryDate: new Date("2026-10-04"),
			title: "Vẫn đang viết tiếp",
			content: "Những kỷ niệm đẹp nhất có lẽ vẫn còn ở phía trước.",
			coverImage: null,
		},
	],
};

async function getCouple() {
	if (!process.env.DATABASE_URL) return fallback;
	try {
		const couple = await prisma.couple.findUnique({
			where: { slug: "main" },
			include: {
				memories: {
					orderBy: { memoryDate: "asc" },
				},
			},
		});
		return couple ?? fallback;
	} catch {
		return fallback;
	}
}

function formatDate(dateInput: Date | string) {
	const date = new Date(dateInput);
	if (Number.isNaN(date.getTime())) return "";
	return new Intl.DateTimeFormat("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(date);
}

export default async function Home() {
	const couple = await getCouple();
	const startDate = new Date(couple.startDate);
	const displayMemories: MemoryItem[] =
		couple.memories && couple.memories.length > 0
			? couple.memories
			: fallback.memories;

	return (
		<main className="site-shell">
			<nav className="nav">
				<a className="logo" href="#top">
					Our Story
				</a>
				<div className="nav-links">
					<a href="#journey">Hành trình</a>
					<a href="#time">Thời gian</a>
					<a href="#letter">Lời nhắn</a>
					<a href="/admin/login">Quản trị</a>
				</div>
			</nav>

			<section
				className="hero"
				id="top"
				style={
					couple.coverImage
						? {
								backgroundImage: `linear-gradient(rgba(11,8,16,.68), rgba(11,8,16,.8)), url(${couple.coverImage})`,
							}
						: undefined
				}
			>
				<div className="hero-content">
					<div className="eyebrow">
						{couple.person1Name} · {couple.person2Name}
					</div>
					<h1>{couple.heroTitle}</h1>
					<p>{couple.heroSubtitle}</p>
					<a className="cta" href="#journey">
						Bắt đầu câu chuyện ↓
					</a>
				</div>
			</section>

			<section className="section" id="time">
				<div className="section-head">
					<small>Since {formatDate(startDate)}</small>
					<h2>Chúng ta đã bên nhau</h2>
					<p>{couple.description}</p>
				</div>
				<Countdown startDate={startDate.toISOString()} />
			</section>

			<section className="section" id="journey">
				<div className="section-head">
					<small>Our journey</small>
					<h2>Những ngày đáng nhớ</h2>
					<p>Mỗi dấu mốc là một mảnh nhỏ của câu chuyện.</p>
				</div>

				<div className="timeline">
					{displayMemories.map((memory, index) => (
						<article className="timeline-item" key={memory.id || index}>
							<span className="timeline-dot" />
							<div className="timeline-date">
								{formatDate(memory.memoryDate)}
							</div>
							<h3>{memory.title}</h3>

							{/* Hiển thị hình ảnh Cloudinary của mốc kỷ niệm nếu có */}
							{memory.coverImage && (
								<div
									className="timeline-media"
									style={{
										marginTop: "0.75rem",
										marginBottom: "0.75rem",
										overflow: "hidden",
										borderRadius: "12px",
									}}
								>
									<img
										src={memory.coverImage}
										alt={memory.title}
										style={{
											width: "100%",
											maxHeight: "360px",
											objectFit: "cover",
											display: "block",
											borderRadius: "12px",
										}}
									/>
								</div>
							)}

							<p>{memory.content}</p>
						</article>
					))}
				</div>
			</section>

			<section className="quote" id="letter">
				<blockquote>“{couple.quote}”</blockquote>
				<cite>
					— {couple.person1Name} & {couple.person2Name}
				</cite>
			</section>

			<footer className="footer">Made with ♥ for a story worth keeping.</footer>
		</main>
	);
}
