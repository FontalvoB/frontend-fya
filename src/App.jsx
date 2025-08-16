import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "./components/Topbar.jsx";
import CreditForm from "./components/CreditForm.jsx";
import CreditsTable from "./components/CreditsTable.jsx";

export default function App() {
  const [refreshFlag, setRefreshFlag] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  return (
    <main>
      <Topbar />
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <CreditForm onCreated={() => setRefreshFlag(v => v+1)} />
        <CreditsTable refreshFlag={refreshFlag} />
      </div>
      <footer className="text-center text-white/70 text-xs py-6">Hecho con ♥ para Fya Social Capital</footer>
    </main>
  );
}
