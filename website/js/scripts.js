var _debug = false;
var _loadingoffset = 0;
var $window = $(window);
var $body = $('body');
var _videoloaded = false;
var _windowloaded = false;
var _scrollPosition = $(window).scrollTop();
var _loadinginterval;

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function getID($el, txtID){
    if($el.attr("id") == undefined) {
        $el.attr("id", txtID);
        return txtID;
    } else {
        return $el.attr("id");
    }
        
}

function sizeOfWindow($el, spaceing) {
	if($el.size() > 0){
		var $inner = $el.find("> .container");
		var h2 = $inner.height();
		var h = ($window.outerHeight()-spaceing);
		
		if(h2 < h){
			$el.css("height", h + "px");
			$inner.css("padding-top", ((h - h2)/2) + "px");
		} else {
			$el.css("height", "");
			$inner.css("padding-top", "");
		}
	}
}

function bsCarouselAnimHeight() {
  /*
    if($('.carousel').size() > 0){
        var $carousel = $('.carousel'),
        $carouselItems = $('.item', $carousel);
        
        $carousel.carousel({ interval: 5000 }).on('slide.bs.carousel', function (e)
        {
            var nextH = $(e.relatedTarget).height();
            $(e.relatedTarget).parent().css({ height: nextH });
        }).on('slid.bs.carousel', function (e) {
            //Reset classes
            $carouselItems.removeClass('prev next');
            //Find current slide
            var $active = $(e.relatedTarget);
            //Add corresponding classes to next and prev elements
            $active.next().addClass('next');
            $active.prev().addClass('prev');
        });
    }
 */
    if($('.carousel').size() > 0){
        var $carousel = $('.carousel'),
        $carouselItems = $('.row', $carousel);
        var h = 0;
        $carouselItems.each(function(i,e){
            var h2 = $(this).find("blockquote").outerHeight();
            if(h2 > h)
                h = h2;
        });   
        $carouselItems.find("> div").css("height", h+"px");
    }
}

function magicStaggered(scrollMagicController){
    if($("#grids-squares").size() > 0){
        // Create Animation
        var tween = TweenMax.staggerFromTo(".grid-square-animate", .5,  
                {top: '25px', opacity:0},
                {top: '0px', opacity:1},  
                0.15);

        // build scene
        var scene = new ScrollScene({triggerElement: "#grids-squares"})
                .setTween(tween).reverse(false)
                .addTo(scrollMagicController);

        // show indicators (requires debug extension)
        if(_debug)
            scene.addIndicators({suffix: "grid sliding"});
    }
}

function magicParallax(scrollMagicController){
    if($(".parallax-background").size() > 0){
        $(".parallax-background").each(function(i, e){
            var id = getID($(this), "ParallaxBG" + i);
            
            var scene = new ScrollScene({triggerElement: "#" + id})
                .setTween(TweenMax.from("#" + id + " > .parallaxbg", 1, {top: "-40%", ease: Linear.easeNone}))
                .addTo(scrollMagicController);

            if(_debug)
                scene.addIndicators({suffix: "parallax"});
        });
    }
}

function magicTopBar(scrollMagicController){
    if($("#toTopBar").size() > 0){
        var tween = TweenMax.fromTo("#toTopBar", 0.5, 
            {height: '60px', lineHeight:'60px'},
            {height: '100px', lineHeight:'100px'});  

        var scene = new ScrollScene({triggerElement: "#toTopBar", offset: -250})
            .setTween(tween)
            .addTo(scrollMagicController);
    }
}

function magicLettering(scrollMagicController){
    if($(".parallax-text").size() > 0){
        $(".parallax-text").each(function(i, e){
            var id = getID($(this), "ParallaxTXT" + i);
            
            var scene = new ScrollScene({ triggerElement: "#" + id, duration: $window.height() + 300, offset: -150})
                .addTo(scrollMagicController)
                .triggerHook("onCenter")
                .setTween(new TimelineMax().add([
                    TweenMax.fromTo("#" + id + " #big1", 1, {alpha: 0.1, top: "35%", left: "5%"}, {top: "-20%", ease: Linear.easeNone}),
                    TweenMax.fromTo("#" + id + " #big2", 1, {alpha: 0.1, top: "25%", left: "30%"}, {top: "50%", ease: Linear.easeNone}),
                    TweenMax.fromTo("#" + id + " #big3", 1, {alpha: 0.1, top: "5%", left: "60%"}, {top: "99%", ease: Linear.easeNone}),
                    TweenMax.fromTo("#" + id + " #big4", 1, {alpha: 0.1, top: "90%", left: "85%"}, {top: "30%", ease: Linear.easeNone})
                ]));
        });
    }
}

