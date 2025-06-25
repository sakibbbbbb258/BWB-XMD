const { zokou } = require("../framework/zokou");

zokou({
  nomCom: "kick",
  categorie: "group",
  desc: "Kick a user from group",
  reaction: "👢"
}, async (m, sock, { isGroup, isAdmin, isBotAdmin, participants }) => {

  if (!isGroup)
    return sock.sendMessage(m.chat, { text: "❌ Group only command." });

  if (!isAdmin)
    return sock.sendMessage(m.chat, { text: "🔐 You must be an admin." });

  if (!isBotAdmin)
    return sock.sendMessage(m.chat, { text: "🤖 I need to be admin too!" });

  let target = m.mentionedJid?.[0] || (m.quoted && m.quoted.sender);

  if (!target)
    return sock.sendMessage(m.chat, { text: "⚠️ Mention or reply to the user to kick." });

  if (participants.find(p => p.id === target)?.admin)
    return sock.sendMessage(m.chat, { text: "⛔ Can't kick an admin!" });

  await sock.groupParticipantsUpdate(m.chat, [target], "remove");
  await sock.sendMessage(m.chat, {
    text: `👋 @${target.split("@")[0]} has been kicked.`,
    mentions: [target]
  });
});
