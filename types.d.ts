import { ReactThreeFiber } from '@react-three/fiber'

declare global {
    namespace JSX {
        interface IntrinsicElements {
            meshLineGeometry: any
            meshLineMaterial: any
        }
    }
}
