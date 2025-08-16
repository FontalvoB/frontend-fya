import { useNavigate } from "react-router-dom";
import logo from "../img/logo_oficial.png";

export default function Topbar() {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem("token"); navigate("/login"); };

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-black/25 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <button
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => navigate("/")}
          title="Inicio"
        >
          <img src={logo} alt="Fya Créditos" className="h-8 md:h-9 w-auto" draggable="false" />
          <span className="sr-only">Fya Créditos</span>
          <div className="hidden sm:block leading-tight text-left">
            <div className="text-white/60 text-xs">Plataforma de gestión de créditos</div>
          </div>
        </button>

        <div className="flex items-center gap-3">
         
          <button onClick={logout} className="btn-ghost">Salir</button>
        </div>
      </div>
    </header>
  );
}
