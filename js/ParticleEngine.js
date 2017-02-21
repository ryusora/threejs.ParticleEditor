/**
* @author Lee Stemkoski   http://www.adelphi.edu/~stemkoski/
*/

///////////////////////////////////////////////////////////////////////////////

var Tween = require('./Tween.js');

/////////////
// SHADERS //
/////////////

// attribute: data that may be different for each particle (such as size and color);
//      can only be used in vertex shader
// varying: used to communicate data from vertex shader to fragment shader
// uniform: data that is the same for each particle (such as texture)

function lerp(times, values, t)
{
	var i = 0;
	var n = times.length;
	while (i < n && t > times[i])  
		i++;
	if (i == 0) return values[0];
	if (i == n)	return values[n-1];
	var p = (t - times[i-1]) / (times[i] - times[i-1]);
	if (values[0] instanceof THREE.Vector3)
	{
		return values[i-1].clone().lerp( values[i], p );
	}
	else // its a float
	{
		return values[i-1] + p * (values[i] - values[i-1]);
	}
}

var particleVertexShader = 
[
"attribute vec3  customColor;",
"attribute float customOpacity;",
"attribute float customSize;",
"attribute float customAngle;",
"attribute float customVisible;",  // float used as boolean (0 = false, 1 = true)
"varying vec4  vColor;",
"varying float vAngle;",
"void main()",
"{",
	"if ( customVisible > 0.5 )", 				// true
		"vColor = vec4( customColor, customOpacity );", //     set color associated to vertex; use later in fragment shader.
	"else",							// false
		"vColor = vec4(0.0, 0.0, 0.0, 0.0);", 		//     make particle invisible.
		
	"vAngle = customAngle;",

	"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
	"gl_PointSize = customSize * ( 300.0 / length( mvPosition.xyz ) );",     // scale particles as objects in 3D space
	"gl_Position = projectionMatrix * mvPosition;",
"}"
].join("\n");

var particleFragmentShader =
[
"uniform sampler2D texture;",
"varying vec4 vColor;", 	
"varying float vAngle;",   
"void main()", 
"{",
	"gl_FragColor = vColor;",
	
	"float c = cos(vAngle);",
	"float s = sin(vAngle);",
	"vec2 rotatedUV = vec2(c * (gl_PointCoord.x - 0.5) + s * (gl_PointCoord.y - 0.5) + 0.5,", 
	                      "c * (gl_PointCoord.y - 0.5) - s * (gl_PointCoord.x - 0.5) + 0.5);",  // rotate UV coordinates to rotate texture
    	"vec4 rotatedTexture = texture2D( texture,  rotatedUV );",
	"gl_FragColor = gl_FragColor * rotatedTexture;",    // sets an otherwise white particle texture to desired color
"}"
].join("\n");

///////////////////////////////////////////////////////////////////////////////

////////////////////
// PARTICLE CLASS //
////////////////////

function Particle()
{
	this.position     = new THREE.Vector3();
	this.velocity     = new THREE.Vector3(); // units per second
	this.acceleration = new THREE.Vector3();

	this.angle             = 0;
	this.angleVelocity     = 0; // degrees per second
	this.angleAcceleration = 0; // degrees per second, per second
	
	this.size = 16.0;

	this.color   = new THREE.Color();
	this.opacity = 1.0;
			
	this.age   = 0;
	this.alive = 0; // use float instead of boolean for shader purposes	
}

Particle.prototype.update = function(dt)
{
	this.position.add( this.velocity.clone().multiplyScalar(dt) );
	this.velocity.add( this.acceleration.clone().multiplyScalar(dt) );
	
	// convert from degrees to radians: 0.01745329251 = Math.PI/180
	this.angle         += this.angleVelocity     * 0.01745329251 * dt;
	this.angleVelocity += this.angleAcceleration * 0.01745329251 * dt;

	this.age += dt;
	
	// if the tween for a given attribute is nonempty,
	//  then use it to update the attribute's value

	if ( this.sizeTween && this.sizeTween.times.length > 0 )
		this.size = lerp(this.sizeTween.times, this.sizeTween.values, this.age );
				
	if ( this.colorTween && this.colorTween.times.length > 0 )
	{
		var colorHSL = lerp(this.colorTween.times, this.colorTween.values, this.age );
		this.color = new THREE.Color().setHSL( colorHSL.x, colorHSL.y, colorHSL.z );
	}
	
	if ( this.opacityTween && this.opacityTween.times.length > 0 ) {
		this.opacity = lerp(this.opacityTween.times, this.opacityTween.values, this.age );
	}
}
	
