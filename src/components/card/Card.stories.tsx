import { useState } from '@wordpress/element';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Card from './Card';

export default {
	title: 'Common/Card',
	component: Card,
} as ComponentMeta< typeof Card >;

const Template: ComponentStory< typeof Card > = ( args ) => (
	<Card { ...args } />
);

const Cards = [
	{
		title: 'All Cards',
		key: 'all',
	},
	{
		title: 'Abandoned Cards',
		key: 'abandoned',
	},
	{
		title: 'Recovered Cards',
		key: 'recovered',
	},
];

export const ControlledCard = () => {
	const [ activeCard, setActiveCard ] = useState( Cards[ 0 ] );
	return (
		<Card key={ activeCard.key } className={ '' }>
			<div>
				<h1>{ activeCard.title }</h1>
			</div>
		</Card>
	);
};

export const DefaultCard = Template.bind( {} );
