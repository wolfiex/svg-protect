"use strict";

/*
## Usage
=========
    const svgp = require('svg-protect');

    var svg = document.getGetElementById('mysvg')

    svggp(svg,{
                  owner:"Dan Ellis <my_email@test.com>"
                  flatten:true,
                  elementids: "",
                  split:false,
                  cclicense:true,
                  cclogo:true,
                  filename:"test"// dont include '.svg'
                  savebtn:true
        })
 */
module.exports = function(svgDOM, opt) {
  var SVGO = require("svgo");
  var parse = require('parse-svg-path')
  var contours = require('svg-path-contours')
  var simplify = require('simplify-path')
  var triangulate = require('triangulate-contours')


  svgo = new SVGO({
    plugins: [
      {
        convertShapeToPath: { convertArcs: true }
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
        removeViewBox: false
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
        convertArcs: true
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
        convertShapeToPath: true
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
        convertShapeToPath: true
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








  function flatten (svg){
    //remove groups
    var gs = document.querySelectorAll('g')

    gs.forEach( g=>{
      styles = g.getAttribute('style')||'';
      if(styles.trim().slice(-1)!=';'){styles+= ';'}
      var children = g.children

      d3.range(children.length).forEach(c=>{

        var child = children[0] //these are lost when added to main svg, therefore only pick first
        childstyle = child.getAttribute('style')||''
        child.setAttribute('style',styles+childstyle)//ensure we are not missing this
        child.id= window.copyright||'copyright Dan Ellis: ' + new Date()
        svg.appendChild(child);

      })

  g.remove()

    } )
  svg.innerHTML=svg.innerHTML.trim()//rm whitespace
  }




if (opt.flatten){flatten(svgDOM)}

return svg

};
