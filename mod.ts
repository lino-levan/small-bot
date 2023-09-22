import "dotenv";
import { encode } from "base64";
import { CommandType, editGuild, getOption, remmy } from "remmy";
import { OpenAI } from "openai";
import { accepted, adjs, denied, pickRandom } from "./responses.ts";

const openAI = new OpenAI(Deno.env.get("OPENAI_KEY")!);

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
      const title = `This is a ${pickRandom(adjs)} cat`;

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
      if (Math.random() < 0.1) return pickRandom(denied);

      const image = getOption<string>("image", res);
      if (!res.data.resolved?.attachments || !image || !res.guild_id) {
        return "there was an error";
      }

      const { url, content_type } = res.data.resolved.attachments[image];
      const req = await fetch(url);
      const buffer = await req.arrayBuffer();

      await editGuild(res.guild_id, {
        icon: `data:${content_type};base64,${encode(buffer)}`,
      });

      return pickRandom(accepted);
    },
  },
  {
    name: "badvaith",
    description: "Get advice from Badvaith",
    options: [
      {
        type: CommandType.STRING,
        name: "question",
        description: "A question for Badvaith",
        required: true,
      },
    ],
    handler: async (res) => {
      const question = getOption<string>("question", res);
      if (!question) return "no.";

      const chatCompletion = await openAI.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { "role": "system", "content": Deno.env.get("BADVAITH_PROMPT")! },
          { "role": "user", "content": question },
        ],
      });

      return chatCompletion.choices[0].message.content!;
    },
  },
]);
