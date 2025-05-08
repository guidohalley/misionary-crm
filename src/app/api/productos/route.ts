import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ status: "error", error: "Unauthorized" }, { status: 401 });

  const productos = await prisma.producto.findMany({
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
  return NextResponse.json({ status: "success", data: productos });
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.user.role !== "admin") {
    return NextResponse.json({ status: "error", error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  try {
    const producto = await prisma.producto.create({ data: body });
    return NextResponse.json({ status: "success", data: producto });
  } catch (error: any) {
    return NextResponse.json({ status: "error", error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.user.role !== "admin") {
    return NextResponse.json({ status: "error", error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  try {
    const producto = await prisma.producto.update({ where: { id: body.id }, data: body });
    return NextResponse.json({ status: "success", data: producto });
  } catch (error: any) {
    return NextResponse.json({ status: "error", error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.user.role !== "admin") {
    return NextResponse.json({ status: "error", error: "Forbidden" }, { status: 403 });
  }

  const { id } = await req.json();
  try {
    await prisma.producto.delete({ where: { id } });
    return NextResponse.json({ status: "success", data: null });
  } catch (error: any) {
    return NextResponse.json({ status: "error", error: error.message }, { status: 400 });
  }
}