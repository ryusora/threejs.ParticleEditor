window.THREEx = window.THREEx || {}
window.THREE = require('../lib/threejs/Three.js')
window.Detector = require('./Detector.js')
window.Stats = require('../lib/Stats.js')
window.THREE.OrbitControls = require('../lib/controls/OrbitControls.js')
window.THREEx.KeyboardState = require('./THREEx.KeyboardState.js')
window.THREEx.FullScreen = require('./THREEx.FullScreen.js')
window.THREEx.WindowResize = require('./THREEx.WindowResize.js')
window.ParticleEngine = require('./ParticleEngine.js')
window.Examples = require('./ParticleEngineExamples.js')
window.dat = require('../lib/controls/DAT.GUI.min.js')
window.scene = require('./Scene.js')
window.FileSaver = require('./FileSaver.js')
window.TextureManager = require('./TextureManager.js')
window.GraphicProfiler = require('./GraphicProfiler.js')
const additionalData = require('../asset/particleData.js')

/*
	Three.js "tutorials by example"
	Author: Lee Stemkoski
	Date: July 2013 (three.js v59dev)
	//
	Editor: Vo Trung Nam
	Date: Jan 2017
*/

// MAIN
window.engine = null;
window.mainCharacter = require('./TestCharacter.js')
window.is_running = true

// standard global variables
var container, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
// custom global variables
var cube;

// Particle variables
var fileName = "";

init();

var cameraDefaultPos

// FUNCTIONS 		
function init() 
{
	var loader = []
    GraphicProfiler.init()
    cameraDefaultPos = new THREE.Vector3(0,15,40)
	// SCENE
	window.scene = window.scene || new THREE.Scene();
	//scene.fog = new THREE.Fog(0x33ccff, 10, 650)
	// CAMERA
	loader.push(new Promise( (resolve, reject) =>{
		mainCharacter.assign('asset/anim_minion_all_clips.json', window.scene, () =>{
			resolve('Main Character init complete')
		})
	}))

	scene.background = new THREE.Color(0x33ccff)
	
	// RENDERER
	renderer = new THREE.WebGLRenderer(GraphicProfiler.getWebGLContextSetting());
	renderer.setPixelRatio(GraphicProfiler.DevicePixelRatio);
    renderer.setSize(GraphicProfiler.Width, GraphicProfiler.Height);

	resetCamera()

	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	// LIGHT
	var light = new THREE.DirectionalLight(0xffffff);
	light.position.set(0,50,-30);
	scene.add(light);

	light = new THREE.DirectionalLight(0xffffff);
	light.position.set(0,50,30);
	scene.add(light);
	// SKYBOX/FOG
	var skyBoxGeometry = new THREE.CubeGeometry( 4000, 4000, 4000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x33ccff, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
    scene.add(skyBox);
	
	// init gui
	window.gui = new dat.GUI();

	// GUI for experimenting with parameters
	var particleList = ["fountain", "startunnel", "starfield", "fireflies", "clouds", "smoke", "fireball", "candle", "rain", "snow" , "firework"];
	var textureList = {
		star			:'asset/particles/star.png',
		spikey			:'asset/particles/spikey.png',
		spark			:'asset/particles/spark.png',
		snowflake		:'asset/particles/snowflake.png',
		smokeparticle	:'asset/particles/smokeparticle.png',
		raindrop2flip	:'asset/particles/raindrop2flip.png',
		glowFlare		:'asset/particles/glowFlare.png',
		checkerboard	:'asset/particles/checkerboard.jpg',
		test			:'asset/particles/test.png',
	}
	loader.push(new Promise( (resolve, reject) =>{
		TextureManager.load(textureList, () => {
			for(var i in additionalData)
			{
				if(i == 'initDone') continue

				var data = additionalData[i]
				convertVector3(data)
		        if (data.hasOwnProperty("texture") && data.hasOwnProperty("particleTexture")) {
		            data.particleTexture = TextureManager.get(data.texture)
		        }
		        Examples[i] = data
		        particleList.push(i)
		        Examples.listParticles.push(i)
				fileName = i
			}
			Examples.initTexture()
			resolve("init textures and additional data done")
		})
	}))

	Promise.all(loader).then(val=>{

		// FLOOR
		// var floorTexture = TextureManager.get('checkerboard');
		// floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
		// floorTexture.repeat.set( 10, 10 );
		// var floorMaterial = new THREE.MeshBasicMaterial( { color: 0x444444, map: floorTexture, side: THREE.DoubleSide } );
		// var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
		// var floor = new THREE.Mesh(floorGeometry, floorMaterial);
		// floor.position.set(0,0,0);
		// floor.rotation.x = Math.PI / 2;
		// scene.add(floor);

		restartEngine(Examples[fileName])
		//////
		// init GUI
		/////
		var parameters =
		{
			Particle: 	fileName, // default value
			Export: 	function(){
							Examples[fileName].particleTexture = ''
							FileSaver.saveAs(new Blob([JSON.stringify(Examples[fileName])], {type: "text/plain;charset=utf-8"}), fileName + ".json")
							Examples.initTexture()
						},
			Refresh: 	function(){
							//restartEngine(Examples[fileName])
							refreshEngine()
						},
		};
		gui.add(parameters, "Particle", particleList)
		.onChange(function(newValue){
			restartEngine(Examples[newValue]);
			gui.removeFolder(fileName);
			fileName = newValue;
			var curFolder = gui.addFolder(fileName);
			Examples.updateGUI(Examples[fileName], curFolder, engine);
		});

		gui.add( parameters, "Export");
		gui.add( parameters, "Refresh");
		gui.removeFolder(fileName);
		var curFolder = gui.addFolder(fileName);
		Examples.updateGUI(Examples[fileName], curFolder, engine);

		gui.open();
		animate()
	}).catch( reason => {
		console.error("Failed with reason : ", reason)
	})
	
}

function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
}

