export default function HomePage() {
  return (
    <div className="flex h-screen bg-gray-800 text-primary">
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <h1 className="text-4xl font-bold mb-4">Sistema de Administración</h1>
        <h2 className="text-2xl font-semibold mb-8">MSNR</h2>
        <a
          href="/auth/signin"
          className="bg-primary text-gray-800 py-2 px-6 rounded text-lg font-medium hover:bg-accent transition"
        >
          Iniciar sesión
        </a>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <img src="/logo-msnr.png" alt="Logo MSNR" className="max-w-full h-auto" />
      </div>
    </div>
  );
}
