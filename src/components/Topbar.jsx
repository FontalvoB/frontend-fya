import { useNavigate } from "react-router-dom";
import logo from "../img/logo_oficial.png"; // ruta: src/img/logo_oficial.png

export default function Topbar() {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem("token"); navigate("/login"); };

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-black/25 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Fya Créditos" className="h-8 md:h-9 w-auto select-none" draggable="false" />
          <span className="sr-only">Fya Créditos</span>
          <div className="hidden sm:block leading-tight">
            <div className="text-white/60 text-xs">Plataforma de gestión de créditos</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="badge">Versión 1.0</span>
          <button onClick={logout} className="btn-ghost">Salir</button>
        </div>
      </div>
    </header>
  );
}