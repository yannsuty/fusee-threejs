import * as three from '../../libs/three/three.js'
import {FBXLoader} from "../../libs/three/FBXLoader.js";
import {OrbitControls} from "../../libs/three/OrbitControls.js";

let scene, renderer, camera, controls
let directionalLight
let rocket
let clock = new three.Clock()

let prevMouseX, angle=0
const power_const=10
const angle_const = Math.PI/180
let power=0


function init() {
    scene = new three.Scene()

    /********RENDERER*********/
    renderer = new three.WebGLRenderer({ antialias: true})
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth,window.innerHeight)
    renderer.setClearColor(0x8f8f8f)
    document.body.appendChild(renderer.domElement)

    /********CAMERA***********/
    camera = new three.PerspectiveCamera(20, window.innerWidth/window.innerHeight,1,1000)
    camera.position.set(0,5,100)
    //camera.lookAt(new three.Vector3(0,10,0))
    scene.add(camera)

    /********LIGHTS***********/
    let ambientLight = new three.AmbientLight(0xcccccc,0.2)
    scene.add(ambientLight)
    directionalLight = new three.DirectionalLight( 0xffffff, 1)
    directionalLight.position.y = 10
    directionalLight.position.z = 100
    scene.add( directionalLight )

    load_model()
}

function load_model() {
    new FBXLoader()
        .setPath( 'assets/models/' )
        .load( 'fusee_fbx.fbx', function ( object ) {
            object.position.y = 0;
            rocket={rocket:object, v:new three.Vector3(0,1,0),w:new three.Vector3(0,0,0)}
            scene.add( object );
            //scene.add(new three.SkeletonHelper(rocket))
            //scene.add(new VertexNormalsHelper(rocket.children,0.5,0xff0000))
            render()
        } );
}

function render() {
    let delta=clock.getDelta()
    renderer.render( scene, camera );
    updateRocket(delta)
    updateCamera(delta)
    requestAnimationFrame( render );
}


function updateLookAt() {
    camera.lookAt(new three.Vector3(rocket.rocket.position.x,rocket.rocket.position.y+10,rocket.rocket.position.z))
}

function updateCamera(delta) {
    let rocketY=rocket.rocket.position.y
    let cameraY=camera.position.y
    let diffY = rocketY-cameraY
    camera.position.x=Math.cos(angle)*100+rocket.rocket.position.x
    camera.position.z=Math.sin(angle)*100+rocket.rocket.position.z
    if (diffY<0.1) {
        camera.position.y+=diffY
    } else {
        camera.position.y+=diffY*delta
    }
    updateLookAt()
}

function updateRocket(delta) {
    rocket.rocket.rotation.x=rocket.w.x
    rocket.rocket.rotation.z=rocket.w.z
    rocket.v.x=Math.cos(rocket.w.x)
    rocket.v.z=Math.cos(rocket.w.z)
    rocket.v.y=Math.acos(Math.sin((Math.sqrt((rocket.v.x*rocket.v.x)+(rocket.v.z*rocket.v.z)))))
    if (power) {
        rocket.rocket.position.x+=rocket.v.x*power*power_const*delta
        rocket.rocket.position.y+=rocket.v.y*power*power_const*delta
        rocket.rocket.position.z+=rocket.v.z*power*power_const*delta
    }
}

document.addEventListener('mousemove',ev=>{
    let mouseX=ev.clientX
    if (mouseX<prevMouseX) {
        angle+=0.1
    } else if (mouseX>prevMouseX) {
        angle-=0.1
    }
    camera.position.x=Math.cos(angle)*100+rocket.rocket.position.x
    camera.position.z=Math.sin(angle)*100+rocket.rocket.position.z
    updateLookAt()
    prevMouseX=mouseX
})

document.addEventListener('keydown',ev=> {
    ev.preventDefault()
    switch(ev.key) {
        case "ArrowUp":
            power+=1
            break
        case "ArrowDown":
            power-=1
            break
        case "z":
            rocket.w.z+=angle_const
            break;
        case "s":
            rocket.w.z-=angle_const
            break;
        case "d":
            rocket.w.x+=angle_const
            break;
        case "q":
            rocket.w.x-=angle_const
            break;
        case "e":
            rocket.w.y+=angle_const
            break;
        case "a":
            rocket.w.y-=angle_const
            break;
    }
})

// document.addEventListener('keydown', ev=>{
//     if (ev.key===' ')
//         is_powered=true
// })
// document.addEventListener('keyup', ev=>{
//     if (ev.key===' ')
//         is_powered=false
// })

init()
