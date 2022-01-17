import * as three from 'http://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js'

let scene, renderer, camera
let particleTexture, spriteMaterialAsteroid
let particles=[]
let asteroids=[]

function init() {
    scene = new three.Scene()

    /********RENDERER*********/
    renderer = new three.WebGLRenderer({ antialias: true})
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth,window.innerHeight)
    document.body.appendChild(renderer.domElement)

    /********CAMERA***********/
    camera = new three.PerspectiveCamera(10, window.innerWidth/window.innerHeight,1,1000)
    camera.position.set(0,0,20)
    camera.lookAt(new three.Vector3(0,0,0))
    scene.add(camera)

    /********LIGHTS***********/
    let ambientLight = new three.AmbientLight(0xcccccc,0.2)
    scene.add(ambientLight)
    let directionalLight = new three.DirectionalLight( 0xffffff, 0.6 )
    directionalLight.position.y = -50
    directionalLight.position.x = -150
    scene.add( directionalLight )

    add_objects()

    render()
}

function add_objects() {
    /********SPRITE***********/
    const loader = new three.TextureLoader()
    let bokutexture = loader.load( 'assets/images/rocket.png' )
    bokutexture.magFilter = three.NearestFilter

    let bokusprite = new three.Sprite( new three.SpriteMaterial( { map: bokutexture } ) )
    bokusprite.scale.set( 1, 1, 1);
    bokusprite.position.set(0, 1, 0.2);
    scene.add(bokusprite);

    /********LOAD PARTICLE***********/
    particleTexture = loader.load( 'assets/images/firefly.png')

    /********LOAD PARTICLE***********/
    let particleTextureAsteroid = loader.load( 'assets/images/asteroid.png')
    spriteMaterialAsteroid = new three.SpriteMaterial( { map: particleTextureAsteroid, transparent : true, opacity : 1, color: 0x333333 } )
}
let compteur=0
function asteroidsRender() {
    /********GENERATE ASTEROIDE***********/
    if (compteur++%3==0) {
        let asteroid = new three.Sprite(spriteMaterialAsteroid)
        asteroid.position.y = 5
        asteroid.position.z = Math.random() * 20 - 10
        asteroid.position.x = Math.random() * 10 - 5
        asteroids.push(asteroid)
        scene.add(asteroid)
    }
    for (let i=0;i<asteroids.length;i++) {
        asteroids[i].position.y -= Math.random()/10.0
        //Verif suppression
        if (asteroids[0].position.y<=-5) {
            scene.remove(asteroids[0])
            asteroids.shift()
        }
    }

}

function particlesRender() {
    /********GENERATE PARTICLES***********/
    let max = Math.floor(Math.random()*100)
    for (let i=0;i<max;i++) {
        let spriteMaterial = new three.SpriteMaterial( { map: particleTexture, transparent : true, opacity : 1, color: 0x333333 } )
        let particle = new three.Sprite(spriteMaterial)
        particle.scale.set(0.1, 0.1, 0.1)
        particles.push(particle)
        scene.add(particle)
    }

    /********UPDATE PARTICLES POSITION***********/
    for (let i=0;i<particles.length;i++) {
        particles[i].position.x += Math.random()<0.5?-1*Math.random()/10.0:Math.random()/10.0
        particles[i].position.y -= Math.random()/10.0
        particles[i].material.opacity-=0.015
        //Verif suppression
        if (particles[0].material.opacity<=0.1) {
            scene.remove(particles[0])
            particles.shift()
        }
    }
}

function render() {
    particlesRender()
    asteroidsRender()
    renderer.render( scene, camera )

    //Create the loop
    requestAnimationFrame( render )
}

document.body.addEventListener("wheel",ev=>{
    if (ev.wheelDelta>0) {
        camera.position.z+=1
    } else {
        camera.position.z-=1
    }
})

init()
