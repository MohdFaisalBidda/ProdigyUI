import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const registryPath = path.join(process.cwd(), "packages/registry/registry.json");
  const registryContent = fs.readFileSync(registryPath, "utf-8");
  return NextResponse.json(JSON.parse(registryContent));
}
