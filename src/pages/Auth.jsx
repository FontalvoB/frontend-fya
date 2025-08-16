import { useState } from "react";
import { loginUser, registerUser } from "../lib/api";
import logo from "../img/logo_oficial.png"; // 👈 mismo logo que usas en Topbar

export default function Auth() {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));
  const switchMode = (m) => { setMode(m); setErr(null); };

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const payload =
        mode === "register"
          ? { name: form.name.trim(), email: form.email.trim(), password: form.password }
          : { email: form.email.trim(), password: form.password };

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
    <main className="min-h-screen relative grid place-items-center overflow-hidden">
     
      <div className="bg-glow -top-24 -left-24 w-[700px] h-[700px] bg-cyan-500/30 rounded-full" />
      <div className="bg-glow -bottom-24 -right-24 w-[700px] h-[700px] bg-emerald-500/25 rounded-full" />

      <form onSubmit={submit} className="card p-8 w-full max-w-md text-white space-y-5 relative z-10">
      
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Fya Créditos" className="h-8 w-auto select-none" draggable="false" />
            <div className="hidden sm:block leading-tight">
              <div className="text-white/60 text-xs">Plataforma de gestión de créditos</div>
            </div>
          </div>
         
        </div>

       
        <div className="flex items-center bg-white/5 p-1 rounded-full w-full">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`btn-ghost flex-1 ${mode === "login" ? "ring-2 ring-cyan-400/40 bg-white/10" : ""}`}
            aria-pressed={mode === "login"}
          >
            Iniciar sesión
          </button>
          
        </div>

      
        <h1 className="text-xl font-semibold">
          {mode === "register" ? "Crea tu cuenta" : "Bienvenido de nuevo"}
        </h1>

      
        {mode === "register" && (
          <div>
            <label htmlFor="name" className="label">Nombre</label>
            <input
              id="name"
              className="input"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              minLength={3}
              required
              autoComplete="name"
              autoFocus
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="label">Email</label>
          <input
            id="email"
            className="input"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
            autoComplete="email"
            autoFocus={mode === "login"}
          />
        </div>

        <div>
          <label htmlFor="password" className="label">Contraseña</label>
          <input
            id="password"
            className="input"
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            minLength={6}
            required
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </div>

      
        {err && (
          <p className="text-red-200 text-sm" role="status" aria-live="polite">
            {typeof err === "string" ? err : "Error"}
          </p>
        )}

      
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Procesando…" : mode === "register" ? "Registrarme" : "Entrar"}
        </button>

      
        <p className="text-white/60 text-sm text-center">
          {mode === "login" ? (
            <>
             
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <button type="button" className="btn-ghost inline-block px-2 py-1" onClick={() => switchMode("login")}>
                Iniciar sesión
              </button>
            </>
          )}
        </p>
      </form>
    </main>
  );
}
