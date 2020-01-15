<template>
  <div id="jpeg-viewer">
    <div class="col-12 row">
      <div class="col-5 border2">
        <h3>This is the image viewer</h3>
        <p>Image name: {{resourcename}}</p>
        <button @click="drawpoints()">Draw Points</button>
        <button @click="toggle_canvas()">Toggle annotation/poly</button>

        <div class="scroller">
          <button class="col-12 btn" v-for="llist in list">
            <div class="row">
              <div class="col-10" style="color:White;">{{llist}}</div>
              <div class="col-2" @click="show(llist)"><i class="fa fa-camera" style="color:White;"></i></div>
            </div>
          </button>
        </div>
        <div class="field">
          <label class="label">Name</label>
          <div class="control">
            <input class="input" style="width:100%" type="text" v-model="annotation.name" />
          </div>
        </div>
        <div class="field">
          <label class="label">Comment</label>
          <div class="control">
            <input class="input" style="width:100%" type="text" v-model="annotation.comment" />
          </div>
        </div>
      </div>
      <div class="col-7" style="width:580px; height: 800px; overflow: hidden;">
        <br>
        <br>
        <br>
        <div id="myImageContainer" class="border">
          <img id="myImage" class="image" src="" width="550" height="700">
          <canvas id="myCanvas" class="canvas" width="550" height="700" style="z-index: 2; border: 2px solid blue;"></canvas>
        </div>
      </div>
    </div>

  </div>
</template>



<style>
  #jpeg-viewer{
    height: 800px;
    background-color: #777;
    color: white;
    overflow-y: hidden;
  }
  .scroller{
		height: 200px;
		overflow-y: scroll;
	}
  .image{
    z-index: 1;
    position: absolute;
    left: 0;
    top: 0;
  }
  .canvas{
    position: absolute;
    left: 0;
    top: 0;
  }
  .canvas2{
    position: absolute;
    border: 2px solid red;
    left: 0;
    top: 0;
  }
  .border{
    border-radius: 4px;
    padding: 0px;
    position: relative;
    width: 550px;
    height: 700px;
  }
  .border2{
    border-radius: 4px;
    padding: 16px;
    border: 2px solid red;
  }
</style>



<script>

