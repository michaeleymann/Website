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
    dom[id].style = "mix-blend-mode: multiply";
    dom[id].setAttributeNS(null, "d", d);
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



// Check of there is a cookie
// Make one if there is none.
if (!getCookie("cookie_colors")) {
    document.cookie = "cookie_colors=" + 1 + "; SameSite=Lax"
}

//draw
let dist = 10;
let square = 20;
let cells = 10;
let colors1 = ["#cdb4db", "#ffc8dd", "#ffafcc", "#bde0fe", "#a2d2ff"];
let colors2 = ["#d3f8e2", "#e4c1f9", "#f694c1", "#ede7b1", "#a9def9"];
let colors3 = ["#f7d1cd", "#e8c2ca", "#d1b3c4", "#b392ac", "#735d78"];
let colors = [];

let c3 = [-square/2,0,square/2];
let c2 = [0,square/2];


//set color by cookie
if ( parseFloat(getCookie("cookie_colors")) == 1){
    colors = colors1;
} else if ( parseFloat(getCookie("cookie_colors")) == 2){
    colors = colors2;
} else {
    colors = colors3;
}

for (let x = -cells/2; x < cells/2; x++){
    for (let y = -cells/2; y < cells/2; y++){
        let thisC3= c3[Math.floor(Math.random()*c3.length)]
        let thisC2= c2[Math.floor(Math.random()*c2.length)]
        let path = [
            {x: x*dist - thisC3, y: y*dist - square/2},
            {x: x*dist + thisC2, y: y*dist + square/2},
            {x: x*dist - square/2, y: y*dist + thisC2}
        ]
        twrk.makeSvgShape( {
            parent: dom.svgLayer,
            color: colors[Math.floor(Math.random()*colors.length)],
            d: twrk.svgPath(path)
        } );
    }
}

function changeColors(n){
    let myPaths = document.querySelectorAll("path");
    for (let p of myPaths){
        if (n == 1){
            p.setAttributeNS(null, "fill", colors1[Math.floor(Math.random()*colors1.length)]);
            document.cookie = "cookie_colors=" + 1 + "; SameSite=Lax";
        } else if (n == 2){
            p.setAttributeNS(null, "fill", colors2[Math.floor(Math.random()*colors2.length)]);
            document.cookie = "cookie_colors=" + 2 + "; SameSite=Lax";
        } else {
            p.setAttributeNS(null, "fill", colors3[Math.floor(Math.random()*colors3.length)]);
            document.cookie = "cookie_colors=" + 3 + "; SameSite=Lax";

        }
    }
}