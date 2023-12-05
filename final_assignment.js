import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

const {Cube, Axis_Arrows, Textured_Phong} = defs

export class Final_Assignment extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            torus: new defs.Torus(15, 15),
            torus2: new defs.Torus(10, 15),
            sphere: new defs.Subdivision_Sphere(6),
            circle: new defs.Regular_2D_Polygon(1, 15),
            sphere2: new defs.Subdivision_Sphere(4),
            sub_sphere: new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(2),
            cube: new defs.Cube()



            // TODO:  Fill in as many additional shape instances as needed in this key/value table.
            //        (Requirement 1)
        };

        // *** Materials
        this.materials = {
            test: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: .6, color: hex_color("#ffffff")}),
            test2: new Material(new Gouraud_Shader(),
                {ambient: 1, diffusivity: .6, color: hex_color("#992828")}),
            test: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: .6, color: hex_color("#ffffff")}),
            
            bg_texture: new Material(new Textured_Phong(), {
                    color: hex_color("#000000"),
                    ambient: 1, diffusivity: 0.1, specularity: 0.1,
                    texture: new Texture("assets/bg_2.png")
                }),
            
            crust_texture: new Material(new Textured_Phong(), {
                    color: hex_color("#000000"),
                    ambient: 1, diffusivity: 0.1, specularity: 0.1,
                    texture: new Texture("assets/crust.png")
                }),
            sauce_texture: new Material(new Textured_Phong(), {
                    color: hex_color("#000000"),
                    ambient: 1, diffusivity: 0.6, specularity: 0.5,
                    texture: new Texture("assets/sauce.png")
                }),
            cheese_texture: new Material(new Textured_Phong(), {
                    color: hex_color("#FDDF8E"),
                    ambient: 1, diffusivity: 0.1, specularity: 0.1,
                    texture: new Texture("assets/cheese.png")
                }),
            cheese_texture_baked: new Material(new Textured_Phong(), {
                    color: hex_color("#000000"),
                    ambient: 1, diffusivity: 0.1, specularity: 0.1,
                    texture: new Texture("assets/cheese.png")
                }),
            olive_texture: new Material(new Textured_Phong(), {
                    color: hex_color("#000000"),
                    ambient: 1, diffusivity: 0.1, specularity: 0.1,
                    texture: new Texture("assets/olive.png")
                }),
            
            tomato_texture: new Material(new Textured_Phong(), {
                    color: hex_color("#010101"),
                    ambient: 1, diffusivity: 0.1, specularity: 0.1,
                    texture: new Texture("assets/tomato.png")
                }),
            
            pineapple_texture: new Material(new Textured_Phong(), {
                    color: hex_color("#010101"),
                    ambient: 1, diffusivity: 0.1, specularity: 0.1,
                    texture: new Texture("assets/pineapple.png")
                }),
            basil_texture: new Material(new Textured_Phong(), {
                    color: hex_color("#010101"),
                    ambient: 1, diffusivity: 0.1, specularity: 0.1,
                    texture: new Texture("assets/basil.png")
                }),


            
                
    
        }
        this.sauce_time = 0;
        this.bake_time = 0;
        this.olive_time = 0;
        this.tomato_time = 0;
        this.chicken_time = 0;
        this.pineapple_time = 0;
        this.peppers_time = 0;
        this.add_sauce = false;
        this.add_cheese = false;
        this.add_olives = false;
        this.add_peppers = false;
        this.add_chicken = false;
        this.add_pineapple = false;
        this.can_bake = false;
        this.update_control_panel = true;
        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("sauce", ["s"], () => {
            // TODO:  Requirement 3d:  Set a flag here that will toggle your swaying motion on and off.
            this.add_sauce = true
        });
    }

    display(context, program_state) {
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);
        
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        const yellow = hex_color("#fac91a");
        let model_transform = Mat4.identity();
        // planet set up


        const light_position = vec4(0, 0, 0, 1);
        program_state.lights = [new Light(light_position, hex_color("#FFFFFF"), 10**100)];

        let crust_color = hex_color("#000000");
        let crust_transform = model_transform.times(Mat4.scale(8,8,0.1));
        

        let max_sauce = 7;
        let sauce_color = hex_color("#000000");
        let sauce_time = t - this.sauce_time
        if (sauce_time<=5)
        {
            var sauce_radius = Math.max(1 + Math.abs((max_sauce -1)*Math.sin(Math.PI/10 * sauce_time)), 2)
        }
        else
        {
            var sauce_radius = max_sauce
        }

        let sauce_transform = model_transform.times(Mat4.scale(sauce_radius, sauce_radius, sauce_radius)).times(Mat4.scale(1,1,0.1)).times(Mat4.translation(0,0.05,0));
        
        let cheese_color = hex_color("#FDDF8E");
        let cheese_transform = model_transform.times(Mat4.scale(4.5, 4.5, 4.5)).times(Mat4.translation(0,0.6,1)).times(Mat4.scale(1,1,0.1));

        

        let olive_base = model_transform.times(Mat4.translation(0,2,10)).times(Mat4.scale(0.2, 0.2, 0.1))
        let olive_transform1= olive_base.times(Mat4.translation(-7,17,0))
        let olive_transform2= olive_base.times(Mat4.translation(5,27,0))
        let olive_transform3= olive_base.times(Mat4.translation(9,15,0))
        let olive_transform4= olive_base.times(Mat4.translation(-5,24,0))
        let olive_transform5= olive_base.times(Mat4.translation(5,6,0))
        let olive_transform6= olive_base.times(Mat4.translation(-7,10,0))
        let olive_transform7= olive_base.times(Mat4.translation(-1,13,0))
        let olive_transform8= olive_base.times(Mat4.translation(-3,15,0))
        let olive_transform9= olive_base.times(Mat4.translation(10,9,0))
        let olive_transform10= olive_base.times(Mat4.translation(6.5,8,0))
        let olive_transform11= olive_base.times(Mat4.translation(4,20,0))

        let tomato_base = model_transform.times(Mat4.translation(0,2,10)).times(Mat4.scale(0.2, 0.3, 0.2))
        let tomato_transform1 = tomato_base.times(Mat4.translation(-5, 4, 0)).times(Mat4.rotation(t,0,0,1))
        let tomato_transform2 = tomato_base.times(Mat4.translation(6, 5, 0))
        let tomato_transform3 = tomato_base.times(Mat4.translation(0, 14, 0))
        let tomato_transform4 = tomato_base.times(Mat4.translation(8, 16, 0))
        let tomato_transform5 = tomato_base.times(Mat4.translation(-6, 17, 0))
        let tomato_transform6 = tomato_base.times(Mat4.translation(-10, 12, 0))
        let tomato_transform7 = tomato_base.times(Mat4.translation(10, 12, 0))

        let pineapple_base = model_transform.times(Mat4.translation(0,2,10)).times(Mat4.scale(0.2, 0.3, 0)).times(Mat4.translation(-3,1,0))
        let pineapple_transform1 = pineapple_base.times(Mat4.translation(-5,16,0)).times(Mat4.rotation(t,0,0,1))
        let pineapple_transform2 = pineapple_base.times(Mat4.translation(5,17,0))
        let pineapple_transform3 = pineapple_base.times(Mat4.translation(7,6,0))
        let pineapple_transform4 = pineapple_base.times(Mat4.translation(10,11,0))
        //let pineapple_transform5 = pineapple_base.times(Mat4.translation(-10,11,0))
        let pineapple_transform6 = pineapple_base.times(Mat4.translation(-3,6,0))
        let pineapple_transform7 = pineapple_base.times(Mat4.translation(-1,12,0))

        let basil_base = model_transform.times(Mat4.translation(0,2,10)).times(Mat4.scale(0.2, 0.3, 0.2))
        let basil_transform1 = basil_base.times(Mat4.translation(5,17,0)).times(Mat4.scale(1.5, 1.6, 0))
        let basil_transform2 = basil_base.times(Mat4.translation(-7,14,0)).times(Mat4.scale(1.5, 1.6, 0))
        let basil_transform3 = basil_base.times(Mat4.translation(0,10,0)).times(Mat4.scale(1.5, 1.6, 0))
        let basil_transform4 = basil_base.times(Mat4.translation(5,5,0)).times(Mat4.scale(1.5, 1.6, 0))
        let basil_transform5 = basil_base.times(Mat4.translation(-7,8,0)).times(Mat4.scale(1.5, 1.6, 0))
        let basil_transform6 = basil_base.times(Mat4.translation(8,9,0)).times(Mat4.scale(1.5, 1.6, 0))
        let basil_transform7 = basil_base.times(Mat4.translation(10,14,0)).times(Mat4.scale(1.5, 1.6, 0))



        let olive_color = hex_color("#000000")
        let tomato_color = hex_color("#010101")

        let background_color = hex_color("#000000");
        let background_transform = model_transform.times(Mat4.scale(50, 50, 50)).times(Mat4.scale(8,8,0.1));

        let bake_time = t - this.bake_time
        if(this.can_bake)
        {
            // use bake_time for this
  
            // to do change the color over time as baking

     
            this.shapes.circle.draw(context, program_state, background_transform, this.materials.bg_texture.override({color: background_color}));
            this.shapes.sphere.draw(context, program_state, crust_transform, this.materials.crust_texture.override({color: crust_color}));
            this.shapes.sphere.draw(context, program_state, sauce_transform, this.materials.sauce_texture.override({color: sauce_color}));
            this.shapes.sphere2.draw(context, program_state, cheese_transform, this.materials.cheese_texture_baked.override({color: cheese_color}));
            
            if (this.add_olives)
            {
                this.shapes.torus.draw(context, program_state, olive_transform1, this.materials.olive_texture.override({color: olive_color}));
                this.shapes.torus.draw(context, program_state, olive_transform2, this.materials.olive_texture.override({color: olive_color}));
                this.shapes.torus.draw(context, program_state, olive_transform3, this.materials.olive_texture.override({color: olive_color}));
                this.shapes.torus.draw(context, program_state, olive_transform4, this.materials.olive_texture.override({color: olive_color}));
                this.shapes.torus.draw(context, program_state, olive_transform5, this.materials.olive_texture.override({color: olive_color}));
                this.shapes.torus.draw(context, program_state, olive_transform6, this.materials.olive_texture.override({color: olive_color}));
                this.shapes.torus.draw(context, program_state, olive_transform7, this.materials.olive_texture.override({color: olive_color}));
                this.shapes.torus.draw(context, program_state, olive_transform8, this.materials.olive_texture.override({color: olive_color}));
                this.shapes.torus.draw(context, program_state, olive_transform9, this.materials.olive_texture.override({color: olive_color}));
                this.shapes.torus.draw(context, program_state, olive_transform10, this.materials.olive_texture.override({color: olive_color}));
                this.shapes.torus.draw(context, program_state, olive_transform11, this.materials.olive_texture.override({color: olive_color}));

            }
            

        }

        else if(this.add_olives || this.add_peppers ||  this.add_chicken || this.add_pineapple){
            this.shapes.circle.draw(context, program_state, background_transform, this.materials.bg_texture.override({color: background_color}));
            this.shapes.sphere.draw(context, program_state, crust_transform, this.materials.crust_texture.override({color: crust_color}));
            this.shapes.sphere.draw(context, program_state, sauce_transform, this.materials.sauce_texture.override({color: sauce_color}));
            this.shapes.sphere2.draw(context, program_state, cheese_transform, this.materials.cheese_texture.override({color: cheese_color}));
            if (this.add_olives)
            {
                this.shapes.torus.draw(context, program_state, olive_transform1, this.materials.olive_texture.override({color: olive_color}));
                this.shapes.torus.draw(context, program_state, olive_transform2, this.materials.olive_texture.override({color: olive_color}));
                this.shapes.torus.draw(context, program_state, olive_transform3, this.materials.olive_texture.override({color: olive_color}));
                this.shapes.torus.draw(context, program_state, olive_transform4, this.materials.olive_texture.override({color: olive_color}));
                this.shapes.torus.draw(context, program_state, olive_transform5, this.materials.olive_texture.override({color: olive_color}));
                this.shapes.torus.draw(context, program_state, olive_transform6, this.materials.olive_texture.override({color: olive_color}));
                this.shapes.torus.draw(context, program_state, olive_transform7, this.materials.olive_texture.override({color: olive_color}));
                this.shapes.torus.draw(context, program_state, olive_transform8, this.materials.olive_texture.override({color: olive_color}));
                this.shapes.torus.draw(context, program_state, olive_transform9, this.materials.olive_texture.override({color: olive_color}));
                this.shapes.torus.draw(context, program_state, olive_transform10, this.materials.olive_texture.override({color: olive_color}));
                this.shapes.torus.draw(context, program_state, olive_transform11, this.materials.olive_texture.override({color: olive_color}));

            }
            if (this.add_peppers)
            {
                this.shapes.sub_sphere.draw(context, program_state, tomato_transform1, this.materials.tomato_texture.override({color: tomato_color}))
                this.shapes.sub_sphere.draw(context, program_state, tomato_transform2, this.materials.tomato_texture.override({color: tomato_color}))
                this.shapes.sub_sphere.draw(context, program_state, tomato_transform3, this.materials.tomato_texture.override({color: tomato_color}))
                this.shapes.sub_sphere.draw(context, program_state, tomato_transform4, this.materials.tomato_texture.override({color: tomato_color}))
                this.shapes.sub_sphere.draw(context, program_state, tomato_transform5, this.materials.tomato_texture.override({color: tomato_color}))
                this.shapes.sub_sphere.draw(context, program_state, tomato_transform6, this.materials.tomato_texture.override({color: tomato_color}))
                this.shapes.sub_sphere.draw(context, program_state, tomato_transform7, this.materials.tomato_texture.override({color: tomato_color}))



            }
            if(this.add_pineapple)
            {
                this.shapes.cube.draw(context,program_state,pineapple_transform1, this.materials.pineapple_texture.override({color:tomato_color}))
                this.shapes.cube.draw(context,program_state,pineapple_transform2, this.materials.pineapple_texture.override({color:tomato_color}))
                this.shapes.cube.draw(context,program_state,pineapple_transform3, this.materials.pineapple_texture.override({color:tomato_color}))
                this.shapes.cube.draw(context,program_state,pineapple_transform4, this.materials.pineapple_texture.override({color:tomato_color}))
                //this.shapes.cube.draw(context,program_state,pineapple_transform5, this.materials.tomato_texture.override({color:tomato_color}))
                this.shapes.cube.draw(context,program_state,pineapple_transform6, this.materials.pineapple_texture.override({color:tomato_color}))
                this.shapes.cube.draw(context,program_state,pineapple_transform7, this.materials.pineapple_texture.override({color:tomato_color}))



            }
            if(this.add_chicken)
            {
                this.shapes.circle.draw(context,program_state,basil_transform1, this.materials.basil_texture.override({color:tomato_color}))
                this.shapes.circle.draw(context,program_state,basil_transform2, this.materials.basil_texture.override({color:tomato_color}))
                this.shapes.circle.draw(context,program_state,basil_transform3, this.materials.basil_texture.override({color:tomato_color}))
                this.shapes.circle.draw(context,program_state,basil_transform4, this.materials.basil_texture.override({color:tomato_color}))
                this.shapes.circle.draw(context,program_state,basil_transform5, this.materials.basil_texture.override({color:tomato_color}))
                this.shapes.circle.draw(context,program_state,basil_transform6, this.materials.basil_texture.override({color:tomato_color}))
                this.shapes.circle.draw(context,program_state,basil_transform7, this.materials.basil_texture.override({color:tomato_color}))

            }
            //DRAW AND SPIN TOPPINGS
            this.bake_time = t

        }else if(this.add_cheese){
            this.shapes.circle.draw(context, program_state, background_transform, this.materials.bg_texture.override({color: background_color}));
            this.shapes.sphere.draw(context, program_state, crust_transform, this.materials.crust_texture.override({color: crust_color}));
            this.shapes.sphere.draw(context, program_state, sauce_transform, this.materials.sauce_texture.override({color: sauce_color}));
            this.shapes.sphere2.draw(context, program_state, cheese_transform, this.materials.cheese_texture.override({color: cheese_color}));
            if(!(this.update_control_panel)){
                this.key_triggered_button("olives", ["o"], () => {
                    // TODO:  Requirement 3d:  Set a flag here that will toggle your swaying motion on and off.
                    this.add_olives = true;
                });  
                this.key_triggered_button("bell peppers", ["b"], () => {
                    // TODO:  Requirement 3d:  Set a flag here that will toggle your swaying motion on and off.
                    this.add_peppers = true;
                });   
                this.key_triggered_button("chicken", ["ch"], () => {
                    // TODO:  Requirement 3d:  Set a flag here that will toggle your swaying motion on and off.
                    this.add_chicken = true;
                });   
                this.key_triggered_button("pineapple", ["p"], () => {
                    // TODO:  Requirement 3d:  Set a flag here that will toggle your swaying motion on and off.
                    this.add_pineapple = true;
                }); 
                this.key_triggered_button("bake", ["ba"], () => {
                    // TODO:  Requirement 3d:  Set a flag here that will toggle your swaying motion on and off.
                    this.can_bake = true;
                });                 
                this.update_control_panel = true;
            }

        }else if(this.add_sauce){
            this.shapes.circle.draw(context, program_state, background_transform, this.materials.bg_texture.override({color: background_color}));
            this.shapes.sphere.draw(context, program_state, crust_transform, this.materials.crust_texture.override({color: crust_color}));
            this.shapes.sphere.draw(context, program_state, sauce_transform, this.materials.sauce_texture.override({color: sauce_color}));
            if(this.update_control_panel){
                this.key_triggered_button("cheese", ["c"], () => {
                    // TODO:  Requirement 3d:  Set a flag here that will toggle your swaying motion on and off.
                    this.add_cheese = true;
                });                
                this.update_control_panel = false;
            }
            
        }else{
            this.shapes.circle.draw(context, program_state, background_transform, this.materials.bg_texture.override({color: background_color}));
            this.shapes.sphere.draw(context, program_state, crust_transform, this.materials.crust_texture.override({color: crust_color}));
            this.sauce_time = t
        }

    
        this.sauce = Mat4.inverse(sauce_transform.times(Mat4.translation(0, 0, 0)));
        this.crust = Mat4.inverse(crust_transform.times(Mat4.translation(0, 0, 5)));

        if (this.attached != undefined && this.attached != null ) {

            program_state.camera_inverse = this.attached().map((x,i) => Vector.from(program_state.camera_inverse[i]).mix(x, 0.1))
        }
    }
}


