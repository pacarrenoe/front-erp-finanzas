import { useQuery } from "@tanstack/react-query";
import { getHealth } from "../../services/health.service";

export function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
  });

  return (
    <section aria-labelledby="dash-title">
      <h2 id="dash-title">Dashboard</h2>

      {isLoading && <p>Conectando al backend…</p>}
      {error && <p role="alert">Error conectando al backend.</p>}

      {data && (
        <div>
          <p>
            Backend: <strong>{data.name}</strong>
          </p>
          <p>
            Estado: <strong>OK</strong>
          </p>
          <p>
            Hora: <strong>{data.time}</strong>
          </p>
        </div>
      )}
    </section>
  );
}