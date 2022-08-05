// @ts-expect-error TS(7016): Could not find a declaration file for module 'cool... Remove this comment to see the full error message
import cool from 'cool-ascii-faces';

export const run = (_bot: any, msg: any) => {
    msg.delete();
    msg.channel.send(cool());
};

export const info = {
    name: 'face',
    usage: 'face',
    description: 'Shows a random ASCII face'
};