class Gouraud_Shader extends Shader {
    // This is a Shader using Phong_Shader as template
    // TODO: Modify the glsl coder here to create a Gouraud Shader (Planet 2)

    constructor(num_lights = 2) {
        super();
        this.num_lights = num_lights;
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return ` 
        precision mediump float;
        const int N_LIGHTS = ` + this.num_lights + `;
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_positions_or_vectors[N_LIGHTS], light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec4 shape_color;
        uniform vec3 squared_scale, camera_center;

        // Specifier "varying" means a variable's final value will be passed from the vertex shader
        // on to the next phase (fragment shader), then interpolated per-fragment, weighted by the
        // pixel fragment's proximity to each of the 3 vertices (barycentric interpolation).
        varying vec3 N, vertex_worldspace;
        varying vec4 gouraund_color;
        // ***** PHONG SHADING HAPPENS HERE: *****                                       
        vec3 phong_model_lights( vec3 N, vec3 vertex_worldspace ){                                        
            // phong_model_lights():  Add up the lights' contributions.
            vec3 E = normalize( camera_center - vertex_worldspace );
            vec3 result = vec3( 0.0 );
            for(int i = 0; i < N_LIGHTS; i++){
                // Lights store homogeneous coords - either a position or vector.  If w is 0, the 
                // light will appear directional (uniform direction from all points), and we 
                // simply obtain a vector towards the light by directly using the stored value.
                // Otherwise if w is 1 it will appear as a point light -- compute the vector to 
                // the point light's location from the current surface point.  In either case, 
                // fade (attenuate) the light as the vector needed to reach it gets longer.  
                vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz - 
                                               light_positions_or_vectors[i].w * vertex_worldspace;                                             
                float distance_to_light = length( surface_to_light_vector );

                vec3 L = normalize( surface_to_light_vector );
                vec3 H = normalize( L + E );
                // Compute the diffuse and specular components from the Phong
                // Reflection Model, using Blinn's "halfway vector" method:
                float diffuse  =      max( dot( N, L ), 0.0 );
                float specular = pow( max( dot( N, H ), 0.0 ), smoothness );
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light );
                
                vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                                          + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
            }
            return result;
        } `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
            attribute vec3 position, normal;                            
            // Position is expressed in object coordinates.
            
            uniform mat4 model_transform;
            uniform mat4 projection_camera_model_transform;
    
            void main(){                                                                   
                // The vertex's final resting place (in NDCS):
                gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
                // The final normal vector in screen space.
                N = normalize( mat3( model_transform ) * normal / squared_scale);
                vertex_worldspace = ( model_transform * vec4( position, 1.0 ) ).xyz;
                gouraund_color = vec4(shape_color.xyz * ambient, shape_color.w);
                gouraund_color.xyz += phong_model_lights(N, vertex_worldspace);
            } `;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // A fragment is a pixel that's overlapped by the current triangle.
        // Fragments affect the final image or get discarded due to depth.
        return this.shared_glsl_code() + `
            void main(){                                                           
                // Compute an initial (ambient) color:
                gl_FragColor = gouraund_color;

                // Compute the final color with contributions from lights:
                //gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
            } `;
    }

    send_material(gl, gpu, material) {
        // send_material(): Send the desired shape-wide material qualities to the
        // graphics card, where they will tweak the Phong lighting formula.
        gl.uniform4fv(gpu.shape_color, material.color);
        gl.uniform1f(gpu.ambient, material.ambient);
        gl.uniform1f(gpu.diffusivity, material.diffusivity);
        gl.uniform1f(gpu.specularity, material.specularity);
        gl.uniform1f(gpu.smoothness, material.smoothness);
    }

    send_gpu_state(gl, gpu, gpu_state, model_transform) {
        // send_gpu_state():  Send the state of our whole drawing context to the GPU.
        const O = vec4(0, 0, 0, 1), camera_center = gpu_state.camera_transform.times(O).to3();
        gl.uniform3fv(gpu.camera_center, camera_center);
        // Use the squared scale trick from "Eric's blog" instead of inverse transpose matrix:
        const squared_scale = model_transform.reduce(
            (acc, r) => {
                return acc.plus(vec4(...r).times_pairwise(r))
            }, vec4(0, 0, 0, 0)).to3();
        gl.uniform3fv(gpu.squared_scale, squared_scale);
        // Send the current matrices to the shader.  Go ahead and pre-compute
        // the products we'll need of the of the three special matrices and just
        // cache and send those.  They will be the same throughout this draw
        // call, and thus across each instance of the vertex shader.
        // Transpose them since the GPU expects matrices as column-major arrays.
        const PCM = gpu_state.projection_transform.times(gpu_state.camera_inverse).times(model_transform);
        gl.uniformMatrix4fv(gpu.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        gl.uniformMatrix4fv(gpu.projection_camera_model_transform, false, Matrix.flatten_2D_to_1D(PCM.transposed()));

        // Omitting lights will show only the material color, scaled by the ambient term:
        if (!gpu_state.lights.length)
            return;

        const light_positions_flattened = [], light_colors_flattened = [];
        for (let i = 0; i < 4 * gpu_state.lights.length; i++) {
            light_positions_flattened.push(gpu_state.lights[Math.floor(i / 4)].position[i % 4]);
            light_colors_flattened.push(gpu_state.lights[Math.floor(i / 4)].color[i % 4]);
        }
        gl.uniform4fv(gpu.light_positions_or_vectors, light_positions_flattened);
        gl.uniform4fv(gpu.light_colors, light_colors_flattened);
        gl.uniform1fv(gpu.light_attenuation_factors, gpu_state.lights.map(l => l.attenuation));
    }

    update_GPU(context, gpu_addresses, gpu_state, model_transform, material) {
        // update_GPU(): Define how to synchronize our JavaScript's variables to the GPU's.  This is where the shader
        // recieves ALL of its inputs.  Every value the GPU wants is divided into two categories:  Values that belong
        // to individual objects being drawn (which we call "Material") and values belonging to the whole scene or
        // program (which we call the "Program_State").  Send both a material and a program state to the shaders
        // within this function, one data field at a time, to fully initialize the shader for a draw.

        // Fill in any missing fields in the Material object with custom defaults for this shader:
        const defaults = {color: color(0, 0, 0, 1), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40};
        material = Object.assign({}, defaults, material);

        this.send_material(context, gpu_addresses, material);
        this.send_gpu_state(context, gpu_addresses, gpu_state, model_transform);
    }
}