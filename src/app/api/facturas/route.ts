import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || (token.user.role !== "admin" && token.user.role !== "contador")) {
    return NextResponse.json({ status: "error", error: "Forbidden" }, { status: 403 });
  }

  try {
    const facturas = await prisma.factura.findMany({
      include: {
        presupuesto: {
          include: {
            cliente: {
              select: {
                id: true,
                nombre: true,
                tipo: true,
                email: true,
                telefono: true,
                cvu: true,
                roles: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json({ status: "success", data: facturas });
  } catch (error: any) {
    return NextResponse.json({ status: "error", error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.user.role !== "admin") {
    return NextResponse.json({ status: "error", error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const presupuesto = await prisma.presupuesto.findUnique({
      where: { id: body.presupuestoId },
      include: { items: true },
    });

    if (!presupuesto || presupuesto.estado !== "FACTURADO") {
      return NextResponse.json({ status: "error", error: "Presupuesto no válido o no facturado" }, { status: 400 });
    }

    const impuesto = await prisma.impuesto.findFirst({ where: { activo: true } });
    if (!impuesto) {
      return NextResponse.json({ status: "error", error: "No hay impuestos configurados" }, { status: 400 });
    }

    const subtotal = presupuesto.subtotal;
    const impuestos = subtotal * (impuesto.porcentaje / 100);
    const total = subtotal + impuestos;

    // Generar el número de factura
    const prefijo = "A"; // Configurable
    const puntoDeVenta = "0001"; // Hardcodeado por ahora
    const ultimaFactura = await prisma.factura.findFirst({
      orderBy: { id: "desc" },
    });
    const ultimoNumero = ultimaFactura?.numero.split("-")[2] || "00000000";
    const nuevoNumero = (parseInt(ultimoNumero, 10) + 1).toString().padStart(8, "0");
    const numeroFactura = `${prefijo}-${puntoDeVenta}-${nuevoNumero}`;

    const factura = await prisma.factura.create({
      data: {
        numero: numeroFactura,
        presupuesto: { connect: { id: presupuesto.id } },
        fecha: new Date(),
        subtotal,
        impuestos,
        total,
        estado: "EMITIDA",
        impuestoAplicado: { connect: { id: impuesto.id } },
      },
      include: { presupuesto: true },
    });

    return NextResponse.json({ status: "success", data: factura });
  } catch (error: any) {
    return NextResponse.json({ status: "error", error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.user.role !== "admin") {
    return NextResponse.json({ status: "error", error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const factura = await prisma.factura.update({
      where: { id: body.id },
      data: body,
      include: { presupuesto: true },
    });
    return NextResponse.json({ status: "success", data: factura });
  } catch (error: any) {
    return NextResponse.json({ status: "error", error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.user.role !== "admin") {
    return NextResponse.json({ status: "error", error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await req.json();
    await prisma.factura.delete({ where: { id } });
    return NextResponse.json({ status: "success", data: null });
  } catch (error: any) {
    return NextResponse.json({ status: "error", error: error.message }, { status: 400 });
  }
}