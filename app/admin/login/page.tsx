"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Đăng nhập thất bại.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="admin-page admin-login-page">
      <section className="admin-login-card">
        <div className="admin-eyebrow">OUR STORY · ADMIN</div>
        <h1>Đăng nhập quản trị</h1>
        <p>Quản lý thông tin của câu chuyện mà không cần sửa code.</p>
        <form onSubmit={submit} className="admin-form">
          <label>
            Mật khẩu quản trị
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Nhập mật khẩu"
              autoFocus
            />
          </label>
          {error && <div className="form-error">{error}</div>}
          <button className="admin-button" disabled={loading}>
            {loading ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>
        </form>
        <a className="back-link" href="/">← Về trang kỷ niệm</a>
      </section>
    </main>
  );
}
