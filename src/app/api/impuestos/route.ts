import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ status: "error", error: "Unauthorized" }, { status: 401 });

  try {
    const impuestos = await prisma.impuesto.findMany();
    return NextResponse.json({ status: "success", data: impuestos });
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
    const impuesto = await prisma.impuesto.create({ data: body });
    return NextResponse.json({ status: "success", data: impuesto });
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
    const impuesto = await prisma.impuesto.update({
      where: { id: body.id },
      data: body,
    });
    return NextResponse.json({ status: "success", data: impuesto });
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
    await prisma.impuesto.delete({ where: { id } });
    return NextResponse.json({ status: "success", data: null });
  } catch (error: any) {
    return NextResponse.json({ status: "error", error: error.message }, { status: 400 });
  }
}