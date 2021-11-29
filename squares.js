//COOKIE GETTER
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
 
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
twrk.scale({ height: 150 });

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

twrk.makeSvgShape = function ({ parent, id, d = "", color = "#0ff" }) {
    dom[id] = document.createElementNS(twrk.svgNameSpace, "path");
    dom[id].setAttributeNS(null, "fill", color);
    dom[id].setAttributeNS(null, "d", d);
    dom[id].id = id;
    parent.appendChild(dom[id]);
}

// DOM

let dom = {};


dom.stage = document.createElement("stage");
dom.stage.style.transform = "translateX(" + (twrk.center.x * twrk.res) + "px) translateY(" + (twrk.center.y * twrk.res +"px)");
dom.stage.id = "stage";
let stageParent = document.querySelector("#content");
stageParent.appendChild(dom.stage);

// make svg laver
twrk.makeSvgLayer({parent: dom.stage, id: "svgLayer", x: 0, y: 0});

//Load Simplex Noise
const simplex = new SimplexNoise();

// Check of there is a cookie
// Make one if there is none.
if (!getCookie("cookie_animate")) {
    document.cookie = "cookie_animate=" + 0 + "; SameSite=Lax"
}

//draw
let dist = 10;
let cells = 10;
let colors = [
    "#9f7576", 
    "#e1b2a1", 
    "#f1aeb4", 
    "#f198be", 
    "#ee88c5", 
    "#e294c2"
  ]
let path = [];
let animate = (parseInt(getCookie("cookie_animate")) == 1);
let counter = 0;
let speed = 0.002;


for (let x = -cells/2; x < cells/2; x++){
        for (let y = -cells/2; y < cells/2; y++){
            let square = dist*simplex.noise2D()*0.7 + 0.2*dist;
            path = [
                {x: x*dist - square/2 - simplex.noise2D()/4,  y: y*dist - square/2 - simplex.noise2D()/4},
                {x: x*dist + square/2 + simplex.noise2D()/4,  y: y*dist - square/2 - simplex.noise2D()/4},
                {x: x*dist + square/2 + simplex.noise2D()/4,  y: y*dist + square/2 + simplex.noise2D()/4},
                {x: x*dist - square/2 - simplex.noise2D()/4,  y: y*dist + square/2 + simplex.noise2D()/4}
            ]
            twrk.makeSvgShape( {
                id: x*cells + y,
                parent: dom.svgLayer,
                color: colors[Math.floor(Math.random()*colors.length)],
                d: twrk.svgPath(path)
            } );
        }
 }

 twrk.animate = function(){
    for (let x = -cells/2; x < cells/2; x++){
        for (let y = -cells/2; y < cells/2; y++){
            let square = dist*(1+simplex.noise2D(x/5,(Math.abs(y)+1)*counter))*0.35 + 0.2*dist;
            path = [
                {x: x*dist - square/2 - simplex.noise2D(1,counter/14)/4,  y: y*dist - square/2 - simplex.noise2D(5,counter/10)/4},
                {x: x*dist + square/2 + simplex.noise2D(2,counter/15)/4,  y: y*dist - square/2 - simplex.noise2D(6,counter/11)/4},
                {x: x*dist + square/2 + simplex.noise2D(3,counter/16)/4,  y: y*dist + square/2 + simplex.noise2D(7,counter/12)/4},
                {x: x*dist - square/2 - simplex.noise2D(4,counter/17)/4,  y: y*dist + square/2 + simplex.noise2D(8,counter/13)/4}
            ]
            
            dom[x*cells+y].setAttributeNS(null, "d", twrk.svgPath(path));
        }
    }
    if (animate){
        requestAnimationFrame(twrk.animate);
    } 
    counter += speed;
 }
 twrk.animate()

// check if dancinge, write into menu
if (parseInt(getCookie("cookie_animate")) == 1){
    document.querySelector("control").innerHTML = "[rest]"
}


 function toggleAnim(){
    animate = !animate;
    if (animate){
        twrk.animate();
        document.querySelector("control").innerHTML = "[rest]"
        document.cookie = "cookie_animate=" + 1 + "; SameSite=Lax"

    } else {
        document.querySelector("control").innerHTML = "[dance]"
        document.cookie = "cookie_animate=" + 0 + "; SameSite=Lax"
    }
 }

/// MAKE A FRAME

let aD = Math.random()/4;

let frame = [
    {x: -(cells/2 + 1 + aD)*dist, y:  -(cells/2 + 1)*dist},
    {x: -(cells/2 + 1)*dist, y:  (cells/2)*dist},
    {x: (cells/2)*dist, y:  (cells/2 + aD)*dist},
    {x: (cells/2 + aD)*dist, y:  -(cells/2 + 1 + aD)*dist},
    {x: -(cells/2 + 1 + aD)*dist, y:  -(cells/2 + 1)*dist}
]

twrk.makeSvgLine( {
    parent: dom.svgLayer,
    stroke: 3,
    cap: "square",
    color: "#513839",
    d: twrk.svgPath(frame)
});
