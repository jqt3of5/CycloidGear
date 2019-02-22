// Convenience Declarations For Dependencies.
// 'Core' Is Configured In Libraries Section.
// Some of these may not be used by this example.
var Conversions = Core.Conversions;
var Debug = Core.Debug;
var Path2D = Core.Path2D;
var Point2D = Core.Point2D;
var Point3D = Core.Point3D;
var Matrix2D = Core.Matrix2D;
var Matrix3D = Core.Matrix3D;
var Mesh3D = Core.Mesh3D;
var Plugin = Core.Plugin;
var Tess = Core.Tess;
var Sketch2D = Core.Sketch2D;
var Solid = Core.Solid;
var Vector2D = Core.Vector2D;
var Vector3D = Core.Vector3D;

// Template Code:
// Default Extrusion Profile
// Wrapped in a function so it's only executed when needed.
function defaultValue() {
    var svg = '<?xml version="1.0" encoding="ISO-8859-1" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" version="1.1"><ellipse cx="0" cy="0" rx="2" ry="10"/></svg>';
    var svgSketch = Conversions.toSketch2DFromSVG(svg);
    return svgSketch.toJSON();
}

// User-Facing Parameters
params = [
    { "id": "num_teeth", "displayName": "Number of Teeth", "type": "int", "default": 10, "rangeMin": 6, "rangeMax": 300 },
    { "id": "diametral_pitch", "displayName": "Diametral Pitch", "type": "length", "default": 1, "rangeMin": 0, "rangeMax": 5 },
    { "id": "gear_height", "displayName": "Gear Height", "type": "length", "default": 1, "rangeMin": 0, "rangeMax": 1 }
  
    
];

// Shape Generator
function shapeGeneratorEvaluate(params,callback) {
    
    var number_of_teeth = params["num_teeth"];
    var diametral_pitch = params["diametral_pitch"]/10; //convert to cm
    var spacer = params["spacer"];
    var arbor = params["arbor"];
    var gear_height = params["gear_height"]*10;
      
    var tooth_width = 1/(2*diametral_pitch/Math.PI);
    var angle_between_tip = 2*Math.PI/number_of_teeth;
    var gear_radius = number_of_teeth * tooth_width*2 / (2*Math.PI); //* 2;
    var small_radius = tooth_width*4/(2*Math.PI);
    var combined_radius = gear_radius + small_radius; 
    var tooth_tip_radius = Math.sqrt(small_radius*small_radius + combined_radius*combined_radius);
    var inset_radius = gear_radius - (tooth_tip_radius - gear_radius);

    console.log("width:" + tooth_width);  
    console.log("angle_between_tip:" + angle_between_tip);
    console.log("gear_radius:" + gear_radius);
    console.log("small_radius:" + small_radius);
   
    var nextx = 0;   
    var nexty = 0;
    var x = 0;  
    var y = 0; 
    
    var path = new Path2D();
    for (var tooth = 0; tooth < number_of_teeth; ++tooth)
    { 
        
        var modifier = number_of_teeth < 8 ? 4.5 : 4;
        var theta_initial = angle_between_tip * tooth;
        var theta_final1 = theta_initial + 1/(modifier*gear_radius/small_radius) * Math.PI*2/2;
        var theta_final2 = theta_initial - 1/(modifier*gear_radius/small_radius) * Math.PI*2/2;
  
        var theta = theta_final1;
        var small_theta = (theta_final2 - theta)*gear_radius/small_radius;
      
        var r = Math.sqrt(small_radius*small_radius + combined_radius*combined_radius - 2*small_radius*combined_radius*Math.cos(small_theta));
        var t = theta_initial;     
        x = r * Math.cos(t);
        y = r * Math.sin(t);
        path.moveTo(x,y);
      
        for (var step = 0; step <= 50; ++step)
        {
            theta = theta_final1 - (theta_final1 - theta_final2)/50*step;
            small_theta = (theta_final2 - theta)*gear_radius/small_radius;
      
            r = Math.sqrt(small_radius*small_radius + combined_radius*combined_radius - 2*small_radius*combined_radius*Math.cos(small_theta));
            t = Math.asin(small_radius/r*Math.sin(small_theta))+theta;
          
            nextx = r * Math.cos(t);
            nexty = r * Math.sin(t);
          
            path.lineTo(nextx, nexty); 
        } 
  
      
        r = inset_radius;
        nextx = r * Math.cos(theta_final2);
        nexty = r * Math.sin(theta_final2);
        path.lineTo(nextx, nexty);
      
        theta = theta_final2;
        small_theta = (theta_final1 - theta)*gear_radius/small_radius;
      
        r = Math.sqrt(small_radius*small_radius + combined_radius*combined_radius - 2*small_radius*combined_radius*Math.cos(small_theta));
        t = theta_initial;     
        x = r * Math.cos(t);
        y = r * Math.sin(t);
        path.moveTo(x,y);
       
        for (var step = 0; step <= 50; ++step)
        {
            theta = theta_final2 + (theta_final1 - theta_final2)/50*step;
            small_theta = (theta_final1 - theta)*gear_radius/small_radius;
            
            r = Math.sqrt(small_radius*small_radius + combined_radius*combined_radius - 2*small_radius*combined_radius*Math.cos(small_theta));
            t = Math.asin(small_radius/r*Math.sin(small_theta))+theta;
            
            nextx = r * Math.cos(t);
            nexty = r * Math.sin(t);
            path.lineTo(nextx, nexty);
      
        } 
   
        r = inset_radius;
        nextx = r * Math.cos(theta_final1);
        nexty = r * Math.sin(theta_final1); 
        path.lineTo(nextx, nexty);
      
        nextx = r * Math.cos(theta_final2);
        nexty = r * Math.sin(theta_final2);
        path.lineTo(nextx, nexty);
  }

   var solid = Solid.extrude([path], gear_height);
  spokeGenerator(inset_radius, inset_radius-3, gear_height, function(mesh) {
   solid = Solid.make(mesh.combine(solid.mesh));
    
    callback(solid);
  });
  
}

function spokeGenerator(outerRadius, innerRadius, height, callback)
{ 
    var outer  = cylinderGenerator(outerRadius, height);
    var inner  = cylinderGenerator(innerRadius, height);
  
  outer.subtract(inner,function(mesh) {
  
    
    callback(mesh);
  });
  
}

function cylinderGenerator(radius, height)
{
    var cl = [0,0,0];
    var ch = [0,0,height];
    var pl = [radius,0,0];
    var ph = [radius,0,height];
    var ndivs = Tess.circleDivisions(radius);
    
    var mesh = new Mesh3D();
    for (var i = 0; i < ndivs; i++) {
        var a = (i+1)/ndivs * Math.PI*2;
        var s = Math.sin(a);
        var c = Math.cos(a);
        var nl = [radius*c, -radius*s, 0];
        var nh = [radius*c, -radius*s, height];
        mesh.triangle(pl, ph, nl);
        mesh.triangle(nl, ph, nh);
        mesh.triangle(cl, pl, nl);
        mesh.triangle(ch, nh, ph);
        pl = nl;
        ph = nh;
    }
    return mesh;
}
