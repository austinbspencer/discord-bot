const fetch = require('node-fetch')

module.exports = {
    name: 'gif',
    aliases: ['video', 'vid'],
    description: 'Send a specified gif. Add arguments if you\'d like!',
    usage: '[**optional** search parameter]',
    args: false,
    readOnly: false,
    guildOnly: false,
    permLevel: 0,
    /**
	 * This command is able to send gifs of whatever argument the user gives
	 * 
	 * @param {message Object} message the message Object that was sent to trigger this command
	 * @param {array} args the rest of the message after the command
	 * @param {Redis client} _redis Redis client (our database)
	 * @param {num} _level users permission level
	 */
    execute: async (message, args, _redis, _level) => {
        let keywords = 'happy'
        if (args.length) {
            keywords = args.join(' ')
        }

        // Keep in mind that ContentFilter is off!!
        let url = `https://api.tenor.com/v1/search?q=${keywords}&key=${process.env.TENOR_KEY}&ContentFilter=off`
        let response = await fetch(url)
        let json = await response.json()
        const index = Math.floor(Math.random() * json.results.length)
        message.channel.send(json.results[index].url)
        console.log(`${keywords} gif sent!`)
    },
    test() {
		return true;
	},
};