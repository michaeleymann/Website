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
window.innerWidth < window.innerHeight ? twrk.scale({ width: 200 }): twrk.scale({ height: 200 });

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
if (!getCookie("cookie_rF")) {
    document.cookie = "cookie_rF=" + 0.5 + "; SameSite=Lax"
}


// PAINTING VARIABLES
let dist = 20;
let cells = 7; //NEEDS TO BE UNEVEN
let gap = 3;
let values = [4,6,8,10,12,14];
let rF;
let rFplus = 0;
let yTranslate = 30;
//MAKE PATH

function draw(){
    rF = parseFloat(getCookie("cookie_rF"))
    let path  = [];
    for (let col = 0; col < cells; col++) {
        for (let row = 0; row < cells; row++) {
            var division = values[Math.floor(Math.random()*values.length)];
            if ((row + col%2)%2 == 0) {//S
                for (let i = 0; i < (2*division + 2); i++){
                    let x = (Math.floor((i + 1)/2) + col%2)%2*-dist;
                    let y = (dist/division)*Math.floor(i/2)*(((col + 1)%2)*2 - 1);
                    x += ((col%2)*2 - 1)*row*(dist + gap);
                    y += col*(dist + gap) + (col%2)*dist - (cells+1)*dist/2;
                    x = col%2==0? (x + (cells*(dist+gap)/2)): (x - ((cells-2)*(dist+gap)/2));
                    path.push({x: x + Math.random()*rF, y: y + Math.random()*rF-yTranslate})
                }
            } else { //W
                for (let i = 0; i < (2*division + 2); i++) {
                    let y = (Math.floor((i + 1)/2)+col%2)%2*-dist;
                    let x = -(dist/division)*Math.floor(i/2)*(((col + 1)%2)*2 - 1);
                    x += ((col%2)*2 - 1)*row*(dist + gap) - (col%2)*dist;
                    y += col*(dist + gap) + dist - (cells+1)*dist/2;
                    x = col%2==0? (x + (cells*(dist+gap)/2)): (x - ((cells-2)*(dist+gap)/2));
                    path.push({x: x + Math.random()*rF, y: y + Math.random()*rF-yTranslate})
                } 
            }
            rF += rFplus;
        }
    }
    
    //PAINT IT 
    

    twrk.makeSvgLine( {
        id: "drawing",
        parent: dom.svgLayer,
        color: "#735d78",
        stroke:0.5,
        d: twrk.svgPath(path)
    } );
}

draw();

//CONTROL

function changeRandomness(dir){
    if (dir == 1) {
        rF += 0.4;
        console.log("rF = "+rF)
        document.cookie = "cookie_rF=" + rF + "; SameSite=Lax";
    } else {
        rF<0?rf=0:rF -= 0.4;
        document.cookie = "cookie_rF=" + rF + "; SameSite=Lax";

    }
    document.getElementById("drawing").remove();
    draw()
    console.log(document.cookie)
}


