import { NextResponse } from "next/server";
import fs from "fs";

export const dynamic = "force-dynamic";

export async function GET() {
  const userConfigPath = process.env.USER_CONFIG_PATH;

  let keyFromFile = "";
  if (userConfigPath && fs.existsSync(userConfigPath)) {
    try {
      const raw = fs.readFileSync(userConfigPath, "utf-8");
      const cfg = JSON.parse(raw || "{}");
      keyFromFile = cfg?.OLLAMA_MODEL || "";
    } catch { }
  }



  const keyFromEnv = process.env.OLLAMA_MODEL || "";
  console.log(keyFromEnv);
  const hasKey = Boolean((keyFromFile || keyFromEnv).trim());

  return NextResponse.json({ hasKey });
} 