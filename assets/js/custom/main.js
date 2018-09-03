(function($) {
	
	"use strict";
	
	/* Default Variables */
	var JasonOptions = {
		loader:true	
	};
	
	if (typeof Jason!=="undefined") {
		$.extend(JasonOptions, Jason);
	}
	
	$.JasonTheme = {
	
		//Initialize
		init:function() {
			this.loader();
			this.menu();
			this.intro();
			this.textSlider();
			this.portfolio();
			this.testimonials();
			this.animation();
			this.contact();
			this.blog();
			this.scroll();
		},
		
		//Page Loader
		loader:function() {
			if (JasonOptions.loader) {
				$(window).on("load", function() {
					$(".page-loader").fadeOut();
					$(window).trigger("jason.complete");
				});
			} else {
				$(document).ready(function() {
					$(window).trigger("jason.complete");
				});
				
				$(window).on("load", function() {
					$(window).trigger("jason.complete");
				});
			}
		},
		
		//Menu
		menu:function() {
			//Open menu
			$(".menu-btn-open").on("click", function(e) {
				e.preventDefault();
				
				$(".menu-lightbox").fadeIn("normal", function() {
					$(this).addClass("active");
				});
				
				$(".menu-btn-close").addClass("loaded");
			});
			
			//Close menu
			$(".menu-btn-close").on("click", function(e) {
				e.preventDefault();
				
				$(".menu-lightbox").delay(100).removeClass("active").delay(200).fadeOut("slow");
				$(".menu-btn-close").removeClass("loaded");
			});
			
			//Menu item
			$(".menu li a").on("click", function() {
				$(".menu-btn-close").trigger("click");
			});
		},
		
		//Intro
		intro:function() {
			if ($(".intro").length===0) {return;}
			
			//Image background
			if ($(".intro.image-bg").length>0) {
				$(".intro.image-bg").backstretch("./assets/images/bg.jpg");
			}
			
			//Slide background
			if ($(".intro.slide-bg").length>0) {
				$(".intro.slide-bg").backstretch([
					"./assets/images/bg1.jpg", 
					"./assets/images/bg2.jpg", 
					"./assets/images/bg3.jpg",
					"./assets/images/bg4.jpg"
				], {duration:3000, fade:750});
			}
			
			//Video background
			if ($(".intro.video-bg").length>0) {
				//Hide loader on mobile
				if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
					$(".player").hide();
					$(".player-controls").hide();
				}
				
				//Youtube player
				$(".player").mb_YTPlayer();
			
				//Player controls
				$("#play").on("click", function() {
					$(".player").playYTP();
				});
			
				$("#pause").on("click", function() {
					$(".player").pauseYTP();
				});
			}
		},
		
		//Text slider
		textSlider:function() {
			if ($(".intro-text").length===0) {return;}
			
			var animationDelay = 2500,
				revealDuration = 1000,
				revealAnimationDelay = 1500;	
			
			var hideWord = function($word) {
				var nextWord = takeNext($word);
				
				$word.parents(".words-wrapper").animate({width:"2px"}, revealDuration, 
					function() {
						switchWord($word, nextWord);
						showWord(nextWord);
					}
				);
			};
		
			var showWord = function($word) {
				$word.parents(".words-wrapper").animate({"width":$word.width()+10}, revealDuration, 
					function() {
						setTimeout(function() { 
							hideWord($word); 
						}, revealAnimationDelay);
					}
				);
			};
			
			var switchWord = function($oldWord, $newWord) {
				$oldWord.removeClass("is-visible").addClass("is-hidden");
				$newWord.removeClass("is-hidden").addClass("is-visible");
			};
			
			var takeNext = function($word) {
				return (!$word.is(":last-child")) ? $word.next() : $word.parent().children().eq(0);
			};
			
			$(".intro-text").each(function() {
				var headline = $(this);
				var spanWrapper = headline.find(".words-wrapper");
				var newWidth = spanWrapper.width()+10;
					
				spanWrapper.css("width", newWidth);
				   
				//Trigger animation
				setTimeout(function() {
					hideWord(headline.find(".is-visible").eq(0));
				}, animationDelay);
			});
		},
		
		//Portfolio
		portfolio:function() {
			//Filters
			if ($(".works-filters").length>0) {
				$(".works-filters li").on("click", function(e) {
					e.preventDefault();
					
					var $that = $(this);
					
					$(".works-filters li").removeClass("active");
					$that.addClass("active");	
				});
			}
			
			//Mixitup
			if ($(".works").length>0) {
				var $works = document.querySelector(".works");
				var mixer = mixitup($works, {
					selectors:{
						control:"[data-mixitup-control]"
					}
				});
			}
			
			//Portfolio item
			$(".portfolio-item a").on("click", function(e) {
				e.preventDefault();
				
				var $that = $(this);				
				
				if ($that.parent().find(".loading").length===0) {
					$("<div />").addClass("loading").appendTo($that.parent());
					$that.parent().addClass("active");
		
					var $loading = $(this).parent().find(".loading"),
						$container = $("#portfolio-details"), 
						timer = 1;
		
					if ($container.is(":visible")) {
						closeProject();
						timer = 800;
						$loading.animate({width:"70%"}, {duration:2000, queue:false});
					}
					
					setTimeout(function() {
						$loading.stop(true, false).animate({width:"70%"}, {duration:6000, queue:false});
						
						$.get($that.attr("href")).done(function(response) {
							$container.html(response);
							
							$container.imagesLoaded(function() {
								$loading.stop(true, false).animate({width:"100%"}, {duration:500, queue:true});
								
								$loading.animate({opacity:0}, {duration:200, queue:true, complete:function() {
									$that.parent().removeClass('active');
									$(this).remove();
		
									$container.show().css({opacity:0});
									$container.animate({opacity:1}, {duration:600, queue:false});
									
									$(document).scrollTo($container, 600, {offset:{top:0, left:0}});
									
									$container.attr("data-current", $that.attr("rel"));
								}});
							});
						}).fail(function() {
							$that.parent().removeClass("active");
							$loading.remove();
						});
					}, timer);
				}
			});
		
			//Close project
			var closeProject = function() {
				$("#portfolio-details").animate({opacity:0}, {duration:600, queue:false, complete:function() {
					$(this).hide().html("").removeAttr("data-current");
				}});
			};
			
			$(document.body).on("click", "#portfolio-details .icon.close i", function() {
				closeProject();
			});
			
			//Anchor Links for Projects
			var dh = document.location.hash;
	
			if (/#view-/i.test(dh)) {
				var $item = $('[rel="'+dh.substr(6)+'"]');
				
				if ($item.length>0) {
					$(document).scrollTo("#portfolio", 0, {offset:{top:0, left:0}});
					
					$(window).on("jason.complete", function() {
						$item.trigger("click");
					});
				}
			}
	
			$('a[href^="#view-"]').on("click", function() {
				var $item = $('[rel="'+$(this).attr('href').substr(6)+'"]');
				
				if ($item.length>0) {
					$(document).scrollTo("#portfolio", JasonOptions.scrollSpeed, {offset:{top:-85, left:0}, onAfter:function() {
						$item.trigger("click");
					}});
				}
			});
		},
		
		//Testimonials
		testimonials:function() {
			if ($('.loop-testi').length===0) {return;}
			
			$(".loop-testi").owlCarousel({
				center:true,
				loop:true,
				smartSpeed:600,
				responsive:{
					300:{
						items:1
					}
				}
			});
		},
		
		//Animation
		animation:function() {
			new WOW().init();
		},
		
		//Contact
		contact:function() {
			if ($("#contact-form").length===0) {return;}
			
			$("#contact-form input, #contact-form textarea").jqBootstrapValidation({
				preventSubmit:true,
				submitError: function($form, e, errors) {
					//Additional error messages or events
				},
				submitSuccess:function($form, e) {
					e.preventDefault(); //Prevent default submit behaviour
					
					//Get values of form
					var name = $("#contact-form input#name").val();
					var email = $("#contact-form input#email").val();
					var phone = $("#contact-form input#phone").val();
					var message = $("#contact-form textarea#message").val();
					
					//For Success/Failure Message
					var firstName = name;
					
					//Check for white space in name for Success/Fail message
					if (firstName.indexOf(" ")>=0) {
						firstName = name.split(" ").slice(0, -1).join(" ");
					}
					
					$.ajax({
						url:"././contact.php",
						type:"POST",
						data:{
							name:name,
							phone:phone,
							email:email,
							message:message
						},
						cache:false,
						success:function() {
							//Success message
							$("#contact-form #success").html("Your message has been sent.");
							
							//Clear all fields
							$('#contact-form').trigger("reset");
						},
						error:function() {
							//Fail message
							$('#contact-form #success').html("<strong>Sorry "+firstName+", it seems that my mail server is not responding. Please try again later!");
							
							//Clear all fields
							$('#contact-form').trigger("reset");
						},
					});
				},
				filter:function() {
					return $(this).is(":visible");
				},
			});
			
			$("#contact-form #name").on("focus", function() {
				$("#contact-form #success").html("");
			});
		},
		
		//Blog
		blog:function() {
			if ($(".intro.blog").length>0) {
				$(".intro.blog").backstretch("images/blog/post-bg.jpg");
			}
		},
		
		//Scroll
		scroll:function() {
			
			var onScroll = function() {
				var pos = $(document).scrollTop();
				
				$(".menu a").each(function() {
					var that = $(this);
					var target = $(that.attr("href"));
					
					if (target.position() && target.position().top<=pos && (target.position().top+target.height())>pos) {
						$(".menu li a").removeClass("active");
						that.addClass("active");
					} else {
						that.removeClass("active");
					}
				});
			};
			
			$(document).on("scroll", onScroll);
			
			$('.menu li a[href^="#"], .scroll-btn a[href^="#"]').on("click", function(e) {
				e.preventDefault();
				$(document).off("scroll");
				
				$("a").each(function() {
					$(this).removeClass("active");
				});
				
				$(this).addClass("active");
		
				var target = this.hash;
				var $target = $(target);
				
				$("html, body").stop().animate({
					"scrollTop":($target.offset().top+2)
				}, 500, "swing", function() {
					window.location.hash = target;
					$(document).on("scroll", onScroll);
				});
			});
		},
	
		//Share functions
		share:function(network, title, image, url) {
			//Window size
			var w = 650, h = 350, params = "width="+w+", height="+h+", resizable=1";
	
			//Title
			if (typeof title==="undefined") {
				title = $("title").text();
			} else if (typeof title==="string") {
				if ($(title).length>0) {title = $(title).text();}
			}
			
			//Image
			if (typeof image==="undefined") {
				image = "";
			} else if (typeof image==="string") {
				if (!/http/i.test(image)) {
					if ($(image).length>0) {
						if ($(image).is("img")) {
							image = $(image).attr("src");
						} else {
							image = $(image).find('img').eq(0).attr("src");
						}
					} else {
						image = "";
					}
				}
			}
			
			//Url
			if (typeof url==="undefined") {
				url = document.location.href;
			} else {
				url = document.location.protocol+"//"+document.location.host+document.location.pathname+url;
			}
			
			//Share
			if (network==="twitter") {
				return window.open("https://twitter.com/intent/tweet?text="+encodeURIComponent(title+" "+url), "share", params);
			} else if (network==="facebook") {
				return window.open("https://www.facebook.com/sharer/sharer.php?s=100&p[url]="+encodeURIComponent(url)+"&p[title]="+encodeURIComponent(title)+"&p[images][0]="+encodeURIComponent(image), "share", params);
			} else if (network==="pinterest") {
				return window.open("https://pinterest.com/pin/create/bookmarklet/?media="+image+"&description="+title+" "+encodeURIComponent(url), "share", params);
			} else if (network==="google") {
				return window.open("https://plus.google.com/share?url="+encodeURIComponent(url), "share", params);
			} else if (network==="linkedin") {
				return window.open("https://www.linkedin.com/shareArticle?mini=true&url="+encodeURIComponent(url)+"&title="+title, "share", params);
			}
			
			return;
		}	
		
	};
	
	//Initialize
	$.JasonTheme.init();

})(jQuery);

//Share Functions
function shareTo(network, title, image, url) {
	return $.JasonTheme.share(network, title, image, url);
}

