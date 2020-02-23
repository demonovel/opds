import React, { PropsWithChildren, ReactNode } from 'react';
import { IconButton } from '@material-ui/core';

export default (prop: PropsWithChildren<{}>) =>
{
	return <IconButton onClick={() => window.open('https://discord.gg/MnXkpmX', 'discordapp467794087769014273')}><img src={"https://discordapp.com/api/guilds/467794087769014273/embed.png"}/></IconButton>
}
