export default function Topbar() {
  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };
  return (
    <header className="flex items-center justify-between p-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/20" />
        <h1 className="text-white text-2xl font-bold">Fya Créditos</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="badge">Versión 1.0</span>
        <button className="btn-ghost" onClick={onLogout}>Salir</button>
      </div>
    </header>
  );
}
