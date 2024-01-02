!function($) {
    var focused = !0;
    $.flexslider = function(el, options) {
        var watchedEventClearTimer, slider = $(el), namespace = (void 0 === options.rtl && "rtl" == $("html").attr("dir") && (options.rtl = !0),
        slider.vars = $.extend({}, $.flexslider.defaults, options),
        slider.vars.namespace), msGesture = window.navigator && window.navigator.msPointerEnabled && window.MSGesture, touch = ("ontouchstart"in window || msGesture || window.DocumentTouch && document instanceof DocumentTouch) && slider.vars.touch, eventType = "click touchend MSPointerUp keyup", watchedEvent = "", vertical = "vertical" === slider.vars.direction, reverse = slider.vars.reverse, carousel = 0 < slider.vars.itemWidth, fade = "fade" === slider.vars.animation, asNav = "" !== slider.vars.asNavFor, methods = {};
        $.data(el, "flexslider", slider),
        methods = {
            init: function() {
                slider.animating = !1,
                slider.currentSlide = parseInt(slider.vars.startAt || 0, 10),
                isNaN(slider.currentSlide) && (slider.currentSlide = 0),
                slider.animatingTo = slider.currentSlide,
                slider.atEnd = 0 === slider.currentSlide || slider.currentSlide === slider.last,
                slider.containerSelector = slider.vars.selector.substr(0, slider.vars.selector.search(" ")),
                slider.slides = $(slider.vars.selector, slider),
                slider.container = $(slider.containerSelector, slider),
                slider.count = slider.slides.length,
                slider.syncExists = 0 < $(slider.vars.sync).length,
                "slide" === slider.vars.animation && (slider.vars.animation = "swing"),
                slider.prop = vertical ? "top" : slider.vars.rtl ? "marginRight" : "marginLeft",
                slider.args = {},
                slider.manualPause = !1,
                slider.stopped = !1,
                slider.started = !1,
                slider.startTimeout = null,
                slider.transitions = !slider.vars.video && !fade && slider.vars.useCSS && function() {
                    var i, obj = document.createElement("div"), props = ["perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"];
                    for (i in props)
                        if (void 0 !== obj.style[props[i]])
                            return slider.pfx = props[i].replace("Perspective", "").toLowerCase(),
                            slider.prop = "-" + slider.pfx + "-transform",
                            !0;
                    return !1
                }(),
                slider.isFirefox = -1 < navigator.userAgent.toLowerCase().indexOf("firefox"),
                (slider.ensureAnimationEnd = "") !== slider.vars.controlsContainer && (slider.controlsContainer = 0 < $(slider.vars.controlsContainer).length && $(slider.vars.controlsContainer)),
                "" !== slider.vars.manualControls && (slider.manualControls = 0 < $(slider.vars.manualControls).length && $(slider.vars.manualControls)),
                "" !== slider.vars.customDirectionNav && (slider.customDirectionNav = 2 === $(slider.vars.customDirectionNav).length && $(slider.vars.customDirectionNav)),
                slider.vars.randomize && (slider.slides.sort(function() {
                    return Math.round(Math.random()) - .5
                }),
                slider.container.empty().append(slider.slides)),
                slider.doMath(),
                slider.setup("init"),
                slider.vars.controlNav && methods.controlNav.setup(),
                slider.vars.directionNav && methods.directionNav.setup(),
                slider.vars.keyboard && (1 === $(slider.containerSelector).length || slider.vars.multipleKeyboard) && $(document).on("keyup", function(event) {
                    var event = event.keyCode;
                    slider.animating || 39 !== event && 37 !== event || (event = slider.vars.rtl ? 37 === event ? slider.getTarget("next") : 39 === event && slider.getTarget("prev") : 39 === event ? slider.getTarget("next") : 37 === event && slider.getTarget("prev"),
                    slider.flexAnimate(event, slider.vars.pauseOnAction))
                }),
                slider.vars.mousewheel && slider.on("mousewheel", function(event, delta, deltaX, deltaY) {
                    event.preventDefault();
                    event = delta < 0 ? slider.getTarget("next") : slider.getTarget("prev");
                    slider.flexAnimate(event, slider.vars.pauseOnAction)
                }),
                slider.vars.pausePlay && methods.pausePlay.setup(),
                slider.vars.slideshow && slider.vars.pauseInvisible && methods.pauseInvisible.init(),
                slider.vars.slideshow && (slider.vars.pauseOnHover && slider.hover(function() {
                    slider.manualPlay || slider.manualPause || slider.pause()
                }, function() {
                    slider.manualPause || slider.manualPlay || slider.stopped || slider.play()
                }),
                slider.vars.pauseInvisible && methods.pauseInvisible.isHidden() || (0 < slider.vars.initDelay ? slider.startTimeout = setTimeout(slider.play, slider.vars.initDelay) : slider.play())),
                asNav && methods.asNav.setup(),
                touch && slider.vars.touch && methods.touch(),
                fade && !slider.vars.smoothHeight || $(window).on("resize orientationchange focus", methods.resize),
                slider.find("img").attr("draggable", "false"),
                setTimeout(function() {
                    slider.vars.start(slider)
                }, 200)
            },
            asNav: {
                setup: function() {
                    slider.asNav = !0,
                    slider.animatingTo = Math.floor(slider.currentSlide / slider.move),
                    slider.currentItem = slider.currentSlide,
                    slider.slides.removeClass(namespace + "active-slide").eq(slider.currentItem).addClass(namespace + "active-slide"),
                    msGesture ? (el._slider = slider).slides.each(function() {
                        this._gesture = new MSGesture,
                        (this._gesture.target = this).addEventListener("MSPointerDown", function(e) {
                            e.preventDefault(),
                            e.currentTarget._gesture && e.currentTarget._gesture.addPointer(e.pointerId)
                        }, !1),
                        this.addEventListener("MSGestureTap", function(e) {
                            e.preventDefault();
                            var e = $(this)
                              , target = e.index();
                            $(slider.vars.asNavFor).data("flexslider").animating || e.hasClass("active") || (slider.direction = slider.currentItem < target ? "next" : "prev",
                            slider.flexAnimate(target, slider.vars.pauseOnAction, !1, !0, !0))
                        })
                    }) : slider.slides.on(eventType, function(e) {
                        e.preventDefault();
                        var e = $(this)
                          , target = e.index()
                          , posFromX = slider.vars.rtl ? -1 * (e.offset().right - $(slider).scrollLeft()) : e.offset().left - $(slider).scrollLeft();
                        posFromX <= 0 && e.hasClass(namespace + "active-slide") ? slider.flexAnimate(slider.getTarget("prev"), !0) : $(slider.vars.asNavFor).data("flexslider").animating || e.hasClass(namespace + "active-slide") || (slider.direction = slider.currentItem < target ? "next" : "prev",
                        slider.flexAnimate(target, slider.vars.pauseOnAction, !1, !0, !0))
                    })
                }
            },
            controlNav: {
                setup: function() {
                    slider.manualControls ? methods.controlNav.setupManual() : methods.controlNav.setupPaging()
                },
                setupPaging: function() {
                    var item, type = "thumbnails" === slider.vars.controlNav ? "control-thumbs" : "control-paging", j = 1;
                    if (slider.controlNavScaffold = $('<ol class="' + namespace + "control-nav " + namespace + type + '"></ol>'),
                    1 < slider.pagingCount)
                        for (var i = 0; i < slider.pagingCount; i++) {
                            void 0 === (slide = slider.slides.eq(i)).attr("data-thumb-alt") && slide.attr("data-thumb-alt", ""),
                            item = $("<a></a>").attr("href", "#").text(j),
                            "thumbnails" === slider.vars.controlNav && (item = $("<img/>").attr("src", slide.attr("data-thumb"))),
                            "" !== slide.attr("data-thumb-alt") && item.attr("alt", slide.attr("data-thumb-alt")),
                            "thumbnails" === slider.vars.controlNav && !0 === slider.vars.thumbCaptions && "" !== (slide = slide.attr("data-thumbcaption")) && void 0 !== slide && (slide = $("<span></span>").addClass(namespace + "caption").text(slide),
                            item.append(slide));
                            var slide = $("<li>");
                            item.appendTo(slide),
                            slide.append("</li>"),
                            slider.controlNavScaffold.append(slide),
                            j++
                        }
                    (slider.controlsContainer ? $(slider.controlsContainer) : slider).append(slider.controlNavScaffold),
                    methods.controlNav.set(),
                    methods.controlNav.active(),
                    slider.controlNavScaffold.on(eventType, "a, img", function(event) {
                        var $this, target;
                        event.preventDefault(),
                        "" !== watchedEvent && watchedEvent !== event.type || ($this = $(this),
                        target = slider.controlNav.index($this),
                        $this.hasClass(namespace + "active")) || (slider.direction = target > slider.currentSlide ? "next" : "prev",
                        slider.flexAnimate(target, slider.vars.pauseOnAction)),
                        "" === watchedEvent && (watchedEvent = event.type),
                        methods.setToClearWatchedEvent()
                    })
                },
                setupManual: function() {
                    slider.controlNav = slider.manualControls,
                    methods.controlNav.active(),
                    slider.controlNav.on(eventType, function(event) {
                        var $this, target;
                        event.preventDefault(),
                        "" !== watchedEvent && watchedEvent !== event.type || ($this = $(this),
                        target = slider.controlNav.index($this),
                        $this.hasClass(namespace + "active")) || (target > slider.currentSlide ? slider.direction = "next" : slider.direction = "prev",
                        slider.flexAnimate(target, slider.vars.pauseOnAction)),
                        "" === watchedEvent && (watchedEvent = event.type),
                        methods.setToClearWatchedEvent()
                    })
                },
                set: function() {
                    var selector = "thumbnails" === slider.vars.controlNav ? "img" : "a";
                    slider.controlNav = $("." + namespace + "control-nav li " + selector, slider.controlsContainer || slider)
                },
                active: function() {
                    slider.controlNav.removeClass(namespace + "active").eq(slider.animatingTo).addClass(namespace + "active")
                },
                update: function(action, pos) {
                    1 < slider.pagingCount && "add" === action ? slider.controlNavScaffold.append($('<li><a href="#">' + slider.count + "</a></li>")) : (1 === slider.pagingCount ? slider.controlNavScaffold.find("li") : slider.controlNav.eq(pos).closest("li")).remove(),
                    methods.controlNav.set(),
                    1 < slider.pagingCount && slider.pagingCount !== slider.controlNav.length ? slider.update(pos, action) : methods.controlNav.active()
                }
            },
            directionNav: {
                setup: function() {
                    var directionNavScaffold = $('<ul class="' + namespace + 'direction-nav"><li class="' + namespace + 'nav-prev"><a class="' + namespace + 'prev" href="#">' + slider.vars.prevText + '</a></li><li class="' + namespace + 'nav-next"><a class="' + namespace + 'next" href="#">' + slider.vars.nextText + "</a></li></ul>");
                    slider.customDirectionNav ? slider.directionNav = slider.customDirectionNav : slider.controlsContainer ? ($(slider.controlsContainer).append(directionNavScaffold),
                    slider.directionNav = $("." + namespace + "direction-nav li a", slider.controlsContainer)) : (slider.append(directionNavScaffold),
                    slider.directionNav = $("." + namespace + "direction-nav li a", slider)),
                    methods.directionNav.update(),
                    slider.directionNav.on(eventType, function(event) {
                        var target;
                        event.preventDefault(),
                        "" !== watchedEvent && watchedEvent !== event.type || (target = $(this).hasClass(namespace + "next") ? slider.getTarget("next") : slider.getTarget("prev"),
                        slider.flexAnimate(target, slider.vars.pauseOnAction)),
                        "" === watchedEvent && (watchedEvent = event.type),
                        methods.setToClearWatchedEvent()
                    })
                },
                update: function() {
                    var disabledClass = namespace + "disabled";
                    1 === slider.pagingCount ? slider.directionNav.addClass(disabledClass).attr("tabindex", "-1") : slider.vars.animationLoop ? slider.directionNav.removeClass(disabledClass).removeAttr("tabindex") : 0 === slider.animatingTo ? slider.directionNav.removeClass(disabledClass).filter("." + namespace + "prev").addClass(disabledClass).attr("tabindex", "-1") : slider.animatingTo === slider.last ? slider.directionNav.removeClass(disabledClass).filter("." + namespace + "next").addClass(disabledClass).attr("tabindex", "-1") : slider.directionNav.removeClass(disabledClass).removeAttr("tabindex")
                }
            },
            pausePlay: {
                setup: function() {
                    var pausePlayScaffold = $('<div class="' + namespace + 'pauseplay"><a href="#"></a></div>');
                    slider.controlsContainer ? (slider.controlsContainer.append(pausePlayScaffold),
                    slider.pausePlay = $("." + namespace + "pauseplay a", slider.controlsContainer)) : (slider.append(pausePlayScaffold),
                    slider.pausePlay = $("." + namespace + "pauseplay a", slider)),
                    methods.pausePlay.update(slider.vars.slideshow ? namespace + "pause" : namespace + "play"),
                    slider.pausePlay.on(eventType, function(event) {
                        event.preventDefault(),
                        "" !== watchedEvent && watchedEvent !== event.type || ($(this).hasClass(namespace + "pause") ? (slider.manualPause = !0,
                        slider.manualPlay = !1,
                        slider.pause()) : (slider.manualPause = !1,
                        slider.manualPlay = !0,
                        slider.play())),
                        "" === watchedEvent && (watchedEvent = event.type),
                        methods.setToClearWatchedEvent()
                    })
                },
                update: function(state) {
                    "play" === state ? slider.pausePlay.removeClass(namespace + "pause").addClass(namespace + "play").html(slider.vars.playText) : slider.pausePlay.removeClass(namespace + "play").addClass(namespace + "pause").html(slider.vars.pauseText)
                }
            },
            touch: function() {
                var startX, startY, offset, cwidth, dx, startT, onTouchMove, onTouchEnd, scrolling = !1, localX = 0, localY = 0, accDx = 0;
                msGesture ? (el.style.msTouchAction = "none",
                el._gesture = new MSGesture,
                (el._gesture.target = el).addEventListener("MSPointerDown", function(e) {
                    e.stopPropagation(),
                    slider.animating ? e.preventDefault() : (slider.pause(),
                    el._gesture.addPointer(e.pointerId),
                    accDx = 0,
                    cwidth = vertical ? slider.h : slider.w,
                    startT = Number(new Date),
                    offset = carousel && reverse && slider.animatingTo === slider.last ? 0 : carousel && reverse ? slider.limit - (slider.itemW + slider.vars.itemMargin) * slider.move * slider.animatingTo : carousel && slider.currentSlide === slider.last ? slider.limit : carousel ? (slider.itemW + slider.vars.itemMargin) * slider.move * slider.currentSlide : reverse ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth)
                }, !1),
                el._slider = slider,
                el.addEventListener("MSGestureChange", function(e) {
                    e.stopPropagation();
                    var transX, transY, slider = e.target._slider;
                    slider && (transX = -e.translationX,
                    transY = -e.translationY,
                    accDx += vertical ? transY : transX,
                    dx = (slider.vars.rtl ? -1 : 1) * accDx,
                    scrolling = vertical ? Math.abs(accDx) < Math.abs(-transX) : Math.abs(accDx) < Math.abs(-transY),
                    e.detail === e.MSGESTURE_FLAG_INERTIA ? setImmediate(function() {
                        el._gesture.stop()
                    }) : (!scrolling || 500 < Number(new Date) - startT) && (e.preventDefault(),
                    !fade) && slider.transitions && (slider.vars.animationLoop || (dx = accDx / (0 === slider.currentSlide && accDx < 0 || slider.currentSlide === slider.last && 0 < accDx ? Math.abs(accDx) / cwidth + 2 : 1)),
                    slider.setProps(offset + dx, "setTouch")))
                }, !1),
                el.addEventListener("MSGestureEnd", function(e) {
                    e.stopPropagation();
                    var updateDx, target, e = e.target._slider;
                    e && (e.animatingTo !== e.currentSlide || scrolling || null === dx || (target = 0 < (updateDx = reverse ? -dx : dx) ? e.getTarget("next") : e.getTarget("prev"),
                    e.canAdvance(target) && (Number(new Date) - startT < 550 && 50 < Math.abs(updateDx) || Math.abs(updateDx) > cwidth / 2) ? e.flexAnimate(target, e.vars.pauseOnAction) : fade || e.flexAnimate(e.currentSlide, e.vars.pauseOnAction, !0)),
                    offset = dx = startY = startX = null,
                    accDx = 0)
                }, !1)) : (onTouchMove = function(e) {
                    localX = e.touches[0].pageX,
                    localY = e.touches[0].pageY,
                    dx = vertical ? startX - localY : (slider.vars.rtl ? -1 : 1) * (startX - localX);
                    (!(scrolling = vertical ? Math.abs(dx) < Math.abs(localX - startY) : Math.abs(dx) < Math.abs(localY - startY)) || 500 < Number(new Date) - startT) && (e.preventDefault(),
                    !fade) && slider.transitions && (slider.vars.animationLoop || (dx /= 0 === slider.currentSlide && dx < 0 || slider.currentSlide === slider.last && 0 < dx ? Math.abs(dx) / cwidth + 2 : 1),
                    slider.setProps(offset + dx, "setTouch"))
                }
                ,
                onTouchEnd = function(e) {
                    var updateDx, target;
                    el.removeEventListener("touchmove", onTouchMove, !1),
                    slider.animatingTo !== slider.currentSlide || scrolling || null === dx || (target = 0 < (updateDx = reverse ? -dx : dx) ? slider.getTarget("next") : slider.getTarget("prev"),
                    slider.canAdvance(target) && (Number(new Date) - startT < 550 && 50 < Math.abs(updateDx) || Math.abs(updateDx) > cwidth / 2) ? slider.flexAnimate(target, slider.vars.pauseOnAction) : fade || slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction, !0)),
                    el.removeEventListener("touchend", onTouchEnd, !1),
                    offset = dx = startY = startX = null
                }
                ,
                el.addEventListener("touchstart", function(e) {
                    slider.animating ? e.preventDefault() : !window.navigator.msPointerEnabled && 1 !== e.touches.length || (slider.pause(),
                    cwidth = vertical ? slider.h : slider.w,
                    startT = Number(new Date),
                    localX = e.touches[0].pageX,
                    localY = e.touches[0].pageY,
                    offset = carousel && reverse && slider.animatingTo === slider.last ? 0 : carousel && reverse ? slider.limit - (slider.itemW + slider.vars.itemMargin) * slider.move * slider.animatingTo : carousel && slider.currentSlide === slider.last ? slider.limit : carousel ? (slider.itemW + slider.vars.itemMargin) * slider.move * slider.currentSlide : reverse ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth,
                    startX = vertical ? localY : localX,
                    startY = vertical ? localX : localY,
                    el.addEventListener("touchmove", onTouchMove, !1),
                    el.addEventListener("touchend", onTouchEnd, !1))
                }, !1))
            },
            resize: function() {
                !slider.animating && slider.is(":visible") && (carousel || slider.doMath(),
                fade ? methods.smoothHeight() : carousel ? (slider.slides.width(slider.computedW),
                slider.update(slider.pagingCount),
                slider.setProps()) : vertical ? (slider.viewport.height(slider.h),
                slider.setProps(slider.h, "setTotal")) : (slider.vars.smoothHeight && methods.smoothHeight(),
                slider.newSlides.width(slider.computedW),
                slider.setProps(slider.computedW, "setTotal")))
            },
            smoothHeight: function(dur) {
                var $obj;
                vertical && !fade || ($obj = fade ? slider : slider.viewport,
                dur ? $obj.animate({
                    height: slider.slides.eq(slider.animatingTo).innerHeight()
                }, dur) : $obj.innerHeight(slider.slides.eq(slider.animatingTo).innerHeight()))
            },
            sync: function(action) {
                var $obj = $(slider.vars.sync).data("flexslider")
                  , target = slider.animatingTo;
                switch (action) {
                case "animate":
                    $obj.flexAnimate(target, slider.vars.pauseOnAction, !1, !0);
                    break;
                case "play":
                    $obj.playing || $obj.asNav || $obj.play();
                    break;
                case "pause":
                    $obj.pause()
                }
            },
            uniqueID: function($clone) {
                return $clone.filter("[id]").add($clone.find("[id]")).each(function() {
                    var $this = $(this);
                    $this.attr("id", $this.attr("id") + "_clone")
                }),
                $clone
            },
            pauseInvisible: {
                visProp: null,
                init: function() {
                    var visProp = methods.pauseInvisible.getHiddenProp();
                    visProp && (visProp = visProp.replace(/[H|h]idden/, "") + "visibilitychange",
                    document.addEventListener(visProp, function() {
                        methods.pauseInvisible.isHidden() ? slider.startTimeout ? clearTimeout(slider.startTimeout) : slider.pause() : !slider.started && 0 < slider.vars.initDelay ? setTimeout(slider.play, slider.vars.initDelay) : slider.play()
                    }))
                },
                isHidden: function() {
                    var prop = methods.pauseInvisible.getHiddenProp();
                    return !!prop && document[prop]
                },
                getHiddenProp: function() {
                    var prefixes = ["webkit", "moz", "ms", "o"];
                    if ("hidden"in document)
                        return "hidden";
                    for (var i = 0; i < prefixes.length; i++)
                        if (prefixes[i] + "Hidden"in document)
                            return prefixes[i] + "Hidden";
                    return null
                }
            },
            setToClearWatchedEvent: function() {
                clearTimeout(watchedEventClearTimer),
                watchedEventClearTimer = setTimeout(function() {
                    watchedEvent = ""
                }, 3e3)
            }
        },
        slider.flexAnimate = function(target, pause, override, withSync, fromNav) {
            if (slider.vars.animationLoop || target === slider.currentSlide || (slider.direction = target > slider.currentSlide ? "next" : "prev"),
            asNav && 1 === slider.pagingCount && (slider.direction = slider.currentItem < target ? "next" : "prev"),
            !slider.animating && (slider.canAdvance(target, fromNav) || override) && slider.is(":visible")) {
                if (asNav && withSync) {
                    override = $(slider.vars.asNavFor).data("flexslider");
                    if (slider.atEnd = 0 === target || target === slider.count - 1,
                    override.flexAnimate(target, !0, !1, !0, fromNav),
                    slider.direction = slider.currentItem < target ? "next" : "prev",
                    override.direction = slider.direction,
                    Math.ceil((target + 1) / slider.visible) - 1 === slider.currentSlide || 0 === target)
                        return slider.currentItem = target,
                        slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide"),
                        !1;
                    slider.currentItem = target,
                    slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide"),
                    target = Math.floor(target / slider.visible)
                }
                var dimension;
                slider.animating = !0,
                slider.animatingTo = target,
                pause && slider.pause(),
                slider.vars.before(slider),
                slider.syncExists && !fromNav && methods.sync("animate"),
                slider.vars.controlNav && methods.controlNav.active(),
                carousel || slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide"),
                slider.atEnd = 0 === target || target === slider.last,
                slider.vars.directionNav && methods.directionNav.update(),
                target === slider.last && (slider.vars.end(slider),
                slider.vars.animationLoop || slider.pause()),
                fade ? touch ? (slider.slides.eq(slider.currentSlide).css({
                    opacity: 0,
                    zIndex: 1
                }),
                slider.slides.eq(target).css({
                    opacity: 1,
                    zIndex: 2
                }),
                slider.wrapup(dimension)) : (slider.slides.eq(slider.currentSlide).css({
                    zIndex: 1
                }).animate({
                    opacity: 0
                }, slider.vars.animationSpeed, slider.vars.easing),
                slider.slides.eq(target).css({
                    zIndex: 2
                }).animate({
                    opacity: 1
                }, slider.vars.animationSpeed, slider.vars.easing, slider.wrapup)) : (dimension = vertical ? slider.slides.filter(":first").height() : slider.computedW,
                pause = carousel ? (withSync = slider.vars.itemMargin,
                (override = (slider.itemW + withSync) * slider.move * slider.animatingTo) > slider.limit && 1 !== slider.visible ? slider.limit : override) : 0 === slider.currentSlide && target === slider.count - 1 && slider.vars.animationLoop && "next" !== slider.direction ? reverse ? (slider.count + slider.cloneOffset) * dimension : 0 : slider.currentSlide === slider.last && 0 === target && slider.vars.animationLoop && "prev" !== slider.direction ? reverse ? 0 : (slider.count + 1) * dimension : reverse ? (slider.count - 1 - target + slider.cloneOffset) * dimension : (target + slider.cloneOffset) * dimension,
                slider.setProps(pause, "", slider.vars.animationSpeed),
                slider.transitions ? (slider.vars.animationLoop && slider.atEnd || (slider.animating = !1,
                slider.currentSlide = slider.animatingTo),
                slider.container.off("webkitTransitionEnd transitionend"),
                slider.container.on("webkitTransitionEnd transitionend", function() {
                    clearTimeout(slider.ensureAnimationEnd),
                    slider.wrapup(dimension)
                }),
                clearTimeout(slider.ensureAnimationEnd),
                slider.ensureAnimationEnd = setTimeout(function() {
                    slider.wrapup(dimension)
                }, slider.vars.animationSpeed + 100)) : slider.container.animate(slider.args, slider.vars.animationSpeed, slider.vars.easing, function() {
                    slider.wrapup(dimension)
                })),
                slider.vars.smoothHeight && methods.smoothHeight(slider.vars.animationSpeed)
            }
        }
        ,
        slider.wrapup = function(dimension) {
            fade || carousel || (0 === slider.currentSlide && slider.animatingTo === slider.last && slider.vars.animationLoop ? slider.setProps(dimension, "jumpEnd") : slider.currentSlide === slider.last && 0 === slider.animatingTo && slider.vars.animationLoop && slider.setProps(dimension, "jumpStart")),
            slider.animating = !1,
            slider.currentSlide = slider.animatingTo,
            slider.vars.after(slider)
        }
        ,
        slider.animateSlides = function() {
            !slider.animating && focused && slider.flexAnimate(slider.getTarget("next"))
        }
        ,
        slider.pause = function() {
            clearInterval(slider.animatedSlides),
            slider.animatedSlides = null,
            slider.playing = !1,
            slider.vars.pausePlay && methods.pausePlay.update("play"),
            slider.syncExists && methods.sync("pause")
        }
        ,
        slider.play = function() {
            slider.playing && clearInterval(slider.animatedSlides),
            slider.animatedSlides = slider.animatedSlides || setInterval(slider.animateSlides, slider.vars.slideshowSpeed),
            slider.started = slider.playing = !0,
            slider.vars.pausePlay && methods.pausePlay.update("pause"),
            slider.syncExists && methods.sync("play")
        }
        ,
        slider.stop = function() {
            slider.pause(),
            slider.stopped = !0
        }
        ,
        slider.canAdvance = function(target, fromNav) {
            var last = asNav ? slider.pagingCount - 1 : slider.last;
            return !!fromNav || asNav && slider.currentItem === slider.count - 1 && 0 === target && "prev" === slider.direction || !(asNav && 0 === slider.currentItem && target === slider.pagingCount - 1 && "next" !== slider.direction || target === slider.currentSlide && !asNav || !slider.vars.animationLoop && (slider.atEnd && 0 === slider.currentSlide && target === last && "next" !== slider.direction || slider.atEnd && slider.currentSlide === last && 0 === target && "next" === slider.direction))
        }
        ,
        slider.getTarget = function(dir) {
            return "next" === (slider.direction = dir) ? slider.currentSlide === slider.last ? 0 : slider.currentSlide + 1 : 0 === slider.currentSlide ? slider.last : slider.currentSlide - 1
        }
        ,
        slider.setProps = function(pos, special, dur) {
            posCheck = pos || (slider.itemW + slider.vars.itemMargin) * slider.move * slider.animatingTo;
            var posCheck, target = function() {
                if (carousel)
                    return "setTouch" === special ? pos : reverse && slider.animatingTo === slider.last ? 0 : reverse ? slider.limit - (slider.itemW + slider.vars.itemMargin) * slider.move * slider.animatingTo : slider.animatingTo === slider.last ? slider.limit : posCheck;
                switch (special) {
                case "setTotal":
                    return reverse ? (slider.count - 1 - slider.currentSlide + slider.cloneOffset) * pos : (slider.currentSlide + slider.cloneOffset) * pos;
                case "setTouch":
                    return pos;
                case "jumpEnd":
                    return reverse ? pos : slider.count * pos;
                case "jumpStart":
                    return reverse ? slider.count * pos : pos;
                default:
                    return pos
                }
            }() * (slider.vars.rtl ? 1 : -1) + "px";
            slider.transitions && (target = vertical ? "translate3d(0," + target + ",0)" : "translate3d(" + parseInt(target) + "px,0,0)",
            slider.container.css("-" + slider.pfx + "-transition-duration", dur = void 0 !== dur ? dur / 1e3 + "s" : "0s"),
            slider.container.css("transition-duration", dur)),
            slider.args[slider.prop] = target,
            !slider.transitions && void 0 !== dur || slider.container.css(slider.args),
            slider.container.css("transform", target)
        }
        ,
        slider.setup = function(type) {
            var sliderOffset, arr;
            fade ? (slider.vars.rtl ? slider.slides.css({
                width: "100%",
                float: "right",
                marginLeft: "-100%",
                position: "relative"
            }) : slider.slides.css({
                width: "100%",
                float: "left",
                marginRight: "-100%",
                position: "relative"
            }),
            "init" === type && (touch ? slider.slides.css({
                opacity: 0,
                display: "block",
                webkitTransition: "opacity " + slider.vars.animationSpeed / 1e3 + "s ease",
                zIndex: 1
            }).eq(slider.currentSlide).css({
                opacity: 1,
                zIndex: 2
            }) : 0 == slider.vars.fadeFirstSlide ? slider.slides.css({
                opacity: 0,
                display: "block",
                zIndex: 1
            }).eq(slider.currentSlide).css({
                zIndex: 2
            }).css({
                opacity: 1
            }) : slider.slides.css({
                opacity: 0,
                display: "block",
                zIndex: 1
            }).eq(slider.currentSlide).css({
                zIndex: 2
            }).animate({
                opacity: 1
            }, slider.vars.animationSpeed, slider.vars.easing)),
            slider.vars.smoothHeight && methods.smoothHeight()) : ("init" === type && (slider.viewport = $('<div class="' + namespace + 'viewport"></div>').css({
                overflow: "hidden",
                position: "relative"
            }).appendTo(slider).append(slider.container),
            slider.cloneCount = 0,
            slider.cloneOffset = 0,
            reverse) && (arr = $.makeArray(slider.slides).reverse(),
            slider.slides = $(arr),
            slider.container.empty().append(slider.slides)),
            slider.vars.animationLoop && !carousel && (slider.cloneCount = 2,
            slider.cloneOffset = 1,
            "init" !== type && slider.container.find(".clone").remove(),
            slider.container.append(methods.uniqueID(slider.slides.first().clone().addClass("clone")).attr("aria-hidden", "true")).prepend(methods.uniqueID(slider.slides.last().clone().addClass("clone")).attr("aria-hidden", "true"))),
            slider.newSlides = $(slider.vars.selector, slider),
            sliderOffset = reverse ? slider.count - 1 - slider.currentSlide + slider.cloneOffset : slider.currentSlide + slider.cloneOffset,
            vertical && !carousel ? (slider.container.height(200 * (slider.count + slider.cloneCount) + "%").css("position", "absolute").width("100%"),
            setTimeout(function() {
                slider.newSlides.css({
                    display: "block"
                }),
                slider.doMath(),
                slider.viewport.height(slider.h),
                slider.setProps(sliderOffset * slider.h, "init")
            }, "init" === type ? 100 : 0)) : (slider.container.width(200 * (slider.count + slider.cloneCount) + "%"),
            slider.setProps(sliderOffset * slider.computedW, "init"),
            setTimeout(function() {
                slider.doMath(),
                slider.vars.rtl ? slider.newSlides.css({
                    width: slider.computedW,
                    marginRight: slider.computedM,
                    float: "right",
                    display: "block"
                }) : slider.newSlides.css({
                    width: slider.computedW,
                    marginRight: slider.computedM,
                    float: "left",
                    display: "block"
                }),
                slider.vars.smoothHeight && methods.smoothHeight()
            }, "init" === type ? 100 : 0))),
            carousel || slider.slides.removeClass(namespace + "active-slide").eq(slider.currentSlide).addClass(namespace + "active-slide"),
            slider.vars.init(slider)
        }
        ,
        slider.doMath = function() {
            var slide = slider.slides.first()
              , slideMargin = slider.vars.itemMargin
              , minItems = slider.vars.minItems
              , maxItems = slider.vars.maxItems;
            slider.w = (void 0 === slider.viewport ? slider : slider.viewport).width(),
            slider.isFirefox && (slider.w = slider.width()),
            slider.h = slide.height(),
            slider.boxPadding = slide.outerWidth() - slide.width(),
            carousel ? (slider.itemT = slider.vars.itemWidth + slideMargin,
            slider.itemM = slideMargin,
            slider.minW = minItems ? minItems * slider.itemT : slider.w,
            slider.maxW = maxItems ? maxItems * slider.itemT - slideMargin : slider.w,
            slider.itemW = slider.minW > slider.w ? (slider.w - slideMargin * (minItems - 1)) / minItems : slider.maxW < slider.w ? (slider.w - slideMargin * (maxItems - 1)) / maxItems : slider.vars.itemWidth > slider.w ? slider.w : slider.vars.itemWidth,
            slider.visible = Math.floor(slider.w / slider.itemW),
            slider.move = 0 < slider.vars.move && slider.vars.move < slider.visible ? slider.vars.move : slider.visible,
            slider.pagingCount = Math.ceil((slider.count - slider.visible) / slider.move + 1),
            slider.last = slider.pagingCount - 1,
            slider.limit = 1 === slider.pagingCount ? 0 : slider.vars.itemWidth > slider.w ? slider.itemW * (slider.count - 1) + slideMargin * (slider.count - 1) : (slider.itemW + slideMargin) * slider.count - slider.w - slideMargin) : (slider.itemW = slider.w,
            slider.itemM = slideMargin,
            slider.pagingCount = slider.count,
            slider.last = slider.count - 1),
            slider.computedW = slider.itemW - slider.boxPadding,
            slider.computedM = slider.itemM
        }
        ,
        slider.update = function(pos, action) {
            slider.doMath(),
            carousel || (pos < slider.currentSlide ? slider.currentSlide += 1 : pos <= slider.currentSlide && 0 !== pos && --slider.currentSlide,
            slider.animatingTo = slider.currentSlide),
            slider.vars.controlNav && !slider.manualControls && ("add" === action && !carousel || slider.pagingCount > slider.controlNav.length ? methods.controlNav.update("add") : ("remove" === action && !carousel || slider.pagingCount < slider.controlNav.length) && (carousel && slider.currentSlide > slider.last && (--slider.currentSlide,
            --slider.animatingTo),
            methods.controlNav.update("remove", slider.last))),
            slider.vars.directionNav && methods.directionNav.update()
        }
        ,
        slider.addSlide = function(obj, pos) {
            obj = $(obj);
            slider.count += 1,
            slider.last = slider.count - 1,
            vertical && reverse ? void 0 !== pos ? slider.slides.eq(slider.count - pos).after(obj) : slider.container.prepend(obj) : void 0 !== pos ? slider.slides.eq(pos).before(obj) : slider.container.append(obj),
            slider.update(pos, "add"),
            slider.slides = $(slider.vars.selector + ":not(.clone)", slider),
            slider.setup(),
            slider.vars.added(slider)
        }
        ,
        slider.removeSlide = function(obj) {
            var pos = isNaN(obj) ? slider.slides.index($(obj)) : obj;
            --slider.count,
            slider.last = slider.count - 1,
            (isNaN(obj) ? $(obj, slider.slides) : vertical && reverse ? slider.slides.eq(slider.last) : slider.slides.eq(obj)).remove(),
            slider.doMath(),
            slider.update(pos, "remove"),
            slider.slides = $(slider.vars.selector + ":not(.clone)", slider),
            slider.setup(),
            slider.vars.removed(slider)
        }
        ,
        methods.init()
    }
    ,
    $(window).on("blur", function(e) {
        focused = !1
    }).on("focus", function(e) {
        focused = !0
    }),
    $.flexslider.defaults = {
        namespace: "flex-",
        selector: ".slides > li",
        animation: "fade",
        easing: "swing",
        direction: "horizontal",
        reverse: !1,
        animationLoop: !0,
        smoothHeight: !1,
        startAt: 0,
        slideshow: !0,
        slideshowSpeed: 7e3,
        animationSpeed: 600,
        initDelay: 0,
        randomize: !1,
        fadeFirstSlide: !0,
        thumbCaptions: !1,
        pauseOnAction: !0,
        pauseOnHover: !1,
        pauseInvisible: !0,
        useCSS: !0,
        touch: !0,
        video: !1,
        controlNav: !0,
        directionNav: !0,
        prevText: "Previous",
        nextText: "Next",
        keyboard: !0,
        multipleKeyboard: !1,
        mousewheel: !1,
        pausePlay: !1,
        pauseText: "Pause",
        playText: "Play",
        controlsContainer: "",
        manualControls: "",
        customDirectionNav: "",
        sync: "",
        asNavFor: "",
        itemWidth: 0,
        itemMargin: 0,
        minItems: 1,
        maxItems: 0,
        move: 0,
        allowOneSlide: !0,
        isFirefox: !1,
        start: function() {},
        before: function() {},
        after: function() {},
        end: function() {},
        added: function() {},
        removed: function() {},
        init: function() {},
        rtl: !1
    },
    $.fn.flexslider = function(options) {
        if ("object" == typeof (options = void 0 === options ? {} : options))
            return this.each(function() {
                var $this = $(this)
                  , selector = options.selector || ".slides > li"
                  , selector = $this.find(selector);
                1 === selector.length && !1 === options.allowOneSlide || 0 === selector.length ? (selector.fadeIn(400),
                options.start && options.start($this)) : void 0 === $this.data("flexslider") && new $.flexslider(this,options)
            });
        var $slider = $(this).data("flexslider");
        switch (options) {
        case "play":
            $slider.play();
            break;
        case "pause":
            $slider.pause();
            break;
        case "stop":
            $slider.stop();
            break;
        case "next":
            $slider.flexAnimate($slider.getTarget("next"), !0);
            break;
        case "prev":
        case "previous":
            $slider.flexAnimate($slider.getTarget("prev"), !0);
            break;
        default:
            "number" == typeof options && $slider.flexAnimate(options, !0)
        }
    }
}(jQuery);
