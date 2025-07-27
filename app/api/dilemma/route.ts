import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { dilemma, messages } = await request.json();

  console.log("🚀 Dilemma:", dilemma);
  console.log("🚀 Messages:", messages);

  return new Response("OK");
}