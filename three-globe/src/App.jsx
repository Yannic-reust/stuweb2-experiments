import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import useKeyboard from './useKeyboard'
import { Vector3, Quaternion } from 'three'










function Ball({ floor,x,y }) {


  console.log('creating ball')


  


  const ref = useRef()
  const keyMap = useKeyboard()
  
  const v0 = useMemo(() => new Vector3(), [])
  const q = useMemo(() => new Quaternion(), [])
  const angularVelocity = useMemo(() => new Vector3(), [])





  useFrame((_, delta) => {

   
    //angularVelocity.x += delta * 5
   angularVelocity.x += x.current * 1
   console.log("x",x.current)
   console.log("angularVelocity",angularVelocity.x)
   angularVelocity.y += y.current *1
   console.log("y",y.current)
   console.log("angularVelocity",angularVelocity.y)
   /* keyMap['KeyS'] && (angularVelocity.x += delta * 5)
    keyMap['KeyA'] && (angularVelocity.z += delta * 5)
    keyMap['KeyD'] && (angularVelocity.z -= delta * 5)*/

    q.setFromAxisAngle(angularVelocity, delta).normalize()
    ref.current.applyQuaternion(q)

    angularVelocity.lerp(v0, 0.01) // slow down the roll

    floor.current.position.x += angularVelocity.z * delta
    floor.current.position.z -= angularVelocity.x * delta

    floor.current.position.x = floor.current.position.x % 10
    floor.current.position.z = floor.current.position.z % 10
  })

  return (
    <mesh ref={ref} position-y={1.0}>
      <sphereGeometry />
      <meshNormalMaterial wireframe />
    </mesh>
  )
}

export default function App() {

  const ref = useRef()

  let x = useRef(0)
  let y = useRef(0)
  

  const requestDeviceMotionPermission = () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === 'granted') {
            // Permission granted, add the event listener for device motion
            window.addEventListener('devicemotion', handleDeviceMotion)
          }
        })
        .catch(console.error)
    } else {
      // handle regular non iOS 13+ devices
    }
  }
  
  const handleDeviceMotion = (event) => {
    // Handle device motion data here
    x.current = Math.round(event.acceleration.x * 1000) / 1000
    y = Math.round(event.acceleration.y * 1000) / 1000
    

  //console.log("x",x)
   
  }
  
  

  return (
    <>
      <button onClick={requestDeviceMotionPermission} id="permissionButton">
       Move Ball
      </button>
     
     <p >Version 2</p>
      <Canvas
      camera={{ position: [0, 2.5, 2.5] }}
      onCreated={({ camera }) => camera.lookAt(0, 1, 0)}>
      <gridHelper ref={ref} args={[100, 100]} />
      <Ball floor={ref} x={x} y={y}/>
      {/* <Stats /> */}
    </Canvas>
    </>
  )
}
