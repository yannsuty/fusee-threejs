import * as three from '../../libs/three/three.js'
import {OrbitControls} from "../../libs/three/OrbitControls.js";

let scene, renderer, camera, controls
let directionalLight, sun_mesh
let clock = new three.Clock()

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
    //Ramp
    createParallelepipedRectangle(new three.Vector3(10,2,10),new three.Vector3(-10,0,-27),0, {x: 0.383, y: -Math.PI/4, z: 0, w:  0.924})
    //Cube destroyer
    createCube(4,new three.Vector3(-10,500,-27),20)

    //Falling cubes
    createCube(4,new three.Vector3(0,10,0),1,null)
    createCube(2,new three.Vector3(0,20,0),1,null)
    createCube(2,new three.Vector3(0,30,0),1,null)
    createCube(2,new three.Vector3(0,40,0),1,null)
    createCube(2,new three.Vector3(0,50,0),1,null)
    createCube(2,new three.Vector3(0,60,0),1,null)
    createCube(2,new three.Vector3(0,70,0),1,null)
    createCube(2,new three.Vector3(0,80,0),1,null)
    createCube(2,new three.Vector3(0,90,0),1,null)
    createCube(2,new three.Vector3(0,100,0),1,null)
    createCube(2,new three.Vector3(0,110,0),1,null)
    createCube(2,new three.Vector3(0,120,0),1,null)
    createCube(2,new three.Vector3(0,130,0),1,null)
    createCube(2,new three.Vector3(0,140,0),1,null)
    createCube(2,new three.Vector3(0,150,0),1,null)
    createCube(2,new three.Vector3(0,160,0),1,null)
    createCube(2,new three.Vector3(0,170,0),1,null)
    createCube(2,new three.Vector3(0,180,0),1,null)
    createCube(2,new three.Vector3(0,190,0),1,null)
    createCube(2,new three.Vector3(0,200,0),1,null)
    createCube(2,new three.Vector3(0,210,0),1,null)
    createCube(2,new three.Vector3(0,220,0),1,null)
    createCube(2,new three.Vector3(0,230,0),1,null)
    createCube(2,new three.Vector3(0,240,0),1,null)
    createCube(2,new three.Vector3(0,250,0),1,null)
    createCube(2,new three.Vector3(0,260,0),1,null)
    createCube(2,new three.Vector3(0,270,0),1,null)
    createCube(2,new three.Vector3(0,280,0),1,null)
    createCube(2,new three.Vector3(0,290,0),1,null)
    createCube(2,new three.Vector3(0,300,0),1,null)

    //Wall of cube
    createCube(2,new three.Vector3(-20,0,-20),1,null)
    createCube(2,new three.Vector3(-20,2,-20),1,null)
    createCube(2,new three.Vector3(-20,4,-20),1,null)
    createCube(2,new three.Vector3(-20,6,-20),1,null)
    createCube(2,new three.Vector3(-20,8,-20),1,null)
    createCube(2,new three.Vector3(-20,10,-20),1,null)
    createCube(2,new three.Vector3(-20,0,-18),1,null)
    createCube(2,new three.Vector3(-20,2,-18),1,null)
    createCube(2,new three.Vector3(-20,4,-18),1,null)
    createCube(2,new three.Vector3(-20,6,-18),1,null)
    createCube(2,new three.Vector3(-20,8,-18),1,null)
    createCube(2,new three.Vector3(-20,10,-18),1,null)
    createCube(2,new three.Vector3(-20,0,-16),1,null)
    createCube(2,new three.Vector3(-20,2,-16),1,null)
    createCube(2,new three.Vector3(-20,4,-16),1,null)
    createCube(2,new three.Vector3(-20,6,-16),1,null)
    createCube(2,new three.Vector3(-20,8,-16),1,null)
    createCube(2,new three.Vector3(-20,10,-16),1,null)
    createCube(2,new three.Vector3(-20,0,-14),1,null)
    createCube(2,new three.Vector3(-20,2,-14),1,null)
    createCube(2,new three.Vector3(-20,4,-14),1,null)
    createCube(2,new three.Vector3(-20,6,-14),1,null)
    createCube(2,new three.Vector3(-20,8,-14),1,null)
    createCube(2,new three.Vector3(-20,10,-14),1,null)
    createCube(2,new three.Vector3(-20,0,-12),1,null)
    createCube(2,new three.Vector3(-20,2,-12),1,null)
    createCube(2,new three.Vector3(-20,4,-12),1,null)
    createCube(2,new three.Vector3(-20,6,-12),1,null)
    createCube(2,new three.Vector3(-20,8,-12),1,null)
    createCube(2,new three.Vector3(-20,10,-12),1,null)

}

function initGraphicsUniverse() {
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
    camera.lookAt(new three.Vector3(0,-30,0))
    scene.add(camera)

    /********LIGHTS***********/
    let ambientLight = new three.AmbientLight(0xcccccc,0.2)
    scene.add(ambientLight)
    directionalLight = new three.DirectionalLight( 0xffffff, 0.6 )
    directionalLight.position.y = 30
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

