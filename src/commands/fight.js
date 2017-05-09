function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

const actions = {
    punch: [
        'was punched in the gut by',
        'was punched in the face by',
        'was punched in the stomach by'
    ],
    kick: [
        'was kicked in his gut by',
        'was dropkicked by',
        'was kicked in his butt by'
    ],
    slam: [
        'was slammed on the head with a ladder by',
        'was slammed in the face with a hammer by',
        'was slammed on the head with a metal door by',
        'was slammed into the wall by'
    ]
};

const validActions = Object.keys(actions).concat('leave');
const validActionString = validActions.map(action => `**${action}**`).join(' || ');

const miss = 'You missed!';

function Player(user) {
    if (Player.cache[user.id]) {
        return Player.cache[user.id];
    }

    Player.cache[user.id] = this;

    this.user = user;
    this.hp = 100;
    this.isFighting = false;
}

Player.prototype.reset = function () {
    this.hp = 100;
};

Player.prototype.debug = function () {
    console.log(`${this.user.username}'s HP: ${this.hp}`);
};

this.end = 0;

Player.cache = {};

exports.run = (bot, message) => {
    const mention = message.mentions.users.first();

    if (!mention) {
        throw 'You must mention someone to fight them!';
    }

    if (mention.bot) {
        throw 'You can\'t play with a bot!';
    }

    if (mention.id === message.author.id) {
        throw 'You can\'t play with yourself!';
    }

    var you = new Player(message.author);
    if (you.isFighting) {
        throw 'You\'re already fighting someone!';
    }

    var opponent = new Player(mention);
    if (opponent.isFighting) {
        throw 'Your opponent is already in a fight!';
    }

    you.isFighting = true;
    opponent.isFighting = true;

    fight(message, you, opponent, true);
};

function fight(message, player1, player2, turn) {
    const currentPlayer = turn ? player1 : player2;
    const targetPlayer = turn ? player2 : player1;

    message.channel.send(`**${currentPlayer.user.username}**, it's your turn. Type ${validActionString} to hit the enemy.`);
    message.channel.awaitMessages(response => response.author.id === currentPlayer.user.id && validActions.indexOf(response.content) > -1, {
        max: 1,
        time: 30000,
        errors: ['time'],
    }).then(collected => {
        let msg = collected.first();

        if (msg.content === 'leave') {
            msg.channel.send(`**${currentPlayer.user.username}** surrendered to **${targetPlayer.user.username}**!`);

            currentPlayer.reset();
            targetPlayer.reset();

            return;
        }

        let action = randomItem(actions[msg.content]);
        let result = randomItem([miss, action]);

        if (result === miss) {
            message.channel.send(miss);
        } else {
            // Damage from 5 to 20 (0 + 5 to 15 + 5)
            let damage = Math.floor(Math.random() * 15 + 5);

            targetPlayer.hp -= damage;
            message.channel.send(`**${targetPlayer.user.username}** ${result} **${currentPlayer.user.username}**\n**${targetPlayer.user.username}**'s health is now ${targetPlayer.hp}, he lost ${damage} HP.`);
        }

        if (targetPlayer.hp <= 0) {
            message.channel.send(`**${targetPlayer.user.username}** was defeated by **${currentPlayer.user.username}**!`);
            targetPlayer.reset();
            currentPlayer.reset();
        } else {
            // By doing !turn it inverts the turn state. Ezpz ;)
            fight(message, player1, player2, !turn);
        }

    }).catch(() => {
        message.channel.send(`**${currentPlayer.user.username}** didn't respond, so we can assume that he has lost his turn.`);
        fight(message, player1, player2, !turn);
        end++
    });
if (end === 4) {
    message.channel.send(':x: Looks like No one is Responding, Terminating the game')
     currentPlayer.reset();
    targetPlayer.reset();
    return;
}
}

exports.info = {
    name: 'fight',
    usage: 'fight <@user>',
    description: 'Start a fight with another user and see who will win.'
};
