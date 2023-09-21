import "dotenv";
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
    handler: (res) => {
      const options = res.data.options;
      if (!options) return "Specifiy options please";
      return "hello!";
    },
  },
]);
