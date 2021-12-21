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
twrk.scale({ height: 400 });

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



//DRAW GRID
function draw(){
    twrk.makeSvgLayer({parent: dom.stage, id: "svgLayer", x: 0, y: 0});

    let path = [];
    //GRID BAISC PARAMETERS
    let dist = 5;
    let square = 5;
    let cells = 60;

    // GRID VALUES, FUNNY TO PLAY 
    // to see original idea _rF = 0.5, gI = 0, gS = 1, mF = 0
    let _rF = Math.random() // 0 to 1, randomness (0.5)
    let gridImpact = Math.random(); // 0 to 1, diamond shaped grid variation (0)
    let _gridStyle = Math.random()<0.5?1:-1; // 1, 0 or -1, defines horizontal or vertical (1)
    let mashupFactor = Math.floor(Math.random()*10) //(0)


   
    for (let x = -cells/2; x < cells/2; x++){
        for (let y = -cells/2; y < cells/2; y++){
            let rF = _rF;
            let gridStyle = _gridStyle;
            rF += gridImpact*(Math.abs(x)+Math.abs(y))/(1.2*cells)
            gridStyle += gridImpact*(Math.abs(x)+Math.abs(y))/(1.2*cells)*mashupFactor
            path = [
                {
                x: x*dist + (Math.random()<rF?(-square/2):square/2),
                y: y*dist + (Math.random()<rF?(square/2):-square/2)
                },{
                x: x*dist + (Math.random()<1-rF?(gridStyle*square/2):-gridStyle*square/2), 
                y: y*dist + (Math.random()<1-rF?(gridStyle*square/2):-gridStyle*square/2)
                },
            ]
            if (Math.random()){
                twrk.makeSvgLine( {
                    parent: dom.svgLayer,
                    id: "drawing",
                    stroke: 0.5,
                    color: "#59758f",
                    d: twrk.svgPath(path)
                } );
            }
            rF = _rF;
            
        }
    }
    document.getElementById("values").innerHTML = "values: rF = " + _rF.toFixed(2) + ", grid Impact = " + gridImpact.toFixed(2) + ", grid Style = " + _gridStyle + ", Mashup Factor = " + mashupFactor
}
draw();

function reDraw(){
    document.getElementById("svgLayer").remove();
    draw();
}

//Text
