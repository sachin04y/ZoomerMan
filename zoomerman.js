var selector = '.wk-editor'; 		//ZoomerMan assigned area selector
var offset = 50; 						// An Offset value to save your screen edges
var elementObj = Object.create(null); 	//An Object bag to store elements
var initialScrollPos = -1;
// A Handler
document.addEventListener("DOMContentLoaded", function() {

	elementObj.body = document.body;
    var container = document.querySelectorAll(selector);
    var el = container[0].getElementsByTagName('img'); // Rescue all Images
    for (var i = 0; i < el.length; i++) {
		if ( ! el[i].classList.contains( 'zoomer-null' ) ) {
			if ( 'A' == el[i].parentNode.nodeName && el[i].getAttribute( 'data-src' ) != el[i].parentElement.href && el[i].getAttribute( 'src' ) != el[i].parentElement.href ) {
				continue;
			}
			el[i].classList.add('zm-zoomer', 'zm-zoomer-in');
			el[i].addEventListener('click', function(event){
				elementObj.img = this;
				event.preventDefault();
				zoomerMan();						// Call ZoomerMan
				addZoomOffListeners();	// Tell ZoomerMan when to Put Off
			});
		}
    }

});
// End Handling

// ZoomerMan Arrival
function zoomerMan() {
	el = elementObj.img;
	elementObj.overlay = document.createElement('div');  	// A CoverUp Shield
	elementObj.overlay.classList.add('zm-zoomer-overlay');
	elementObj.body.appendChild(elementObj.overlay);

	var ___ = elementObj.overlay.offsetWidth;    // Initiate Browser-Reflow to apply transition

	elementObj.overlay.classList.add('zm-overlay-on');
    var naturalSize = {
                        'w' : el.naturalWidth,
			 			'h' : el.naturalHeight
			 	 	  };
	var scaleFactor = scaleFinder(naturalSize);  // Call ScaleFinder (His Buddy)
	actionInitiation(scaleFactor);			     // Use ScaloTranslate superpower
}
// ZoomerMan GoodBye :)


// Helper : 'ScaleFinder'
function scaleFinder(naturalSize) {
    var maxScalingVal = naturalSize.w / elementObj.img.width;
    var viewportWidth =  document.documentElement.clientWidth - offset;
    var viewportHeight = document.documentElement.clientHeight - offset;
    var imageAspectRatio = naturalSize.w / naturalSize.h;
    var viewportAspectRatio = viewportWidth / viewportHeight;

    if (naturalSize.w < viewportWidth && naturalSize.h < viewportHeight) {
        return maxScalingVal;
    }
    else if (imageAspectRatio < viewportAspectRatio) {
        return viewportHeight / naturalSize.h * maxScalingVal;
    }
    else {
        return viewportWidth / naturalSize.w * maxScalingVal;
    }
}

// SupperPower : 'ScaloTranslate'
function actionInitiation(scale) {
	el = elementObj.img;
	var scrollTop = window.pageYOffset;
	var rect = el.getBoundingClientRect();
	var docEl = document.documentElement;
	var win = window;
	var imgOffset = {
		left : rect.left + win.pageXOffset - docEl.clientLeft,
		top  : rect.top + win.pageYOffset - docEl.clientTop,
	};
	var imgCenterXoffset = imgOffset.left + ( el.width / 2 );
	var imgCenterYoffset = imgOffset.top + ( el.height / 2 );
	var midViewportX = document.documentElement.clientWidth / 2;
	var midViewportY = scrollTop + ( document.documentElement.clientHeight / 2 );
	var _pos_x = midViewportX - imgCenterXoffset;
	var _pos_y = midViewportY - imgCenterYoffset;
	var _pos_z = 0;

	var moveAction = "translate3d(" + _pos_x + "px, " + _pos_y + "px, " + _pos_z + "px)";
	var scaleAction = "scale(" + scale + ")";

	el.classList.add('zm-zoomer-out');
	el.style.transform = moveAction + ' ' + scaleAction;  // First Translate, then Scale
}

var addZoomOffListeners = function addZoomOffListeners() {
    document.addEventListener( "keyup", handleKeyup );
    document.addEventListener( "click", handleClick, true );
    document.addEventListener( "scroll", handleScroll );
    document.addEventListener( "touchmove", handleScroll );
};

var removeZoomOffListeners = function removeZoomOffListeners() {
    document.removeEventListener( "keyup", handleKeyup );
    document.removeEventListener( "click", handleClick, true );
    document.removeEventListener( "scroll", handleScroll );
    document.removeEventListener( "touchstart", handleScroll );
};

// Helping Hands
var handleClick = function handleClick(event) {
		event.preventDefault();
		event.stopPropagation();
		closeZoomer();
};
var handleScroll = function handleScroll() {

		if ( initialScrollPos == -1 ) {
				initialScrollPos = window.pageYOffset;
		}
		var relativeY = Math.abs(initialScrollPos - window.pageYOffset);
		if (relativeY >= 100) {
				closeZoomer();
		}
};
var handleKeyup = function handleKeyup(event) {
    if (event.keyCode == 27) {
		// When Pressed 'ESC'
        closeZoomer();
    }
};
function closeZoomer() {
    elementObj.img.style.transform = "none";
		elementObj.img.classList.remove("zm-zoomer-out");
		elementObj.overlay.classList.add('zm-overlay-off');
		elementObj.overlay.addEventListener('transitionend', function(){
			elementObj.body.removeChild(elementObj.overlay);
		});
		removeZoomOffListeners();
}
