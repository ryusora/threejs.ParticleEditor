/**
 * @author Michael Guerrero / http://realitymeltdown.com
 * @modify tin.nguyenhuuletrong
 *		+ add this into onLoad callback 
 *		+ add default params for playAnim
 */

THREE.BlendCharacter = function(geometry, material, useVertexTexture) {
    this.animName = "none";
    this.weightSchedule = [];
    this.warpSchedule = [];

    if (geometry && material) {
        THREE.SkinnedMesh.call(this, geometry, material, useVertexTexture);
    }

    this.load = function(url, onLoad) {

        var scope = this;
        var loader = new THREE.ObjectLoader();
        loader.load(url, function(loadedObject) {

            // The exporter does not currently allow exporting a skinned mesh by itself
            // so we must fish it out of the hierarchy it is embedded in (scene)
            loadedObject.traverse(function(object) {

                if (object instanceof THREE.SkinnedMesh) {

                    scope.skinnedMesh = object;

                }

            });

            THREE.SkinnedMesh.call(scope, scope.skinnedMesh.geometry, scope.skinnedMesh.material, false);

            // If we didn't successfully find the mesh, bail out
            if (scope.skinnedMesh == undefined) {

                console.log('unable to find skinned mesh in ' + url);
                return;

            }

            scope.material.skinning = true;

            scope.mixer = new THREE.AnimationMixer(scope);
            scope.mixer = scope.mixer;

            // Create the animations
            for (var i = 0; i < scope.geometry.animations.length; ++i) {

                scope.mixer.clipAction(scope.geometry.animations[i]);

            }

            // Loading is complete, fire the callback
            if (onLoad !== undefined) onLoad(scope);

        });

    };

    this.loadJSON = function(url, onLoad) {

        var scope = this;

        var loader = new THREE.JSONLoader();
        loader.load(url, function(geometry, materials) {

            scope.animations = geometry.animations
            var originalMaterial = materials[0];
            originalMaterial.skinning = true;

            THREE.SkinnedMesh.call(scope, geometry, originalMaterial);

            var mixer = new THREE.AnimationMixer(scope);
            scope.mixer = mixer;

            // Create the animations
            for (var i = 0; i < geometry.animations.length; ++i) {

                mixer.clipAction(geometry.animations[i]);

            }

            // Loading is complete, fire the callback
            if (onLoad !== undefined) onLoad(scope);

        });

    };

    this.updateAnimation = function(dt) {
        if (this.mixer)
            this.mixer.update(dt);

    };

    this.play = function(animName, weight = 1, mode = THREE.LoopRepeat, loopNum = Infinity) {
        this.animName = animName;
        return this.mixer.clipAction(animName).setEffectiveWeight(weight).setLoop(mode, loopNum).play();
    };

    this.playOne = function(animName, weight = 1, mode = THREE.LoopOne, loopNum = 0) {
        this.animName = animName;
        var action = this.mixer.clipAction(animName).setEffectiveWeight(weight).setLoop(mode, loopNum).play();

        // register onEnd
        action.onEnd = function(callback) {
            if (this.ticket)
                clearTimeout(this.ticket)
            this.ticket = setTimeout(callback, action._clip.duration * 1000);
            this.animName = "none";
        }

        return action
    };

    this.crossfade = function(fromAnimName, toAnimName, duration) {

        this.mixer.stopAllAction();

        var fromAction = this.play(fromAnimName, 1);
        var toAction = this.play(toAnimName, 1);

        fromAction.crossFadeTo(toAction, duration, false);

    };

    this.warp = function(fromAnimName, toAnimName, duration) {

        this.mixer.stopAllAction();

        var fromAction = this.play(fromAnimName, 1);
        var toAction = this.play(toAnimName, 1);

        fromAction.crossFadeTo(toAction, duration, true);

    };

    this.applyWeight = function(animName, weight) {

        this.mixer.clipAction(animName).setEffectiveWeight(weight);

    };

    this.getWeight = function(animName) {

        return this.mixer.clipAction(animName).getEffectiveWeight();

    }

    this.pauseAll = function() {

        this.mixer.timeScale = 0;

    };

    this.unPauseAll = function() {

        this.mixer.timeScale = 1;

    };


    this.stopAll = function() {

        this.mixer.stopAllAction();

    };

    this.showModel = function(boolean) {

        this.visible = boolean;

    }

};


THREE.BlendCharacter.prototype = Object.create(THREE.SkinnedMesh.prototype);
THREE.BlendCharacter.prototype.constructor = THREE.BlendCharacter;

THREE.BlendCharacter.prototype.getForward = function() {

    var forward = new THREE.Vector3();

    return function() {

        // pull the character's forward basis vector out of the matrix
        forward.set(-this.matrix.elements[8], -this.matrix.elements[9], -this.matrix.elements[10]);

        return forward;

    }

};

THREE.BlendCharacter.prototype.clone = function() {

    const ins = THREE.SkinnedMesh.prototype.clone.call(this)

    var mixer = new THREE.AnimationMixer(ins);
    ins.mixer = mixer;

    // Create the animations
    for (var i = 0; i < ins.geometry.animations.length; ++i) {
        mixer.clipAction(ins.geometry.animations[i]);
    }

    return ins

}