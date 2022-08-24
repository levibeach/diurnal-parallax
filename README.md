⚠️ WARNING: This project is not maintained. Use at your own risk.

---

# Diurnal Parallax

A super-simple parallax plugin for jQuery.

_*Currenly only supports background images._

## How to use it

### HTML

Add the image path as a data attribute to your element(s).

    data-parallax-image="massive-bg-image.jpg"
    
Diurnal Parallax will take the data attribute and turn it into an image reference via inline CSS.

You can also set the speed for each of the elements (default is 15):

    data-parallax-speed="5"

### JavaScript

Grab a copy of the latest [jQuery](http://jquery.com/) library and reference it before referencing the Diurnal Parallax plugin.

    <script type="text/javascript" src="jquery.js"></script>
    <script type="text/javascript" src="jquery.diurnal.js"></script>
    
Use `dParallax();` on the element you want to have a parallax background.

    $('.parallax-bg').dParallax();
    
### Quick Example
    <div class="parallax-bg" data-parallax-speed="5" data-parallax-image="dandy.jpg">
	    <h1>Clever Headline</h1>	
		<p>Awesome paragraph about skateboarding.</p>	
	</div>

	<script src="jquery.js"></script>
	<script src="jquery.diurnal.js"></script>
	<script>
		$('.parallax-bg').dParallax();
	</script>
    
### Demo

You can view this in action [here](https://levibeach.com/diurnal-parallax/).
    
 
