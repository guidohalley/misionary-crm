import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ status: "error", error: "Unauthorized" }, { status: 401 });

  try {
    if (token.user.role === "proveedor") {
      const recibos = await prisma.recibo.findMany({
        where: { personaId: parseInt(token.user.id) }
      });
      return NextResponse.json({ status: "success", data: recibos });
    }

    if (token.user.role === "admin") {
      const recibos = await prisma.recibo.findMany({
        include: {
          persona: {
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
      return NextResponse.json({ status: "success", data: recibos });
    }

    return NextResponse.json({ status: "error", error: "Forbidden" }, { status: 403 });
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
    const recibo = await prisma.recibo.create({
      data: {
        ...body,
        persona: { connect: { id: body.personaId } },
      },
    });
    return NextResponse.json({ status: "success", data: recibo });
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
    await prisma.recibo.delete({ where: { id } });
    return NextResponse.json({ status: "success", data: null });
  } catch (error: any) {
    return NextResponse.json({ status: "error", error: error.message }, { status: 400 });
  }
}