export default {
  data(){
    return{
      viewerselectvalue: "",
      resourcefolder: "",
      resourcename: "",
      list : [],
      instance : {},
      panzoomflag : false,
      drawpointsflag : false,
      annoflag : false,
      imageloadedflag : false,
      needFirstPoint : true,
      clear_canvas : false,
      imagesrc : "",
      annotation : {
          name : "",
          comment : ""
      }
    };
  },
  methods : {
    showinImage(resource){
      // loading one image in the image viewer
      let temp = this;
      var localcanvas = document.getElementById("myCanvas");
      var ctx = localcanvas.getContext("2d");
      ctx.clearRect(0, 0, localcanvas.width, localcanvas.height);
      var image = document.getElementById("myImage");
      image.src = "https:"+process.env.VUE_APP_PUBLIC+"/"+this.resourcefolder+"/"+resource;
      this.resourcename = resource;
      this.imagesrc = image.src;
      this.imageloadedflag = true;
      this.clear_canvas = true;
      this.annoflag = true;

    },
    toggle_canvas() {
      // toggle between annotation and polyline
      if (this.annoflag == false) {
        this.annoflag = true;
        this.needFirstPoint = true;
      } else {
        this.annoflag = false;
      }
    },
    init_poly() {
      // this method is for handling polyline and annotation
      let temp = this;
      var Xcoordinates = new Array(1000);
      var Ycoordinates = new Array(1000);
      Xcoordinates.fill(0);
      Ycoordinates.fill(0);
      var canvas = new fabric.Canvas('myCanvas', {fireRightClick: true});
      canvas.selectable = false;
      var a,b;
      var i = 0;
      var a,b;
      var old_x, old_y;
      function drawNextLine2(cvs, x, y) {
          if(temp.needFirstPoint) {
              old_x = x; old_y = y;
              temp.needFirstPoint = false;
              var circle = new fabric.Circle({radius: 5, top:old_y, left:old_x, stroke: 'blue', originX: 'center', originY: 'center',
              fill: 'transparent'});
              cvs.add(circle);
          } else {
              var line = new fabric.Line([old_x, old_y, x, y], {
                stroke: 'blue'
              });
              var circle = new fabric.Circle({radius: 5, top:y, left:x, stroke: 'blue', originX: 'center', originY: 'center',
              fill: 'transparent'});
              line.selectable = false;
              circle.selectable = false;
              cvs.add(line);
              cvs.add(circle);
              old_x = x; old_y = y;
          }
      }
      function drawNextLine(ctx, x, y) {
        ctx.strokeStyle = "blue";
          if (temp.needFirstPoint) {
              ctx.lineWidth = 1;
              ctx.moveTo(x, y);
              ctx.arc(x,y,5,0,2*Math.PI,true);
              ctx.stroke();
              temp.needFirstPoint = false;
          }
          else {

              ctx.lineTo(x, y);
              ctx.arc(x,y,5,0,2*Math.PI,true);
              ctx.stroke();

          }
      }
      function addText(e) {
        temp.needFirstPoint = true;
        var custontxt=new fabric.Textbox(temp.annotation.name+':::\n'+temp.annotation.comment, {
          fontFamily: 'helvetica',
          fontSize:15,
          fontWeight:400,
          fill:'red',
          fontStyle: 'normal',
          top:e.offsetY,
          cursorDuration:500,
          left:e.offsetX,
        });
        custontxt.selectable = false;
        canvas.add(custontxt);
      }



      canvas.on('mouse:down', function(e) {
        console.log(temp.needFirstPoint);
        if(e.button == 1){
          console.log("left click");
          if(temp.clear_canvas == true){
            var objects = canvas.getObjects('line');
            for (let i in objects) {
                canvas.remove(objects[i]);
            }
            var objects = canvas.getObjects('circle');
            for (let i in objects) {
                canvas.remove(objects[i]);
            }
            var objects = canvas.getObjects('textbox');
            for (let i in objects) {
                canvas.remove(objects[i]);
            }
            temp.clear_canvas = false;
          }
          else {
            if(temp.annoflag==false){
                  var offset = fabric.util.getElementOffset(canvas.lowerCanvasEl);
                  var ctx = canvas.getContext('2d');
                   a = e.e.offsetX;
                   b = e.e.offsetY;

                   Xcoordinates.fill(a,i,i+1);
                   Ycoordinates.fill(b,i,i+1);
                   // storing the polyline coordinates, if necessary
                   console.log("coordinate "+i+"::: X = "+Xcoordinates[i]+", Y = "+Ycoordinates[i]);
                   i++;
                  canvas.on('mouse:up',function(ev){
                    if(temp.annoflag==false){
                      // drawNextLine(ctx,a,b);
                      // the function drawNextLine2() makes sure the canvas element recognises all the changes, whereas function
                      // drawNextLine() creates a 2d layer over the canvas. So in function drawNextLine() the changes are not recognised
                      // by canvas. this way the polyline stays with function drawNextLine2().
                      drawNextLine2(canvas, a, b);
                    }
                  });

            }

            else if(temp.annoflag==true){
              canvas.on('mouse:up',function(ev){
                if(temp.annoflag==true){
                  addText(ev.e);
                }
              });
            }
          }
        }
        if(e.button == 3){
          console.log("right click");
          canvas.on('mouse:up', function(ev){
            if(e.button ==3){
              temp.needFirstPoint = true;
            }
          });
        }
      });

    },
    panzoomfunc(){
      // using panzoom feature
      if(this.drawpointsflag === true){
        this.drawpointsflag = false;
      }
      var imagecontainer = document.getElementById("myImageContainer");
      this.instance = panzoom(imagecontainer, {maxZoom: 10, minZoom: 0.5});
      this.panzoomflag = true;
      // alert(this.instance);
    },
    drawpoints(){
      // this method can be used if coordinates/points are received from the sparse cloud
      var localcanvas = document.getElementById("myCanvas");
      var ctx = localcanvas.getContext("2d");
      ctx.fillStyle = "#0000ff";
      var canvasWidth = localcanvas.width;
      var canvasHeight = localcanvas.height;
      //alert(canvasHeight);
      for(var i = 1; i<=5; i++){
        //alert(i);
        var height = Math.round(Math.random()*canvasHeight);
        var width = Math.round(Math.random()*canvasWidth);
        ctx.fillRect(width,height,2,2);
        //alert(width);
      }
      this.drawpointsflag = true;
    },
    show(resource){
			// hide once the resource is loaded
			if(resource.formatType == "POTREE" || resource.formatType == "OBJ")
				$(event.target.parentElement).toggleClass("hide");
			//console.log(event.target.parentElement);
			this.$emit('onJpegShow', resource);
		},
    load(resource){
      // loading all the image files
      this.resourcefolder = resource.location;
      this.list = resource.files;
    }
  }

}
</script>
