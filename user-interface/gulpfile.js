
const path = require('path');
const gulp = require('gulp');
const exec = require('child_process').exec;

const dest_potree = 'public/potree';
const fs = require("fs");
const fsp = fs.promises;
const concat = require('gulp-concat');
//const gutil = require('gulp-util');
//const through = require('through');
//const File = gutil.File;
const connect = require('gulp-connect');
const replace = require('gulp-replace-path');
//const watch = require('glob-watcher');
const {watch} = gulp;


let paths = {
	laslaz: [
		path.join(dest_potree, "workers/laslaz-worker.js"),
		path.join(dest_potree, "workers/lasdecoder-worker.js"),
	],
	html: [
		"potree/src/viewer/potree.css",
		"potree/src/viewer/sidebar.html",
		"potree/src/viewer/profile.html"
	],
	resources: [
		"potree/resources/**/*"
	]
};

let workers = {
	"LASLAZWorker": [
		"potree/libs/plasio/workers/laz-perf.js",
		"potree/libs/plasio/workers/laz-loader-worker.js"
	],
	"LASDecoderWorker": [
		"potree/src/workers/LASDecoderWorker.js"
	],
	"EptLaszipDecoderWorker": [
		"potree/src/workers/EptLaszipDecoderWorker.js"
	],
	"EptBinaryDecoderWorker": [
		"potree/src/workers/EptBinaryDecoderWorker.js"
	],
	"EptZstandardDecoderWorker": [
		"potree/src/workers/EptZstandardDecoderWorker.js"
	],
	"GreyhoundBinaryDecoderWorker": [
		"potree/libs/plasio/workers/laz-perf.js",
		"potree/src/workers/GreyhoundBinaryDecoderWorker.js",
		"potree/src/Version.js",
		"potree/src/loader/PointAttributes.js",
		"potree/src/InterleavedBuffer.js",
		"potree/src/utils/toInterleavedBufferAttribute.js",
	]
};

let shaders = [
	"potree/src/materials/shaders/pointcloud.vs",
	"potree/src/materials/shaders/pointcloud.fs",
	"potree/src/materials/shaders/pointcloud_sm.vs",
	"potree/src/materials/shaders/pointcloud_sm.fs",
	"potree/src/materials/shaders/normalize.vs",
	"potree/src/materials/shaders/normalize.fs",
	"potree/src/materials/shaders/normalize_and_edl.fs",
	"potree/src/materials/shaders/edl.vs",
	"potree/src/materials/shaders/edl.fs",
	"potree/src/materials/shaders/blur.vs",
	"potree/src/materials/shaders/blur.fs",
];

// For development, it is now possible to use 'gulp webserver'
// from the command line to start the server (default port is 8080)
gulp.task('webserver', gulp.series(async function() {
	server = connect.server({port: 1234});
}));

gulp.task('examples_page', async function(done) {

	let settings = JSON.parse(fs.readFileSync("potree/examples/page.json", 'utf8'));
	let files = fs.readdirSync("./potree/examples");

	let unhandledCode = ``;
	let exampleCode = ``;
	let showcaseCode = ``;
	let thirdpartyCode = ``;

	{
		let urls = settings.examples.map(e => e.url);
		let unhandled = [];
		for(let file of files){
			let isHandled = false;
			for(let url of urls){

				if(file.indexOf(url) !== -1){
					isHandled = true;
				}
			}

			if(!isHandled){
				unhandled.push(file);
			}
		}
		unhandled = unhandled
			.filter(file => file.indexOf(".html") > 0)
			.filter(file => file !== "page.html");


		for(let file of unhandled){
			unhandledCode += `
				<a href="${file}" class="unhandled">${file}</a>
			`;
		}
	}

	for(let example of settings.examples){
		exampleCode += `
		<a href="${example.url}" target="_blank" style="display: inline-block">
			<div class="thumb" style="background-image: url('${example.thumb}'); ">
				<div class="thumb-label">${example.label}</div>
			</div>
		</a>
		`;
	}

	for(let showcaseItem of settings.showcase){
		showcaseCode += `<a href="${showcaseItem.url}" target="_blank" style="display: inline-block">
			<div class="thumb" style="background-image: url('${showcaseItem.thumb}'); ">
				<div class="thumb-label">${showcaseItem.label}</div>
			</div>
		</a>
		`;
	}

	for(let item of settings.thirdparty){
		thirdpartyCode += `<a href="${item.url}" target="_blank" style="display: inline-block">
			<div class="thumb" style="background-image: url('${item.thumb}'); ">
				<div class="thumb-label">${item.label}</div>
			</div>
		</a>
		`;
	}


	let page = `
		<html>
			<head>
			<style>

			body{
				background: #ECE9E9;
				padding: 30px;
			}

			.thumb{
				background-size: 140px 140px;
				width: 140px;
				height: 140px;
				border-radius: 5px;
				border: 1px solid black;
				box-shadow: 3px 3px 3px 0px #555;
				margin: 0px;
				float: left;
			}

			.thumb-label{
				font-size: large;
				text-align: center;
				font-weight: bold;
				color: #FFF;
				text-shadow:black 0 0 5px, black 0 0 5px, black 0 0 5px, black 0 0 5px, black 0 0 5px, black 0 0 5px;
				height: 100%;
			}

			.unhandled_container{
				max-width: 1200px;
				margin: auto;
				margin-top: 50px;

			}

			.unhandled{
				width: 30%;
				padding-top:8px;
				padding-bottom:8px;
				padding-left: 10px;
				float:left;
				font-family: "Helvetica Neue", "Lucida Grande", Arial;
				font-size: 13px;
				border: 1px solid rgba(0, 0, 0, 0);

			}

			.unhandled:hover{
				border: 1px solid rgba(200, 200, 200, 1);
				border-radius: 4px;
				background: white;
			}

			a{
				color: #555555;
			}

			h1{
				font-weight: 500;
				color: rgb(51, 51, 51);
				font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
			}

			#samples_container{
				display: grid;
				grid-template-columns: 70% 30%;
				grid-gap: 10px;
				grid-template-rows: auto auto;

				max-width: 1300px;
				margin: auto;
			}


			#thumb_container{
				grid-column-start: 1;
				grid-column-end: 1;
				grid-row-start: 1;
				grid-row-end: 1;

				max-width: 1200px;
				margin: auto;
				margin-top: 20px
			}

			#external_container{
				grid-column-start: 2;
				grid-column-end: 2;
				grid-row-start: 1;
				grid-row-end: span 2;

				margin-top: 20px
			}

			#showcase_container{
				grid-column-start: 1;
				grid-column-end: 1;
				grid-row-start: 2;
				grid-row-end: 2;

				max-width: 1200px;
				margin: auto;
				margin-top: 20px;
			}

			</style>
			</head>
			<body>

				<div id="samples_container">

					<div id="thumb_container">
						<h1>Examples</h1>
						${exampleCode}
					</div>

					<div id="showcase_container">
						<h1>Showcase</h1>
						${showcaseCode}
					</div>

					<div id="external_container">
						<h1>Third Party</h1>
						${thirdpartyCode}
					</div>

				</div>



				<div class="unhandled_container">
					<h1>Other</h1>
					${unhandledCode}
				</div>

			</body>
		</html>
	`;

	fs.writeFile(`potree/examples/page.html`, page, (err) => {
		if(err){
			console.log(err);
		}else{
			console.log(`created examples/page.html`);
		}
	});

	done();

});

