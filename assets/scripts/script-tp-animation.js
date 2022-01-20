import * as three from '../../libs/three/three.js'
import {FBXLoader} from "../../libs/three/FBXLoader.js";
import {OrbitControls} from "../../libs/three/OrbitControls.js";

let scene, renderer, camera, controls
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

    /********CONTROLS***********/
    controls=new OrbitControls(camera, renderer.domElement)
    controls.enableDamping=true
    controls.dampingFactor=0.05
    controls.maxPolarAngle=Math.PI/2

    add_objects()
    render()
}

function add_objects() {
    /********ANIMATED ROCKET***********/
    new FBXLoader().load('./assets/models/fusee_anim_9.fbx', (object)=> {
        rocket=object
        rocket.scale.set(1,1,1)
        mixer = new three.AnimationMixer(rocket)
        let tmp = rocket.animations[0]
        console.log(rocket.animations)
        mixer.clipAction(tmp).play()
        scene.add(rocket)
    })
}

function render() {
    let delta = clock.getDelta()
    if (rocket) mixer.update(delta)
    controls.update()
    renderer.render( scene, camera );

    //Create the loop
    requestAnimationFrame( render );
}

init()
