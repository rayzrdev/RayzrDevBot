const inspect = require('util').inspect;

const clean = input => {
    const output = typeof input === 'string' ? input : inspect(input);
    return output.replace(/(@|`)/g, '$1\u200b');
};

exports.run = (bot, msg, args) => {
    const input = args.join(' ');
    if (!input) {
        throw 'You must provide some code to evaluate!';
    }

    msg.delete();

    try {
        const output = clean(eval(input));
        msg.channel.send({
            embed: global.factory.embed()
                .addField('Input', `\`\`\`javascript\n${input.substr(0, 256)}\n\`\`\``)
                .addField('Output', `\`\`\`javascript\n${output.substr(0, 768)}\n\`\`\``)
                .setFooter(`Requested by ${msg.author.tag}`)
        }).then(m => m.delete(15000));
    } catch (err) {
        msg.channel.send(`:x: An error has occurred: \`\`\`\n${err.toString().substr(0, 1500)}\n\`\`\``);
    }
};

exports.info = {
    name: 'eval',
    usage: 'eval <js code>',
    description: 'Evaluates some JavaScript code',
    hidden: true,
    ownerOnly: true
};
