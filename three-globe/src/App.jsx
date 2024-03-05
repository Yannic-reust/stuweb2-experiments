import { useRef, useMemo,useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import useKeyboard from './useKeyboard'
import { Vector3, Quaternion } from 'three'

/*window.addEventListener("devicemotion", (event) => {
  console.log(`${event.acceleration.x} m/s2`);
  console.log(`${event.acceleration.y} m/s2`);
  console.log(`${event.acceleration.z} m/s2`);
});*/

/*const acl = new Accelerometer({ frequency: 60 });
 
 const handleReading = () => {
  console.log("Acceleration along the X-axis " + acl.x);
  console.log("Acceleration along the Y-axis " + acl.y);
  console.log("Acceleration along the Z-axis " + acl.z);

};

acl.addEventListener('reading', handleReading);
acl.start();*/



function Ball({ floor }) {
  console.log('creating ball')
  const ref = useRef()
  const keyMap = useKeyboard()

  const v0 = useMemo(() => new Vector3(), [])
  const q = useMemo(() => new Quaternion(), [])
  const angularVelocity = useMemo(() => new Vector3(), [])

  useFrame((_, delta) => {
    keyMap['KeyW'] && (angularVelocity.x -= delta * 5)
    keyMap['KeyS'] && (angularVelocity.x += delta * 5)
    keyMap['KeyA'] && (angularVelocity.z += delta * 5)
    keyMap['KeyD'] && (angularVelocity.z -= delta * 5)

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
  let x = useRef(0)
  let y = useRef(0)
  let z = useRef(0)
  const ref = useRef()




  const requestDeviceMotionPermission = () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            // Permission granted, add the event listener for device motion
            window.addEventListener("devicemotion", handleDeviceMotion);
          }
        })
        .catch(console.error);
    } else {
      // handle regular non iOS 13+ devices
    }
  };
  
  const handleDeviceMotion = (event) => {
    // Handle device motion data here
    x.current = Math.round(event.acceleration.x * 100) / 100;
    y.current = Math.round(event.acceleration.y * 100) / 100;
    z.current = Math.round(event.acceleration.z * 100) / 100;
    
   
    console.log(`${x.current} m/s2`);
    console.log(`${y.current} m/s2`);
    console.log(`${z.current} m/s2`);
  
  };
  
 

  
  


 
  return (<>
<button onClick={requestDeviceMotionPermission} id="permissionButton">Request Device Motion Permission</button>
<p  >x{x.current}</p>
<p>y {y.current}</p>
<p>z {z.current}</p>
   {/* <Canvas
      camera={{ position: [0, 2.5, 2.5] }}
      onCreated={({ camera }) => camera.lookAt(0, 1, 0)}>
      <gridHelper ref={ref} args={[100, 100]} />
      <Ball floor={ref} />
      <Stats />
    </Canvas> */}
  </>
   
  )
}
