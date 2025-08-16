import { useEffect, useMemo, useState } from "react";
import { listCredits } from "../lib/api";
import { money } from "../lib/format";

const PAGE_SIZE = 10;

export default function CreditsTable({ refreshFlag }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: "", id: "", agent: "" });
  const [sort, setSort] = useState({ by: "createdAt", order: "desc" });
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await listCredits({ sortBy: sort.by, order: sort.order });
      setRows(data);
      setLoading(false);
    })();
  }, [refreshFlag, sort]);

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (!filters.name ||
            r.customerName.toLowerCase().includes(filters.name.toLowerCase())) &&
          (!filters.id ||
            r.customerId.toLowerCase().includes(filters.id.toLowerCase())) &&
          (!filters.agent ||
            r.agent.toLowerCase().includes(filters.agent.toLowerCase()))
      ),
    [rows, filters]
  );

  
  useEffect(() => { setPage(1); }, [filters, sort]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

 
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const start = (page - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  const goto = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  return (
    <section className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-xl font-semibold">Créditos registrados</h2>
        <div className="flex items-center gap-2">
          <button
            className={`btn-ghost ${sort.by === "createdAt" ? "ring-2 ring-cyan-400/40" : ""}`}
            onClick={() => setSort((s) => ({ by: "createdAt", order: s.order }))}
            title="Ordenar por fecha"
          >
            Orden: Fecha
          </button>
          <button
            className={`btn-ghost ${sort.by === "amount" ? "ring-2 ring-cyan-400/40" : ""}`}
            onClick={() => setSort((s) => ({ by: "amount", order: s.order }))}
            title="Ordenar por valor"
          >
            Orden: Valor
          </button>
          <button
            className="btn-ghost"
            onClick={() =>
              setSort((s) => ({ ...s, order: s.order === "asc" ? "desc" : "asc" }))
            }
            title="Cambiar orden"
          >
            {sort.order === "asc" ? "Asc" : "Desc"}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <input
          className="input"
          placeholder="Filtrar por nombre"
          value={filters.name}
          onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
        />
        <input
          className="input"
          placeholder="Filtrar por cédula/ID"
          value={filters.id}
          onChange={(e) => setFilters((f) => ({ ...f, id: e.target.value }))}
        />
        <input
          className="input"
          placeholder="Filtrar por comercial"
          value={filters.agent}
          onChange={(e) => setFilters((f) => ({ ...f, agent: e.target.value }))}
        />
      </div>

      <div className="overflow-auto rounded-xl border border-white/10">
        <table className="table">
          <thead>
            <tr className="border-b border-white/10">
              <th className="th">Cliente</th>
              <th className="th">ID</th>
              <th className="th">Valor</th>
              <th className="th">Tasa</th>
              <th className="th">Plazo</th>
              <th className="th">Comercial</th>
              <th className="th">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i}>
                  <td className="td" colSpan="7"><div className="skel" /></td>
                </tr>
              ))
            ) : pageRows.length === 0 ? (
              <tr>
                <td className="td text-center text-white/60" colSpan="7">
                  No hay registros que coincidan con el filtro.
                </td>
              </tr>
            ) : (
              pageRows.map((r) => (
                <tr key={r.id} className="hover:bg-white/5">
                  <td className="td">{r.customerName}</td>
                  <td className="td">{r.customerId}</td>
                  <td className="td">{money(r.amount)}</td>
                  <td className="td">{(r.interestRate * 100).toFixed(2)}%</td>
                  <td className="td">{r.termMonths} m</td>
                  <td className="td">{r.agent}</td>
                  <td className="td">{new Date(r.createdAt).toLocaleString("es-CO")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

     
      <div className="flex items-center justify-between flex-wrap gap-3 pt-3">
        <div className="text-white/60 text-sm">
          {loading
            ? "Cargando…"
            : `Mostrando ${total ? start + 1 : 0}–${Math.min(start + PAGE_SIZE, total)} de ${total}`}
        </div>
        <div className="pager">
          <button className="btn-ghost" onClick={() => goto(1)} disabled={page === 1} aria-label="Primera página">«</button>
          <button className="btn-ghost" onClick={() => goto(page - 1)} disabled={page === 1} aria-label="Página anterior">‹</button>
          <span className="text-white/70 text-sm tabular-nums">{page} / {totalPages}</span>
          <button className="btn-ghost" onClick={() => goto(page + 1)} disabled={page === totalPages} aria-label="Página siguiente">›</button>
          <button className="btn-ghost" onClick={() => goto(totalPages)} disabled={page === totalPages} aria-label="Última página">»</button>
        </div>
      </div>
    </section>
  );
}
