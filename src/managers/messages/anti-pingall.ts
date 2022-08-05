import Manager from '../manager';

const identical = array => array.length > 0 && array.findIndex(item => item !== array[0]) === -1;

const lolm8noyadont = content => {
    const matches = content.match(/<@[&!]?\d{18}>/g) || [];
    return !identical(matches) && matches.length > 20;
};

class AntiPingall extends Manager {
    getName();

    onMessage(message) {
        if (!message.guild || !message.guild.id) {
            return;
        }

        if (/^.{0,3}pingall/i.test(message.content) || lolm8noyadont(message.content)) {
            message.channel.send('<:OOF:401835306216718337>');
            message.author.send(':angry: Go DM a staff member and beg them for forgiveness for spamming @mentions.');
            message.member.addRole(message.guild.roles.find(role => role.name === 'Muted'));
        }
    }
}

export default AntiPingall;
