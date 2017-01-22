window.THREEx = window.THREEx || {}
window.THREE = require('./Three.js')
window.Detector = require('./Detector.js')
window.Stats = require('./Stats.js')
window.THREE.OrbitControls = require('./OrbitControls.js')
window.THREEx.KeyboardState = require('./THREEx.KeyboardState.js')
window.THREEx.FullScreen = require('./THREEx.FullScreen.js')
window.THREEx.WindowResize = require('./THREEx.WindowResize.js')
window.ParticleEngine = require('./ParticleEngine.js')
window.Examples = require('./ParticleEngineExamples.js')
window.dat = require('./DAT.GUI.min.js')
window.scene = require('./Scene.js')
window.FileSaver = require('./FileSaver.js')
window.TextureManager = require('./TextureManager.js')
window.GraphicProfiler = require('./GraphicProfiler.js')

window.TestCharacter = require('./TestCharacter.js')

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
window.mainCharacter = new TestCharacter()

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
    GraphicProfiler.init()
    window.mainCharacter.init()
    cameraDefaultPos = new THREE.Vector3(0,15,40)
	// SCENE
	window.scene = window.scene || new THREE.Scene();
	//scene.fog = new THREE.Fog(0x33ccff, 10, 650)
	// CAMERA
	scene.add(mainCharacter)

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
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
	// SKYBOX/FOG
	var skyBoxGeometry = new THREE.CubeGeometry( 4000, 4000, 4000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
    scene.add(skyBox);
	
	////////////
	// CUSTOM //
	////////////

	fileName = "firework";
	
	// GUI for experimenting with parameters

	var gui = new dat.GUI();
	var parameters =
	{
		Particle: 	fileName, // default value
		Export: 	function(){
						Examples[fileName].particleTexture = ''
						FileSaver.saveAs(new Blob([JSON.stringify(Examples[fileName])], {type: "text/plain;charset=utf-8"}), fileName + ".json")
						Examples.initTexture()
					},
		Refresh: 	function(){
						restartEngine(Examples[fileName])
					},
	};

	var particleList = ["fountain", "startunnel", "starfield", "fireflies", "clouds", "smoke", "fireball", "candle", "rain", "snow" , "firework"];

	gui.add(parameters, "Particle", particleList)
		.onChange(function(newValue){
			restartEngine(Examples[newValue]);
			gui.removeFolder(fileName);
			fileName = newValue;
			var curFolder = gui.addFolder(fileName);
			Examples.updateGUI(Examples[fileName], curFolder, engine);
		});

	// animate when init done
	var textureList = {
		star			:'asset/particles/star.png',
		spikey			:'asset/particles/spikey.png',
		spark			:'asset/particles/spark.png',
		snowflake		:'asset/particles/snowflake.png',
		smokeparticle	:'asset/particles/smokeparticle.png',
		raindrop2flip	:'asset/particles/raindrop2flip.png',
		checkerboard	:'asset/particles/checkerboard.jpg',
	}

	TextureManager.load(textureList, ()=>{

		// FLOOR
		var floorTexture = TextureManager.get('checkerboard');
		floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
		floorTexture.repeat.set( 10, 10 );
		var floorMaterial = new THREE.MeshBasicMaterial( { color: 0x444444, map: floorTexture, side: THREE.DoubleSide } );
		var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
		var floor = new THREE.Mesh(floorGeometry, floorMaterial);
		floor.position.set(0,0,0);
		floor.rotation.x = Math.PI / 2;
		scene.add(floor);

		Examples.initTexture()
		restartEngine(Examples[fileName])
		// init GUI
		gui.add( parameters, "Export");
		gui.add( parameters, "Refresh");
		gui.removeFolder(fileName);
		var curFolder = gui.addFolder(fileName);
		Examples.updateGUI(Examples[fileName], curFolder, engine);

		gui.open();	
		animate()
	})
	
}

function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
}

function restartEngine(parameters)
{
	resetCamera();
	if(engine)
	{
		engine.destroy();
		window.mainCharacter.remove(engine.particleMesh)
	}
	engine = new ParticleEngine();
	engine.setValues( parameters );
	engine.initialize();
	engine.startAnimation = true
	window.mainCharacter.add(engine.particleMesh)
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


function update()
{
/*
	if ( keyboard.pressed("1") ) 
		restartEngine( fountain );
	if ( keyboard.pressed("2") ) 
		restartEngine( startunnel );
	if ( keyboard.pressed("3") ) 
		restartEngine( starfield );
	if ( keyboard.pressed("4") ) 
		restartEngine( fireflies );
		
	if ( keyboard.pressed("5") ) 
		restartEngine( clouds );
	if ( keyboard.pressed("6") ) 
		restartEngine( smoke );
		
	if ( keyboard.pressed("7") ) 
		restartEngine( fireball );
	if ( keyboard.pressed("8") ) 
		restartEngine( Examples.candle );
		
	if ( keyboard.pressed("9") ) 
		restartEngine( rain );
	if ( keyboard.pressed("0") ) 
		restartEngine( snow );
		
	if ( keyboard.pressed("q") ) 
		restartEngine( firework );
	// also: reset camera angle
*/
	
	controls.update();
	stats.update();
	
	var dt = clock.getDelta();
	if(engine)
		engine.update( dt * 0.5 );	
}

function render() 
{
	renderer.render( scene, window.camera );
}
