import { useQuery } from "@tanstack/react-query";
import { listAccounts } from "../../services/account.service";

export function SettingsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["accounts"],
    queryFn: listAccounts,
  });

  return (
    <section aria-labelledby="settings-title">
      <h2 id="settings-title">Configuración</h2>

      <h3>Cuentas</h3>

      {isLoading && <p>Cargando cuentas…</p>}
      {error && <p role="alert">Error cargando cuentas.</p>}

      {data && data.length === 0 && <p>No hay cuentas todavía.</p>}

      {data && data.length > 0 && (
        <ul>
          {data.map((a) => (
            <li key={a.id}>
              <strong>{a.name}</strong> — {a.type}
              {a.bank ? ` • ${a.bank}` : ""}
              {!a.active ? " (inactiva)" : ""}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}