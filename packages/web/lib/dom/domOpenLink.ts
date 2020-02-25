import { MouseEventHandler, LinkHTMLAttributes, BaseSyntheticEvent } from 'react';

export default function (event: BaseSyntheticEvent<LinkHTMLAttributes<HTMLLinkElement>>)
{
	event.preventDefault();
	window.open(event.target.href, event.target.href);
	return event
}
