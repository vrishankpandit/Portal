import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import  FirefliesVertex from './shaders/fireflies/vertex.glsl'
import  FirefliesFragment from './shaders/fireflies/fragment.glsl'
import  PortalVertex from './shaders/portal/vertex.glsl'
import  PortalFragment from './shaders/portal/fragment.glsl'
// import SPECTOR from "spectorjs";




//Pefromance
// var SPECTOR = require("spectorjs");

// var spector = new window.SPECTOR.Spector()
// spector.displayUI();
/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

//Material
const bakedTexture=textureLoader.load('baked1.jpg')
bakedTexture.flipY=false;
bakedTexture.encoding=THREE.sRGBEncoding;

const bakedMaterial=new THREE.MeshBasicMaterial({map : bakedTexture})
const poleLightMaterial=new THREE.MeshBasicMaterial({color:'#FCFF0B'})

const portal={}
portal.portalColorStart = new THREE.Color('#ffffff');
portal.portalColorEnd = new THREE.Color('#000000');



const portalMaterial=new THREE.ShaderMaterial({
    vertexShader:PortalVertex,
    fragmentShader:PortalFragment,
    transparent :true,
    uniforms:{
        uTime:{value : 0.0},
        uStartColor:{value:portal.portalColorStart},
        uEndColor:{value : portal.portalColorEnd}
    }
})

gui
    .addColor(portal,'portalColorStart')
    .onChange((value)=>{
        portalMaterial.uniforms.uStartColor.value.set(portal.portalColorStart)
    })

gui
    .addColor(portal,'portalColorEnd')
    .onChange((value)=>{
        portalMaterial.uniforms.uEndColor.value.set(portal.portalEndStart)
    })

//Models
gltfLoader.load(
    'buildingCopy(2)Draco.glb',
    (gltf)=>{

        gltf.scene.traverse((child)=>{
            child.material=bakedMaterial;
        })

        const portalLightMesh=gltf.scene.children.find(x=>x.name==='Portal')
        portalLightMesh.rotation.z=Math.PI*1.5;
        portalLightMesh.material=portalMaterial;

        const poleLightsMesh=gltf.scene.children.find(x=>x.name==='PoleLights')

        poleLightsMesh.material=poleLightMaterial;
        


        // console.log(PoleLightFMesh)
        scene.add(gltf.scene)
        console.log(gltf.scene)

    }
)

const parameters = {}
    parameters.count = 200
    parameters.size = 100.0
    
    
    const particlesPos = new Float32Array(parameters.count * 3)
    const scaleArray=new Float32Array(parameters.count)
    
    for(let i=0;i<parameters.count;i++){
        const i3=i*3;
    
        particlesPos[i3]=(Math.random() -0.5) * 10.0;
        particlesPos[i3+1]=(Math.random() -0.5) * 10.0;
        particlesPos[i3+2]=(Math.random() -0.5) * 10.0;

        scaleArray[i]=Math.random()
    
    }
    
    const particlesGeometry=new THREE.BufferGeometry();

    particlesGeometry.setAttribute('position',new THREE.BufferAttribute(particlesPos,3))
    particlesGeometry.setAttribute('aScale',new THREE.BufferAttribute(scaleArray,1))
    
    const particlesMaterial=new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader:FirefliesVertex,
        fragmentShader:FirefliesFragment,
        transparent :true,

        uniforms:{
            uTime:{value : 0.0},
            uSize:{value: parameters.size  * Math.min(window.devicePixelRatio, 2)}
        }
        // size: parameters.size,
        // sizeAttenuation: true,
    })
    
    const particles=new THREE.Points(particlesGeometry,particlesMaterial);
    scene.add(particles)
    console.log(particles)


/**
 * Object
*/
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

// scene.add(cube)

/**
 * Sizes
*/
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
    {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight
        
        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()
        
        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
    
    /**
     * Camera
    */
   // Base camera
   const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
   camera.position.x = -5
   camera.position.y = 2
   camera.position.z = 2
   scene.add(camera)
   
   // Controls
   const controls = new OrbitControls(camera, canvas)
   controls.enableDamping = true
   
   /**
    * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputEncoding=THREE.sRGBEncoding;
    
    /**
     * Animate
    */
   const clock = new THREE.Clock()
   let elapsedTime=0;
   const tick = () =>
    {
        elapsedTime = clock.getElapsedTime()
        particlesMaterial.uniforms.uTime.value=elapsedTime;
        portalMaterial.uniforms.uTime.value=elapsedTime;
        
        // Update controls
        controls.update()
        
        // Render
        renderer.render(scene, camera)
        
        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }
    
    tick()
    
    