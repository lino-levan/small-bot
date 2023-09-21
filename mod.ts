import "https://deno.land/std@0.202.0/dotenv/load.ts";
import { CommandType, remmy } from "remmy";

remmy([
  {
    name: "hello",
    description: "Say hello to someone",
    options: [
      {
        type: CommandType.STRING,
        name: "name",
        description: "The name of the person to say hello to",
        required: true,
      },
    ],
    handler: () => {
      return "hello!";
    },
  },
]);
