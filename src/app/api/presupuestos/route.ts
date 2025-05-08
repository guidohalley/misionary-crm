import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ status: "error", error: "Unauthorized" }, { status: 401 });

  try {
    const presupuestos = await prisma.presupuesto.findMany({
      include: {
        items: {
          include: {
            producto: true,
            servicio: true,
          },
        },
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
    });
    return NextResponse.json({ status: "success", data: presupuestos });
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
    const presupuesto = await prisma.presupuesto.create({
      data: {
        ...body,
        cliente: { connect: { id: body.clienteId } },
        items: {
          create: body.items.map((item: any) => ({
            ...item,
            producto: item.productoId ? { connect: { id: item.productoId } } : undefined,
            servicio: item.servicioId ? { connect: { id: item.servicioId } } : undefined,
          })),
        },
      },
      include: { items: true },
    });
    return NextResponse.json({ status: "success", data: presupuesto });
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
    const presupuesto = await prisma.presupuesto.update({
      where: { id: body.id },
      data: {
        ...body,
        cliente: { connect: { id: body.clienteId } },
        items: {
          deleteMany: {},
          create: body.items.map((item: any) => ({
            ...item,
            producto: item.productoId ? { connect: { id: item.productoId } } : undefined,
            servicio: item.servicioId ? { connect: { id: item.servicioId } } : undefined,
          })),
        },
      },
      include: { items: true },
    });
    return NextResponse.json({ status: "success", data: presupuesto });
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
    await prisma.presupuesto.delete({ where: { id } });
    return NextResponse.json({ status: "success", data: null });
  } catch (error: any) {
    return NextResponse.json({ status: "error", error: error.message }, { status: 400 });
  }
}