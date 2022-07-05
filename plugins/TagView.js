var TagView=function(){"use strict";var t=KanKan.Viewmode,n=function(n){function i(i,e){var r=this;n.call(this),this.app=i,this.options=e||{},this.sid=null,this.$tag=null,this.tags=null,this.tags_dom={},this.isLoad=!1,this.isPositioning=!1,this.player=null,this.app.TagManager.on("update",(function(n){r.tags&&r.tags.length&&(r.player||(r.player=r.app.core.get("Player")),r.tags.forEach((function(n){if(r.tags_dom[n.sid]){if(r.player.mode!=t.PANORAMA||!n.visiblePanos.includes(r.player.currentPano))return r.tags_dom[n.sid].style.display="none";var i=r.app.TagManager.convertPositionTo2D(n.position);return n.x=i.pos.x,n.y=i.pos.y,r.tags_dom[n.sid].style.transform="translate("+i.pos.x+"px,"+i.pos.y+"px)",i.trueSide&&i.inSight?r.player.mode!=t.PANORAMA&&r.app.TagManager.ifShelter(n.position,i)?r.tags_dom[n.sid].style.display="none":void(r.tags_dom[n.sid].style.display="block"):r.tags_dom[n.sid].style.display="none"}})),n.hasChanged.cameraChanged3?r.waitToAimAtTag(!1):r.waitToAimAtTag(!0))}))}return n&&(i.__proto__=n),i.prototype=Object.create(n&&n.prototype),i.prototype.constructor=i,i.prototype.load=function(t){this.isLoad=!0,this.tags=(t||{}).tags||[],this.emit("loaded",{tags:this.tags}),this._insertHTML()},i.prototype.focus=function(t){var n=this;return new Promise((function(i){var e=n.tags.find((function(n){return n.sid==t}));if(!e)return i();var r=n.player||n.app.core.get("Player"),a=r.model.panos.closestPanoTowardPoint({point:e.position,getAll:!0}).map((function(t){return t.pano})).filter((function(t){return e.visiblePanos.indexOf(t)>-1&&t.position.clone().setY(e.position.y).sub(e.position).length()>1.5})),o=a[0],s=a.filter((function(t){return t.floorIndex==r.model.currentFloor.floorIndex}));s.length>0&&(o=s[0]),o||(console.warn("该热点无可视点位"),o=r.currentPano),r.flyToPano({pano:o,lookAtPoint:e.position},(function(){n.isPositioning=!1,i()}))}))},i.prototype._insertHTML=function(){var t=this,n=[],i='<span class="tag-icon animate" style="background-image:url({{icon}})"></span>',e=this.options.render||function(){},r=document.querySelector("[xui_tags_view]");if(this.tags_dom={},this.tags.forEach((function(a){a.icon=a.icon?t.app.resource.getUserResourceURL(a.icon):t.app.resource.base("images/tag_icon_default.svg");var o=e(a)||i;"string"==typeof o?n.push('\n                    <div data-tag-id="'+a.sid+'" data-tag-type="'+a.type+'">\n                        '+(e(a)||i).replace(/\{\{(\w+)\}\}/g,(function(t,n){return a[n]}))+"\n                    </div>"):o instanceof HTMLElement&&(o.setAttribute("data-tag-id",a.sid),o.setAttribute("data-tag-type",a.type),r.insertAdjacentElement("beforeend",o))})),n.length){var a=document.createElement("template");a.innerHTML=n.join(""),r.appendChild(a.content)}r.querySelectorAll("[data-tag-id]").forEach((function(n){var i=n.getAttribute("data-tag-id");i&&(t.tags_dom[i]=n),n.addEventListener("mouseenter",(function(n){t.emit("mouseenter",n)})),n.addEventListener("mouseleave",(function(n){t.emit("mouseleave",n)})),n.addEventListener("click",(function(n){n.preventDefault(),n.stopPropagation(),n.data=t.tags.find((function(t){return t.sid==i})),t.emit("click",n)}))})),this.emit("rendered",{tags:this.tags,elem:r})},i.prototype.aimAtTag=function(){var t=this.player.getDirection(),n=1/0,i=null;for(var e in this.tags){var r=this.tags[e],a=r.position.clone().sub(this.player.position).angleTo(t);a<n&&(n=a,i=r)}if(i){if(this.activeTag&&this.activeTag==i)return;this.activeTag=i,this.$tag=this.tags_dom[this.activeTag.sid],this.emit("focus",{data:this.activeTag,target:this.$tag})}},i.prototype.waitToAimAtTag=function(t){var n=this;t?this.aimAtTagTimer||(this.aimAtTagTimer=setTimeout((function(){n.aimAtTag()}),200)):this.aimAtTagTimer&&(clearTimeout(this.aimAtTagTimer),this.aimAtTagTimer=null)},i}(KanKan.MITT.Emiter);return function(t,i){var e=KanKan.Deferred();return t.Scene.on("loaded",(function(){var r=new n(t,i);r.$name="TagView",r.$html="<div xui_tags_view></div> <style> [xui_tags_view] {\r\n        position: absolute;\r\n        width: 100%;\r\n        height: 100%;\r\n    }\r\n    [xui_tags_view] > div {\r\n        pointer-events: all;\r\n        display: none;\r\n        position: absolute;\r\n        width: 48px;\r\n        height: 48px;\r\n        margin-left: -24px;\r\n        margin-top: -24px;\r\n    }\r\n\r\n    [xui_tags_view] .tag-icon {\r\n        display: block;\r\n        width: 48px;\r\n        height: 48px;\r\n        background-size: cover;\r\n        cursor: pointer;\r\n    }\r\n\r\n    [xui_tags_view] .tag-icon.animate {\r\n        animation: tag-animate-zoom 3s -1s linear infinite;\r\n    }\r\n\r\n    /* [xui_tags_view] > div.open,\r\n    [xui_tags_view] > div.hover{\r\n        z-index: 999;\r\n    }\r\n\r\n    [xui_tags_view] > div.open .tag-billboard,\r\n    [xui_tags_view] > div.hover .tag-billboard {\r\n        transform: translateY(-50%) scale(1);\r\n       \r\n    }\r\n    [xui_tags_view] .tag-body .tag-billboard {\r\n        padding: 0 40px 0 0;\r\n        position: absolute;\r\n        right: 35px;\r\n        top: 50%;\r\n        min-width: 420px;\r\n        min-height: 60px;\r\n        z-index: 1000;\r\n        transform: translateY(-50%) scale(0);\r\n        transform-origin: center right;\r\n        transition: all 0.3s cubic-bezier(0.35, 0.32, 0.65, 0.63);\r\n        pointer-events: none;\r\n    }\r\n    [xui_tags_view] .tag-body .tag-billboard::before {\r\n        pointer-events: all;\r\n        content: '';\r\n        position: absolute;\r\n        top: 50%;\r\n        right: 1px;\r\n        width: 0;\r\n        height: 0;\r\n        border-top: 15px solid transparent;\r\n        border-bottom: 15px solid transparent;\r\n        border-left: 40px solid rgba(27, 27, 28, 0.8);\r\n        transform: translateY(-50%);\r\n    }\r\n    [xui_tags_view] .tag-body .tag-billboard-content {\r\n        pointer-events: auto;\r\n        background: rgba(27, 27, 28, 0.8);\r\n        border-radius: 4px;\r\n        min-width: 400px;\r\n        padding: 30px 20px;\r\n        color: #fff;\r\n    } */\r\n\r\n    @keyframes tag-animate-zoom {\r\n        0% {\r\n            transform: scale(1);\r\n        }\r\n        50% {\r\n            transform: scale(0.7);\r\n        }\r\n        100% {\r\n            transform: scale(1);\r\n        }\r\n    } </style> ",r.$load=function(){t.TagManager.install("view",r)},e.resolve(r)})),e}}();