function magicLazyText(scrollMagicController){
    if($(".lazytext").size() > 0){
        $(".lazytext").each(function(i, e){
            var id = getID($(this), "LazyLoader" + i);
            var tween = TweenMax.fromTo("#" + id, 0.5, 
                {top: '25px', opacity:0},
                {top: '0px', opacity:1});  

            var scene = new ScrollScene({triggerElement: "#" + id, offset: -250})
                .setTween(tween).reverse(false)
                .addTo(scrollMagicController);
            
            if(_debug)
                scene.addIndicators({suffix: "lazy text"});
        });
    }
}

function magicLazyBackground(scrollMagicController){
    if($(".lazybackground").size() > 0){
        $(".lazybackground").each(function(i, e){
            var id = getID($(this), "LazyBackgroundLoader" + i);
            var tween = TweenMax.fromTo("#" + id, 0.5, 
                {backgroundColor: "#F1F1F1"},
                {backgroundColor: "transparent"});  

            var scene = new ScrollScene({triggerElement: "#" + id, offset: -250})
                .setTween(tween).reverse(false)
                .addTo(scrollMagicController);
            
            if(_debug)
                scene.addIndicators({suffix: "lazy background"});
        });
    }
}

function doneLoading(){
	var $preload = $(".preload");
    if(_videoloaded==true && _windowloaded==true){
        if($preload.size() > 0){
			$preload.addClass("still-loading");
			setTimeout(function(){
				//$preload.find(".icon").one('animationiteration webkitAnimationIteration', function() {
					$preload.addClass("done-loading").children().removeClass("icon-loading");
					setTimeout(function(){
						clearInterval(_loadinginterval);
						$preload.remove();
						$("#whole-site").removeClass("loading");
                        setCookie("loaded", "true", .25); 
					},1200);
				//});
			},1000); 
        }
    }
}

function scrollWheeling(scrollfactor){
    var isTweening = false;

    document.onmousewheel = function(){ customScroll(); }
    if(document.addEventListener){ document.addEventListener('DOMMouseScroll', customScroll, false); }

    function customScroll(event){

       var delta = 0;

       if (!event){ event = window.event; }

       if (event.wheelDelta) {
           delta = event.wheelDelta/120;
       } else if(event.detail) {
           delta = -event.detail/3;
       }

       if (delta){
            var scrollTop = $window.scrollTop();
            var finScroll = scrollTop - parseInt(delta*100) * scrollfactor;

            TweenMax.to($window, 0.5, {
                scrollTo : { y: finScroll, autoKill:true },
                ease: Power4.easeOut,
                autoKill: true,
                overwrite: 5,
                onComplete: function(){ }
            });
       }

       if (event.preventDefault){ event.preventDefault(); }
       event.returnValue = false;
    }
}

function slideNavigation(){
	var $whole = $("#whole-site"),
		$mask = $('<div class="mask"></div>'),
		$menuToggle = $body.find( ".toggle-slide-left" ),
        scrollPosition = 0,
		activeNav = "";
	
	function navOn(){
        scrollPosition = window.pageYOffset;
        $whole.css("top", (-1*scrollPosition) + "px");
		activeNav = "nav-open";
		$body.addClass(activeNav);
		$body.append($mask.clone());
        window.scrollTo(0, 0);
	}
	function navOff(){
        $whole.css("top", "");
		$body.removeClass( activeNav );
		activeNav = "";
		$body.find(".mask").remove();
        window.scrollTo(0, scrollPosition);
        scrollPosition = 0;
	}
	
	/* hide active menu if mask is clicked */
	$body.on( "click", ".mask", function(){
		navOff();
	} );
	
	/* slide menu left */
	$menuToggle.on( "click", function(){
		if(activeNav == ""){
			navOn();
		} else {
			navOff();
		}
	} );
}