///////////////////////////////////////////////////////////////////////////////

///////////////////////////
// PARTICLE ENGINE CLASS //
///////////////////////////

var Type = Object.freeze({ "CUBE":1, "SPHERE":2 });

function ParticleEngine()
{
	/////////////////////////
	// PARTICLE PROPERTIES //
	/////////////////////////
	
	this.positionStyle = Type.CUBE;		
	this.positionBase   = new THREE.Vector3();
	// cube shape data
	this.positionSpread = new THREE.Vector3();
	// sphere shape data
	this.positionRadius = 0; // distance from base at which particles start

	this.velocityStyle = Type.CUBE;
	// cube movement data
	this.velocityBase       = new THREE.Vector3();
	this.velocitySpread     = new THREE.Vector3();
	// sphere movement data
	//   direction vector calculated using initial position
	this.speedBase   = 0;
	this.speedSpread = 0;

	this.accelerationBase   = new THREE.Vector3();
	this.accelerationSpread = new THREE.Vector3();

	this.angleBase               = 0;
	this.angleSpread             = 0;
	this.angleVelocityBase       = 0;
	this.angleVelocitySpread     = 0;
	this.angleAccelerationBase   = 0;
	this.angleAccelerationSpread = 0;

	this.sizeBase   = 0.0;
	this.sizeSpread = 0.0;
	this.sizeTween  = new Tween();

	// store colors in HSL format in a THREE.Vector3 object
	// http://en.wikipedia.org/wiki/HSL_and_HSV
	this.colorBase   = new THREE.Vector3(0.0, 1.0, 0.5); 
	this.colorSpread = new THREE.Vector3(0.0, 0.0, 0.0);
	this.colorTween  = new Tween();

	this.opacityBase   = 1.0;
	this.opacitySpread = 0.0;
	this.opacityTween  = new Tween();

	this.blendStyle = THREE.NormalBlending; // false;

	this.particleArray = [];
	this.particlesPerSecond = 100;
	this.particleDeathAge = 1.0;

	////////////////////////
	// EMITTER PROPERTIES //
	////////////////////////

	this.emitterAge      = 0.0;
	this.emitterAlive    = true;
	this.emitterDeathAge = 60; // time (seconds) at which to stop creating particles.

	// How many particles could be active at any time?
	this.particleCount = this.particlesPerSecond * Math.min( this.particleDeathAge, this.emitterDeathAge );

	//////////////
	// THREE.JS //
	//////////////

	this.particleGeometry = new THREE.BufferGeometry();
	this.particleTexture  = null;
	this.particleMaterial = new THREE.ShaderMaterial( 
	{
		uniforms: 
		{
			texture:   { type: "t", value: this.particleTexture },
		},
		vertexShader:   particleVertexShader,
		fragmentShader: particleFragmentShader,
		transparent: true, // alphaTest: 0.5,  // if having transparency issues, try including: alphaTest: 0.5, 
		blending: THREE.NormalBlending, depthTest: true,
	});
	this.startAnimation = false
	this.particleEnd = true
	this.particleDieCount = 0
}

ParticleEngine.prototype.SetAnimation = function( value)
{
	this.startAnimation = value
	this.particleEnd = !value
	if(this.startAnimation)
	{
		this.particleDieCount = 0
		this.updateAll()
	}
	else
	{
		this.emitterAlive = false
	}
}

ParticleEngine.prototype.setValues = function( parameters )
{
	if ( parameters === undefined ) return;

	// clear any previous tweens that might exist
	this.sizeTween    = new Tween();
	this.colorTween   = new Tween();
	this.opacityTween = new Tween();

	for ( var key in parameters )
		this[ key ] = parameters[ key ];

	// attach tweens to particles

	// calculate/set derived particle engine values
	this.particleArray = [];
	this.emitterAge      = 0.0;
	this.emitterAlive    = true;
	this.particleCount = this.particlesPerSecond * Math.min( this.particleDeathAge, this.emitterDeathAge );
	
	this.particleGeometry = new THREE.BufferGeometry();

	this.particleMaterial = new THREE.ShaderMaterial( 
	{
		uniforms: 
		{
			texture:   { type: "t", value: this.particleTexture },
		},
		vertexShader:   particleVertexShader,
		fragmentShader: particleFragmentShader,
		transparent: true,
		alphaTest: 0.5, // if having transparency issues, try including: alphaTest: 0.5, 
		blending: THREE.NormalBlending, 
		depthTest: true, depthWrite: false,
	});
	this.particleMesh = new THREE.Points( this.particleGeometry, this.particleMaterial );
}
	
