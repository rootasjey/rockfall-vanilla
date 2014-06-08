window.onload = function () {

  var plateau = new Table(5, 5, 40, 40, 10);
  
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var valid = true;
  plateau.draw(ctx);
  
  var interval = 30;
  setInterval(function() { if(!valid){ plateau.clear(ctx); plateau.draw(ctx); valid = true;} }, interval);
  
  $("#canvas").on("mousemove",function(e){
	
	var canvas = document.getElementById("canvas");
	var mouse = getMouse(e,canvas);
	var mx = mouse.x, my = mouse.y;

	for (var i = 0; i < plateau.graphique.length; i++) {
		if (plateau.graphique[i].contains(mx, my)) {
		
			plateau.graphique[i].selected = true;
			valid = false;
		
		}else{
		
			plateau.graphique[i].selected = false;
			valid = false;
		}
	}

  });
  
};

function getMouse(e,canvas) {
	
	// This complicates things a little but but fixes mouse co-ordinate problems
	// when there's a border or padding. 
	var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
	if (document.defaultView && document.defaultView.getComputedStyle) {
		stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
		stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
		styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
		styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
	}
  // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
  // They will mess up mouse coordinates and this fixes that
  var html = document.body.parentNode;
  htmlTop = html.offsetTop;
  htmlLeft = html.offsetLeft;
	

  var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
  
  // Compute the total offset
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  // Add padding and border style widths to offset
  // Also add the <html> offsets in case there's a position:fixed bar
  offsetX += stylePaddingLeft + styleBorderLeft + htmlLeft;
  offsetY += stylePaddingTop + styleBorderTop + htmlTop;

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;
  
  // We return a simple javascript object (a hash) with x and y defined
  return {x: mx, y: my};

 }