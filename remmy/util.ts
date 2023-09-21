export const DISCORD_BASE = "https://discord.com/api/v10";

export const BOT_TOKEN = Deno.env.get("DISCORD_BOT_TOKEN")!;

export async function discordReq(
  path: string,
  options: RequestInit | undefined,
) {
  const req = await fetch(
    `${DISCORD_BASE}${path}`,
    {
      headers: {
        "Authorization": `Bot ${BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      ...options,
    },
  );

  return await req.json();
}