// helper functions for randomization
ParticleEngine.prototype.randomValue = function(base, spread)
{
	return base + spread * (Math.random() - 0.5);
}
ParticleEngine.prototype.randomVector3 = function(base, spread)
{
	var rand3 = new THREE.Vector3( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );
	return new THREE.Vector3().addVectors( base, new THREE.Vector3().multiplyVectors( spread, rand3 ) );
}


ParticleEngine.prototype.createParticle = function()
{
	var particle = new Particle();

	this.initParticle(particle)


	// init tween
	particle.sizeTween    = this.sizeTween;
	particle.colorTween   = this.colorTween;
	particle.opacityTween = this.opacityTween;

	particle.age   = 0;
	particle.alive = 0; // particles initialize as inactive
	
	return particle;
}

ParticleEngine.prototype.initParticle = function(particle)
{
	if (this.positionStyle == Type.CUBE)
		particle.position = this.randomVector3( this.positionBase, this.positionSpread ); 
	if (this.positionStyle == Type.SPHERE)
	{
		var z = 2 * Math.random() - 1;
		var t = 6.2832 * Math.random();
		var r = Math.sqrt( 1 - z*z );
		var vec3 = new THREE.Vector3( r * Math.cos(t), r * Math.sin(t), z );
		particle.position = new THREE.Vector3().addVectors( this.positionBase, vec3.multiplyScalar( this.positionRadius ) );
	}

	if ( this.velocityStyle == Type.CUBE )
	{
		particle.velocity     = this.randomVector3( this.velocityBase,     this.velocitySpread ); 
	}
	if ( this.velocityStyle == Type.SPHERE )
	{
		var direction = new THREE.Vector3().subVectors( particle.position, this.positionBase );
		var speed     = this.randomValue( this.speedBase, this.speedSpread );
		particle.velocity  = direction.normalize().multiplyScalar( speed );
	}
	
	particle.acceleration = this.randomVector3( this.accelerationBase, this.accelerationSpread ); 

	particle.angle             = this.randomValue( this.angleBase,             this.angleSpread );
	particle.angleVelocity     = this.randomValue( this.angleVelocityBase,     this.angleVelocitySpread );
	particle.angleAcceleration = this.randomValue( this.angleAccelerationBase, this.angleAccelerationSpread );

	particle.size = this.randomValue( this.sizeBase, this.sizeSpread );

	var color = this.randomVector3( this.colorBase, this.colorSpread );
	particle.color = new THREE.Color().setHSL( color.x, color.y, color.z );
	
	particle.opacity = this.randomValue( this.opacityBase, this.opacitySpread );
}

ParticleEngine.prototype.updateAll = function()
{
	for(let i in this.particleArray)
	{
		this.initParticle(this.particleArray[i])
		this.particleArray[i].age = 0
		this.particleArray[i].alive = 0
	}
	this.emitterAge = 0.0
	this.emitterAlive = true
}

ParticleEngine.prototype.initialize = function()
{
	// link particle data with geometry/material data
	var positions 		= new Float32Array(this.particleCount * 3)
	var customVisible 	= new Float32Array(this.particleCount)
	var customColor 	= new Float32Array(this.particleCount * 3)
	var customOpacity 	= new Float32Array(this.particleCount)
	var customSize 		= new Float32Array(this.particleCount)
	var customAngle 	= new Float32Array(this.particleCount)
	var t = 0
	for (let i = 0; i < this.particleCount; i++)
	{
		// remove duplicate code somehow, here and in update function below.
		this.particleArray.push(this.createParticle())

		positions[t] 		= this.particleArray[i].position.x
		positions[t+1] 		= this.particleArray[i].position.y
		positions[t+2] 		= this.particleArray[i].position.z

		customColor[t] 		= this.particleArray[i].color.r
		customColor[t+1]	= this.particleArray[i].color.g
		customColor[t+2]	= this.particleArray[i].color.b

		customVisible[i] 	= this.particleArray[i].alive
		customOpacity[i] 	= this.particleArray[i].opacity
		customSize[i] 		= this.particleArray[i].size
		customAngle[i] 		= this.particleArray[i].angle
		t+=3
	}

	this.particleGeometry.addAttribute('position', 		new THREE.BufferAttribute(positions, 3));
	this.particleGeometry.addAttribute('customVisible', new THREE.BufferAttribute(customVisible, 1));
	this.particleGeometry.addAttribute('customColor', 	new THREE.BufferAttribute(customColor, 3));
	this.particleGeometry.addAttribute('customOpacity', new THREE.BufferAttribute(customOpacity, 1));
	this.particleGeometry.addAttribute('customSize', 	new THREE.BufferAttribute(customSize, 1));
	this.particleGeometry.addAttribute('customAngle', 	new THREE.BufferAttribute(customAngle, 1));
	
	this.particleMaterial.blending = this.blendStyle;
	if ( this.blendStyle != THREE.NormalBlending) 
		this.particleMaterial.depthTest = false;

	
	this.particleMesh.dynamic = true;
	this.particleMesh.sortParticles = true;
	//this.particleMesh.renderOrder = 5;
}

