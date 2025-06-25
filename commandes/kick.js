const { zokou } = require("../framework/zokou");

zokou({
  nomCom: "kick",
  categorie: "group",
  desc: "Kick mentioned or replied user from group",
  reaction: "👢"
}, async (m, sock, { isGroup, isAdmin, isBotAdmin, participants }) => {
  if (!isGroup)
    return sock.sendMessage(m.chat, { text: "❌ This command works in groups only." });

  if (!isAdmin)
    return sock.sendMessage(m.chat, { text: "🔐 You must be an *admin* to use this command." });

  if (!isBotAdmin)
    return sock.sendMessage(m.chat, { text: "🤖 I need to be *admin* to kick someone." });

  // Get user to kick
  let target;

  if (m.mentionedJid?.length) {
    target = m.mentionedJid[0];
  } else if (m.quoted && m.quoted.sender) {
    target = m.quoted.sender;
  } else {
    return sock.sendMessage(m.chat, {
      text: "⚠️ Mention or reply to the user you want to kick."
    });
  }

  const isTargetAdmin = participants.find(p => p.id === target)?.admin;

  if (target === m.sender) {
    return sock.sendMessage(m.chat, { text: "🙅‍♂️ You can't kick yourself!" });
  }

  if (target === sock.user.id.split(":")[0] + "@s.whatsapp.net") {
    return sock.sendMessage(m.chat, { text: "🤖 I can't kick myself." });
  }

  if (isTargetAdmin) {
    return sock.sendMessage(m.chat, {
      text: "⛔ I can't remove an admin."
    });
  }

  await sock.groupParticipantsUpdate(m.chat, [target], "remove");
  await sock.sendMessage(m.chat, {
    text: `👢 @${target.split("@")[0]} has been removed.`,
    mentions: [target]
  });
});
