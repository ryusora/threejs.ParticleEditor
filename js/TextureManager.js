function TextureManager()
{
    var textureloader = new THREE.TextureLoader()
    var textures = {}
    var textureLeft = 0
    var onload = undefined

    var loadTexture = function(key)
    {
        textureloader.load(textures[key], function(texture)
        {
            textures[key] = texture
            textureLeft--
            if (textureLeft == 0 && onload)
                onload()
        })
    }

    this.load = function(list, callback)
    {
        onload = callback
        textureLeft += Object.keys(list).length
        for (var key in list)
        {
            textures[key] = list[key]
            loadTexture(key)
        }
    }

    this.get = function(key)
    {
        return textures[key]
    }
}

module.exports = new TextureManager()
