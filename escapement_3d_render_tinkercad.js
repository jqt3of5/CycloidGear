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
    { "id": "diametral_pitch", "displayName": "Diametral Pitch", "type": "length", "default": 1, "rangeMin": 0, "rangeMax": 5 },
    { "id": "gear_height", "displayName": "Gear Height", "type": "length", "default": 1, "rangeMin": 0, "rangeMax": 1 }
];

// Shape Generator
function shapeGeneratorEvaluate(params,callback) {
    
    var diametral_pitch = params["diametral_pitch"]/10; //convert to cm
    var gear_height = params["gear_height"]*10;

    var wheel_points = generate_wheel(diametral_pitch, 30);
    var anchor_points = generate_anchor(diametral_pitch, 30).points;

    var path = new Path2D();
    path.moveTo(wheel_points[0].x, wheel_points[0].y);
    for (var i = 1; i < wheel_points.length; i++) {
        path.lineTo(wheel_points[i].x, wheel_points[i].y);
    }

    var solid = Solid.extrude([path], gear_height);
    
    callback(solid);

}