const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once("ready", () => {
  console.log(`✅ Bot sudah online sebagai ${client.user.tag}`);
});

client.on("guildMemberAdd", async (member) => {
  try {
    const channel = member.guild.channels.cache.get(process.env.CHANNEL_ID);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor("#ffb6c1")
      .setTitle("✨ Selamat Datang ✨")
      .setDescription(
        `Hai ${member}, selamat bergabung di **${member.guild.name}** 🌸\n\n` +
        "Semoga harimu indah seperti senja yang jatuh perlahan di ufuk barat ☁️✨"
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setImage("https://i.ibb.co/9y3RCnD/aesthetic-welcome.jpg")
      .setFooter({ text: "Jangan lupa perkenalkan dirimu ya 🌿" })
      .setTimestamp();

    channel.send({ embeds: [embed] });
  } catch (err) {
    console.error("Error saat kirim pesan welcome:", err);
  }
});

client.login(process.env.DISCORD_TOKEN);
