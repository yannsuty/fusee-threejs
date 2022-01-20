import * as three from '../../libs/three/three.js'
import {FBXLoader} from "../../libs/three/FBXLoader.js";

let scene, renderer, camera
let directionalLight
let rocket, mixer
let clock = new three.Clock()

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
    camera.position.set(0,10,50)
    camera.lookAt(new three.Vector3(0,0,0))
    scene.add(camera)

    /********LIGHTS***********/
    let ambientLight = new three.AmbientLight(0xcccccc,0.2)
    scene.add(ambientLight)
    directionalLight = new three.DirectionalLight( 0xffffff, 0.6 )
    directionalLight.position.y = 10
    directionalLight.position.x = -150
    scene.add( directionalLight )

    add_objects()
}

function add_objects() {
    /********ANIMATED ROCKET***********/
    new FBXLoader().load('./assets/models/fusee_anim_8.fbx', (object)=> {
        rocket=object
        rocket.scale.set(1,1,1)
        mixer = new three.AnimationMixer(rocket)
        let tmp = rocket.animations[0]
        console.log(rocket.animations)
        mixer.clipAction(tmp).play()
        scene.add(rocket)
        render()
    })
}

function render() {
    let delta = clock.getDelta()
    mixer.update(delta)
    renderer.render( scene, camera );

    //Create the loop
    requestAnimationFrame( render );
}

document.body.addEventListener("wheel",ev=>{
    let lookAt = new three.Vector3(camera.lookAt.x,camera.lookAt.y,camera.lookAt.z)
    let r = Math.sqrt(Math.pow(camera.position.x,2)+Math.pow(camera.position.z,2))+0.1
    if (ev.wheelDelta>0) {
        camera.position.y+=0.1
        camera.position.x+=camera.position.x/r
        camera.position.z+=camera.position.z/r
    } else {
        camera.position.y-=0.1
        camera.position.x-=camera.position.x/r
        camera.position.z-=camera.position.z/r
    }
    camera.lookAt(lookAt)
})

let drag=false, oldX, oldY, dX=0, dY, angle=Math.PI
window.onmousedown=function(event) {
    drag=true;
    oldX=event.clientX
};

window.onmouseup=function() {
    drag=false;
};

window.onmousemove=function(event) {
    if (!drag) return false;

    let lookAt = new three.Vector3(camera.lookAt.x,camera.lookAt.y,camera.lookAt.z)
    dX=event.clientX-oldX
    if (dX>0) {
        angle -=0.1
    } else if (dX<0) {
        angle +=0.1
    }
    let r=Math.sqrt(Math.pow(camera.position.x,2)+Math.pow(camera.position.z,2))
    camera.position.x=r*Math.cos(angle)
    camera.position.z=r*Math.sin(angle)
    camera.lookAt(lookAt)

    oldX=event.clientX
};

init()