ParticleEngine.prototype.update = function(dt)
{
	if(!this.startAnimation) return

	var recycleIndices = [];
	
	// update particle data
	for (var i = 0; i < this.particleCount; i++)
	{
		if ( this.particleArray[i].alive )
		{
			this.particleArray[i].update(dt);

			// check if particle should expire
			// could also use: death by size<0 or alpha<0.
			if ( this.particleArray[i].age > this.particleDeathAge ) 
			{
				this.particleArray[i].alive = 0.0;
				this.particleDieCount++
				recycleIndices.push(i);
			}

			// update particle properties in shader
			this.particleGeometry.attributes.position.array[i*3 + 0] 	= this.particleArray[i].position.x
			this.particleGeometry.attributes.position.array[i*3 + 1] 	= this.particleArray[i].position.y
			this.particleGeometry.attributes.position.array[i*3 + 2] 	= this.particleArray[i].position.z
			this.particleGeometry.attributes.customVisible.array[i] 	= this.particleArray[i].alive
			this.particleGeometry.attributes.customColor.array[i*3 + 0] = this.particleArray[i].color.r
			this.particleGeometry.attributes.customColor.array[i*3 + 1] = this.particleArray[i].color.g
			this.particleGeometry.attributes.customColor.array[i*3 + 2] = this.particleArray[i].color.b
			this.particleGeometry.attributes.customOpacity.array[i] 	= this.particleArray[i].opacity
			this.particleGeometry.attributes.customSize.array[i] 		= this.particleArray[i].size
			this.particleGeometry.attributes.customAngle.array[i] 		= this.particleArray[i].angle
			this.particleGeometry.attributes.position.needsUpdate		= true
			this.particleGeometry.attributes.customVisible.needsUpdate 	= true
			this.particleGeometry.attributes.customColor.needsUpdate 	= true
			this.particleGeometry.attributes.customOpacity.needsUpdate 	= true
			this.particleGeometry.attributes.customSize.needsUpdate 	= true
			this.particleGeometry.attributes.customAngle.needsUpdate 	= true
		}
	}

	// check if particle emitter is still running
	if ( !this.emitterAlive )
	{
		if(this.particleDieCount >= this.particleArray.length - 1)
			this.particleEnd = true
		return;
	}

	// if no particles have died yet, then there are still particles to activate
	if ( this.emitterAge < this.particleDeathAge )
	{
		// determine indices of particles to activate
		var startIndex = Math.round( this.particlesPerSecond * (this.emitterAge +  0) );
		var   endIndex = Math.round( this.particlesPerSecond * (this.emitterAge + dt) );
		if  ( endIndex > this.particleCount ) 
			  endIndex = this.particleCount; 
			  
		for (var i = startIndex; i < endIndex; i++)
			this.particleArray[i].alive = 1.0;		
	}

	// if any particles have died while the emitter is still running, we imediately recycle them
	for (var j = 0; j < recycleIndices.length; j++)
	{
		var i = recycleIndices[j];
		this.initParticle(this.particleArray[i]);
		this.particleArray[i].age = 0
		this.particleArray[i].alive = 1.0; // activate right away
		this.particleGeometry.attributes.position.array[i*3] 		= this.particleArray[i].position.x;
		this.particleGeometry.attributes.position.array[i*3 + 1] 	= this.particleArray[i].position.y;
		this.particleGeometry.attributes.position.array[i*3 + 2] 	= this.particleArray[i].position.z;
		// minus dead count
		this.particleDieCount--
	}


	// stop emitter?
	this.emitterAge += dt;
	if ( this.emitterAge > this.emitterDeathAge )  this.emitterAlive = false;
}

ParticleEngine.prototype.destroy = function()
{
	this.startAnimation = false
    window.scence && scene.remove( this.particleMesh );
}
///////////////////////////////////////////////////////////////////////////////

module.exports = ParticleEngine;