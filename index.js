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
      .setImage("https://cdn.discordapp.com/attachments/1361886141397340371/1414241266115285104/08f04819c687b31b954595d766ca21ef84c918a6_2_650x265.png?ex=68bf8311&is=68be3191&hm=ec211ad398335584d77b781f9d45501c289dbbe35a3f2b04ea1de549143c1052")
      .setFooter({ text: "Jangan lupa perkenalkan dirimu ya 🌿" })
      .setTimestamp();

    channel.send({ embeds: [embed] });
  } catch (err) {
    console.error("Error saat kirim pesan welcome:", err);
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return; // biar ga nge-ban bot sendiri

  // List kata terlarang
  const badWords = ["kasar1", "kasar2", "kasar3"];

  // Cek kata terlarang
  if (badWords.some(word => message.content.toLowerCase().includes(word))) {
    await message.delete();
    return message.channel.send(`⚠️ ${message.author}, kata itu dilarang di sini!`);
  }

  // Block link invite discord
  if (message.content.includes("discord.gg/")) {
    await message.delete();
    return message.channel.send(`🚫 ${message.author}, jangan share invite server lain ya.`);
  }

  // Anti spam (contoh: kalau spam huruf kapital semua)
  if (message.content === message.content.toUpperCase() && message.content.length > 5) {
    return message.reply("👉 Tolong jangan spam CAPS LOCK ya 😅");
  }
});


client.login(process.env.DISCORD_TOKEN);
