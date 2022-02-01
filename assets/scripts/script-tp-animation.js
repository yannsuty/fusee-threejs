import * as three from '../../libs/three/three.js'
import {FBXLoader} from "../../libs/three/FBXLoader.js";
import {OrbitControls} from "../../libs/three/OrbitControls.js";
import Stats from "../../libs/Stats.js";

let scene, renderer, camera, controls
let directionalLight
let human_object, mixer_human
let clock = new three.Clock()
let stats = Stats()
let keys={forward:false,left:false,backward:false, right:false,space:false, shift:false}
let state={idle:true,walk:false,run:false,dance:false}


function initGraphicsUniverse() {
    scene = new three.Scene()

    /********RENDERER*********/
    renderer = new three.WebGLRenderer({ antialias: true})
    renderer.setPixelRatio(window.devicePixelRatio*0.8)
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

    /********CONTROLS***********/
    document.body.appendChild(stats.dom)

    add_objects()
    render()
}

function add_objects() {
    /********FLAT***********/
    let material_texture = new three.MeshLambertMaterial({color: 0xdcdcdc})
    let flat = new three.Mesh( new three.BoxGeometry( 150, 1.5, 150 ), material_texture )
    flat.position.y=-0.6
    flat.castShadow=false
    flat.receiveShadow=true
    scene.add( flat )
    scene.add(new three.BoxHelper(flat, Math.random()*0xffffff))

    /********HUMAN***********/
    const fbxloader = new FBXLoader()
    fbxloader.setPath('./assets/models/human/')
    fbxloader.load('xbot.fbx', (object)=> {
        object.scale.set(0.005,0.005,0.005)
        object.position.y=0.15
        mixer_human = new three.AnimationMixer(object)
        scene.add(object)
        human_object={mesh:object, mixer:mixer_human, animations:{}, velocity:new three.Vector3(0,0,0)}
        /********ANIMATIONS***********/
        fbxloader.load('Idle.fbx',(anim)=>{human_object.animations['idle']=mixer_human.clipAction(anim.animations[0])})
        fbxloader.load('Walk.fbx',(anim)=>{human_object.animations['walk']=mixer_human.clipAction(anim.animations[0])})
        fbxloader.load('Run.fbx',(anim)=>{human_object.animations['run']=mixer_human.clipAction(anim.animations[0])})
        fbxloader.load('Dance.fbx',(anim)=>{human_object.animations['dance']=mixer_human.clipAction(anim.animations[0])})
    })

}

function render() {
    let delta = clock.getDelta()
    if (human_object)  {
        human_object.mixer.update(delta)
        updatePosition()
    }
    updateKeyControl()
    controls.update()
    stats.update()
    renderer.render( scene, camera );

    //Create the loop
    requestAnimationFrame( render );
}

function updatePosition() {
    if (keys.forward) {
        human_object.velocity=calcVelocity()
        if (keys.shift) {
            human_object.velocity=calcVelocity(true)
        }
        if (keys.left) {
            human_object.mesh.rotation.y+=0.05
        } else if (keys.right) {
            human_object.mesh.rotation.y-=0.05
        }
    } else {
        human_object.velocity.z=0
        human_object.velocity.x=0
    }
    human_object.mesh.position.z+=human_object.velocity.z
    human_object.mesh.position.x+=human_object.velocity.x
    human_object.mesh.position.y+=human_object.velocity.y
}

function calcVelocity(run=false) {
    const velocity = new three.Vector3(0,0,0)
    let speed=0.01
    if (run) speed+=0.015

    const rotation = human_object.mesh.rotation.clone()

    velocity.x=speed*Math.sin(rotation.y)
    velocity.z=speed*Math.cos(rotation.y)

    return velocity
}

function updateKeyControl() {
    if (keys.forward) {
        if (keys.shift) {
            changeStateToRun()
        } else {
            changeStateToWalk()
        }
    } else if (keys.space) {
        changeStateToDance()
    } else {
        changeStateToIdle()
    }
}

function changeStateToWalk() {
    if (state.walk) {
        return
    } else {
        const curAction = human_object.animations['walk']
        let prevAction
        state.walk=true
        if (state.run) {
            state.run=false
            prevAction=human_object.animations['run']
        } else if (state.idle) {
            state.idle=false
            prevAction=human_object.animations['idle']
        } else {
            return false
        }
        curAction.reset()
        curAction.clampWhenFinished = false
        curAction.crossFadeFrom(prevAction, 0.3, true)
        curAction.play()
    }
}

function changeStateToRun() {
    if (state.run) {
        return
    } else {
        const curAction = human_object.animations['run']
        let prevAction
        state.run=true
        if (state.walk) {
            state.walk=false
            prevAction=human_object.animations['walk']
        } else if (state.idle) {
            state.idle=false
            prevAction=human_object.animations['idle']
        } else {
            return false
        }
        curAction.reset()
        curAction.clampWhenFinished = false
        curAction.crossFadeFrom(prevAction, 0.2, true)
        curAction.play()
    }
}

function changeStateToDance() {
    if (state.dance) {
        return
    } else {
        const curAction = human_object.animations['dance']
        let prevAction
        state.dance=true
        if (state.idle) {
            state.idle=false
            prevAction=human_object.animations['idle']
        } else {
            return false
        }
        curAction.reset()
        curAction.clampWhenFinished = false
        curAction.crossFadeFrom(prevAction, 0.2, true)
        curAction.play()
    }
}

function changeStateToIdle() {
    if (state.idle) {
        return
    } else {
        const curAction = human_object.animations['idle']
        let prevAction
        state.idle=true
        if (state.run) {
            state.run=false
            prevAction=human_object.animations['run']
        } else if (state.walk) {
            state.walk=false
            prevAction=human_object.animations['walk']
        } else if (state.dance) {
            state.dance=false
            prevAction=human_object.animations['dance']
        }
        curAction.reset()
        curAction.clampWhenFinished = false
        curAction.crossFadeFrom(prevAction, 0.2, true)
        curAction.play()
    }
}

let keyPressed={}
document.addEventListener('keydown',ev=> {
    keyPressed[ev.key]=true
    keySwitch(true, ev.key)
}, false)

document.addEventListener('keyup',ev=> {
    keyPressed[ev.key]=false
    keySwitch(false, ev.key)
}, false)

function keySwitch(revert, key) {
    switch (key) {
        case 'z':
            keys.forward=revert
            break
        case 'q':
            keys.left=revert
            break
        case 's':
            keys.backward=revert
            break
        case 'd':
            keys.right=revert
            break
        case ' ':
            keys.space=revert
            break
        case 'Shift':
            keys.shift=revert
            break
    }
    // if (keyPressed['z'])
    //     keys.forward=revert
    // if (keyPressed['q'])
    //     keys.left=revert
    // if (keyPressed['s'])
    //     keys.backward=revert
    // if (keyPressed['d'])
    //     keys.right=revert
    // if (keyPressed[' '])
    //     keys.space=revert
    // if (keyPressed['Shift'])
    //     keys.shift=revert
    // if (key)
    //     keyPressed[key]=false
}

initGraphicsUniverse()
