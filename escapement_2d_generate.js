var EscapementType = {
    PinPallet : 1, 
    Bullzeye : 2,//Bullzeye clock uses variation on pin pallet escapement, nice for 3d printing
    DeadBeat: 3,
}

function generate_wheel(diametral_pitch, numberOfTeeth = 30) {
    
    var circPitch = (diametral_pitch * Math.PI);
    var dedenum_radius = (numberOfTeeth / circPitch) / (2*Math.PI);
    
    //tooth width is 1/3 to leave room between teeth. 
    var tooth_arc_width = 1/3 * 2*Math.PI/numberOfTeeth;
    // Tooth height is 20% of radius
    var tooth_height = dedenum_radius*.20; 
    var points = []    

    for (var i = 0; i < numberOfTeeth; ++i)
    {
        var angle = 2*Math.PI/numberOfTeeth * i;

        var tooth_points = generate_tooth(angle, dedenum_radius, tooth_arc_width, tooth_height, 45);
        points = points.concat(tooth_points);
    }


    return points;
}

function generate_anchor(diametral_pitch, numberOfTeeth = 30)
{
    var points = [];    

    var circPitch = (diametral_pitch * Math.PI);
    var dedenum_radius = (numberOfTeeth / circPitch) / (2*Math.PI);
    // Tooth height is 20% of radius
    var tooth_height = dedenum_radius*.20; 

    var anchor_radius = dedenum_radius + tooth_height + 2/3*tooth_height;

    //angle between anchor teeth should be 1/3 a circle plus a half tooth width
    var theta_diff = 2 * Math.PI / numberOfTeeth * (numberOfTeeth/3 + .5);

    var x = (anchor_radius - tooth_height)*Math.cos(0);
    var y = (anchor_radius - tooth_height)*Math.sin(0);
    points.push({x:x,y:y});

    x = (anchor_radius)*Math.cos(0);
    y = (anchor_radius)*Math.sin(0);
    points.push({x:x,y:y});

    for (var i = 0; i < 100; ++i) 
    {
        x = anchor_radius*Math.cos(theta_diff/100 * i);
        y = anchor_radius*Math.sin(theta_diff/100 * i);
        points.push({x:x,y:y});        
    }

    x = (anchor_radius)*Math.cos(theta_diff);
    y = (anchor_radius)*Math.sin(theta_diff);
    points.push({x:x,y:y});

    x = (anchor_radius - tooth_height)*Math.cos(theta_diff);
    y = (anchor_radius - tooth_height)*Math.sin(theta_diff);
    points.push({x:x,y:y});

    x = x + 1/8*Math.cos(theta_diff+Math.PI/2);
    y = y + 1/8*Math.sin(theta_diff+Math.PI/2);
    points.push({x:x,y:y});
    
    x = x + (3/2*tooth_height)*Math.cos(theta_diff);
    y = y + (3/2*tooth_height)*Math.sin(theta_diff);
    points.push({x:x,y:y});

    for (var i = 100; i >= 0; --i) 
    {
        x = (anchor_radius+1/2*tooth_height)*Math.cos(theta_diff/100 * i);
        y = (anchor_radius+1/2*tooth_height)*Math.sin(theta_diff/100 * i);
        points.push({x:x,y:y});        
    }

    x = x + 1/8*Math.cos(0-Math.PI/2);
    y = y + 1/8*Math.sin(0-Math.PI/2);
    points.push({x:x,y:y});        

    x = x - (3/2*tooth_height)*Math.cos(0);
    y = y - (3/2*tooth_height)*Math.sin(0);
    points.push({x:x,y:y});        

    x = x + 1/8*Math.cos(0+Math.PI/2);
    y = y + 1/8*Math.sin(0+Math.PI/2);
    points.push({x:x,y:y});    

    x = anchor_radius*Math.cos(theta_diff/2);
    y = anchor_radius*Math.sin(theta_diff/2);
    
    var center = {x:x,y:y}    

    return {center:center, points:points};
}

function generate_tooth(angle, radius, arc_width, height, face_angle)
{
    var points = []

    //starting point
    var x = radius * Math.cos(angle);
    var y = radius * Math.sin(angle);
    points.push({x:x, y:y});

    //next point will define back of tooth
    x = (radius + height) * Math.cos(angle);
    y = (radius + height) * Math.sin(angle);
    points.push({x:x, y:y});

    //Face width is arc_width - not the best approach, but it looks fine.     
    var face_width = radius * arc_width;
    //calculate next point to define face of tooth
    var facePoint = addPolar({radius:(radius+height), angle:angle},{radius:face_width, angle:180-face_angle});    
    x = facePoint.radius * Math.cos(facePoint.angle);  
    y = facePoint.radius * Math.sin(facePoint.angle);  
    points.push({x:x, y:y});

    //next point will define belly of tooth
    x = radius * Math.cos(angle + arc_width);
    y = radius * Math.sin(angle + arc_width);
    points.push({x:x, y:y});


    return points;
}

function addPolar(primary, secondary)
{
    var angle = 180 - secondary.angle;
    var newRadius = Math.sqrt(primary.radius*primary.radius + secondary.radius*secondary.radius - 2 * primary.radius*secondary.radius*Math.cos(angle));
    var theta_diff = Math.asin(secondary.radius * Math.sin(angle)/newRadius);

    var newTheta = primary.angle;
    if (secondary.angle - primary.angle > 0)
    {
        newTheta += theta_diff;
    }
    else
    {
        newTheta -= theta_diff;
    }
    return {angle:newTheta, radius:newRadius};
}

function generate_circle (radius)
{
    const circle_divisions = 100;
    var points = []
    for (var i = 0; i <= circle_divisions; i++) 
    {
        var theta = 2*Math.PI/circle_divisions * i;
        var x = radius * Math.cos(theta);
        var y = radius * Math.sin(theta);
        points.push({x:x, y:y});
    }  

    return points;
}