"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Persona, Producto, Servicio, Item } from "@/types";


export default function NuevoPresupuestoPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [clientes, setClientes] = useState<Persona[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [impuestos, setImpuestos] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!session || session.user.role !== "admin") {
      router.push("/dashboard");
    } else {
      fetch("/api/personas")
        .then((res) => res.json())
        .then((data) => setClientes(data.data.filter((p: Persona) => p.tipo === "CLIENTE")));

      fetch("/api/productos")
        .then((res) => res.json())
        .then((data) => setProductos(data.data));

      fetch("/api/servicios")
        .then((res) => res.json())
        .then((data) => setServicios(data.data));
    }
  }, [session, router]);

  const agregarItem = (item: Item) => {
    setItems([...items, item]);
    setSubtotal(subtotal + item.precio);
  };

  useEffect(() => {
    const impuestoRate = 0.0245; // 2.45%
    setImpuestos(subtotal * impuestoRate);
    setTotal(subtotal + subtotal * impuestoRate);
  }, [subtotal]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const presupuesto = {
      clienteId,
      items: items.map((item) => ({
        productoId: item.productoId || null,
        servicioId: item.servicioId || null,
        cantidad: 1,
        precioUnitario: item.precio,
      })),
      subtotal,
      impuestos,
      total,
    };

    const res = await fetch("/api/presupuestos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(presupuesto),
    });

    if (res.ok) {
      router.push("/presupuestos");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary">Nuevo Presupuesto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-contrast">Cliente</label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="mt-1 block w-full border border-primary rounded-md shadow-sm focus:ring-accent focus:border-accent sm:text-sm"
          >
            <option value="">Seleccionar cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-contrast">Productos</label>
          <ul className="space-y-2">
            {productos.map((producto) => (
              <li key={producto.id}>
                <button
                  type="button"
                  onClick={() => agregarItem({ productoId: producto.id, precio: producto.precio })}
                  className="text-primary hover:text-accent"
                >
                  {producto.nombre} - ${producto.precio.toFixed(2)}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label className="block text-sm font-medium text-contrast">Servicios</label>
          <ul className="space-y-2">
            {servicios.map((servicio) => (
              <li key={servicio.id}>
                <button
                  type="button"
                  onClick={() => agregarItem({ servicioId: servicio.id, precio: servicio.precio })}
                  className="text-primary hover:text-accent"
                >
                  {servicio.nombre} - ${servicio.precio.toFixed(2)}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-medium text-contrast">Resumen</h2>
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Impuestos: ${impuestos.toFixed(2)}</p>
          <p>Total: ${total.toFixed(2)}</p>
        </div>

        <button
          type="submit"
          className="bg-primary text-background py-2 px-4 rounded hover:bg-accent"
        >
          Crear Presupuesto
        </button>
      </form>
    </div>
  );
}