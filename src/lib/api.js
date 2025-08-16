import http from "./http";

export async function createCredit(payload) {
  const { data } = await http.post("/api/credits", payload);
  return data.credit;
}
export async function listCredits(params = {}) {
  const { data } = await http.get("/api/credits", { params });
  return data.credits;
}

// Auth
export async function registerUser(payload) {
  const { data } = await http.post("/api/auth/register", payload);
  console.log("llega",data,payload)
  return data; 
}
export async function loginUser(payload) {
  const { data } = await http.post("/api/auth/login", payload);
  return data; // { ok, user, token }
}
