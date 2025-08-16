export const money = v => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(Number(v || 0));
