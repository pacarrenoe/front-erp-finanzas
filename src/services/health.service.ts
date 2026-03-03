import { http } from "../api/http";
import { endpoints } from "../api/endpoints";

export type HealthResponse = { ok: true; name: string; time: string };

export async function getHealth(): Promise<HealthResponse> {
  const { data } = await http.get<HealthResponse>(endpoints.health);
  return data;
}