import * as three from 'http://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js'

let scene, renderer, camera
let particles=[]
let clock = new three.Clock()

function init() {
    scene = new three.Scene()

    /********RENDERER*********/
    renderer = new three.WebGLRenderer({ antialias: true})
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth,window.innerHeight)
    document.body.appendChild(renderer.domElement)

    /********CAMERA***********/
    camera = new three.PerspectiveCamera(20, window.innerWidth/window.innerHeight,1,1000)
    camera.position.set(0,10,10)
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
    /********SPRITE***********/
    const loader = new three.TextureLoader()
    let bokutexture = loader.load( 'assets/images/gumba.png' )
    bokutexture.magFilter = three.NearestFilter

    let bokusprite = new three.Sprite( new three.SpriteMaterial( { map: bokutexture } ) )
    bokusprite.scale.set( 1, 1, 1);
    bokusprite.position.set(0, 1, 0.2);
    scene.add(bokusprite);

    /********FLOOR***********/
    const texture = loader.load('assets/images/floor-grass.jpg');
    texture.wrapS = three.RepeatWrapping;
    texture.wrapT = three.RepeatWrapping;
    texture.magFilter = three.NearestFilter;
    texture.repeat.set(2, 2);

    const mesh = new three.Mesh(
        new three.PlaneGeometry(2, 2),
        new three.MeshPhongMaterial({map: texture,side: three.DoubleSide}));
    mesh.rotation.x = Math.PI * -0.5;
    scene.add(mesh);

    /********PARTICLE***********/
    let particle=[]
    let particleTexture = loader.load( 'assets/images/firefly.png' );
    let spriteMaterial = new three.SpriteMaterial( { map: particleTexture, transparent : true, opacity : 0.5, color: 0xfffc00 } );

    for (let i=0; i<100; i++) {
        particle.push(new three.Sprite( spriteMaterial ));
    }
    let i=0
    particle.forEach(elem=> {
        elem.scale.set( 0.5, 0.5, 0.5 );
        elem.position.set(i++/10.0,1,0);
        scene.add( elem );
        particles.push(elem)
    })
}

function render() {
    /********UPDATE PARTICLE POSITION***********/
    clock.getDelta()
    let elapsed = clock.elapsedTime;    //get elapsed time
    let i=0
    particles.forEach(particle=> {
        particle.position.x = Math.sin(elapsed+i);
        particle.position.z = Math.cos(elapsed+i);
        particle.position.y = Math.cos(elapsed+i*100)/3*2 + 1;
        i++
    })

    renderer.render( scene, camera );

    //Create the loop
    requestAnimationFrame( render );
}

init()
