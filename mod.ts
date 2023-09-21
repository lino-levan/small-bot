import "dotenv";
import { CommandType, getOption, remmy } from "remmy";

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
      if (caption) {
        return {
          attachments: [{
            url: `https://cataas.com/c/s/${encodeURI(caption)}`,
          }],
        };
      }

      return {
        attachments: [{
          url: "https://cataas.com/c",
        }],
      };
    },
  },
]);
