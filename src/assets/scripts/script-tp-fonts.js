import * as three from '../../libs/three/three.js'
import {OrbitControls} from "../../libs/three/OrbitControls.js";
import {FontLoader} from "../../libs/three/FontLoader.js";

let scene, renderer, camera, controls
let directionalLight

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


    /********CONTROLS***********/
    controls=new OrbitControls(camera, renderer.domElement)
    controls.enableDamping=true
    controls.dampingFactor=0.05
    controls.maxPolarAngle=Math.PI/2

    /********FONTS***********/
    new FontLoader().load('assets/fonts/helvetiker_regular.typeface.json', font=> {
        let matLite = new three.MeshBasicMaterial({
            color: 0x2c3e50,
            transparent: true,
            opacity: 0.8,
            side: three.DoubleSide
        })
        const shapes = font.generateShapes("My first\nMessage",50)
        const geometry = new three.ShapeGeometry(shapes)
        geometry.computeBoundingBox()
        const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x )
        geometry.translate(xMid,0,0)
        let text=new three.Mesh(geometry,matLite)
        text.position.z=0
        scene.add(text)
    })

    render()
}

function render() {
    renderer.render( scene, camera );
    controls.update()

    //Create the loop
    requestAnimationFrame( render );
}

init()
