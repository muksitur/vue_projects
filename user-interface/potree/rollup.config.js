import includePaths from 'rollup-plugin-includepaths';

const path = require('path');
const dest_potree = 'build';

let includePathOptions = {
    include: {},
    paths: [dest_potree],
    external: [],
};

export default [
	{
		input: 'src/Potree.js',
		treeshake: false,
		output: {
			file: 'build/potree/potree.js',
			format: 'umd',
			name: 'Potree',
			sourcemap: true,
		},
        plugins: [ includePaths(includePathOptions) ],
	},{
		input: 'src/workers/BinaryDecoderWorker.js',
		output: {
			file: 'build/potree/workers/BinaryDecoderWorker.js',
			format: 'es',
			name: 'Potree',
			sourcemap: false
		}
	}/*,{
		input: 'src/workers/LASDecoderWorker.js',
		output: {
			file: 'build/potree/workers/LASDecoderWorker.js',
			format: 'es',
			name: 'Potree',
			sourcemap: true
		}
	},{
		input: 'src/workers/LASLAZWorker.js',
		output: {
			file: 'build/potree/workers/LASLAZWorker.js',
			format: 'es',
			name: 'Potree',
			sourcemap: true
		}
	}*/
]
