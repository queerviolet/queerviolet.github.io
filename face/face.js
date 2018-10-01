// import * as THREE from 'three'
// import GLTFLoader from 'three-gltf-loader'

let camera, scene, renderer
let geometry, material, mesh

addEventListener('DOMContentLoaded', main)
addEventListener('resize', resize)

function main() {
  init()
  animate()
}

function init() { 
  scene = new THREE.Scene
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10)
  light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1)
  const controls = new THREE.OrbitControls(camera)
  scene.add(light)
  // geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
  // material = new THREE.MeshNormalMaterial()
 
  // mesh = new THREE.Mesh(geometry, material)
  // scene.add(mesh)

  const colors = [ 0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0xffff00, 0x00ffff ]
  let i = 0
  const loader = new THREE.GLTFLoader
  loader.load('angelica/scene.gltf',
    gltf => {
      scene.add(gltf.scene)
      each(node => {
        if (node.type === 'Mesh') {
          console.log(node)
          node.material = new THREE.MeshStandardMaterial({
            color: colors[i = (i + 1) % colors.length],
            wireframe: true,
          })
          // node.material.wireframe = true
          // node.material.color.set(0xffffff)
          // node.material.lights = false
        }
      }, gltf.scene)
      const scale = 0.1
      gltf.scene.scale.set(scale, scale, scale)
      console.log(gltf)
    },
    ({loaded, total}) => console.log(loaded / total),
    console.error
  )

  renderer = new THREE.WebGLRenderer({antialias: true})
  resize()
  document.body.appendChild(renderer.domElement)
}

const each = (visit, node=scene) => {
  visit(node)
  node.children.forEach(child => each(visit, child))
}

function resize() {
  const w = innerWidth * devicePixelRatio
  const h = innerHeight * devicePixelRatio
  renderer.setSize(w, h, false)
  Object.assign(renderer.domElement.style, {
    width: innerWidth + 'px',
    height: innerHeight + 'px',
  })
  camera.aspect = innerWidth / innerHeight  
  camera.position.z = 1
  camera.updateProjectionMatrix()  
}

function animate() {
  requestAnimationFrame(animate)

  // mesh.rotation.x += 0.01
  // mesh.rotation.y += 0.02

  renderer.render(scene, camera) 
}
