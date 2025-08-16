import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "./components/Topbar.jsx";
import CreditForm from "./components/CreditForm.jsx";
import CreditsTable from "./components/CreditsTable.jsx";

export default function App() {
  const [refreshFlag, setRefreshFlag] = useState(0);
  const navigate = useNavigate();

  useEffect(() => { if (!localStorage.getItem("token")) navigate("/login"); }, [navigate]);

  return (
    <main className="page-shell">
      {/* glows decorativos */}
      <div className="bg-glow -top-24 -left-24 w-[700px] h-[700px] bg-cyan-500/30 rounded-full" />
      <div className="bg-glow -bottom-24 -right-24 w-[700px] h-[700px] bg-emerald-500/25 rounded-full" />

      <Topbar />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <CreditForm onCreated={() => setRefreshFlag((v) => v + 1)} />
        <CreditsTable refreshFlag={refreshFlag} />
      </div>

      <footer className="text-center app-footer text-xs py-6">
        Fya Social Capital
      </footer>
    </main>
  );
}