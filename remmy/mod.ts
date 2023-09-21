import { validateRequest } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { verifySignature } from "./verify_signature.ts";

export const enum CommandType {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP = 2,
  STRING = 3,
  INTEGER = 4,
  BOOLEAN = 5,
  USER = 6,
  CHANNEL = 7,
  ROLE = 8,
  MENTIONABLE = 9,
  NUMBER = 10,
  ATTACHMENT = 11,
  de,
}

export interface Command {
  type: number;
  name: string;
  description: string;
  required?: boolean;
  options?: Command[];
}

export function remmy(
  commands: (Omit<Command, "type"> & { handler: () => string })[],
) {
  if (Deno.env.get("REMMY_PUBLISH")) {
    // We're actually in publish commands mode... don't start bot
    console.log("[REMMY] Publishing commands to discord");

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
    const req = JSON.parse(body);
    const { type = 0, data = { options: [] } } = req;
    console.log(req);

    // Type 1 in a request implies a Ping interaction.
    if (type === 1) {
      return Response.json({
        type: 1, // Type 1 in a response is a Pong interaction response type.
      });
    }

    // Type 2 in a request is an ApplicationCommand interaction.
    if (type === 2) {
      const { value } = data.options.find((option: { name: string }) =>
        option.name === "name"
      );
      return Response.json({
        type: 4,
        data: {
          content: `Hello, ${value}!`,
        },
      });
    }

    // Catch any edgecases
    return Response.json({ error: "bad request" }, { status: 400 });
  });
}
