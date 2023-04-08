const fs = require( 'fs-extra' );
const replace = require( 'replace-in-file' );

const pluginFiles = [
	'includes/**/*',
	'templates/*',
	'src/*',
	'article-gen.php',
];

const { version } = JSON.parse( fs.readFileSync( 'package.json' ) );

replace( {
	files: pluginFiles,
	from: /ARTICLEGEN_SINCE/g,
	to: version,
} );
