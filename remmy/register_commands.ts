import { Command } from "./types.ts";
import { discordReq } from "./util.ts";

export async function registerCommands(commands: Command[]) {
  console.log("[REMMY] Publishing commands to discord");

  const CLIENT_ID = Deno.env.get("DISCORD_CLIENT_ID")!;

  const req = await discordReq(
    `/applications/${CLIENT_ID}/commands`,
    {
      method: "PUT",
      body: JSON.stringify(
        commands.map(({ handler: _, ...command }) => command),
      ),
    },
  );

  console.log(req);
}
