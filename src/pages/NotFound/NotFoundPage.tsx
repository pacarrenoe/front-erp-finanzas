import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section aria-labelledby="nf-title">
      <h2 id="nf-title">Página no encontrada</h2>
      <p>La ruta no existe.</p>
      <Link to="/">Volver al Dashboard</Link>
    </section>
  );
}
