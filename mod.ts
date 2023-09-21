import "dotenv";
import { CommandType, getOption, remmy } from "remmy";
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
    handler: (res) => {
      const image = getOption<string>("image", res);
      if (!res.data.resolved?.attachments || !image) {
        return "there was an error";
      }

      const { url } = res.data.resolved.attachments[image];

      return url;
    },
  },
]);
