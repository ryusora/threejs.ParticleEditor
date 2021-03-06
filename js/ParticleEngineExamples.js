/**
* @author Lee Stemkoski   http://www.adelphi.edu/~stemkoski/
*/

/* 
	Particle Engine options:
	
	positionBase   : new THREE.Vector3(),
	positionStyle : Type.CUBE or Type.SPHERE,

	// for Type.CUBE
	positionSpread  : new THREE.Vector3(),

	// for Type.SPHERE
	positionRadius  : 10,
	
	velocityStyle : Type.CUBE or Type.SPHERE,

	// for Type.CUBE
	velocityBase       : new THREE.Vector3(),
	velocitySpread     : new THREE.Vector3(), 

	// for Type.SPHERE
	speedBase   : 20,
	speedSpread : 10,
		
	accelerationBase   : new THREE.Vector3(),
	accelerationSpread : new THREE.Vector3(),
		
	particleTexture : THREE.ImageUtils.loadTexture( 'images/star.png' ),
		
	// rotation of image used for particles
	angleBase               : 0,
	angleSpread             : 0,
	angleVelocityBase       : 0,
	angleVelocitySpread     : 0,
	angleAccelerationBase   : 0,
	angleAccelerationSpread : 0,
		
	// size, color, opacity 
	//   for static  values, use base/spread
	//   for dynamic values, use Tween
	//   (non-empty Tween takes precedence)
	sizeBase   : 20.0,
	sizeSpread : 5.0,
	sizeTween  : new Tween( [0, 1], [1, 20] ),
			
	// colors stored in Vector3 in H,S,L format
	colorBase   : new THREE.Vector3(0.0, 1.0, 0.5),
	colorSpread : new THREE.Vector3(0,0,0),
	colorTween  : new Tween( [0.5, 2], [ new THREE.Vector3(0, 1, 0.5), new THREE.Vector3(1, 1, 0.5) ] ),

	opacityBase   : 1,
	opacitySpread : 0,
	opacityTween  : new Tween( [2, 3], [1, 0] ),
	
	blendStyle    : THREE.NormalBlending (default), THREE.AdditiveBlending

	particlesPerSecond : 200,
	particleDeathAge   : 2.0,		
	emitterDeathAge    : 60	
*/
var Tween = require('./Tween.js')
var Type = Object.freeze({ "CUBE":1, "SPHERE":2 });
window.TextureManager = require('./TextureManager.js')

