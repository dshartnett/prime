// David H.
window['Prime']={};

(function(){

"use strict";

var CONST = {
FPS: 60,
FRAME_MAX: 30,
CANVAS_WIDTH: 1024,
CANVAS_HEIGHT: 640,
SPEED_SLIDER_MAX: 1000,
};

window.requestAnimFrame = (function () {
 return window.requestAnimationFrame
 					|| window.webkitRequestAnimationFrame
 					|| window.mozRequestAnimationFrame
 					|| window.oRequestAnimationFrame
 					|| window.msRequestAnimationFrame
 					|| function(callback){window.setTimeout(callback, 1000 / CONST.FPS);};
}
)();

function Ulam_Spiral(x,y,dot_size,dot_color)
{
	var pos_x = x,
		pos_y = y,
		dir_x = 1,
		dir_y = 0,
		count = 1,
		size = dot_size,
		color = dot_color,
		line_size = 1,
		line_count = 1,
		line_size_change = 1;
	
	function is_prime(x)
	{
		var sqrt_x = Math.ceil(Math.sqrt(x));
		if (x%2==0 && x!=2 || x==1) return false;
		for (var i = 3; i <= sqrt_x; i++)
		{
			if (x%i==0) return false;
		}
		return true;
	}
	
	this.next_step = function(context){
		//console.log(line_size + " " + count + " " + x + " " + y + " " + dir_x + " " + dir_y + " " + line_size_change + " " + line_count + " " + is_prime(count));
		if (x > -dot_size && x < CONST.CANVAS_WIDTH && y > -dot_size && y < CONST.CANVAS_HEIGHT && is_prime(count))// && (is_prime(count-2) || is_prime(count+2)))
		{
			context.fillStyle = color;
			context.fillRect(x,y,size,size);
		}
		
		x += dir_x*dot_size;
		y += dir_y*dot_size;
		count++;
		line_count--;
		
		if (line_size_change==0) {line_size_change = 2; line_size++;}
		if (line_count == 0)
		{
			if (dir_x == 0)
			{
				dir_x = dir_y;
				dir_y = 0;
			}
			else
			{
				dir_y = -dir_x;
				dir_x = 0;
			}
			line_count = line_size;
			line_size_change--;
		}
	};
}

function Toy()
{
	var request_id;
	
	var main_canvas;
	var main_context;
	var button_clear, slider_dot_size, slider_speed;

	var spirals = {};
	var spiral_num = 0;

	var interval = 1000/CONST.FPS;
	
	var draw_per_frame = 100;
	var dot_size = 2;

	this.initialize = function () {
		$(document).ready(function(){
			CONST.CANVAS_WIDTH = window.screen.availWidth - 10;
			CONST.CANVAS_HEIGHT = window.screen.availHeight - 160;

			main_canvas = $("<canvas id='main_canvas' width='" + CONST.CANVAS_WIDTH + "' height='" + CONST.CANVAS_HEIGHT + "'>Update your browser</canvas>");
			main_context = main_canvas.get(0).getContext('2d');
			main_canvas['appendTo']("body");
			$('#main_canvas').click(function(e) {
				var x = e.pageX - this.offsetLeft;
				var y = e.pageY - this.offsetTop;
				spirals[spiral_num++] = new Ulam_Spiral(x,y,dot_size,'black');
			});

			$("<table id='table'><tbody><tr id='row_1'></tr><tr id='row_2'></tr></tbody></table>")['appendTo']("body");
			$("<td><button name='Clear' type='button' onclick='Prime.clear()'>Clear</button></td><td><div id='slider_dot_size'></div></td><td><div id='slider_speed'></div></td>")['appendTo']("#row_1");
			$("<td></td><td id='dot_size'>Dot size</td><td id='speed'>Draw speed</td>")['appendTo']("#row_2");
			
			Prime['clear'] = function()
			{
				for (var u in spirals) delete spirals[u];
				spiral_num = 0;
				main_context.fillStyle = "white";
				main_context.fillRect(0,0,CONST.CANVAS_WIDTH,CONST.CANVAS_HEIGHT);
			}
			
			
			$(function() {$( "#slider_dot_size" ).slider({max:10,min:1,value:dot_size});});
			$( "#slider_dot_size" ).on( "slidechange", function( event, ui ) {dot_size=ui['value'];} );
			$(function() {$( "#slider_speed" ).slider({max:CONST.SPEED_SLIDER_MAX,min:1,value:draw_per_frame});});
			$( "#slider_speed" ).on( "slidechange", function( event, ui ) {draw_per_frame=ui['value'];} );

			draw();
		});
	};

	function draw() {
		request_id = window.requestAnimFrame(draw);
		var then = Date.now(), i = 0;
		while (Date.now() - then < interval && (draw_per_frame == CONST.SPEED_SLIDER_MAX || i++ < draw_per_frame)) for (var u in spirals) spirals[u].next_step(main_context);
	};

	return this;
}

var main = new Toy();

main.initialize();

})();
