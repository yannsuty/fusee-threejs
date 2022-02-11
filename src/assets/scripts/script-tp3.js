import * as three from 'http://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js'

let scene, renderer, camera
// Wave configuration
let wavespeed = 1;
let wavewidth = 200;
let waveheight = 100;
let objects_margin = 20;

let clock = new three.Clock();
console.log()

//Array
let waveobjects = new Array();

function init() {
    scene = new three.Scene()

    /********RENDERER*********/
    renderer = new three.WebGLRenderer({ antialias: true})
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth,window.innerHeight)
    document.body.appendChild(renderer.domElement)

    /********CAMERA***********/
    camera = new three.PerspectiveCamera(20, window.innerWidth/window.innerHeight,1,1000)
    camera.position.set(1000,100,500)
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
    /********PARTICLES***********/
    const loader = new three.TextureLoader();
    let particleTexture = loader.load( 'assets/images/firefly.png' );
    let spriteMaterial = new three.SpriteMaterial( { map: particleTexture, transparent : true, opacity :1, color: 0x00FFFFF } );

    for ( let x = 0; x < 100; x ++ ) {
        for ( let y = 0; y < 100; y ++ ) {
            // Sprite creation
            let mesh = new three.Sprite( spriteMaterial )

            mesh.scale.set(10,10,10)
            mesh.position.x = x * objects_margin;    // POSITION X
            mesh.position.z = y * objects_margin;    //POSITION Y
            mesh.position.y = 0;
            scene.add(mesh);
            waveobjects.push(mesh);
        }
    }

    /********CUBE TEST***********/
    //scene.add( new three.Mesh( new three.BoxGeometry( 150, 150, 150 ), new three.MeshPhongMaterial( {color: 0x00ffff, shininess: 200} ) ) )
}

function animateWave()
{
    clock.getDelta()
    let elapsed = clock.elapsedTime

    for(let i = 0 ; i < waveobjects.length ; i++)
    {
        waveobjects[i].position.y = Math.cos( (elapsed + (waveobjects[i].position.x /wavewidth) + (waveobjects[i].position.z /wavewidth) ) *wavespeed ) * waveheight;
    }
}

function render() {
    animateWave()
    console.log("tour")
    renderer.render( scene, camera );

    //Create the loop
    requestAnimationFrame( render );
}

document.body.addEventListener("wheel",ev=>{
    if (ev.wheelDelta>0) {
        camera.position.z+=1
    } else {
        camera.position.z-=1
    }
    console.log(camera.position.z)
})

init()
