"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Presupuesto } from "@/types";



export default function PresupuestosPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);

  useEffect(() => {
    if (!session || session.user.role !== "admin") {
      router.push("/dashboard");
    } else {
      fetch("/api/presupuestos")
        .then((res) => res.json())
        .then((data) => setPresupuestos(data.data));
    }
  }, [session, router]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary">Presupuestos</h1>
      <table className="min-w-full bg-contrast border border-primary rounded-md">
        <thead>
          <tr className="bg-primary text-background">
            <th className="py-3 px-4 border-b">Cliente</th>
            <th className="py-3 px-4 border-b">Subtotal</th>
            <th className="py-3 px-4 border-b">Impuestos</th>
            <th className="py-3 px-4 border-b">Total</th>
            <th className="py-3 px-4 border-b">Estado</th>
          </tr>
        </thead>
        <tbody>
          {presupuestos.map((presupuesto) => (
            <tr key={presupuesto.id} className="hover:bg-accent">
              <td className="py-3 px-4 border-b">{presupuesto.cliente.nombre}</td>
              <td className="py-3 px-4 border-b">${presupuesto.subtotal.toFixed(2)}</td>
              <td className="py-3 px-4 border-b">${presupuesto.impuestos.toFixed(2)}</td>
              <td className="py-3 px-4 border-b">${presupuesto.total.toFixed(2)}</td>
              <td className="py-3 px-4 border-b">{presupuesto.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}