import "dotenv";
import { CommandType, getOption, remmy } from "remmy";

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
    handler: (res) => {
      const name = getOption<string>("name", res);
      if (!name) return "Please provide a name!";

      return `Hello, ${name}`;
    },
  },
]);
