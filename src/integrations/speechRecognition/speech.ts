import Swal from 'sweetalert2';
import tailwindConfig from '../../../tailwind.config';
import resolveConfig from 'tailwindcss/resolveConfig';

export interface ISpeechOptions
	extends Pick<
		SpeechRecognition,
		'lang' | 'continuous' | 'interimResults'
	> {
	resultCallback: ( transcript: string ) => void;
	endCallback: () => void;
}

export default function speech(
	options: ISpeechOptions
): boolean | SpeechRecognition {
	// Verifica se a API é suportada pelo navegador
	if ( ! ( 'webkitSpeechRecognition' in window ) ) {
		console.log(
			'A API de reconhecimento de fala não é suportada pelo seu navegador'
		);
		return false;
	}

	// cria um objeto de reconhecimento de fala
	const recognition = new webkitSpeechRecognition();

	// define o idioma da fala com base no idioma do navegador ou custom
	recognition.lang = options.lang || navigator.language;

	// define se a captura de voz deve continuar ou parar depois da primeira fala detectada
	recognition.continuous = options.continuous || false;

	// define se a captura deve incluir pausas de voz
	recognition.interimResults = options.interimResults || true;

	// define a função a ser chamada quando uma fala é detectada
	recognition.onresult = function ( event ) {
		const result = event.results[ event.resultIndex ];
		const transcript = result[ 0 ].transcript;

		console.info( transcript );
		options.resultCallback( transcript );
	};

	recognition.onend = function () {
		options.endCallback();
	};

	recognition.onerror = function ( error ) {
		if ( error.error === 'not-allowed' ) {
			const fullConfig = resolveConfig( tailwindConfig );
			Swal.fire( {
				title: 'We need your permission to use the microphone',
				html: `<img src="https://iili.io/HkNcPX1.png">`,
				confirmButtonColor: fullConfig.theme?.colors.primary as string,
			} );
		}
	};

	recognition.start();
	return recognition;
}
