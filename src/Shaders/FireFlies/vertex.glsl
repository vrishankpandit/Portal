uniform float uTime;
uniform float uSize;

varying vec2 vUv;

void main(){
    vec4 modelPosition= modelMatrix * vec4(position ,1.0);
    // modelPosition.y+=uTime;
   
    vec4 viewPosition=viewMatrix * modelPosition;

    vec4 projectedPosition= projectionMatrix * viewPosition;
    
    gl_Position=projectedPosition;
    vUv=uv;

    gl_PointSize=uSize;

}