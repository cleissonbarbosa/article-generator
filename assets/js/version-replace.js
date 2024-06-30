const fs = require( 'fs-extra' );
const replace = require( 'replace-in-file' );

const pluginFiles = [
	'dist/includes/**/*.php',
	'dist/templates/*',
	'dist/build/*',
	'dist/languages/*',
	'dist/article-gen.php',
];

const { version } = JSON.parse( fs.readFileSync( 'package.json' ) );

replace( {
	files: pluginFiles,
	from: /ARTICLEGEN_SINCE/g,
	to: version,
} );
