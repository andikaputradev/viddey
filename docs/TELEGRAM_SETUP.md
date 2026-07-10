# Telegram Setup Guide

## 1. Create a Telegram Bot

1. Open Telegram and search for `@BotFather`.
2. Send `/newbot` and follow the prompts.
3. Choose a name (e.g., `VIDDEY Storage`) and a username ending in `bot` (e.g., `viddey_storage_bot`).
4. BotFather will return an **HTTP API token** like `123456789:AABBccDDee...`. Copy it.

Set in `.env.local`:
```
TELEGRAM_BOT_TOKEN=123456789:AABBccDDee...
```

## 2. Create a Private Channel

1. In Telegram, create a new channel (private, any name, e.g., `viddey-storage`).
2. Do **not** add any public link.

## 3. Add the Bot as Admin

1. Open the private channel → Manage Channel → Administrators.
2. Add your bot as administrator with at least these permissions:
   - Post messages
   - Delete messages

## 4. Get the Channel ID

**Method A — via Telegram API:**

1. Send a test message in the channel.
2. Visit in a browser:
   ```
   https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
   ```
3. In the JSON response, find the `chat.id` field under the channel post. It will be a negative number like `-1001234567890`.

**Method B — via @JsonDumpBot:**

1. Forward a message from your private channel to `@JsonDumpBot`.
2. The bot will return a JSON with the `forward_from_chat.id` field.

Set in `.env.local`:
```
TELEGRAM_CHANNEL_ID=-1001234567890
```

## File Size Limitations

| Environment | Max Upload Size |
|---|---|
| Telegram Cloud Bot API | 50 MB |
| Telegram Bot API Local Server | 2 GB |

For files exceeding 50 MB, you must run the [Telegram Bot API Local Server](https://github.com/tdlib/telegram-bot-api) and configure your environment accordingly. Vercel serverless functions also have body size constraints — for large-file production use, a self-hosted Node.js server is recommended.

## Notes

- The bot token is a server-side secret and is never exposed to the browser.
- Files uploaded to a private channel are only accessible through the Bot API using the token.
- Telegram may delete very old files or files from suspended bots. Back up metadata accordingly.
