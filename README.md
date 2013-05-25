# Diurnal Parallax

A super-simple parallax plugin for jQuery.

_*Currenly only supports background images._

## How to use it

### HTML

Add the image path as a data attribute to your element(s).

    data-bg-image="massive-bg-image.jpg"
    
Diurnal Parallax will take the data attribute and turn it into an image reference via inline CSS.

### JavaScript

Grab a copy of the latest [jQuery](http://jquery.com/) library and reference it before referencing the Diurnal Parallax plugin.

    <script type="text/javascript" src="jquery.js"></script>
    <script type="text/javascript" src="jquery.diurnal.js"></script>
    
Use `dParallax();` on the element you want to have a parallax background.

    $('.parallax-bg').dParallax();
    
### Quick Example
    <div class="parallax-bg" data-bg-image="dandy.jpg">
	    <h1>Clever Headline</h1>	
		<p>Awesome paragraph about skateboarding.</p>	
	</div>

	<script src="jquery.js"></script>
	<script src="jquery.diurnal.js"></script>
	<script>
		$('.parallax-bg').dParallax();
	</script>
    
### Demo

You can view this in action [here](http://levibeach.github.com/diurnal-parallax).
    
 