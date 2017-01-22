const UAParser = require("./core/ua-parser.js")
window.Define = require("./Define.js")

// Profiler Score mapping
const PROFILER_SCORE = {
	"high": 2,
	"normal": 1,
	"low": 0
}

const GraphicProfiler = function() {
	this.level = "high"
	this.ObjectDB = []
}

// TTin: still WIP
//	Don't use it
GraphicProfiler.prototype.getCubeTexture = function() {
	if (this.textureCube != null)
		return this.textureCube

	var r = "asset/cube/Bridge2/";
	var urls = [r + "posx.jpg", r + "negx.jpg",
		r + "posy.jpg", r + "negy.jpg",
		r + "posz.jpg", r + "negz.jpg"
	];
	this.textureCube = new THREE.CubeTextureLoader().load(urls);
	this.textureCube.format = THREE.RGBFormat;
	this.textureCube.mapping = THREE.CubeReflectionMapping;

	return this.textureCube
};

GraphicProfiler.prototype.getScore = function(level) {
	level = level || this.level
	return PROFILER_SCORE[level]
};


// Create Profiler base on Profiler level
GraphicProfiler.prototype.createSpriteMaterial = function(sprite) {

	const texture = TextureManager.get(sprite)

	if (this.getScore() >= 1 && (sprite == 'runway')) {
		const normal = TextureManager.get(sprite + '_normal')
		const specular = TextureManager.get(sprite + '_specular')

		if (normal && specular)
			return new THREE.MeshPhongMaterial({
				specular: Define.SPECULAR_COLOR,
				map: texture,
				normalMap: normal,
				specularMap: specular,
				transparent: true,
				side: 0
			})
	}

	if (this.getScore() >= 2 && sprite == 'wall') {
		const normal = TextureManager.get(sprite + '_normal')
		const specular = TextureManager.get(sprite + '_specular')

		if (normal && specular)
			return new THREE.MeshPhongMaterial({
				specular: Define.SPECULAR_COLOR,
				map: texture,
				normalMap: normal,
				specularMap: specular,
				transparent: false,
				side: 0
			})
	}

	return new THREE.MeshBasicMaterial({
		map: TextureManager.get(sprite),
		transparent: true,
		wireframe: false,
		side: 0
	})
};

GraphicProfiler.prototype.init = function() {
	var ua = new UAParser();

	//"{"ua":"Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36","browser":{"name":"Chrome","version":"55.0.2883.87","major":"55"},"engine":{"version":"537.36","name":"WebKit"},"os":{"name":"Android","version":"5.0"},"device":{"model":"SM-G900P","vendor":"Samsung","type":"mobile"},"cpu":{}}"
	this.BrowserInfo = ua.getResult()
	this.Width = document.body.offsetWidth
	this.Height = document.body.offsetHeight
	this.DevicePixelRatio = window.devicePixelRatio

	console.log(this.BrowserInfo)
		// alert(JSON.stringify(this.BrowserInfo))

	if (this.isPad()) {
		this.DevicePixelRatio = 1
		this.level = "normal"

	} else if (!this.isPC()) {
		this.DevicePixelRatio = Math.min(this.DevicePixelRatio, 2)
	}

};

// Call after all scene loaded
GraphicProfiler.prototype.postInit = function() {
	for (var i = 0; i < this.ObjectDB.length; i++) {
		if (this.getScore(this.ObjectDB[i].level)  < this.getScore(this.level))
			this.ObjectDB[i].object.visible = false
	}
};

// Add Profiler Object
GraphicProfiler.prototype.addProfileObject = function(profileName, object) {
	console.log("Add Profiler ", profileName, object)
	this.ObjectDB.push({
		level: profileName,
		object: object
	})
};

GraphicProfiler.prototype.isPC = function() {
	if (this.BrowserInfo.device.type != "mobile" &&
		this.BrowserInfo.device.type != "tablet")
		return true
};


GraphicProfiler.prototype.getWebGLContextSetting = function() {
	if (this.isPC())
		return {
			antialias: true
		}
	else
		return {

		}
};

GraphicProfiler.prototype.isPad = function() {
	if (!this.BrowserInfo || !this.BrowserInfo.device || !this.BrowserInfo.device.model)
		return false

	const model = this.BrowserInfo.device.model.toLowerCase()
	return model.indexOf("ipad") != -1
};

module.exports = new GraphicProfiler();