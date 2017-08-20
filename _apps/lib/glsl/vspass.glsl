layout(location = 0) in vec3 a_position;
layout(location = 1) in vec2 a_texcoord;

// TODO: figure out how to decouple with shadergraph

//out vec2 v_st;
out vec3 v_position;

void main() {
//  v_st = a_texcoord;
  v_position = a_position;
  gl_Position = vec4(a_position, 1.0);
}
