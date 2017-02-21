require('./core/BlendCharacter.js')

function TestCharacter()
{
	THREE.BlendCharacter.call(this)
	this.vectorUp 		= new THREE.Vector3( 0, 1, 0)
	this.vectorDown 	= new THREE.Vector3( 0,-1, 0)
	this.vectorLeft 	= new THREE.Vector3(-1, 0, 0)
	this.vectorRight 	= new THREE.Vector3( 1, 0, 0)
	this.vectorIn 		= new THREE.Vector3( 0, 0,-1)
	this.vectorOut 		= new THREE.Vector3( 0, 0, 1)
}

TestCharacter.prototype = Object.assign(Object.create(THREE.BlendCharacter.prototype), {
	constructor: TestCharacter,
	moveWithOffset:function(addedValue){
		this.position.add(addedValue)
	},
	init:function(){
		document.body.addEventListener('keydown', (event) =>
	    {
	        switch (event.keyCode)
	        {
	            case Define.KEYCODE_W:
	            {
	            	this.moveWithOffset(this.vectorIn)
	            	break
	            }
	            case Define.KEYCODE_ARROW_UP:
	            {
	            	// move up
	            	this.moveWithOffset(this.vectorUp)
	                break
	            }
	            case Define.KEYCODE_ARROW_LEFT:
	            case Define.KEYCODE_A:
	            {
	            	// move left
	            	this.moveWithOffset(this.vectorLeft)
	                break
	            }
	            case Define.KEYCODE_ARROW_RIGHT:
	            case Define.KEYCODE_D:
	            {
	            	// move right
	            	this.moveWithOffset(this.vectorRight)
	                break
	            }
	            case Define.KEYCODE_S:
	            {
	            	this.moveWithOffset(this.vectorOut)
	            	break
	            }
	            case Define.KEYCODE_ARROW_DOWN:
	            {
	            	// move down
	            	this.moveWithOffset(this.vectorDown)
	                break
	            }
	        }
	        console.log(this.position)
	    }, false)
	    this.rotateY(Math.PI)
	    this.scale.multiplyScalar(16)
	    this.play('run', 1)
	},
	assign(model, scene, callback) {
		var obj = this
        obj.loadJSON(model, () => {
            obj.init()
            scene.add(obj)
            callback()
        })
    }
})

module.exports = new TestCharacter()