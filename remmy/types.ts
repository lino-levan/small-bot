export type InteractionData =
  & {
    name: string;
    type: number;
  }
  & (
    | {
      value: string | number | boolean;
    }
    | {
      options: InteractionData[];
    }
  );

export interface InteractionResponse {
  "app_permissions"?: string;
  "application_id": string;
  "channel"?: {
    "flags": number;
    "guild_id": string;
    "icon_emoji": { "id"?: string; "name": string };
    "id": string;
    "last_message_id": string;
    "last_pin_timestamp": string;
    "name": string;
    "nsfw": boolean;
    "parent_id": string;
    "permissions": string;
    "position": number;
    "rate_limit_per_user": number;
    "theme_color": null;
    "topic": null;
    "type": number;
  };
  "channel_id"?: string;
  "data": {
    "id": string;
    "name": string;
    "options"?: InteractionData[];
    "type": number;
  };
  "entitlement_sku_ids": [];
  "entitlements": [];
  "guild": {
    "features": string[];
    "id": string;
    "locale": string;
  };
  "guild_id"?: string;
  "guild_locale"?: string;
  "id": string;
  "locale"?: string;
  "member"?: {
    "avatar"?: string;
    "communication_disabled_until"?: string;
    "deaf": boolean;
    "flags": number;
    "joined_at": string;
    "mute": boolean;
    "nick": string;
    "pending": boolean;
    "permissions": string;
    "premium_since"?: string;
    "roles": string[];
    "unusual_dm_activity_until"?: string;
    "user": {
      "avatar": string;
      "avatar_decoration_data"?: string;
      "discriminator": string;
      "global_name": string;
      "id": string;
      "public_flags": number;
      "username": string;
    };
  };
  "token": string;
  "type": number;
  "version": number;
}

export const enum CommandType {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP = 2,
  STRING = 3,
  INTEGER = 4,
  BOOLEAN = 5,
  USER = 6,
  CHANNEL = 7,
  ROLE = 8,
  MENTIONABLE = 9,
  NUMBER = 10,
  ATTACHMENT = 11,
  de,
}

export interface Subcommand {
  type: number;
  name: string;
  description: string;
  required?: boolean;
  options?: Subcommand[];
}

export type Command = {
  handler: (res: InteractionResponse) => string;
} & Omit<Subcommand, "type">;