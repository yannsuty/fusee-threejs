import * as three from '../../libs/three/three.js'
import {OrbitControls} from "../../libs/three/OrbitControls.js"
import Stats from "../../libs/Stats.js"

let scene, renderer, camera, controls
let directionalLight, sun_mesh
let clock = new three.Clock()
let stats = Stats()

let rigidBodies = []
let tmpTransformation
let physicsUniverse

Ammo().then(AmmoStart)

function AmmoStart() {
    tmpTransformation=new Ammo.btTransform()
    initPhysicsUniverse()
    initGraphicsUniverse()

    //Cube de soutien
    createCube(40,new three.Vector3(-10,-20,-10),0)
    rigidBodies[0].castShadow=false
    rigidBodies[0].receiveShadow=true
    //Ramp
    createParallelepipedRectangle(new three.Vector3(10,2,10),new three.Vector3(-10,0,-27),0, {x: 0.383, y: -Math.PI/4, z: 0, w:  0.924})
    //Cube destroyer
    createCube(4,new three.Vector3(-10,500,-27),20)
    createCube(4,new three.Vector3(-9,1000,-28),20)
    createCube(4,new three.Vector3(-9,2000,-29),20)
    createCube(4,new three.Vector3(-9,5000,-29),80)

    //Falling cubes
    createCube(4,new three.Vector3(0,10,0),1)
    for (let nb=20;nb<=10000;nb+=10) {
        createCube(2,new three.Vector3(0,nb,0),1)
    }

    //Wall of cube
    let scale=2
    for (let y=0;y<=10;y+=scale) {
        for (let z=-21;z<=9;z+=scale) {
            createCube(scale, new three.Vector3(-20,y,z),1)
        }
    }
}

function initGraphicsUniverse() {
    scene = new three.Scene()

    /********RENDERER*********/
    renderer = new three.WebGLRenderer({ antialias: true})
    renderer.setPixelRatio(window.devicePixelRatio*0.8)
    renderer.setSize(window.innerWidth,window.innerHeight)
    renderer.setClearColor(0x8f8f8f)
    renderer.shadowMap.enabled = true
    document.body.appendChild(renderer.domElement)

    /********CAMERA***********/
    camera = new three.PerspectiveCamera(20, window.innerWidth/window.innerHeight,1,1000)
    camera.position.set(0,10,100)
    camera.lookAt(new three.Vector3(0,-30,0))
    scene.add(camera)

    /********LIGHTS***********/
    let ambientLight = new three.AmbientLight(0xcccccc,0.2)
    scene.add(ambientLight)
    directionalLight = new three.PointLight( 0xffffff, 0.6 )
    directionalLight.castShadow=true
    directionalLight.position.y = 30
    directionalLight.position.x = -50
    scene.add( directionalLight )

    /********CONTROLS***********/
    controls=new OrbitControls(camera, renderer.domElement)
    controls.enableDamping=true
    controls.dampingFactor=0.05
    controls.maxPolarAngle=Math.PI/2

    /********CONTROLS***********/
    document.getElementById('nav').appendChild(stats.dom)

    add_objects()

    render()
}
function initPhysicsUniverse() {
    let collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration();
    let dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration);
    let overlappingPairCache    = new Ammo.btDbvtBroadphase();
    let solver                  = new Ammo.btSequentialImpulseConstraintSolver();
    physicsUniverse             = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    physicsUniverse.setGravity(new Ammo.btVector3(0, -75, 0));
}

function add_objects() {
    /********SUN***********/
    sun_mesh = new three.Mesh(
        new three.SphereGeometry(10,100,100),
        new three.MeshBasicMaterial( {color: 0xffff00} ))
    sun_mesh.position.x=-150
    sun_mesh.position.y=20

    scene.add(sun_mesh)
}

function render() {
    let deltaTime = clock.getDelta()
    updatePhysicsUniverse(deltaTime)
    controls.update()
    renderer.render( scene, camera );
    stats.update()
    //Create the loop
    requestAnimationFrame( render );
}

function createCube(scale, position, mass, rot_quaternion) {
        createParallelepipedRectangle(
            new three.Vector3(scale,scale,scale),
            position,mass,rot_quaternion
        )
}

function createParallelepipedRectangle(scale, position, mass, rot_quaternion) {
    let object = new three.Mesh(
        new three.BoxBufferGeometry(scale.x,scale.y,scale.z),
        new three.MeshPhongMaterial({color: Math.random()*0xffffff})
    )
    object.castShadow=true
    object.position.set(position.x,position.y,position.z)
    scene.add(object)
    rigidBodies.push(object)

    //Physic universe
    let quaternion
    if (rot_quaternion==null)
        quaternion={x:0,y:0,z:0,w:1}
    else
        quaternion=rot_quaternion

    let transform = new Ammo.btTransform()
    transform.setIdentity()
    transform.setOrigin(new Ammo.btVector3(position.x,position.y,position.z))
    transform.setRotation(new Ammo.btQuaternion(quaternion.x,quaternion.y,quaternion.z,quaternion.w))
    let defaultMotionState = new Ammo.btDefaultMotionState(transform)

    //Collision
    let structColShape=new Ammo.btBoxShape(new Ammo.btVector3(scale.x*0.5,scale.y*0.5,scale.z*0.5))
    structColShape.setMargin(0.05)
    //Inertia
    let localInertia = new Ammo.btVector3( 0, 0, 0 )
    structColShape.calculateLocalInertia(mass,localInertia)
    //Create RigidBody
    let rbody_info = new Ammo.btRigidBodyConstructionInfo(mass, defaultMotionState, structColShape, localInertia)
    let rbody = new Ammo.btRigidBody(rbody_info)
    physicsUniverse.addRigidBody(rbody)
    object.userData.physicsBody=rbody
}

function updatePhysicsUniverse(deltaTime) {
    physicsUniverse.stepSimulation(deltaTime)
    rigidBodies.forEach((body)=>{
        let graphics_obj = body
        let physics_obj = graphics_obj.userData.physicsBody
        let motionState = physics_obj.getMotionState()
        if (motionState) {
            motionState.getWorldTransform(tmpTransformation)
            let new_pos = tmpTransformation.getOrigin()
            let new_qua = tmpTransformation.getRotation()
            graphics_obj.position.set(new_pos.x(),new_pos.y(),new_pos.z())
            graphics_obj.quaternion.set(new_qua.x(),new_qua.y(),new_qua.z(),new_qua.w())
        }
    })
}