var Examples =
{
	listParticles :[
		"fountain",
		"startunnel",
		"starfield",
		"fireflies",
		"clouds",
		"smoke",
		"fireball",
		"candle",
		"rain",
		"snow",
		"firework"
	],
	textureList:[
	'star'			,
	'spikey'		,
	'spark'			,
	'snowflake'		,
	'smokeparticle'	,
	'raindrop2flip'	,
	'glowFlare'		,
	'test'
	],
	// (1) build GUI for easy effects access.
	// (2) write ParticleEngineExamples.js
	
	// Not just any fountain -- a RAINBOW STAR FOUNTAIN of AWESOMENESS
	fountain :
	{
		positionStyle    : Type.CUBE,
		positionBase     : new THREE.Vector3( 0,  0, 0 ),
		positionSpread   : new THREE.Vector3( 1,  0, 10 ),
		
		velocityStyle    : Type.CUBE,
		velocityBase     : new THREE.Vector3( -50, 50, 0 ),
		velocitySpread   : new THREE.Vector3( -100, 100, 0 ), 

		accelerationBase : new THREE.Vector3( 0, -100, 0 ),
		
		texture 		: 'star',
		particleTexture : null,

		angleBase               : 0,
		angleSpread             : 180,
		angleVelocityBase       : 0,
		angleVelocitySpread     : 360 * 4,
		
		sizeTween    : new Tween( [0, 1], [2, 0.1] ),
		opacityTween : new Tween( [1, 2], [1, 0] ),
		colorTween   : new Tween( [0, 1], [ new THREE.Vector3(0.16, 1, 0.77), new THREE.Vector3(0, 1, 0.5) ] ),

		particlesPerSecond : 100,
		particleDeathAge   : 2.0,		
		emitterDeathAge    : 60
	},

	fireball :
	{
		positionStyle  : Type.SPHERE,
		positionBase   : new THREE.Vector3( 0, 50, 0 ),
		positionRadius : 2,
				
		velocityStyle : Type.SPHERE,
		speedBase     : 40,
		speedSpread   : 8,
		
		texture 		: 'smokeparticle',
		particleTexture : null,

		sizeTween    : new Tween( [0, 0.1], [1, 150] ),
		opacityTween : new Tween( [0.7, 1], [1, 0] ),
		colorBase    : new THREE.Vector3(0.02, 1, 0.4),
		blendStyle   : THREE.AdditiveBlending,

		particlesPerSecond : 60,
		particleDeathAge   : 1.5,
		emitterDeathAge    : 60
	},
	smoke :
	{
		positionStyle    : Type.CUBE,
		positionBase     : new THREE.Vector3( 0, 0, 0 ),
		positionSpread   : new THREE.Vector3( 10, 0, 10 ),

		velocityStyle    : Type.CUBE,
		velocityBase     : new THREE.Vector3( 0, 150, 0 ),
		velocitySpread   : new THREE.Vector3( 80, 50, 80 ),
		accelerationBase : new THREE.Vector3( 0,-10,0 ),

		texture 		: 'smokeparticle',
		particleTexture : null,

		angleBase               : 0,
		angleSpread             : 720,
		angleVelocityBase       : 0,
		angleVelocitySpread     : 720,

		sizeTween    : new Tween( [0, 1], [32, 128] ),
		opacityTween : new Tween( [0.8, 2], [0.5, 0] ),
		colorTween   : new Tween( [0.4, 1], [ new THREE.Vector3(0,0,0.2), new THREE.Vector3(0, 0, 0.5) ] ),

		particlesPerSecond : 200,
		particleDeathAge   : 2.0,
		emitterDeathAge    : 60
	},

	clouds :
	{
		positionStyle  : Type.CUBE,
		positionBase   : new THREE.Vector3( -100, 100,  0 ),
		positionSpread : new THREE.Vector3(    0,  50, 60 ),

		velocityStyle  : Type.CUBE,
		velocityBase   : new THREE.Vector3( 40, 0, 0 ),
		velocitySpread : new THREE.Vector3( 20, 0, 0 ), 

		texture 		: 'smokeparticle',
		particleTexture : null,

		sizeBase     : 80.0,
		sizeSpread   : 100.0,
		colorBase    : new THREE.Vector3(0.0, 0.0, 1.0), // H,S,L
		opacityTween : new Tween([0,1,4,5],[0,1,1,0]),

		particlesPerSecond : 50,
		particleDeathAge   : 10.0,
		emitterDeathAge    : 60
	},

	snow :
	{
		positionStyle    : Type.CUBE,
		positionBase     : new THREE.Vector3( 0, 200, 0 ),
		positionSpread   : new THREE.Vector3( 500, 0, 500 ),

		velocityStyle    : Type.CUBE,
		velocityBase     : new THREE.Vector3( 0, -60, 0 ),
		velocitySpread   : new THREE.Vector3( 50, 20, 50 ), 
		accelerationBase : new THREE.Vector3( 0, -10,0 ),

		angleBase               : 0,
		angleSpread             : 720,
		angleVelocityBase       :  0,
		angleVelocitySpread     : 60,

		texture 		: 'snowflake',
		particleTexture : null,

		sizeTween    : new Tween( [0, 0.25], [1, 10] ),
		colorBase   : new THREE.Vector3(0.66, 1.0, 0.9), // H,S,L
		opacityTween : new Tween( [2, 3], [0.8, 0] ),

		particlesPerSecond : 200,
		particleDeathAge   : 4.0,
		emitterDeathAge    : 60
	},

	rain :
	{
		positionStyle    : Type.CUBE,
		positionBase     : new THREE.Vector3( 0, 200, 0 ),
		positionSpread   : new THREE.Vector3( 600, 0, 600 ),

		velocityStyle    : Type.CUBE,
		velocityBase     : new THREE.Vector3( 0, -400, 0 ),
		velocitySpread   : new THREE.Vector3( 10, 50, 10 ), 
		accelerationBase : new THREE.Vector3( 0, -10,0 ),

		texture 		: 'raindrop2flip',
		particleTexture : null,

		sizeBase    : 8.0,
		sizeSpread  : 4.0,
		colorBase   : new THREE.Vector3(0.66, 1.0, 0.7), // H,S,L
		colorSpread : new THREE.Vector3(0.00, 0.0, 0.2),
		opacityBase : 0.6,

		particlesPerSecond : 1000,
		particleDeathAge   : 1.0,
		emitterDeathAge    : 60
	},

	starfield :
	{
		positionStyle    : Type.CUBE,
		positionBase     : new THREE.Vector3( 0, 200, 0 ),
		positionSpread   : new THREE.Vector3( 600, 400, 600 ),

		velocityStyle    : Type.CUBE,
		velocityBase     : new THREE.Vector3( 0, 0, 0 ),
		velocitySpread   : new THREE.Vector3( 0.5, 0.5, 0.5 ),

		angleBase               : 0,
		angleSpread             : 720,
		angleVelocityBase       : 0,
		angleVelocitySpread     : 4,

		texture 		: 'spikey',
		particleTexture : null,

		sizeBase    : 10.0,
		sizeSpread  : 2.0,
		colorBase   : new THREE.Vector3(0.15, 1.0, 0.9), // H,S,L
		colorSpread : new THREE.Vector3(0.00, 0.0, 0.2),
		opacityBase : 1,

		particlesPerSecond : 20000,
		particleDeathAge   : 60.0,
		emitterDeathAge    : 0.1
	},

	fireflies :
	{
		positionStyle  : Type.CUBE,
		positionBase   : new THREE.Vector3( 0, 100, 0 ),
		positionSpread : new THREE.Vector3( 400, 200, 400 ),

		velocityStyle  : Type.CUBE,
		velocityBase   : new THREE.Vector3( 0, 0, 0 ),
		velocitySpread : new THREE.Vector3( 60, 20, 60 ),

		texture 		: 'spark',
		particleTexture : null,

		sizeBase   : 30.0,
		sizeSpread : 2.0,
		opacityTween : new Tween([0.0, 1.0, 1.1, 2.0, 2.1, 3.0, 3.1, 4.0, 4.1, 5.0, 5.1, 6.0, 6.1],
		                         [0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 1.0, 1.0, 0.2] ),
		colorBase   : new THREE.Vector3(0.30, 1.0, 0.6), // H,S,L
		colorSpread : new THREE.Vector3(0.3, 0.0, 0.0),

		particlesPerSecond : 20,
		particleDeathAge   : 6.1,
		emitterDeathAge    : 600
	},

	startunnel :
	{
		positionStyle  : Type.CUBE,
		positionBase   : new THREE.Vector3( 0, 0, 0 ),
		positionSpread : new THREE.Vector3( 10, 10, 10 ),

		velocityStyle  : Type.CUBE,
		velocityBase   : new THREE.Vector3( 0, 100, 200 ),
		velocitySpread : new THREE.Vector3( 40, 40, 80 ), 

		angleBase               : 0,
		angleSpread             : 720,
		angleVelocityBase       : 10,
		angleVelocitySpread     : 0,

		texture 		: 'spikey',
		particleTexture : null,

		sizeBase    : 4.0,
		sizeSpread  : 2.0,
		colorBase   : new THREE.Vector3(0.15, 1.0, 0.8), // H,S,L
		opacityBase : 1,
		blendStyle  : THREE.AdditiveBlending,

		particlesPerSecond : 500,
		particleDeathAge   : 4.0,
		emitterDeathAge    : 60
	},

	firework :
	{
		positionStyle  : Type.SPHERE,
		positionBase   : new THREE.Vector3( 0, 10, 0 ),
		positionRadius : 1,

		velocityStyle  : Type.SPHERE,
		speedBase      : 10,
		speedSpread    : 5,

		accelerationBase : new THREE.Vector3( 0, 0, 0 ),

		texture 		: 'spark',
		particleTexture : null,

		sizeTween    : new Tween( [0.1, 0.5, 0.7], [10, 15, 1] ),
		opacityTween : new Tween( [0.2, 0.7, 1.5], [0.75, 1, 0] ),
		colorTween   : new Tween( [0.4, 0.8, 1.0], [ new THREE.Vector3(0,1,1), new THREE.Vector3(0,1,0.6), new THREE.Vector3(0.8, 1, 0.6) ] ),
		blendStyle   : THREE.AdditiveBlending,

		particlesPerSecond : 300,
		particleDeathAge   : 0.2,
		emitterDeathAge    : 0.2
	},

    candle :
	{
		positionStyle  : Type.SPHERE,
		positionBase   : new THREE.Vector3( 0, 50, 0 ),
		positionRadius : 2,

		velocityStyle  : Type.CUBE,
		velocityBase   : new THREE.Vector3(0,100,0),
		velocitySpread : new THREE.Vector3(20,0,20),

		texture 		: 'smokeparticle',
		particleTexture : null,

		sizeTween    : new Tween( [0, 0.3, 1.2], [20, 150, 1] ),
		opacityTween : new Tween( [0.9, 1.5], [1, 0] ),
		colorTween   : new Tween( [0.5, 1.0], [ new THREE.Vector3(0.02, 1, 0.5), new THREE.Vector3(0.05, 1, 0) ] ),
		blendStyle : THREE.AdditiveBlending,

		particlesPerSecond : 60,
		particleDeathAge   : 1.5,
		emitterDeathAge    : 60
	},

	initTexture: function(){
		for(var i in this.listParticles)
		{
			var key = this.listParticles[i]
			if(this.hasOwnProperty(key) && this[key].hasOwnProperty("particleTexture"))
			{
				this[key].particleTexture = TextureManager.get(this[key].texture)
			}
		}
	},

	updateGUI: function(target, gui, engine)
	{
		//===============================================================
		// Particle Texture
		//===============================================================
		gui.add(target, "texture", this.textureList).onChange(newValue=>{
			target.texture = newValue
			target.particleTexture = TextureManager.get(newValue)
		})

		// blend mode
		var blendMode = ['normal', 'additive']

		target.blendStyle = target.blendStyle || engine.blendStyle
		var blendStyle = [] 
		blendStyle.push(blendMode[target.blendStyle - 1])
		gui.add(blendStyle, "0", blendMode).name("Blend Style").onChange(newValue=>{
			target.blendStyle = blendMode.indexOf(newValue) + 1
			engine.blendStyle = blendMode.indexOf(newValue) + 1
		})

		//===============================================================
		// position
		//===============================================================
		var mainFolder = gui.addFolder("Position")

		// Position Base : THREE.Vector3
		target.positionBase = target.positionBase || engine.positionBase;
		var folder = mainFolder.addFolder("Position Base");
		folder.add(target.positionBase, "x", -5000, 5000, 5).onChange(function(newValue){
			target.positionBase.x = newValue;
			engine.positionBase.x = newValue;
		});
		folder.add(target.positionBase, "y", -5000, 5000, 5).onChange(function(newValue){
			target.positionBase.y = newValue;
			engine.positionBase.y = newValue;
		});
		folder.add(target.positionBase, "z", -5000, 5000, 5).onChange(function(newValue){
			target.positionBase.z = newValue;
			engine.positionBase.z = newValue;
		});

		// Position Style : CUBE or SPHERE
		target.positionStyle = target.positionStyle || engine.positionStyle;
		folder.add(target, "positionStyle", [Type.CUBE, Type.SPHERE]).onChange(function(newValue){
			target.positionStyle = newValue;
			engine.positionStyle = newValue;
			gui.destroy()
			this.updateGUI(target, gui, engine)
		});

		// Position Spread : THREE.Vector3
		if(target.positionStyle == Type.CUBE)
		{
			target.positionSpread = target.positionSpread || engine.positionSpread;
			folder = mainFolder.addFolder("Position Spread");
			folder.add(target.positionSpread, "x", -5000, 5000, 5).onChange(function(newValue){
				target.positionSpread.x = newValue;
				engine.positionSpread.x = newValue;
			});
			folder.add(target.positionSpread, "y", -5000, 5000, 5).onChange(function(newValue){
				target.positionSpread.y = newValue;
				engine.positionSpread.y = newValue;
			});
			folder.add(target.positionSpread, "z", -5000, 5000, 5).onChange(function(newValue){
				target.positionSpread.z = newValue;
				engine.positionSpread.z = newValue;
			});
		}
		else
		{
			target.positionRadius = target.positionRadius || engine.positionRadius
			mainFolder.add(target, "positionRadius").onChange(value => {
				target.positionRadius = value
				engine.positionRadius = value
			})
		}
		//===============================================================
		// Velocity
		//===============================================================
		mainFolder = gui.addFolder("Velocity")

		// Velocity type : CUBE or SPHERE
		target.velocityStyle = target.velocityStyle || engine.velocityStyle;
		mainFolder.add(target, "velocityStyle", [Type.CUBE, Type.SPHERE]).onChange(function(newValue){
			target.velocityStyle = newValue;
			engine.velocityStyle = target.velocityStyle;
			gui.destroy()
			this.updateGUI(target, gui, engine)
		});

		// Velocity Base : THREE.Vector3
		if(target.velocityStyle == Type.CUBE)
		{
			target.velocityBase = target.velocityBase || engine.velocityBase;
			folder = mainFolder.addFolder("Velocity Base");
			folder.add(target.velocityBase, "x", -5000, 5000, 5).onChange(function(newValue){
				target.velocityBase.x = newValue;
				engine.velocityBase.x = newValue;
			});
			folder.add(target.velocityBase, "y", -5000, 5000, 5).onChange(function(newValue){
				target.velocityBase.y = newValue;
				engine.velocityBase.y = newValue;
			});
			folder.add(target.velocityBase, "z", -5000, 5000, 5).onChange(function(newValue){
				target.velocityBase.z = newValue;
				engine.velocityBase.z = newValue;
			});
		}
		else
		{
			target.speedBase = target.speedBase || engine.speedBase
			mainFolder.add(target, "speedBase").onChange(newVal =>{
				target.speedBase = newVal
				engine.speedBase = newVal
			})

			mainFolder.add(target, "speedSpread").onChange(newVal =>{
				target.speedSpread = newVal
				engine.speedSpread = newVal
			})
		}

		// Velocity SPREAD : THREE.Vector3
		target.velocitySpread = target.velocitySpread || engine.velocitySpread;
		folder = mainFolder.addFolder("Velocity Spread");
		folder.add(target.velocitySpread, "x", -5000, 5000, 5).onChange(function(newValue){
			target.velocitySpread.x = newValue;
			engine.velocitySpread.x = newValue;
		});
		folder.add(target.velocitySpread, "y", -5000, 5000, 5).onChange(function(newValue){
			target.velocitySpread.y = newValue;
			engine.velocitySpread.y = newValue;
		});
		folder.add(target.velocitySpread, "z", -5000, 5000, 5).onChange(function(newValue){
			target.velocitySpread.z = newValue;
			engine.velocitySpread.z = newValue;
		});

		//===============================================================
		// Acceleration
		//===============================================================
		mainFolder = gui.addFolder("Acceleration")

		// Acceleration Base : THREE.Vector3
		target.accelerationBase = target.accelerationBase || engine.accelerationBase;
		folder = mainFolder.addFolder("Acceleration Base");
		folder.add(target.accelerationBase, "x", -5000, 5000, 5).onChange(function(newValue){
			target.accelerationBase.x = newValue;
			engine.accelerationBase.x = newValue;
		});
		folder.add(target.accelerationBase, "y", -5000, 5000, 5).onChange(function(newValue){
			target.accelerationBase.y = newValue;
			engine.accelerationBase.y = newValue;
		});
		folder.add(target.accelerationBase, "z", -5000, 5000, 5).onChange(function(newValue){
			target.accelerationBase.z = newValue;
			engine.accelerationBase.z = newValue;
		});
		// Acceleration Spread
		folder = mainFolder.addFolder("Acceleration Spread");
		target.accelerationSpread = target.accelerationSpread || engine.accelerationSpread
		folder.add(target.accelerationSpread, "x", -5000, 5000, 5).onChange(function(newValue){
			target.accelerationSpread.x = newValue;
			engine.accelerationSpread.x = newValue;
		});
		folder.add(target.accelerationSpread, "y", -5000, 5000, 5).onChange(function(newValue){
			target.accelerationSpread.y = newValue;
			engine.accelerationSpread.y = newValue;
		});
		folder.add(target.accelerationSpread, "z", -5000, 5000, 5).onChange(function(newValue){
			target.accelerationSpread.z = newValue;
			engine.accelerationSpread.z = newValue;
		});

		//===============================================================
		// Angles
		//===============================================================
		mainFolder = gui.addFolder("Angle");

		// Angle Base
		target.angleBase = target.angleBase || engine.angleBase;
		mainFolder.add(target, "angleBase", -1440, 1440, 5).onChange(function(newValue){
			target.angleBase = newValue;
			engine.angleBase = newValue;
		});

		// Angle Spread
		target.angleSpread = target.angleSpread || engine.angleSpread;
		mainFolder.add(target, "angleSpread", -1440, 1440, 5).onChange(function(newValue){
			target.angleSpread = newValue;
			engine.angleSpread = newValue;
		});

		// Angle Velocity Base
		target.angleVelocityBase = target.angleVelocityBase || engine.angleVelocityBase;
		mainFolder.add(target, "angleVelocityBase", -1440, 1440, 5).onChange(function(newValue){
			target.angleVelocityBase = newValue;
			engine.angleVelocityBase = newValue;
		});

		// Angle Velocity Spread
		target.angleVelocitySpread = target.angleVelocitySpread || engine.angleVelocitySpread;
		mainFolder.add(target, "angleVelocitySpread", -1440, 1440, 5).onChange(function(newValue){
			target.angleVelocitySpread = newValue;
			engine.angleVelocitySpread = newValue;
		});

		// Angle Acceleration Base
		target.angleAccelerationBase = target.angleAccelerationBase || engine.angleAccelerationBase;
		mainFolder.add(target, "angleAccelerationBase", -1440, 1440, 5).onChange(function(newValue){
			target.angleAccelerationBase = newValue;
			engine.angleAccelerationBase = newValue;
		});

		// Angle Velocity Spread
		target.angleAccelerationSpread = target.angleAccelerationSpread || engine.angleAccelerationSpread;
		mainFolder.add(target, "angleAccelerationSpread", -1440, 1440, 5).onChange(function(newValue){
			target.angleAccelerationSpread = newValue;
			engine.angleAccelerationSpread = newValue;
		});


		//===============================================================
		// Particles
		//===============================================================
		mainFolder = gui.addFolder("Particles")

		// particlesPerSecond
		target.particlesPerSecond = target.particlesPerSecond || engine.particlesPerSecond;
		mainFolder.add(target, "particlesPerSecond").onChange(function(newValue){
			target.particlesPerSecond = newValue;
			engine.particlesPerSecond = newValue;
		});

		// particleDeathAge
		target.particleDeathAge = target.particleDeathAge || engine.particleDeathAge;
		mainFolder.add(target, "particleDeathAge").onChange(function(newValue){
			target.particleDeathAge = newValue;
			engine.particleDeathAge = newValue;
		});

		// emitterDeathAge
		target.emitterDeathAge = target.emitterDeathAge || engine.emitterDeathAge;
		mainFolder.add(target, "emitterDeathAge").onChange(function(newValue){
			target.emitterDeathAge = newValue;
			engine.emitterDeathAge = newValue;
		});

		//===============================================================
		// Size
		//===============================================================
		mainFolder = gui.addFolder("Size Tween")

		// size base
		target.sizeBase = target.sizeBase || engine.sizeBase
		mainFolder.add(target, "sizeBase").onChange(newValue =>{
			target.sizeBase = newValue
			engine.sizeBase = newValue
		})

		// Size Spread
		target.sizeSpread = target.sizeSpread || engine.sizeSpread
		mainFolder.add(target, "sizeSpread").onChange(newValue =>{
			target.sizeSpread = newValue
			engine.sizeSpread = newValue
		})

		target.sizeTween = target.sizeTween || engine.sizeTween
		folder = mainFolder.addFolder("Times")
		for(let i in target.sizeTween.times)
		{
			folder.add(target.sizeTween.times, i).name("t-" + i).onChange(newValue=>{
				target.sizeTween.times[i] = newValue
				engine.sizeTween.times[i] = newValue
			})
		}

		folder = mainFolder.addFolder("Values")
		for(let i in target.sizeTween.values)
		{
			folder.add(target.sizeTween.values, i).name("v-" + i).onChange(newValue=>{
				target.sizeTween.values[i] = newValue
				engine.sizeTween.values[i] = newValue
			})
		}

		//===============================================================
		// Color
		//===============================================================
		mainFolder = gui.addFolder("Color Tween")

		// Color base
		target.colorBase = target.colorBase || engine.colorBase
		folder = mainFolder.addFolder("Color Base")
		folder.add(target.colorBase, 'x').name('hue').onChange(newValue =>{
			target.colorBase.x = newValue
			engine.colorBase.x = newValue
		})

		folder.add(target.colorBase, 'y').name('saturation').onChange(newValue =>{
			target.colorBase.y = newValue
			engine.colorBase.y = newValue
		})

		folder.add(target.colorBase, 'z').name('lightness').onChange(newValue =>{
			target.colorBase.z = newValue
			engine.colorBase.z = newValue
		})

		// Color Spread
		target.colorSpread = target.colorSpread || engine.colorSpread
		folder = mainFolder.addFolder("Color Spread")
		folder.add(target.colorSpread, 'x').name('hue').onChange(newValue =>{
			target.colorSpread.x = newValue
			engine.colorSpread.x = newValue
		})

		folder.add(target.colorSpread, 'y').name('saturation').onChange(newValue =>{
			target.colorSpread.y = newValue
			engine.colorSpread.y = newValue
		})

		folder.add(target.colorSpread, 'z').name('lightness').onChange(newValue =>{
			target.colorSpread.z = newValue
			engine.colorSpread.z = newValue
		})

		// Color Tween
		target.colorTween = target.colorTween || engine.colorTween
		folder = mainFolder.addFolder("Times")
		for(let i in target.colorTween.times)
		{
			folder.add(target.colorTween.times, i).name("t-" + i).onChange(newValue=>{
				target.colorTween.times[i] = newValue
				engine.colorTween.times[i] = newValue
			})
		}

		folder = mainFolder.addFolder("Values")
		for(let i in target.colorTween.values)
		{
			let subFolder = folder.addFolder("v-" + i)
			subFolder.add(target.colorTween.values[i], 'x').name('hue').onChange(newValue=>{
				target.colorTween.values[i].x = newValue
				engine.colorTween.values[i].x = newValue
			})
			subFolder.add(target.colorTween.values[i], 'y').name('saturation').onChange(newValue=>{
				target.colorTween.values[i].y = newValue
				engine.colorTween.values[i].y = newValue
			})
			subFolder.add(target.colorTween.values[i], 'z').name('lightness').onChange(newValue=>{
				target.colorTween.values[i].z = newValue
				engine.colorTween.values[i].z = newValue
			})
		}

		//===============================================================
		// Opacity
		//===============================================================
		mainFolder = gui.addFolder("Opacity Tween")

		// size base
		target.opacityBase = target.opacityBase || engine.opacityBase
		mainFolder.add(target, "opacityBase").onChange(newValue =>{
			target.opacityBase = newValue
			engine.opacityBase = newValue
		})

		// Size Spread
		target.opacitySpread = target.opacitySpread || engine.opacitySpread
		mainFolder.add(target, "opacitySpread").onChange(newValue =>{
			target.opacitySpread = newValue
			engine.opacitySpread = newValue
		})

		target.opacityTween = target.opacityTween || engine.opacityTween
		folder = mainFolder.addFolder("Times")
		for(let i in target.opacityTween.times)
		{
			folder.add(target.opacityTween.times, i).name("t-" + i).onChange(newValue=>{
				target.opacityTween.times[i] = newValue
				engine.opacityTween.times[i] = newValue
			})
		}

		folder = mainFolder.addFolder("Values")
		for(let i in target.opacityTween.values)
		{
			folder.add(target.opacityTween.values, i).name("v-" + i).onChange(newValue=>{
				target.opacityTween.values[i] = newValue
				engine.opacityTween.values[i] = newValue
			})
		}
	},
}

module.exports = Examples;