function tiles(){
    var $section = $(".biography-section");
    var $tilesAndText = $section.find(".bio-img, .bio-text");
    var $tiles = $tilesAndText.filter(".bio-img");
    var $texts = $tilesAndText.filter(".bio-text");
    var $spacer = $('<div class="bio-spacer"></div>');
    var index = -1;
    var $currentToShow = null;
    var $lastItem = null;
	var closing = false;
	var opening = false;
    var itemsAcross = 0;
    
    function showTile() {
        getItemsAcross();
        index = $texts.index($currentToShow);
        $lastItem = whereToShowTile($currentToShow);
        var h = $currentToShow.find(".content").outerHeight(true) + "px";
        
        var $newSpace = $spacer.clone();
        
        window.setTimeout(function () {
            $currentToShow.css({
                "height" : h,
                "top"    : $newSpace.position().top + "px"
            });
            $newSpace.css("height", h);
        }, 100);
		
		window.setTimeout(function () {
			opening = false;
		}, 600);
        
        $lastItem.after($newSpace);
    }
    
    
    function getItemsAcross(){
        var testWidth = $tiles.eq(0).width();
        var winWidth = $window.width();
        
        itemsAcross = Math.round(winWidth/testWidth);
    }
    
    function resize(){
        if(index >= 0){
            var checkRow = itemsAcross;
            getItemsAcross();
            if(checkRow != itemsAcross){
                $tiles.removeClass("active");
                $section.removeClass("active");
                $texts.removeClass("active-text");
                closing = true;
                $texts.css("opacity", 0);
                $(".bio-spacer").hide();
                hideTile();
            } else {
                var $currentSpacer = $(".bio-spacer");
                var h = $currentToShow.find(".content").outerHeight(true) + "px";

                $currentSpacer.css("height", h);
                $currentToShow.css({
                    "height" : h,
                    "top"    : $currentSpacer.position().top + "px"
                });
            }
        }
    }
    
    function hideTile() {
        $texts.css({"height" : ''});
        if(index >= 0){ 
            index = -1;
            $currentToShow = null;
            $lastItem = null;
            var $spacers = $(".bio-spacer");
            $spacers.css("height", '');
            window.setTimeout(function () {
                $spacers.remove();
                $texts.css("opacity", 0);
            }, 600);
        }
        
        index = -1;
        $texts.css("opacity", 1);
		window.setTimeout(function () {
            
			closing=false;
		}, 600);
        window.setTimeout(function () {
            if (!$texts.hasClass("active-text")) {
                $texts.css("opacity", 0);
            } else {
                $texts.css("opacity", 1);
            }
        }, 605);
        
    }
    
    function whereToShowTile() {  
        var tempIndex = index;
        var $last = $tiles.eq(tempIndex);
        var $test = $tiles.eq(tempIndex+1);        
        var t = $last.offset().top;
        
        if($tiles.size() != tempIndex+1) {
            while ($test != null && $test.offset().top == t)
            {
                tempIndex += 1;
                $last = $test;
                $test = $tiles.eq(tempIndex);

                if($tiles.size() <= tempIndex)
                    break;

                t = $last.offset().top;
            } 
        }

        return $last;
    }
    
    $tiles.on('click', function (e){
        e.preventDefault();
		if(!closing && !opening){
			var ind = $tilesAndText.index($(this));
			var indTile = $tiles.index($(this));
			$tiles.removeClass("active");
			$section.removeClass("active");
            $texts.removeClass("active-text");
			closing = true;

			var isOpened = (index == indTile);
			var openSpeed = index >= 0 ? 600 : 0
			hideTile();
            
            
			if(!isOpened){
				opening = true;
				$section.addClass("active");
				$(this).addClass("active");
                $texts.addClass("active-text");
				window.setTimeout(function () {
					$currentToShow = $tilesAndText.eq(ind+1);
					showTile();
				}, openSpeed);
			}
		}
        
    });

    $( window ).resize(function() { resize(); });
}

