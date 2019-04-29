function process() {
    
    var number_of_teeth = 10;
    var diametral_pitch = 8;
    var gear_height = 0;
    var spacer = 0;
    var arbor = 0;
            
    // var mesh = new Mesh3D();
      
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
    for (var tooth = 0; tooth < number_of_teeth; ++tooth)
    {
        var theta_initial = angle_between_tip * tooth;
        var theta_final1 = theta_initial + 1/(4*gear_radius/small_radius) * Math.PI*2/2;
        var theta_final2 = theta_initial - 1/(4*gear_radius/small_radius) * Math.PI*2/2;

        var r = tooth_tip_radius;
        x = r * Math.cos(theta_initial);
        y = r * Math.sin(theta_initial);

        for (var step = 0; step < 20; ++step)
        {
            var theta = theta_final2 + (theta_final1 - theta_final2)/20*step;
            var small_theta = (theta_final1 - theta)*gear_radius/small_radius;
            
            r = Math.sqrt(small_radius*small_radius + combined_radius*combined_radius - 2*small_radius*combined_radius*Math.cos(small_theta));
            t = Math.asin(small_radius/r*Math.sin(small_theta))+theta;
            
            nextx = r * Math.cos(t);
            nexty = r * Math.sin(t);
          
          //mesh.quad([x,y,0],[x,y,gear_height],[nextx,nexty,0],[nextx,nexty,gear_height]);
          console.log(nextx + "," + nexty + " ");
          x=nextx;
          y=nexty;
        }

        r = inset_radius;
        nextx = r * Math.cos(theta_final2);
        nexty = r * Math.sin(theta_final2);
        console.log(nextx + "," + nexty);

        r = tooth_tip_radius;
        x = r * Math.cos(theta_initial);
        y = r * Math.sin(theta_initial);
        
        for (var step = 0; step < 20; ++step)
        {
            var theta = theta_final1 - (theta_final1 - theta_final2)/20*step;
            var small_theta = (theta_final2 - theta)*gear_radius/small_radius;
      
            r = Math.sqrt(small_radius*small_radius + combined_radius*combined_radius - 2*small_radius*combined_radius*Math.cos(small_theta));
            t = Math.asin(small_radius/r*Math.sin(small_theta))+theta;
          
            nextx = r * Math.cos(t);
            nexty = r * Math.sin(t);
          
          //mesh.quad([x,y,0],[x,y,gear_height],[nextx,nexty,0],[nextx,nexty,gear_height]);
          console.log(nextx + "," + nexty + " ");
          x=nextx;
          y=nexty;
        }

        r = inset_radius;
        nextx = r * Math.cos(theta_final1);
        nexty = r * Math.sin(theta_final1);
        console.log(nextx + "," + nexty);

        x = nextx;
        y = nexty;

        var next_theta_initial = angle_between_tip * (tooth+1)%number_of_teeth;
        var next_theta_final2 = next_theta_initial + 1/(4*gear_radius/small_radius) * Math.PI*2/2;

        r = inset_radius;
        nextx = r * Math.cos(next_theta_final2);
        nexty = r * Math.sin(next_theta_final2);
        console.log(nextx + "," + nexty);
  }
}

process();
