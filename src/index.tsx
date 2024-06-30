/**
 * External dependencies
 */
import { render } from '@wordpress/element';
import './data/store';

/**
 * Internal dependencies
 */
import App from './App';

// Import the stylesheet for the plugin.
import './style/tailwind.css';
import './style/main.scss';

// Render the App component into the DOM
const articleGenElement = document.getElementById( 'article-gen' );

if ( articleGenElement ) {
	render( <App />, articleGenElement );
}
