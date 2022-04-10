import * as three from '../../libs/three/three.js'
import {FBXLoader} from "../../libs/three/FBXLoader.js";
import Stats from "../../libs/Stats.js"

let scene, renderer, camera, controls
let directionalLight
let rocket, particleTexture
let clock = new three.Clock()
let stats = Stats()

let prevMouseX, prevAngleCamera, angle=0
const power_const=10
const angle_const = Math.PI/180
const max_angle_const = Math.PI*2
let power=0

let particles=[]


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
    camera.position.set(100,5,0)
    //camera.lookAt(new three.Vector3(0,10,0))
    scene.add(camera)

    /********LIGHTS***********/
    let ambientLight = new three.AmbientLight(0xcccccc,0.2)
    scene.add(ambientLight)
    directionalLight = new three.DirectionalLight( 0xffffff, 1)
    directionalLight.position.y = 10
    directionalLight.position.z = 100
    scene.add( directionalLight )

    /********STATS***********/
    document.body.appendChild(stats.dom)

    load_model()
    add_objects()
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

function add_objects() {
    /********LOAD PARTICLE***********/
    particleTexture = new three.TextureLoader().load( 'assets/images/firefly.png')

    /********AXES***********/
    const material_x = new three.MeshPhongMaterial( {color: 0xff0000, side : three.DoubleSide} )
    const material_y = new three.MeshPhongMaterial( {color: 0x00ff00, side : three.DoubleSide} )
    // const material_z = new three.MeshPhongMaterial( {color: 0x0000ff, side : three.DoubleSide} )
    let axe_x = new three.Mesh(new three.BoxGeometry(100,1,1),material_x)
    let axe_y = new three.Mesh(new three.BoxGeometry(1.01,100,1.01),material_y)
    // let axe_z = new three.Mesh(new three.BoxGeometry(5,5,100),material_z)
    scene.add(axe_x)
    scene.add(axe_y)
    // scene.add(axe_z)
}

function render() {
    let delta=clock.getDelta()
    
    updateRocket(delta)
    updateCamera(delta)
    particlesRender(delta)
    stats.update()
    console.log(rocket.v)
    
    
    renderer.render( scene, camera );
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
    if (diffY<100.0||power<10) {
        camera.position.y+=diffY*delta
    } else {
        //console.log(rocketY-100 + " " + cameraY + " " + (cameraY+(rocketY-cameraY-100)*delta))
        camera.position.y+=(rocketY-cameraY-100)*delta
    }
    updateLookAt()
}

function updateRocket(delta) {
    rocket.rocket.rotation.x=rocket.w.z
    rocket.rocket.rotation.y=rocket.w.y
    rocket.rocket.rotation.z=rocket.w.x
    //On ajoute PI/2 pour tourner par rapport au plan
    const rocketWX=rocket.w.x+Math.PI/2, rocketWZ=rocket.w.z-Math.PI/2
    rocket.v.x=Math.cos(rocketWX)
    rocket.v.y=Math.sin(rocketWX)//+Math.cos(rocketWZ)
    // rocket.v.z=Math.sin(rocketWX)+Math.sin(rocketWZ)
    if (power) {
        rocket.rocket.position.x+=rocket.v.x*power*power_const*delta
        rocket.rocket.position.y+=rocket.v.y*power*power_const*delta
        // rocket.rocket.position.z+=rocket.v.z*power*power_const*delta
    }
}

function particlesRender(delta) {
    /********GENERATE PARTICLES***********/
    let max = power>0?Math.floor(Math.random()*power+1):0
    for (let i=0;i<max;i++) {
        let spriteMaterial = new three.SpriteMaterial( { map: particleTexture, opacity : 1 , color: 0x779977} )
        let particle = new three.Sprite(spriteMaterial)
        particle.position.x=rocket.rocket.position.x+Math.cos(Math.random()*Math.PI*2)
        particle.position.y=rocket.rocket.position.y
        particle.position.z=rocket.rocket.position.z+Math.sin(Math.random()*Math.PI*2)
        // particle.scale.set(0.1, 0.1, 0.1)
        particles.push(particle)
        scene.add(particle)
    }

    /********UPDATE PARTICLES OPACITY***********/
    particles.forEach(elem=> {
        elem.material.opacity-=Math.random()/250.0
        if (particles[0].material.opacity<0) {
            scene.remove(particles[0])
            particles.shift()
        }
    })
}

document.addEventListener('mousemove',ev=>{
    let mouseX=ev.clientX
    if (mouseX<prevMouseX) {
        angle+=0.1
    } else if (mouseX>prevMouseX) {
        angle-=0.1
    }
    if (prevAngleCamera!=angle) {
        camera.position.x=Math.cos(angle)*100*rocket.rocket.position.x
        camera.position.z=Math.sin(angle)*100*rocket.rocket.position.z
        updateLookAt()
    }
    prevMouseX=mouseX
    prevAngleCamera=angle
})

document.addEventListener('keydown',ev=> {
    // ev.preventDefault()
    switch(ev.key) {
        case "ArrowUp":
            power+=1
            break
        case "ArrowDown":
            let tpower = power-1
            power=tpower<0?0:tpower
            break
        case "z":
            rocket.w.z=(rocket.w.z+angle_const)%(max_angle_const)
            break;
        case "s":
            rocket.w.z=(rocket.w.z+angle_const)%(max_angle_const)
            break;
        case "q":
            rocket.w.x+=angle_const%max_angle_const
            break;
        case "d":
            rocket.w.x-=angle_const%max_angle_const
            break;
        case "e":
            rocket.w.y+=angle_const%max_angle_const
            break;
        case "a":
            rocket.w.y-=angle_const%max_angle_const
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
