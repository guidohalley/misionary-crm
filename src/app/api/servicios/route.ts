import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ status: "error", error: "Unauthorized" }, { status: 401 });

  try {
    const servicios = await prisma.servicio.findMany({
      include: {
        proveedor: {
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
    return NextResponse.json({ status: "success", data: servicios });
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
    const servicio = await prisma.servicio.create({
      data: {
        ...body,
        proveedor: { connect: { id: body.proveedorId } },
      },
    });
    return NextResponse.json({ status: "success", data: servicio });
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
    const servicio = await prisma.servicio.update({
      where: { id: body.id },
      data: {
        ...body,
        proveedor: { connect: { id: body.proveedorId } },
      },
    });
    return NextResponse.json({ status: "success", data: servicio });
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
    await prisma.servicio.delete({ where: { id } });
    return NextResponse.json({ status: "success", data: null });
  } catch (error: any) {
    return NextResponse.json({ status: "error", error: error.message }, { status: 400 });
  }
}