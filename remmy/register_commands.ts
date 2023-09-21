import { Command } from "./types.ts";

const DISCORD_BASE = "https://discord.com/api/v10";

export async function registerCommands(commands: Command[]) {
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
        commands.map(({ handler: _, ...command }) => command),
      ),
    },
  );

  console.log(await req.json());
}
