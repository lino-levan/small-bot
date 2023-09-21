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
]);