function initGoogleMap() {
  var $ = jQuery,
  mapCanvas = $('.map-canvas');

  mapCanvas.each(function () {
    var $this           = $(this),
        zoom            = 8,
        lat             = -34,
        lng             = 150,
        scrollwheel     = false,
        draggable       = true,
        mapType         = google.maps.MapTypeId.ROADMAP,
        title           = '',
        contentString   = '',
        dataZoom        = $this.attr('data-zoom'),
        dataLat         = $this.attr('data-lat'),
        dataLng         = $this.attr('data-lng'),
        dataType        = $this.attr('data-type'),
        dataScrollwheel = $this.attr('data-scrollwheel'),
        dataHue         = $this.attr('data-hue'),
        dataTitle       = $this.attr('data-title'),
        dataContent     = $this.attr('data-content');

    if (dataZoom !== undefined && dataZoom !== false) {
      zoom = parseFloat(dataZoom);
    }

    if (dataLat !== undefined && dataLat !== false) {
      lat = parseFloat(dataLat);
    }

    if (dataLng !== undefined && dataLng !== false) {
      lng = parseFloat(dataLng);
    }

    if (dataScrollwheel !== undefined && dataScrollwheel !== false) {
      scrollwheel = dataScrollwheel;
    }

    if (dataType !== undefined && dataType !== false) {
      if (dataType == 'satellite') {
        mapType = google.maps.MapTypeId.SATELLITE;
      } else if (dataType == 'hybrid') {
        mapType = google.maps.MapTypeId.HYBRID;
      } else if (dataType == 'terrain') {
        mapType = google.maps.MapTypeId.TERRAIN;
      }
    }

    if (dataTitle !== undefined && dataTitle !== false) {
      title = dataTitle;
    }

    if( navigator.userAgent.match(/iPad|iPhone|Android/i) ) {
      draggable = false;
    }

    var mapOptions = {
      zoom        : zoom,
      scrollwheel : scrollwheel,
      draggable   : draggable,
      center      : new google.maps.LatLng(lat, lng),
      mapTypeId   : mapType
    };

    var map = new google.maps.Map($this[0], mapOptions);

    var image = '/images/Logo-O.png';

    if (dataContent !== undefined && dataContent !== false) {
      contentString = '<div class="map-content">' +
        '<h3 class="title">' + title + '</h3>' +
        dataContent +
      '</div>';
    }

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    var marker = new google.maps.Marker({
      position : new google.maps.LatLng(lat, lng),
      map      : map,
      icon     : image,
      title    : title
    });

    if (dataContent !== undefined && dataContent !== false) {
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
      });
    }

    var styles = [
      {
        "elementType": "geometry",
        "stylers": [
          { "visibility": "simplified" },
          { "saturation": -100 },
          { "gamma": 0.2 },
          { "lightness": 80 }
        ]
      },{
        "elementType": "labels.text",
        "stylers": [
          { "saturation": -100 },
          { "visibility": "simplified" },
          { "weight": 0.1 },
          { "gamma": 0.4 },
          { "lightness": 50 }
        ]
      },{
        "elementType": "labels.icon",
        "stylers": [
          { "gamma": 0.01 },
          { "saturation": -100 },
          { "lightness": 25 }
        ]
      }
    ];

      map.setOptions({styles: styles});
    
      
    google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(center); 
    });
  });
    
    
      
}

function loadGoogleScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' +
    'callback=initGoogleMap';
  document.body.appendChild(script);
}

function loadAnimation(){
	var $loaderContainer = $(".icon-loading-O1");
	if($loaderContainer.children().size()>1){
		$loaderContainer.children().last().remove();
	}
    var multiColors = ['#ceb979','#79aba9','#0f4b53','#4458a0','#8ea06a','#656173','#a4aeb2'];
    var addNum = 0;
    var nextColor;
    var $newdiv = $('<i class="iconis-o-logo"></i>');
	$loaderContainer.children().addClass("anim");
    $loaderContainer.prepend($newdiv);

    firstLoad = setTimeout(function() {
      $newdiv.css("color", multiColors[0]);
    }, 10);
    function setColors() {
        clearInterval(firstLoad);
        var animeDiv = $(".iconis-o-logo.anim");
        addNum = (addNum + 1) % multiColors.length;
        nextColor = multiColors[addNum];
        if (Modernizr.mq('(max-width: 749px)')) {
            $(animeDiv).css({"color": nextColor, "height": "100px"});
        } else {
            $(animeDiv).css({"color": nextColor, "height": "300px"});
        }

        timeout = setTimeout(function() {
              $(animeDiv).css("height", "0");
              $newdiv.css("color", nextColor);
        }, 500);
    }
    
    var _loadinginterval = setInterval(setColors, 1000);
    if(_videoloaded == true) {
        clearInterval(_loadinginterval);
    }
    
	//var $newdiv = $('<i class="iconis-o-logo" style="color:' + ("#"+((1<<24)*Math.random()|0).toString(16)) + '"></i>');

}

