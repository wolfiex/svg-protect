"use strict";

/*
## Usage
=========


const svgp = require('svg-protect');

var svg = document.getElementById('mysvg')

svgp(svg,{
              owner:"Dan Ellis <my_email@test.com>",
              flatten:true,
              elementids: "",
              split:false,
              cclicense:true,
              cclogo:true,
              savestyle: "svge" // "svge|svg|png"
              savebtn:true
    })

 */
module.exports = function(svgDOM, opt) {
  var SVGO = require("svgo");
  var parse = require("parse-svg-path");
  var contours = require("svg-path-contours");
  var simplify = require("simplify-path");
  var triangulate = require("triangulate-contours");
  var save = require('./save.js');

  function svgopt(split) {
    return new SVGO({
      plugins: [
        {
          convertShapeToPath: { convertArcs: split }
        },
        {
          cleanupAttrs: true
        },
        {
          removeDoctype: true
        },
        {
          removeXMLProcInst: true
        },
        {
          removeComments: true
        },
        {
          removeMetadata: true
        },
        {
          removeTitle: true
        },
        {
          removeDesc: true
        },
        {
          removeUselessDefs: true
        },
        {
          removeEditorsNSData: true
        },
        {
          removeEmptyAttrs: true
        },
        {
          removeHiddenElems: true
        },
        {
          removeEmptyText: true
        },
        {
          removeEmptyContainers: true
        },
        {
          removeViewBox: true
        },
        {
          cleanUpEnableBackground: true
        },
        {
          convertStyleToAttrs: true
        },
        {
          convertColors: true
        },
        {
          convertPathData: true
        },
        {
          convertTransform: true
        },
        {
          removeUnknownsAndDefaults: true
        },
        {
          removeNonInheritableGroupAttrs: true
        },
        {
          removeUselessStrokeAndFill: true
        },
        {
          removeUnusedNS: true
        },
        {
          cleanupIDs: true
        },

        {
          cleanupNumericValues: true
        },
        {
          moveElemsAttrsToGroup: true
        },
        {
          moveGroupAttrsToElems: true
        },
        {
          collapseGroups: true
        },
        {
          removeRasterImages: true
        },
        {
          mergePaths: true
        },

        {
          sortAttrs: true
        },
        {
          transformsWithOnePath: true
        },
        {
          removeDimensions: true
          //},{
          //removeAttrs: {attrs: '(stroke|fill)'},
        }
      ]
    });
  }

  function flatten(svg) {
    //remove groups
    var gs = document.querySelectorAll("g");

    gs.forEach(g => {
      var styles = g.getAttribute("style") || "";
      if (styles.trim().slice(-1) != ";") {
        styles += ";";
      }
      var children = g.children;

      Array.from({ length: children.length }, (x, i) => i).forEach(c => {
        var child = children[0]; //these are lost when added to main svg, therefore only pick first
        var childstyle = child.getAttribute("style") || "";
        child.setAttribute("style", styles + childstyle); //ensure we are not missing this
        //child.id= path.elementids||'CC Attrib. Dan Ellis'
        svg.appendChild(child);
      });

      g.remove();
    });
    svg.innerHTML = svg.innerHTML.trim(); //rm whitespace
  }

  function setids(svg) {
    Array.from({ length: svg.childElementCount}, (x, i) => i).forEach(c => {
      svg.children[c].id = opt.elementids;
    });
  }

  function splitme(svg) {
    var paths = svg.querySelectorAll("path");
    console.log(svg,paths)
    paths.forEach(p => {
      var lines = contours(parse(p.getAttribute("d")));
      lines = lines.map(path => simplify(path, 1e-30));

      var shape = triangulate(lines);
      shape.cells.forEach(d => {
        var array = d.map(e => shape.positions[e]);
        makeTriangle(svg, array, p.getAttribute("fill") || "");
      });

      p.fill = "none";
      p.style.fill = "none";
      svg.appendChild(p);
      //p.remove()
    });
  }

  function makeTriangle(svg, array, p) {
    var polygon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    var value;
    for (value of array) {
      var point = svg.createSVGPoint();
      point.x = value[0];
      point.y = value[1];
      polygon.points.appendItem(point);
    }
    //polygon.style = "fill:" + p + ";stroke:p;stroke-width:0";
    polygon.style='stroke:red;stroke-opacity:0';
    ///console.log(polygon)
    svg.appendChild(polygon);
  }

  function optimise(svg, split) {

    return svgopt(split).optimize(svg.innerHTML.trim())

  }

  if (opt.flatten || true) {
    flatten(svgDOM);
  }

  optimise(svgDOM, opt.split || false).then(function(result) {

      console.log('postop')

      svg.innerHTML = result.data;
      if (opt.elementids||"" != "") {
        setids(svgDOM);
      }

      if (opt.split || false) {
        splitme(svgDOM);
      }

      if (opt.cclicense||false){
        var owner = opt.owner||'Dan Ellis'
        svg.innerHTML = '<!--'+owner+' '+ new Date + '\n'+ require('./CC_BY_SA.js') + '-->' +svg.innerHTML
      }




    });


    var ss = opt.savestyle||'svge'
    window.savebtnfn= save[ss]
    if (opt.savebtn||false){
    document.body.innerHTML=document.body.innerHTML+ `<div><button id='saveme' onclick='window.savebtnfn()'> Save Me! </button></div>`
    document.getElementById('saveme').style = 'width:100%;fill:red;position:absolute;'

}








  return svg;
};
