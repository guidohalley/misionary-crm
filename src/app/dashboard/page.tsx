export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-primary">Bienvenido al Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-contrast p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Presupuestos Activos</h2>
          <p className="text-2xl">0</p>
        </div>
        <div className="bg-contrast p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Facturación del Mes</h2>
          <p className="text-2xl">$0</p>
        </div>
        <div className="bg-contrast p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Proveedores Pagos</h2>
          <p className="text-2xl">0</p>
        </div>
      </div>
    </div>
  );
}