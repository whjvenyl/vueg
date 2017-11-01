"use strict";var transition={};transition.install=function(t,n){function e(){if(this.$el){var t=this.$el.classList;if(t){var n=[];Object.keys(t).forEach(function(e){n.push(t[e])});var e=!1;if(n.map(function(t){"animated"===t&&(e=!0)}),e){var a=document.createElement("div");a.id="vueg-background";var i=f.default;if(i){var o=i.$data.vuegConfig;if(o&&Object.keys(o).forEach(function(t){m[t]=o[t]}),m.disable)return;var s=document.getElementById("vueg-background");s||(i.$el.parentElement.appendChild(a),s=a),m.isStackAnim||s.classList.add("stack-animation"),s.innerHTML="",s.classList=[],s.appendChild(this.$el)}}}}}function a(){return!(!this.vuegConfig||!1!==this.vuegConfig.disable)||(!f||!f.default||f.default._uid===this._uid)}function i(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this;if(a.call(t)&&t&&!1!==l.value&&r){var n=this.$el;if(n&&n.parentElement){s(),Object.keys(d).forEach(function(t){m[t]=d[t]});var e=this.$data.vuegConfig;e&&Object.keys(e).forEach(function(t){m[t]=e[t]}),m.disable&&(u="");var i=n;m.isStackAnim&&"back"===u&&(n=document.getElementById("vueg-background")),n.classList.add("stack-animation"),m.shadow&&(n.style.boxShadow="0 3px 10px rgba(0, 0, 0, .156863), 0 3px 10px rgba(0, 0, 0, .227451)"),"first"===u&&(n.style.animationDuration=m.firstEntryDuration+"s",n.classList.add("fadeIn")),u&&(n.style.animationDuration=m.duration+"s"),n.classList.add("animated");var o=["touchPoint"],c=void 0;switch(u){case"forward":c=m.forwardAnim;break;case"back":c=m.backAnim}c&&n.classList.add(c);var f=void 0,v=document.head||document.getElementsByTagName("head")[0],p=void 0;if((f=document.getElementById("vueg-style"))||((f=document.createElement("style")).type="text/css",f.id="vueg-style",v.appendChild(f)),-1!==o.findIndex(function(t){return t===c}))switch(c){case"touchPoint":var g={x:document.documentElement.clientWidth/2,y:document.documentElement.clientHeight/2};p=".touchPoint{\n                                max-height:"+document.documentElement.clientHeight+"px!important;\n                                overflow:hidden;\n                                animation-name:touchPoint;\n                                position: relative;\n                                animation-timing-function: linear;\n                            }\n                            @keyframes touchPoint {\n                                from {\n                                    opacity:0.5;\n                                    transform: scale3d(0, 0, 0);\n                                    left:"+(-g.x+h.x)+"px;\n                                    top:"+(-g.y+h.y)+"px;\n                                }\n                                to{\n                                    opacity:1;\n                                    transform: scale3d(1, 1, 1);\n                                    left:0;\n                                    top:0;\n                                }\n                            }";var b=document.createTextNode(p);f.appendChild(b)}setTimeout(function(){i.classList.add("animated"),n&&n.classList&&n.classList.remove(m.forwardAnim,m.backAnim,"stack-animation"),n.style.boxShadow="",n.style.animationDuration="0s";var t=document.getElementById("vueg-background");t&&(t.innerHTML="",t.classList=[],t.removeAttribute("style")),-1!==o.findIndex(function(t){return t===c})&&(f.innerHTML="")},1e3*m.duration+300),setTimeout(function(){n.classList.remove("fadeIn")},1e3*m.firstEntryDuration)}}}function o(t){"mousedown"===t.type?(h.x=t.pageX,h.y=t.pageY):(h.x=t.touches[0].pageX,h.y=t.touches[0].pageY)}function s(){m={duration:"0.3",firstEntryDisable:!1,firstEntryDuration:".6",forwardAnim:"fadeInRight",backAnim:"fadeInLeft",isStackAnim:!1,sameDepthDisable:!1,tabs:[],tabsDisable:!1,disable:!1,shadow:!0}}var d=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=void 0,c=void 0,u=void 0,l={},m=void 0,f=void 0,h={x:0,y:0};s(),t.directive("transition",{bind:function(t,n,e,a){l=n}}),t.mixin({mounted:i,activated:i,beforeDestroy:e,deactivated:e}),n.beforeEach(function(t,n,e){r=t;var a=t.path.split("/").length,i=n.path.split("/").length;if("/"!==t.path.charAt(t.path.length-1)&&(a+=1),"/"!==n.path.charAt(n.path.length-1)&&(i+=1),u=a>i?"forward":"back",a===i&&(u=c===t.path?"back":"forward",m.sameDepthDisable&&(u=""),c=n.path),t.path===n.path&&t.path===c&&(u="first"),m.firstEntryDisable&&(u=""),n.name&&t.name){var o=m.tabs.findIndex(function(t){return t.name===n.name}),s=m.tabs.findIndex(function(n){return n.name===t.name});m.tabsDisable||-1===o||-1===s?-1!==o&&-1!==s&&(u=""):(s>o&&(u="forward"),s<o&&(u="back"),s===o&&(u=""))}var d=t.matched[0];f=d&&d.instances?d.instances:null,e()}),document.addEventListener("mousedown",o),document.addEventListener("touchstart",o)},module.exports=transition;