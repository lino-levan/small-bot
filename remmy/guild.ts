import { discordReq } from "./util.ts";

interface Guild {
  name: string;
  icon: string;
}

export async function editGuild(guild_id: string, guild: Partial<Guild>) {
  return await discordReq(
    `/guilds/${guild_id}`,
    {
      method: "PATCH",
      body: JSON.stringify(guild),
    },
  );
}
