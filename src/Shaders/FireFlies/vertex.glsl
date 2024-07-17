uniform float uTime;
uniform float uSize;

varying vec2 vUv;

attribute float aScale;



void main(){
    vec4 modelPosition= modelMatrix * vec4(position ,1.0);
    modelPosition.y+=sin(uTime*aScale + modelPosition.x)*0.5*aScale;
   
    vec4 viewPosition=viewMatrix * modelPosition;

    vec4 projectedPosition= projectionMatrix * viewPosition;
    
    gl_Position=projectedPosition;

    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0/-viewPosition.z); //for size attenuation in shaders

    vUv=uv;

}