import { useState } from "react";
import { createCredit } from "../lib/api";
import { money } from "../lib/format";

const MAX_AMOUNT = 999999999999n;

export default function CreditForm({ onCreated }) {
  const [form, setForm] = useState({
    customerName: "",
    customerId: "",
    amount: "",
    interestRate: 0.02,
    termMonths: 12,
    agent: ""
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [errors, setErrors] = useState({ amount: null, customerId: null });

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const onAmountChange = (e) => {
    const raw = e.target.value; const digitsOnly = raw.replace(/\D/g, "");
    let amountError = null;
    try {
      const bi = BigInt(digitsOnly || "0");
      if (bi === 0n) amountError = "El valor del crédito debe ser mayor a 0.";
      else if (bi > MAX_AMOUNT) amountError = `El valor supera el límite permitido (${money(Number(MAX_AMOUNT))}).`;
    } catch { amountError = "Valor inválido."; }
    update("amount", digitsOnly); setErrors((s) => ({ ...s, amount: amountError }));
  };

  const onCustomerIdChange = (e) => {
    const raw = e.target.value; const digitsOnly = raw.replace(/\D/g, "");
    let idError = null; if (digitsOnly && digitsOnly.length < 5) idError = "La cédula debe tener al menos 5 dígitos.";
    update("customerId", digitsOnly); setErrors((s) => ({ ...s, customerId: idError }));
  };

  const submit = async (e) => {
    e.preventDefault(); setMsg(null);
    if (!form.customerName || !form.customerId || !form.amount || !form.agent) { setMsg({ type: "error", text: "Por favor completa los campos obligatorios." }); return; }
    if (!/^\d{5,}$/.test(form.customerId)) { setMsg({ type: "error", text: "La cédula debe contener solo números y al menos 5 dígitos." }); return; }
    const amountDigits = String(form.amount).replace(/\D/g, "");
    let amountBI; try { amountBI = BigInt(amountDigits || "0"); } catch { setMsg({ type: "error", text: "Valor del crédito inválido." }); return; }
    if (amountBI === 0n) { setMsg({ type: "error", text: "El valor del crédito debe ser mayor a 0." }); return; }
    if (amountBI > MAX_AMOUNT) { setMsg({ type: "error", text: `El valor del crédito excede el máximo permitido (${money(Number(MAX_AMOUNT))}).` }); return; }
    if (errors.amount || errors.customerId) { setMsg({ type: "error", text: errors.amount || errors.customerId }); return; }

    const amount = Number(amountBI);
    setLoading(true);
    try {
      const created = await createCredit({
        customerName: form.customerName.trim(),
        customerId: form.customerId.trim(),
        amount,
        interestRate: Number(form.interestRate),
        termMonths: Number(form.termMonths),
        agent: form.agent.trim()
      });
      setMsg({ type: "ok", text: `Crédito registrado para ${created.customerName}. Se envió notificación.` });
      setForm({ customerName: "", customerId: "", amount: "", interestRate: 0.02, termMonths: 12, agent: "" });
      setErrors({ amount: null, customerId: null });
      onCreated?.(created);
    } catch {
      setMsg({ type: "error", text: "No se pudo registrar el crédito. Intenta nuevamente." });
    } finally { setLoading(false); }
  };

  return (
    <form className="card p-6 space-y-5" onSubmit={submit}>
      <div className="flex items-center justify-between">
        <h2 className="text-white text-xl font-semibold">Registrar crédito</h2>
        <span className="badge">Asíncrono</span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="label">Nombre del cliente*</label>
          <input className="input" value={form.customerName} onChange={(e) => update("customerName", e.target.value)} placeholder="Ej: Pepito Perez" />
        </div>

        <div>
          <label className="label">Cédula o ID*</label>
          <input className="input" inputMode="numeric" pattern="[0-9]*" value={form.customerId} onChange={onCustomerIdChange} placeholder="Ej: 123456789" aria-invalid={!!errors.customerId} aria-describedby="customerId-error" />
          {errors.customerId && <p id="customerId-error" className="text-red-200 text-xs mt-1">{errors.customerId}</p>}
        </div>

        <div>
          <label className="label">Valor del crédito (COP)*</label>
          <div className="input-wrap">
            <span className="prefix">COP</span>
            <input className="input" inputMode="numeric" value={form.amount} onChange={onAmountChange} placeholder="Ej: 7800000" aria-invalid={!!errors.amount} aria-describedby="amount-error" />
          </div>
          {form.amount && <p className="text-white/70 text-xs mt-1">{money(form.amount)}</p>}
          {errors.amount && <p id="amount-error" className="text-red-200 text-xs mt-1">{errors.amount}</p>}
        </div>

        <div>
          <label className="label">Tasa de interés (decimal)</label>
          <input className="input" type="number" step="0.01" value={form.interestRate} onChange={(e) => update("interestRate", e.target.value)} />
        </div>

        <div>
          <label className="label">Plazo (meses)</label>
          <input className="input" type="number" value={form.termMonths} onChange={(e) => update("termMonths", e.target.value)} />
        </div>

        <div>
          <label className="label">Comercial*</label>
          <input className="input" value={form.agent} onChange={(e) => update("agent", e.target.value)} placeholder="Ej: Comercial 1" />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button className="btn btn-primary" disabled={loading || !!errors.amount || !!errors.customerId}>
          {loading ? "Registrando…" : "Registrar"}
        </button>
        <button type="button" className="btn-ghost" onClick={() => {
          setForm({ customerName: "", customerId: "", amount: "", interestRate: 0.02, termMonths: 12, agent: "" });
          setErrors({ amount: null, customerId: null }); setMsg(null);
        }}>Limpiar</button>
      </div>

      {msg && <div className={`mt-2 text-sm ${msg.type === "ok" ? "msg-ok" : "msg-err"}`}>{msg.text}</div>}
    </form>
  );
}