function refreshEngine()
{
	engine.SetAnimation(true)
}

function restartEngine(parameters)
{
	//resetCamera();
	if(engine)
	{
		engine.destroy();
		window.scene.remove(engine.particleMesh)
	}
	engine = new ParticleEngine();
	engine.setValues( parameters );
	engine.initialize();
	engine.SetAnimation(true)
	window.scene.add(engine.particleMesh)
}

function resetCamera()
{
	// CAMERA
	window.camera = new THREE.PerspectiveCamera(105, GraphicProfiler.Width / GraphicProfiler.Height, 0.1, 600);
    camera.setRotationFromEuler(new THREE.Euler(28 * Math.PI / 180, Math.PI, 0))
    window.camera.position.set(cameraDefaultPos.x, cameraDefaultPos.y, cameraDefaultPos.z)
    window.camera.lookAt(mainCharacter);

    scene.add(window.camera)
	controls = new THREE.OrbitControls( window.camera, renderer.domElement );
	THREEx.WindowResize(renderer, window.camera);
}

function convertVector3(data) {
    for (let key in data) {
        if (data[key].hasOwnProperty("x") && data[key].hasOwnProperty("y") && data[key].hasOwnProperty("z")) {
            data[key] = new THREE.Vector3(data[key].x, data[key].y, data[key].z)
        } else if (typeof(data[key]) === 'object') {
            convertVector3(data[key])
        }
    }
}

function update()
{
	if(!window.is_running) return

	controls.update();
	stats.update();

	var dt = clock.getDelta();
	if(engine)
		engine.update( dt );

	window.mainCharacter && window.mainCharacter.updateAnimation(dt)
}

function render() 
{
	renderer.render( scene, window.camera );
}


window.addEventListener('blur', (event)=>{
	window.is_running = false
	console.log('pause')
})

window.addEventListener('focus', (event)=>{
	window.is_running = true
	clock.getDelta();
	console.log('resume')
})