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

// === LOGGING SYSTEM ===

// Pesan dihapus
client.on("messageDelete", async (message) => {
  if (message.partial) return; // biar gak error kalau message cache hilang
  const logChannel = message.guild.channels.cache.get(process.env.LOG_CHANNEL_ID);
  if (!logChannel) return;

  const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("🗑️ Pesan Dihapus")
    .addFields(
      { name: "Author", value: `${message.author}`, inline: true },
      { name: "Channel", value: `${message.channel}`, inline: true },
      { name: "Isi Pesan", value: message.content || "Embed/Attachment", inline: false }
    )
    .setTimestamp();

  logChannel.send({ embeds: [embed] });
});

// Role ditambah/dihapus
client.on("guildMemberUpdate", async (oldMember, newMember) => {
  const logChannel = newMember.guild.channels.cache.get(process.env.LOG_CHANNEL_ID);
  if (!logChannel) return;

  const addedRoles = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
  const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));

  if (addedRoles.size > 0) {
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("➕ Role Ditambahkan")
      .setDescription(`${newMember} mendapat role: ${addedRoles.map(r => r.name).join(", ")}`)
      .setTimestamp();
    logChannel.send({ embeds: [embed] });
  }

  if (removedRoles.size > 0) {
    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("➖ Role Dihapus")
      .setDescription(`${newMember} kehilangan role: ${removedRoles.map(r => r.name).join(", ")}`)
      .setTimestamp();
    logChannel.send({ embeds: [embed] });
  }
});

// Log Spam (lanjutan dari AutoMod sebelumnya)
const userSpamMap = new Map();

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const logChannel = message.guild.channels.cache.get(process.env.LOG_CHANNEL_ID);

  // ========== SPAM DETECTION ==========
  const now = Date.now();
  const userData = userSpamMap.get(message.author.id) || { count: 0, lastMessage: now };

  if (now - userData.lastMessage < 5000) { // 5 detik
    userData.count += 1;
  } else {
    userData.count = 1;
  }
  userData.lastMessage = now;
  userSpamMap.set(message.author.id, userData);

  if (userData.count >= 5) { // spam >= 5 pesan cepat
    if (logChannel) {
      const embed = new EmbedBuilder()
        .setColor("DarkRed")
        .setTitle("🚨 Deteksi Spam")
        .setDescription(`${message.author} terdeteksi spam di ${message.channel}`)
        .setTimestamp();
      logChannel.send({ embeds: [embed] });
    }

    // Reset counter
    userSpamMap.set(message.author.id, { count: 0, lastMessage: now });
  }
});



client.login(process.env.DISCORD_TOKEN);
