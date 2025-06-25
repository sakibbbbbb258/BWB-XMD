const { zokou } = require("../framework/zokou");

zokou({
  nomCom: "tag",
  categorie: "group",
  desc: "Tag all group members",
  reaction: "🔊"
}, async (m, sock, { isGroup, participants, isAdmin }) => {
  if (!isGroup) return sock.sendMessage(m.chat, { text: "❌ This command works in groups only." });
  // Optional: Admin-only check
  // if (!isAdmin) return sock.sendMessage(m.chat, { text: "🔐 Only admins can use this command." });

  let messageText = "*👥 Group Mention:*\n\n";
  let mentions = [];

  for (let p of participants) {
    messageText += `@${p.id.split("@")[0]}\n`;
    mentions.push(p.id);
  }

  await sock.sendMessage(m.chat, {
    text: messageText,
    mentions
  });
});
