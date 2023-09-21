import "dotenv";
import { encode } from "base64";
import { CommandType, editGuild, getOption, remmy } from "remmy";
import { adjs } from "./adjectives.ts";

const randomString = () => (Math.random() + 1).toString(36).substring(7);

remmy([
  {
    name: "cat",
    description: "Send random cat",
    options: [
      {
        type: CommandType.STRING,
        name: "caption",
        description: "A silly caption for the cat photo",
      },
    ],
    handler: (res) => {
      const caption = getOption<string>("caption", res);
      const title = `This is a ${
        adjs[Math.floor(Math.random() * adjs.length)]
      } cat`;

      if (caption) {
        return {
          embeds: [
            {
              title,
              image: {
                url: `https://cataas.com/c/s/${
                  encodeURI(caption)
                }?random=${randomString()}`,
              },
            },
          ],
        };
      }

      return {
        embeds: [
          {
            title,
            image: {
              url: `https://cataas.com/c?random=${randomString()}`,
            },
          },
        ],
      };
    },
  },
  {
    name: "icon",
    description: "Change the server icon",
    options: [
      {
        type: CommandType.ATTACHMENT,
        name: "image",
        description: "The image to change the server icon to",
        required: true,
      },
    ],
    handler: async (res) => {
      const image = getOption<string>("image", res);
      if (!res.data.resolved?.attachments || !image || !res.guild_id) {
        return "there was an error";
      }

      const { url, content_type } = res.data.resolved.attachments[image];
      const req = await fetch(url);
      const buffer = await req.arrayBuffer();

      console.log(
        await editGuild(res.guild_id, {
          icon: `data:${content_type};base64,${encode(buffer)}`,
        }),
      );

      return "uhh I think I got it";
    },
  },
]);
