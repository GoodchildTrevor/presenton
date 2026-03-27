import { NextResponse } from "next/server";
import fs from "fs";
import { LLMConfig } from "@/types/llm_config";

const userConfigPath = process.env.USER_CONFIG_PATH!;
const canChangeKeys = process.env.CAN_CHANGE_KEYS !== "false";

export async function GET() {
  if (!canChangeKeys) {
    return NextResponse.json({
      error: "You are not allowed to access this resource",
      status: 403,
    });
  }
  if (!userConfigPath) {
    return NextResponse.json({
      error: "User config path not found",
      status: 500,
    });
  }

  if (!fs.existsSync(userConfigPath)) {
    return NextResponse.json({});
  }
  const configData = fs.readFileSync(userConfigPath, "utf-8");
  let config = JSON.parse(configData);

  // Autofill FLUX_URL from environment variable if FLUX is selected but URL is missing
  if (config.IMAGE_PROVIDER === "flux" && !config.FLUX_URL) {
    const fluxUrlFromEnv = process.env.FLUX_URL;
    if (fluxUrlFromEnv) {
      config.FLUX_URL = fluxUrlFromEnv;
    }
  }

  return NextResponse.json(config);
}

export async function POST(request: Request) {
  if (!canChangeKeys) {
    return NextResponse.json({
      error: "You are not allowed to access this resource",
    });
  }

  const userConfig = await request.json();

  let existingConfig: LLMConfig = {};
  if (fs.existsSync(userConfigPath)) {
    const configData = fs.readFileSync(userConfigPath, "utf-8");
    existingConfig = JSON.parse(configData);
  }
  const mergedConfig: LLMConfig = {
    LLM: userConfig.LLM || existingConfig.LLM,
    OLLAMA_URL: userConfig.OLLAMA_URL || existingConfig.OLLAMA_URL,
    OLLAMA_MODEL: userConfig.OLLAMA_MODEL || existingConfig.OLLAMA_MODEL,
    DISABLE_IMAGE_GENERATION:
      userConfig.DISABLE_IMAGE_GENERATION === undefined
        ? existingConfig.DISABLE_IMAGE_GENERATION
        : userConfig.DISABLE_IMAGE_GENERATION,
    IMAGE_PROVIDER: userConfig.IMAGE_PROVIDER || existingConfig.IMAGE_PROVIDER,
    FLUX_URL: userConfig.FLUX_URL || existingConfig.FLUX_URL,
    TOOL_CALLS:
      userConfig.TOOL_CALLS === undefined
        ? existingConfig.TOOL_CALLS
        : userConfig.TOOL_CALLS,
    DISABLE_THINKING:
      userConfig.DISABLE_THINKING === undefined
        ? existingConfig.DISABLE_THINKING
        : userConfig.DISABLE_THINKING,
    EXTENDED_REASONING:
      userConfig.EXTENDED_REASONING === undefined
        ? existingConfig.EXTENDED_REASONING
        : userConfig.EXTENDED_REASONING,
    WEB_GROUNDING:
      userConfig.WEB_GROUNDING === undefined
        ? existingConfig.WEB_GROUNDING
        : userConfig.WEB_GROUNDING,
    USE_CUSTOM_URL:
      userConfig.USE_CUSTOM_URL === undefined
        ? existingConfig.USE_CUSTOM_URL
        : userConfig.USE_CUSTOM_URL,
  };
  fs.writeFileSync(userConfigPath, JSON.stringify(mergedConfig));
  return NextResponse.json(mergedConfig);
}
