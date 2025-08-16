import { useState } from "react";
import { loginUser, registerUser } from "../lib/api";

export default function Auth() {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const submit = async e => {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      const payload = mode === "register" ? form : { email: form.email, password: form.password };
      const res = mode === "register" ? await registerUser(payload) : await loginUser(payload);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      window.location.href = "/"; // al dashboard
    } catch (e2) {
      setErr(e2?.response?.data?.error || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700">
      <form onSubmit={submit} className="card p-8 w-full max-w-md text-white space-y-4">
        <h1 className="text-2xl font-semibold">{mode === "register" ? "Crear cuenta" : "Iniciar sesión"}</h1>

        {mode === "register" && (
          <div>
            <label className="label">Nombre</label>
            <input className="input" value={form.name} onChange={e=>update("name", e.target.value)} minLength={3} required />
          </div>
        )}

        <div>
          <label className="label">Email</label>
          <input className="input" type="email" value={form.email} onChange={e=>update("email", e.target.value)} required />
        </div>

        <div>
          <label className="label">Contraseña</label>
          <input className="input" type="password" value={form.password} onChange={e=>update("password", e.target.value)} minLength={6} required />
        </div>

        {err && <p className="text-red-200 text-sm">{typeof err === "string" ? err : "Error"}</p>}

        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Procesando…" : (mode === "register" ? "Registrarme" : "Entrar")}
        </button>

        
      </form>
    </div>
  );
}
