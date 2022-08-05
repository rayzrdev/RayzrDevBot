import Manager from '../manager';

const identical = (array: any) => array.length > 0 && array.findIndex((item: any) => item !== array[0]) === -1;

const lolm8noyadont = (content: any) => {
    const matches = content.match(/<@[&!]?\d{18}>/g) || [];
    return !identical(matches) && matches.length > 20;
};

class AntiPingall extends Manager {
    // @ts-expect-error TS(7010): 'getName', which lacks return-type annotation, imp... Remove this comment to see the full error message
    getName();

    // @ts-expect-error TS(2389): Function implementation name must be 'getName'.
    onMessage(message: any) {
        if (!message.guild || !message.guild.id) {
            return;
        }

        if (/^.{0,3}pingall/i.test(message.content) || lolm8noyadont(message.content)) {
            message.channel.send('<:OOF:401835306216718337>');
            message.author.send(':angry: Go DM a staff member and beg them for forgiveness for spamming @mentions.');
            message.member.addRole(message.guild.roles.find((role: any) => role.name === 'Muted'));
        }
    }
}

export default AntiPingall;
