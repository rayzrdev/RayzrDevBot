const responses = [
    'Unclear, ask again later',
    'Soon',
    'Yes',
    'Absolutely!',
    'Never',
    'Magic 8-ball is currently unavailable, please leave a message after the tone. \\*beep\\*',
    'When you are ready',
    'Hopefully',
    'Hopefully not',
    'Oh my, why would you even ask that?',
    'What kind of a question is that?',
    'Over my dead body!',
    'Haha, funny joke'
];

const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];

export const run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'Please specify something to ask of the magic 8-ball!';
    }

    let response = randomItem(responses);

    if (msg.content.toLowerCase().indexOf('ipodtouch0218') > -1 || msg.content.indexOf('233360087979130882') > -1) {
        response = 'HAH';
    }

    msg.channel.send(`:8ball: | **${response}**`);
};

export const info = {
    name: '8ball',
    usage: '8ball <question>',
    description: 'Asks the magic 8-ball a question'
};
