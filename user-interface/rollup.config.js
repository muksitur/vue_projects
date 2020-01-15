import includePaths from 'rollup-plugin-includepaths';

const path = require('path');
const dest_potree = 'public/potree';

let includePathOptions = {
    include: {},
    paths: [dest_potree],
    external: [],
};


export default [
	{
		input: 'potree/src/Potree.js',
		treeshake: false,
		output: {
			file: path.join(dest_potree, 'potree/potree.js'),
			format: 'umd',
			name: 'Potree',
			sourcemap: true,
		},
        plugins: [ includePaths(includePathOptions) ],
	},{
		input: 'potree/src/workers/BinaryDecoderWorker.js',
		output: {
			file: path.join(dest_potree, 'potree/workers/BinaryDecoderWorker.js'),
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
