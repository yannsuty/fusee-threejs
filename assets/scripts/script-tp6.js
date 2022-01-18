import * as three from '../../libs/three/three.js'
import {FBXLoader} from "../../libs/three/FBXLoader.js";

let scene, renderer, camera
let directionalLight, sun_mesh

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
    camera.position.set(0,10,300)
    camera.lookAt(new three.Vector3(0,10,0))
    scene.add(camera)

    /********LIGHTS***********/
    let ambientLight = new three.AmbientLight(0xcccccc,0.2)
    scene.add(ambientLight)
    directionalLight = new three.DirectionalLight( 0xffffff, 0.6 )
    directionalLight.position.y = 10
    directionalLight.position.x = -150
    scene.add( directionalLight )

    load_model()

    add_objects()

    render()
}

function load_model() {
    new FBXLoader()
        .setPath( 'assets/models/' )
        .load( 'fusee_fbx.fbx', function ( object ) {
            object.position.y = 0;
            scene.add( object );
        } );
}

function add_objects() {
    /********SUN***********/
    sun_mesh = new three.Mesh(
        new three.SphereGeometry(10,100,100),
        new three.MeshBasicMaterial( {color: 0xffff00} ))
    sun_mesh.position.x=-150
    sun_mesh.position.y=10

    scene.add(sun_mesh)
}

let lightAngle=0
function render() {
    lightAngle+=0.005
    sun_mesh.position.x=150*Math.cos(lightAngle)
    sun_mesh.position.z=150*Math.sin(lightAngle)
    directionalLight.position.z = 140*Math.sin(lightAngle)
    directionalLight.position.x = 140*Math.cos(lightAngle)

    renderer.render( scene, camera );

    //Create the loop
    requestAnimationFrame( render );
}

document.body.addEventListener("wheel",ev=>{
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
    camera.lookAt(new three.Vector3(0,10,0))
})

let drag=false, oldX, dX=0, angle=Math.PI
window.onmousedown=function(event) {
    drag=true;
    oldX=event.clientX
};

window.onmouseup=function() {
    drag=false;
};

window.onmousemove=function(event) {
    if (!drag) return false;

    dX=event.clientX-oldX
    if (dX>0) {
        angle -=0.1
    } else if (dX<0) {
        angle +=0.1
    }
    let r=Math.sqrt(Math.pow(camera.position.x,2)+Math.pow(camera.position.z,2))
    camera.position.x=r*Math.cos(angle)
    camera.position.z=r*Math.sin(angle)
    camera.lookAt(new three.Vector3(0,10,0))

    oldX=event.clientX
};

init()
