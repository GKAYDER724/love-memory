"use client";

import { FormEvent, useState, ChangeEvent } from "react";

type Memory = {
	id?: string;
	title: string;
	content: string;
	memoryDate: string;
	location?: string | null;
	coverImage?: string | null;
};

type Couple = {
	person1Name: string;
	person2Name: string;
	startDate: string | Date;
	description: string | null;
	coverImage: string | null;
	heroTitle: string;
	heroSubtitle: string;
	quote: string;
	memories?: Array<{
		id: string;
		title: string;
		content: string;
		memoryDate: string | Date;
		location: string | null;
		coverImage: string | null;
	}>;
} | null;

function dateInputValue(value?: string | Date | null) {
	if (!value) return "2024-10-04";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "2024-10-04";
	return date.toISOString().slice(0, 10);
}

export default function AdminCoupleForm({ couple }: { couple: Couple }) {
	const [form, setForm] = useState({
		person1Name: couple?.person1Name ?? "Người thứ nhất",
		person2Name: couple?.person2Name ?? "Người thứ hai",
		startDate: dateInputValue(couple?.startDate),
		description: couple?.description ?? "",
		coverImage: couple?.coverImage ?? "",
		heroTitle: couple?.heroTitle ?? "Kỷ niệm của chúng ta.",
		heroSubtitle:
			couple?.heroSubtitle ?? "Một nơi nhỏ để lưu giữ những ngày đã đi qua.",
		quote:
			couple?.quote ??
			"Có những người bước vào cuộc đời mình rất nhẹ nhàng, nhưng lại để lại cả một câu chuyện.",
	});

	const [memories, setMemories] = useState<Memory[]>(
		couple?.memories?.map((m) => ({
			id: m.id,
			title: m.title,
			content: m.content,
			memoryDate: dateInputValue(m.memoryDate),
			location: m.location ?? "",
			coverImage: m.coverImage ?? "",
		})) ?? [],
	);

	const [status, setStatus] = useState("");
	const [saving, setSaving] = useState(false);
	const [uploadingIndex, setUploadingIndex] = useState<number | "main" | null>(
		null,
	);

	function updateForm(field: keyof typeof form, value: string) {
		setForm((current) => ({ ...current, [field]: value }));
	}

	function updateMemory(index: number, field: keyof Memory, value: string) {
		setMemories((current) => {
			const updated = [...current];
			updated[index] = { ...updated[index], [field]: value };
			return updated;
		});
	}

	// Hàm upload file ảnh lên Cloudinary qua API
	async function handleFileUpload(file: File, target: "main" | number) {
		setUploadingIndex(target);
		const formData = new FormData();
		formData.append("file", file);

		try {
			const res = await fetch("/api/admin/upload", {
				method: "POST",
				body: formData,
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Lỗi upload");

			if (target === "main") {
				updateForm("coverImage", data.url);
			} else {
				updateMemory(target, "coverImage", data.url);
			}
		} catch (err: any) {
			alert(err.message || "Tải ảnh thất bại");
		} finally {
			setUploadingIndex(null);
		}
	}

	function addMemory() {
		setMemories((current) => [
			...current,
			{
				title: "",
				memoryDate: dateInputValue(new Date()),
				content: "",
				location: "",
				coverImage: "",
			},
		]);
	}

	function removeMemory(index: number) {
		setMemories((current) => current.filter((_, i) => i !== index));
	}

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSaving(true);
		setStatus("");

		const response = await fetch("/api/admin/couple", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...form, memories }),
		});
		const data = await response.json().catch(() => ({}));

		setSaving(false);
		if (!response.ok) {
			setStatus(data.error || "Không thể lưu dữ liệu.");
			return;
		}

		setStatus("✓ Đã lưu thay đổi thành công.");
	}

	return (
		<form className="admin-card admin-form" onSubmit={submit}>
			{/* KHỐI 01: THÔNG TIN CẶP ĐÔI */}
			<div className="admin-card-title">
				<div>
					<span>01</span>
					<h2>Thông tin hai người</h2>
				</div>
				<span className="saved-badge">Cloudinary Enabled</span>
			</div>

			<div className="admin-grid two-columns">
				<label>
					Tên người thứ nhất
					<input
						value={form.person1Name}
						onChange={(e) => updateForm("person1Name", e.target.value)}
					/>
				</label>
				<label>
					Tên người thứ hai
					<input
						value={form.person2Name}
						onChange={(e) => updateForm("person2Name", e.target.value)}
					/>
				</label>
			</div>

			<div className="admin-grid two-columns">
				<label>
					Ngày bắt đầu quen nhau
					<input
						type="date"
						value={form.startDate}
						onChange={(e) => updateForm("startDate", e.target.value)}
					/>
				</label>

				{/* Upload Ảnh bìa chính */}
				<label>
					Ảnh bìa chính
					<input
						type="file"
						accept="image/*"
						onChange={(e: ChangeEvent<HTMLInputElement>) => {
							if (e.target.files?.[0])
								handleFileUpload(e.target.files[0], "main");
						}}
					/>
					{uploadingIndex === "main" && (
						<span style={{ fontSize: "0.8rem", color: "#f43f5e" }}>
							Đang tải ảnh lên Cloudinary...
						</span>
					)}
					{form.coverImage && (
						<img
							src={form.coverImage}
							alt="Cover Preview"
							style={{
								width: "80px",
								height: "50px",
								objectFit: "cover",
								borderRadius: "4px",
								marginTop: "4px",
							}}
						/>
					)}
				</label>
			</div>

			<label>
				Mô tả câu chuyện
				<textarea
					rows={4}
					value={form.description}
					onChange={(e) => updateForm("description", e.target.value)}
				/>
			</label>

			{/* KHỐI 02: NHỮNG NGÀY ĐÁNG NHỚ */}
			<div className="admin-card-title second">
				<div>
					<span>02</span>
					<h2>Những ngày đáng nhớ</h2>
				</div>
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
				{memories.map((mem, index) => (
					<div
						key={index}
						style={{
							padding: "1.25rem",
							border: "1px solid rgba(255, 255, 255, 0.1)",
							borderRadius: "10px",
							backgroundColor: "rgba(255, 255, 255, 0.02)",
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "0.75rem",
							}}
						>
							<span
								style={{
									fontWeight: 600,
									fontSize: "0.9rem",
									color: "var(--accent, #f43f5e)",
								}}
							>
								Mốc kỷ niệm #{index + 1}
							</span>
							<button
								type="button"
								onClick={() => removeMemory(index)}
								style={{
									background: "transparent",
									border: "none",
									color: "#ef4444",
									cursor: "pointer",
								}}
							>
								✕ Xóa
							</button>
						</div>

						<div className="admin-grid two-columns">
							<label>
								Tiêu đề mốc
								<input
									required
									value={mem.title}
									onChange={(e) => updateMemory(index, "title", e.target.value)}
								/>
							</label>
							<label>
								Ngày mốc kỷ niệm
								<input
									type="date"
									required
									value={mem.memoryDate}
									onChange={(e) =>
										updateMemory(index, "memoryDate", e.target.value)
									}
								/>
							</label>
						</div>

						<div
							className="admin-grid two-columns"
							style={{ marginTop: "0.5rem" }}
						>
							{/* Upload file ảnh cho từng mốc */}
							<label>
								Chọn ảnh mốc kỷ niệm
								<input
									type="file"
									accept="image/*"
									onChange={(e: ChangeEvent<HTMLInputElement>) => {
										if (e.target.files?.[0])
											handleFileUpload(e.target.files[0], index);
									}}
								/>
								{uploadingIndex === index && (
									<span style={{ fontSize: "0.8rem", color: "#f43f5e" }}>
										Đang tải lên Cloudinary...
									</span>
								)}
							</label>

							<label>
								Địa điểm (Tùy chọn)
								<input
									value={mem.location || ""}
									onChange={(e) =>
										updateMemory(index, "location", e.target.value)
									}
								/>
							</label>
						</div>

						{/* Preview ảnh mốc sau khi upload */}
						{mem.coverImage && (
							<div
								style={{
									marginTop: "0.75rem",
									display: "flex",
									alignItems: "center",
									gap: "10px",
								}}
							>
								<img
									src={mem.coverImage}
									alt="Preview"
									style={{
										width: "60px",
										height: "60px",
										objectFit: "cover",
										borderRadius: "6px",
									}}
								/>
								<span style={{ fontSize: "0.8rem", color: "#10b981" }}>
									✓ Đã lưu trên Cloudinary
								</span>
							</div>
						)}

						<label style={{ marginTop: "0.5rem" }}>
							Nội dung mốc
							<textarea
								rows={2}
								required
								value={mem.content}
								onChange={(e) => updateMemory(index, "content", e.target.value)}
							/>
						</label>
					</div>
				))}

				<button
					type="button"
					onClick={addMemory}
					className="admin-outline-button"
					style={{
						width: "100%",
						justifyContent: "center",
						borderStyle: "dashed",
					}}
				>
					+ Thêm mốc kỷ niệm mới
				</button>
			</div>

			{/* KHỐI 03: NỘI DUNG TRANG CHỦ */}
			<div className="admin-card-title second">
				<div>
					<span>03</span>
					<h2>Nội dung trang chủ</h2>
				</div>
			</div>

			<label>
				Tiêu đề lớn
				<input
					value={form.heroTitle}
					onChange={(e) => updateForm("heroTitle", e.target.value)}
				/>
			</label>
			<label>
				Lời giới thiệu
				<input
					value={form.heroSubtitle}
					onChange={(e) => updateForm("heroSubtitle", e.target.value)}
				/>
			</label>
			<label>
				Câu quote cuối trang
				<textarea
					rows={3}
					value={form.quote}
					onChange={(e) => updateForm("quote", e.target.value)}
				/>
			</label>

			<div className="admin-actions">
				<a href="/" className="admin-outline-button">
					Hủy / xem trang
				</a>
				<button
					className="admin-button"
					disabled={saving || uploadingIndex !== null}
				>
					{saving ? "Đang lưu…" : "💾 Lưu toàn bộ thay đổi"}
				</button>
			</div>
			{status && (
				<div className={status.startsWith("✓") ? "form-success" : "form-error"}>
					{status}
				</div>
			)}
		</form>
	);
}
