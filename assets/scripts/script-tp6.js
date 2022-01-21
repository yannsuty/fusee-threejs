import * as three from '../../libs/three/three.js'
import {FBXLoader} from "../../libs/three/FBXLoader.js";
import {OrbitControls} from "../../libs/three/OrbitControls.js";
import {VertexNormalsHelper} from "../../libs/three/VertexNormalsHelper.js";

let scene, renderer, camera, controls
let directionalLight, sun_mesh
let rocket

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
    directionalLight = new three.PointLight( 0xffffff, 0.6 )
    directionalLight.position.y = 10
    directionalLight.position.x = -100
    scene.add( directionalLight )
    scene.add(new three.PointLightHelper(directionalLight,10))


    /********CONTROLS***********/
    controls=new OrbitControls(camera, renderer.domElement)
    controls.enableDamping=true
    controls.dampingFactor=0.05
    controls.maxPolarAngle=Math.PI/2

    load_model()
    add_objects()
    render()
}

function load_model() {
    new FBXLoader()
        .setPath( 'assets/models/' )
        .load( 'fusee_fbx.fbx', function ( object ) {
            object.position.y = 0;
            rocket=object
            scene.add( object );
            //scene.add(new three.SkeletonHelper(rocket))
            //scene.add(new VertexNormalsHelper(rocket.children,0.5,0xff0000))
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
    controls.update()

    //Create the loop
    requestAnimationFrame( render );
}

init()
