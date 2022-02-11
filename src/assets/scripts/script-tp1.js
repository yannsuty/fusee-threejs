import * as three from 'http://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js'

let scene, renderer, camera
let geometry = []

function init() {
    scene = new three.Scene()

    /********RENDERER*********/
    renderer = new three.WebGLRenderer({ antialias: true})
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth,window.innerHeight)
    document.body.appendChild(renderer.domElement)

    /********CAMERA***********/
    camera = new three.PerspectiveCamera(75, window.innerWidth/window.innerHeight,1,1000)
    camera.position.set(0,100,700)
    camera.lookAt(new three.Vector3(0,0,0))
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
    /********TEXTURE***********/
    const loadMngr = new three.LoadingManager()
    const loader = new three.TextureLoader(loadMngr)
    let rocket_png = loader.load("assets/images/rocket.jpg")
    rocket_png.mafFilter = three.NearestFilter //or LinearFilter
    let mini_rocket = loader.load("assets/images/rocket.jpg")
    mini_rocket.magFilter = three.NearestFilter
    mini_rocket.wrapS = three.RepeatWrapping
    mini_rocket.wrapT = three.RepeatWrapping
    mini_rocket.repeat.set(3,3)
    const material = new three.MeshPhongMaterial( {color: 0x00ffff, shininess: 200} )
    const material_two = new three.MeshPhongMaterial( {color: 0x00ffff, side : three.DoubleSide} )

    loadMngr.onLoad=() => {
        /********3D CUBE***********/
        let material_texture = new three.MeshLambertMaterial({map: rocket_png})
        let cube = new three.Mesh( new three.BoxGeometry( 150, 150, 150 ), material_texture )
        cube.position.x=300
        cube.position.y=300
        scene.add( cube )
        geometry.push(cube)

        /********3D CUBE MINI ROCKET***********/
        let material_texture_mini = new three.MeshLambertMaterial({map: mini_rocket})
        let cube_mini = new three.Mesh(new three.BoxGeometry(150,150,150),material_texture_mini)
        cube_mini.position.x=-300
        cube_mini.position.y=-300
        scene.add(cube_mini)
        geometry.push(cube_mini)
    }

    /********CONE***********/
    let cone = new three.Mesh(new three.ConeGeometry(100,100,150), material)
    cone.position.x=300
    cone.position.y=50
    scene.add(cone)
    geometry.push(cone)

    /********CYLINDER***********/
    let cylinder = new three.Mesh(new three.CylinderGeometry(100,100,200),material)
    cylinder.position.x=0
    cylinder.position.y=-200
    scene.add(cylinder)
    geometry.push(cylinder)

    /********PLANE***********/
    let plane = new three.Mesh(new three.PlaneGeometry(100,100,100),material_two)
    plane.position.x=-200
    plane.position.y=50
    scene.add(plane)
    geometry.push(plane)

    /********SPHERE***********/
    let sphere = new three.Mesh(new three.SphereGeometry(75,100,100),material)
    sphere.position.x=-200
    sphere.position.y=300
    scene.add(sphere)
    geometry.push(sphere)

    /********AXES***********/
    const material_x = new three.MeshPhongMaterial( {color: 0xff0000, side : three.DoubleSide} )
    const material_y = new three.MeshPhongMaterial( {color: 0x00ff00, side : three.DoubleSide} )
    const material_z = new three.MeshPhongMaterial( {color: 0x0000ff, side : three.DoubleSide} )
    let axe_x = new three.Mesh(new three.BoxGeometry(100,5,5),material_x)
    let axe_y = new three.Mesh(new three.BoxGeometry(5,100,5),material_y)
    let axe_z = new three.Mesh(new three.BoxGeometry(5,5,100),material_z)
    scene.add(axe_x)
    scene.add(axe_y)
    scene.add(axe_z)
}

function render() {
    geometry.forEach(elem => {
        elem.rotation.x += 0.005
        elem.rotation.y += 0.01
        elem.rotation.z += 0.001
    })

    renderer.render( scene, camera );

    //Create the loop
    requestAnimationFrame( render );
}

init()