gulp.task('icons_viewer', async function(done) {
	let iconsPath = "potree/resources/icons";

	fs.readdir(iconsPath, function(err, items) {

		let svgs = items.filter(item => item.endsWith(".svg"));
		let other = items.filter(item => !item.endsWith(".svg"));

		items = [...svgs, ...other];

		let iconsCode = ``;
		for(let item of items){
			let extension = path.extname(item);
			if(![".png", ".svg", ".jpg", ".jpeg"].includes(extension)){
				continue;
			}

			let iconCode = `
			<span class="icon_container" style="position: relative; float: left">
				<center>
				<img src="${item}" style="height: 32px;"/>
				<div style="font-weight: bold">${item}</div>
				</center>
			</span>
			`;

			//iconsCode += `<img src="${item}" />\n`;
			iconsCode += iconCode;
		}

		let page = `
			<html>
				<head>
					<style>
						.icon_container{
							border: 1px solid black;
							margin: 10px;
							padding: 10px;
						}
					</style>
				</head>
				<body>
					<div id="icons_container">
						${iconsCode}
					</div>
				</body>
			</html>
		`;

		fs.writeFile(`${iconsPath}/index.html`, page, (err) => {
			if(err){
				console.log(err);
			}else{
				console.log(`created ${iconsPath}/index.html`);
			}
		});

	});

	done();

});

gulp.task('test', async function() {

	console.log("asdfiae8ofh");

});

gulp.task("workers", async function(done){

	for(let workerName of Object.keys(workers)){

		gulp.src(workers[workerName])
			.pipe(concat(`${workerName}.js`))
			.pipe(gulp.dest(path.join(dest_potree, 'potree/workers')));
	}

	done();
});

gulp.task("shaders", async function(){

	const components = [
		"let Shaders = {};"
	];

	for(let file of shaders){
		const filename = path.basename(file);

		const content = await fsp.readFile(file);

		const prep = `Shaders["${filename}"] = \`${content}\``;

		components.push(prep);
	}

	components.push("export {Shaders};");

	const content = components.join("\n\n");

    fs.mkdir(path.join(dest_potree, 'shaders'), { recursive: true}, (err) => { if (err) throw err; });
	const targetPath = path.join(dest_potree, `shaders/shaders.js`);
	fs.writeFileSync(targetPath, content);
});

gulp.task('build', 
	gulp.series(
		gulp.parallel("workers", "shaders", "icons_viewer", "examples_page"),
		async function(done){
			gulp.src(paths.html).pipe(gulp.dest(path.join(dest_potree, 'potree')));

			gulp.src(paths.resources).pipe(gulp.dest(path.join(dest_potree, 'potree/resources')));

            gulp.src(['potree/libs/**/*']).pipe(gulp.dest(path.join(dest_potree, 'libs')));

            gulp.src(['potree/pointclouds/**/*']).pipe(gulp.dest(path.join(dest_potree, 'pointclouds')));

			gulp.src(["potree/LICENSE"]).pipe(gulp.dest(dest_potree));

			done();
		}
	)
);

gulp.task("pack", async function(){
	exec('rollup -c', function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
	});
});

//gulp.task('prepare', async function(){
//    gulp.src(['potree/src/materials/*.js'])
//        .pipe(replace('../../build/shaders/shaders.js', 'build/shaders/shaders.js'))
//        .pipe(gulp.dest('test.txt'));
//});

gulp.task('watch', gulp.parallel("build", "pack", "webserver", async function() {

	let watchlist = [
		'potree/src/**/*.js',
		'potree/src/**/*.css',
		'potree/src/**/*.html',
		'potree/src/**/*.vs',
		'potree/src/**/*.fs',
		'potree/resources/**/*',
		'potree/examples//**/*.json',
		'!potree/resources/icons/index.html',
	];

	watch(watchlist, gulp.series("build", "pack"));

}));


