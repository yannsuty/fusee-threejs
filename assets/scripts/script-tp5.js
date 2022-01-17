import * as three from 'http://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js'

let scene, renderer, camera

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
    camera.position.set(0,0,10)
    camera.lookAt(new three.Vector3(0,0,-200))
    scene.add(camera)

    /********LIGHTS***********/
    let ambientLight = new three.AmbientLight(0xcccccc,0.2)
    scene.add(ambientLight)
    let directionalLight = new three.DirectionalLight( 0xffffff, 0.6 )
    directionalLight.position.y = -50
    directionalLight.position.x = -150
    scene.add( directionalLight )

    add_objects()

    render()
}

function add_objects() {
    const loader = new three.TextureLoader()

    /********FLOOR***********/
    const texture = loader.load('assets/images/floor-stone.png');
    texture.wrapS = three.RepeatWrapping;
    texture.wrapT = three.RepeatWrapping;
    texture.magFilter = three.NearestFilter;
    texture.repeat.set(100,100);

    const mesh = new three.Mesh(
        new three.PlaneGeometry(100, 1000),
        new three.MeshPhongMaterial({map: texture,side: three.DoubleSide}));
    mesh.position.z=-25
    mesh.rotation.x = Math.PI * -0.5;
    scene.add(mesh);

    /********FLOOR***********/
    scene.fog = new three.Fog( 0x2f3640, 10, 50 )
}

function render() {

    renderer.render( scene, camera );

    //Create the loop
    requestAnimationFrame( render );
}

document.body.addEventListener("wheel",ev=>{
    if (ev.wheelDelta>0) {
        camera.position.y+=1
        camera.position.z+=1
    } else {
        camera.position.y-=1
        camera.position.z-=1
    }
})

init()