$(document).ready(function () {

    var isFF = !!navigator.userAgent.match(/firefox/i);

    if (isFF) {
        $('body').addClass("moz");
    } else {
        $('body').removeClass("moz");
    }

    /***Detect Mobile***/
    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    //Smooth scroll to links (back to top)

    //Top Resize
    sizeOfWindow($(".top-section .pattern-overlay.home"), 0);

    $('.scrollsmooth').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top
            }, 1000);
            return false;
          }
        }
    });
    if (isMobile.any()) {
        $("body").addClass("mobi-only");
    } else {
        $("body").removeClass("mobi-only");
    }

    if ($(".ie8").length) {
        $(".video-section").addClass("show-text");
    }

    if (isMobile.any() || $(".ie8").length || $(".onisno-video").length) {
        _videoloaded = true;
        setTimeout(function(){
           $(".video-section").addClass("show-text");
        }, 1000);

    } else {
        //Add youtube background player
        var videoname = "images/backgrounds/onis_final_may_18B";
        
        if($(".player").size() > 0){
            $(".player").videobackground({
                videoSource: [[videoname + '.mp4', 'video/mp4'],
                [videoname + '.webm', 'video/webm'],
                [videoname + '.ogv', 'video/ogg']], 
                controlPosition: '.player',
                poster: '',
				loop: true,
                resize: false,
                loadedCallback: function() {
                    _videoloaded = true;
                    doneLoading();
                    setTimeout(function(){
                       $(".video-section").addClass("show-text");
                    }, 6000);
                }
            });
        } else {
            _videoloaded = true;
        }

        // Init ScrollMagic Controller
        var scrollMagicController = new ScrollMagic();
        var scrollMagicControllerParallax = new ScrollMagic({globalSceneOptions: {triggerHook: "onEnter", duration: $(window).height()*2}});

        magicStaggered(scrollMagicController);
        magicLazyText(scrollMagicController);
        magicLazyBackground(scrollMagicController);
        magicTopBar(scrollMagicController);
        magicParallax(scrollMagicControllerParallax);
        magicLettering(scrollMagicControllerParallax);
    }

    //Add height fix animation for carousel
    bsCarouselAnimHeight();
    if ($(".about-carousel").size() > 0) {
        $('.carousel').carousel();
    }

    
    
    //About Tiles
    if($(".biography-section").size() > 0) {
        tiles();
    }
    
    //Add smooth scrolling
    scrollWheeling(2);
	
	//Add Navigation
	slideNavigation();
	

});

$window.on('scroll touchmove', function () {
    var scroll = $(window).scrollTop();
    var isDown = scroll < _scrollPosition;
    $body.removeClass("startPage");
    _scrollPosition = scroll;
    if(isDown){
        $body.removeClass("scrollNavUp");
    } else {
        $body.addClass("scrollNavUp");
    }
});

$window.load(function() {
    _windowloaded = true;

	//Start loading animation
	loadAnimation();

	/*_loadinginterval = setInterval(function(){
		loadAnimation();
	}, 2000); */
    
	//Start Googlemaps Script
    if($('.map-box').size() > 0)
        loadGoogleScript();
	
	//Check if visited cookie exists and if there is a video to load
    if(_videoloaded == false || getCookie("loaded") != "true"){
        if(_loadingoffset > 0) {
            setTimeout(function(){
                 doneLoading(); 
            },_loadingoffset);
        } else {
            doneLoading();
        }
    } else{
		// clearInterval(_loadinginterval);
        $(".preload").remove();
        $("#whole-site").removeClass("loading");
        setCookie("loaded", "true", .25); 
    }
	
	$window.on("resize", function(){
        //Top Resize
        sizeOfWindow($(".top-section .pattern-overlay.home"), 0);

        bsCarouselAnimHeight();
	});
});
