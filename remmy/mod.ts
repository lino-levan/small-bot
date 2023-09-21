import type { Command, InteractionResponse } from "./types.ts";
export * from "./types.ts";

import { validateRequest } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { verifySignature } from "./verify_signature.ts";

const DISCORD_BASE = "https://discord.com/api/v10";

export async function remmy(
  commands: Command[],
) {
  if (Deno.env.get("REMMY_PUBLISH")) {
    // We're actually in publish commands mode... don't start bot
    console.log("[REMMY] Publishing commands to discord");

    const BOT_TOKEN = Deno.env.get("DISCORD_BOT_TOKEN")!;
    const CLIENT_ID = Deno.env.get("DISCORD_CLIENT_ID")!;

    const req = await fetch(
      `${DISCORD_BASE}/applications/${CLIENT_ID}/commands`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bot ${BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          commands.map(({ handler, ...command }) => command),
        ),
      },
    );

    console.log(await req.json());

    return;
  }

  if (!Deno.env.get("DISCORD_PUBLIC_KEY")) {
    throw new Error(
      "[REMMY] Environment variable 'DISCORD_PUBLIC_KEY' not set. Failing.",
    );
  }

  return Deno.serve(async (request) => {
    // Validate request is of right type and has correct headers
    const { error } = await validateRequest(request, {
      POST: {
        headers: ["X-Signature-Ed25519", "X-Signature-Timestamp"],
      },
    });
    if (error) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    // Verify the signature of the request
    const { valid, body } = await verifySignature(request);
    if (!valid) {
      return Response.json(
        { error: "Invalid request" },
        {
          status: 401,
        },
      );
    }

    // Extract information
    const req: InteractionResponse = JSON.parse(body);
    const { type = 0 } = req;

    // Type 1 in a request implies a Ping interaction.
    if (type === 1) {
      return Response.json({
        type: 1, // Type 1 in a response is a Pong interaction response type.
      });
    }
    // Type 2 in a request is an ApplicationCommand interaction.
    if (type === 2) {
      for (const command of commands) {
        if (command.name === req.data.name) {
          return Response.json({
            type: 4,
            data: {
              content: command.handler(req),
            },
          });
        }
      }
    }

    // Catch any edgecases
    return Response.json({ error: "bad request" }, { status: 400 });
  });
}
