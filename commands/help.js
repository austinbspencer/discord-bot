const version = require('./version.js')

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	args: false,
	readOnly: false,
	guildOnly: false,
	channel: 'bot-testing',
	cooldown: 5,
	permLevel: 0,
	/**
	 * This command is able to help a user by showing all of the available commands
	 * Also able to give individual help for the command given as an argument
	 * 
	 * @param {message Object} message the message Object that was sent to trigger this command
	 * @param {array} args the rest of the message after the command
	 * @param {Redis client} _redis Redis client (our database)
	 * @param {num} _level users permission level
	 */
	execute: async (message, args, redis, level) => {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			// data.push('Here\'s a list of all my commands:');
			// data.push(commands.map(command => command.name).join(', '));

			// // data.push(`\n You can send **![command name] in the dm's or a text channel to run the command!`)
			// data.push(`\nSend \`!help [command name]\` to get info on a specific command and how to use it!`);

			// return message.author.send(data, { split: true })
			// 	.then(() => {
			// 		if (message.channel.type === 'dm') return;
			// 		message.reply('I\'ve sent you a DM with all my commands!');
			// 	})
			// 	.catch(error => {
			// 		console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
			// 		message.reply('it seems like I can\'t DM you!');
			// 	});
			const curr_version = await redis.get('botguy-version');
			args.push(curr_version)
			return version.execute(message, args, redis, level)
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) return message.reply('that\'s not a valid command! Try `!help\` to visualize all commands.');
			
		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) {
			data.push(`**Usage:** !${command.name} ${command.usage}`);
		} else data.push(`**Usage:** !${command.name}`)

		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
		

		message.channel.send(data, { split: true });
	},
	test() {
		return true;
	},
};