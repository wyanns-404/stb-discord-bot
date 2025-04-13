require('dotenv').config();

const { Client, GatewayIntentBits } = require("discord.js");
const config = require("./config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

client.once("ready", () => {
  console.log(`✅ Bot aktif sebagai ${client.user.tag}`);
});

client.on("presenceUpdate", async (oldPresence, newPresence) => {
  const member = newPresence.member;
  if (!member || member.user.bot) return;

  const activities = newPresence.activities || [];
  const playing = activities.find((a) => a.type === 0); // type 0 = Playing

  for (const gameConfig of config.gameRoles) {
    const role = member.guild.roles.cache.find(
      (r) => r.name === gameConfig.role
    );
    if (!role) continue;

    if (playing && playing.name === gameConfig.game) {
      if (!member.roles.cache.has(role.id)) {
        await member.roles.add(role).catch(console.error);
        console.log(
          `✅ Menambahkan role ${gameConfig.role} ke ${member.user.tag}`
        );
      }
    } else {
      if (member.roles.cache.has(role.id)) {
        await member.roles.remove(role).catch(console.error);
        console.log(
          `❌ Menghapus role ${gameConfig.role} dari ${member.user.tag}`
        );
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
