let twrk = {};

// COORDINATES

twrk.scale = function ({ width, height }) {
    if (width) {
        twrk.width = width;
        twrk.res = window.innerWidth / twrk.width;
        twrk.height = window.innerHeight / twrk.res;
    } else if (height) {
        twrk.height = height;
        twrk.res = window.innerHeight / twrk.height;
        twrk.width = window.innerWidth / twrk.res;
    }
    twrk.center = {x: twrk.width / 2, y: twrk.height / 2};  
}
window.innerWidth < window.innerHeight ? twrk.scale({ width: 120 }): twrk.scale({ height: 120 });

// SVG

twrk.svgNameSpace = "http://www.w3.org/2000/svg";

twrk.svgPath = function (points) {

    let output = "M ";
    for (var i = 0; i < points.length; i++) {
        output += points[i].x * twrk.res + " " + points[i].y * twrk.res + " ";
    }

    return output;
};

twrk.makeSvgLayer = function ({ parent, id, x = 0, y = 0}) {
    dom[id] = document.createElementNS(twrk.svgNameSpace, "svg");
    dom[id].id = id;
    dom[id].style.transform = "translateX(" + (x * twrk.res) + "px) translateY(" + (y * twrk.res +"px)");
    parent.appendChild(dom[id]);
}

twrk.makeSvgLine = function ({parent, id, d="", color = "#f0f", stroke = 1, cap = "butt"}){
    dom[id] = document.createElementNS(twrk.svgNameSpace, "path");
    dom[id].setAttributeNS(null, "fill", "none");
    dom[id].setAttributeNS(null, "d", d);
    dom[id].setAttributeNS(null, "stroke-width", stroke * twrk.res);
    dom[id].setAttributeNS(null, "stroke", color);
    dom[id].setAttributeNS(null, "stroke-linecap", cap);
    dom[id].id = id;
    parent.appendChild(dom[id]);
} 

twrk.makeSvgShape = function ({ parent, id, d = "", color = "#0ff" , strokeCol, stroke}) {
    dom[id] = document.createElementNS(twrk.svgNameSpace, "path");
    dom[id].setAttributeNS(null, "fill", color);
    dom[id].setAttributeNS(null, "d", d);
    dom[id].setAttributeNS(null, "stroke-width", stroke * twrk.res);
    dom[id].setAttributeNS(null, "stroke", strokeCol);
    dom[id].id = id;
    parent.appendChild(dom[id]);
}

// DOM

let dom = {};

// add main stage
dom.stage = document.createElement("stage");
dom.stage.style.transform = "translateX(" + (twrk.center.x * twrk.res) + "px) translateY(" + (twrk.center.y * twrk.res +"px)");
dom.stage.id = "stage";
let stageParent = document.querySelector("#content");
stageParent.appendChild(dom.stage);

// make svg laver
twrk.makeSvgLayer({parent: dom.stage, id: "svgLayer", x: 0, y: 0});

// ------ HERE COMES THE FUN PART -----------


//Load Simplex Noise
const simplex = new SimplexNoise();

// Variables

let xIter = 0.5; //Point density on x-Axis
let y = 0; 
let off1 = 0; // perlin offset 1
let off2 = 0; // perlin offset 2
let inc1 = 0.03; //perlin scan variable y
let inc2 = 0.1 // perlin scan variable x, 0.05: wavey, 0.2: noisy
let startY = 0; //perlin starting point
let startX = 1; //perlin starting point
let numLines = 100 // number of lines, whatelse?
let lineOffset = 1 //line spacing
let similarity = 2 //10: high, 1: normal, dependent on other variables

// Paint Lines
for (l = 0; l< numLines; l++){
    twrk.makeSvgShape( {
        parent: dom.svgLayer,
        id: "line" + l,
        color: "#fff",
        stroke: 0.1,
        strokeCol: "#000",
        d: ""
    } );
}


// Paint Frame

let frame = [
    {x: -50, y: -numLines*lineOffset/2-20},
    {x: -50, y: numLines*lineOffset/2+20},
    {x: 50, y: numLines*lineOffset/2+20},
    {x: 50, y: -numLines*lineOffset/2-20},
    {x: -50, y: -numLines*lineOffset/2-20}
]

twrk.makeSvgLine({
    parent: dom.svgLayer,
    id: "frame",
    color: "#fff",
    stroke: 5,
    d: twrk.svgPath(frame)
});

// -------------  LOOP ---------------
let t = {};

function loop(time) {
    off2 = startX;
    for (let l = 0; l < numLines; l++){
        let path = [];
        off1 = startY;
       
        xScale = (1-simplex.noise2D(0,off2)); // variation through lines, yields extremer results than 2D perlin
        for (let x = -50; x<50; x+= xIter) {
            yTranslate = l*lineOffset-numLines*lineOffset/2
            yScale = 0.1*(5-Math.abs(x/10)-(simplex.noise2D(off1*5,0))/4)**3
            path.push({x: x , y: (xScale*-Math.abs(simplex.noise2D(off1+l/similarity,0)))*yScale+yTranslate});
            off1 += inc1;
        }
        path.push({x: 50, y: yTranslate+20}) //add two points so previous lines are hidden
        path.push({x: -50, y: yTranslate+20});  
        dom["line"+l].setAttributeNS(null, "d", twrk.svgPath(path));
        off2 += inc2;
       
    }
    startX = time*0.0002//+=0.01; //x Animation Speed
    startY = -time*0.0005//-= 0.01; //y Animation Speed
   requestAnimationFrame(loop);

   t.now = time;
   let fr = 1000/(t.now-t.delta)
   fr = fr.toFixed(0)
   document.getElementById("framerate").innerHTML = "framerate: " + fr + " fps";
   t.delta = t.now;
}
loop(0);



