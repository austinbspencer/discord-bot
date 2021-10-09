const getUserFromMention = require("../utils/functions/getUserFromMention.js");

module.exports = {
  name: "decr-prof-count",
  description: "Tag a member and decrease their profanity count.",
  usage: "[@member]",
  args: true,
  readOnly: false,
  guildOnly: true,
  cooldown: 5,
  permLevel: 3,
  /**
   * This command is able to decreae the amount of strikes against a member
   * for foul language
   *
   * @param {message Object} message the message Object that was sent to trigger this command
   * @param {array} args the rest of the message after the command
   * @param {Redis client} redis Redis client (our database)
   * @param {num} _level users permission level
   */
  execute(message, args, redis, _level) {
    if (!message.mentions.users.size) {
      return message.reply(
        "You need to tag a user in order to decrease their profanity count!"
      );
    }

    const user = getUserFromMention.execute(args[0], message.client);

    if (user) {
      const member = message.guild.member(user);
      // If the member is in the guild
      if (member) {
        let title = member.user.username + "-prof-count";
        redis
          .get(title)
          .then((res) => {
            if (res > 0) {
              // Decrement the profanity count
              redis
                .decr(title)
                .then(() => {
                  res--;
                  message.reply(
                    `Decrement was a success:\n${member.displayName} now has profanity count of ${res}`
                  );
                })
                .catch((err) => {
                  // An error happened
                  message.reply(
                    `I was unable to edit ${member.displayName}'s profanity count`
                  );
                  // Log the error
                  console.error(err);
                });
            } else {
              // member doesn't have any profanity incidents
              message.reply(
                `${member.displayName} doesn't have any profanity incidents.`
              );
            }
          })
          .catch((err) => {
            // An error happened
            message.reply(
              `I was unable to edit ${member.displayName}'s profanity count`
            );
            // Log the error
            console.error(err);
          });
      } else {
        // The mentioned user isn't in this guild
        return message.reply(`${member.displayName} isn't in this guild!`);
      }
      // Otherwise, if no user was mentioned
    } else {
      // Otherwise, if no user was mentioned
      return message.reply(
        "Please use a proper mention if you want to edit someone's profanity count."
      );
    }
  },
  test() {
    return true;
  },
};
