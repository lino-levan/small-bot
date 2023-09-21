import { validateRequest } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { verifySignature } from "./verify_signature.ts";

export function remmy() {
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
      const { value } = data.options.find((option) => option.name === "name");
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
