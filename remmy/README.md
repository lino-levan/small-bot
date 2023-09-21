# Remmy

Remmy is a discord bot framework for the edge. That's it. There's nothing more
to it.

## Demo

```ts
import "https://deno.land/std@0.202.0/dotenv/load.ts";
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
```
