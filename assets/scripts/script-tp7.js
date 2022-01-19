import * as three from '../../libs/three/three.js'

let scene, renderer, camera
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
    createCube(40,new three.Vector3(-10,-30,-10),0)

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

    renderer.render( scene, camera );

    //Create the loop
    requestAnimationFrame( render );
}

function createCube(scale, position, mass, rot_quaternion) {
    let quaternion
    if (rot_quaternion==null)
        quaternion={x:0,y:0,z:0,w:1}
    else
        quaternion=rot_quaternion

    let cube = new three.Mesh(new three.BoxBufferGeometry(scale,scale,scale),
        new three.MeshPhongMaterial({color: Math.random()*0xffffff}))
    cube.position.set(position.x,position.y,position.z)
    scene.add(cube)
    rigidBodies.push(cube)

    //Physic universe
    let transform = new Ammo.btTransform()
    transform.setIdentity()
    transform.setOrigin(new Ammo.btVector3(position.x,position.y,position.z))
    transform.setRotation(new Ammo.btQuaternion(quaternion.x,quaternion.y,quaternion.z,quaternion.w))
    let defaultMotionState = new Ammo.btDefaultMotionState(transform)

    //Collision
    let structColShape=new Ammo.btBoxShape(new Ammo.btVector3(scale*0.5,scale*0.5,scale*0.5))
    structColShape.setMargin(0.05)
    //Inertia
    let localInertia = new Ammo.btVector3( 0, 0, 0 )
    structColShape.calculateLocalInertia(mass,localInertia)
    //Create RigidBody
    let rbody_info = new Ammo.btRigidBodyConstructionInfo(mass, defaultMotionState, structColShape, localInertia)
    let rbody = new Ammo.btRigidBody(rbody_info)
    physicsUniverse.addRigidBody(rbody)
    cube.userData.physicsBody=rbody
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
            // graphics_obj.quaternion.set(new_qua.x(),new_qua.y(),new_qua.z(),new_qua.w())
        }
    })
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
