var TourPlayer=function(){"use strict";var t=KanKan.Animate.transitions,e="panorama",r="floorplan",o={flydown:{movementEasing:"easeInOutQuad",movementDelay:.001,rotationEasing:"easeInOutQuad",rotationDelay:.5,modelTextureDelay:.75,skyboxDelay:.75}};o.freeze=Object.freeze({FlyToPano:t.getUniqueId(),FlyToNewMode:t.getUniqueId(),FlyToSameMode:t.getUniqueId(),FlyToViewFloor:t.getUniqueId(),LookTransition:t.getUniqueId(),ZoomTransition:t.getUniqueId(),LookRotationForPlay:t.getUniqueId(),wallLineShine:t.getUniqueId(),spotShine:t.getUniqueId(),rulerShine:t.getUniqueId(),outsideFocus:t.getUniqueId(),shopCircle:t.getUniqueId()});var a=function(a){function n(t,e){a.call(this),this.app=t,this.tours=t.TourManager.tours,this.partId=0,this.frameId=0,this._wait_queue=[],this._anit_queue=[],this._isEnd=!1,this._isPlaying=!1,this._isPlayFrame=!1}a&&(n.__proto__=a),n.prototype=Object.create(a&&a.prototype),n.prototype.constructor=n;var i={isEnd:{configurable:!0},isPlaying:{configurable:!0}};return i.isEnd.get=function(){return this._isEnd},i.isPlaying.get=function(){return this._isPlaying},n.prototype.play=function(t,e){var r=this;if(null!=t&&null!=e?(this.partId=t,this.frameId=e,this._isPlayFrame=!0):null!=t?(this.partId=t,this.frameId=0):this.frameId=0,this._isEnd&&(this._isEnd=!1,this.partId=0,this.frameId=0),this._isPlaying)return this.pause(!0),this._start_timer&&clearTimeout(this._start_timer),void(this._start_timer=setTimeout((function(){r.play(t,e)}),200));var o=this.tours[this.partId],a=o.list[this.frameId];if(!a)return this.emit("end");a._end&&(this.frameId=0,a=o.list[this.frameId]),this._isPlaying=!0,this.flyToFirst(a,(function(){r._isPlaying&&(r.emit("play",{partId:r.partId,frameId:r.frameId}),r.playNextFrame())}))},n.prototype.pause=function(e){this._anit_queue.forEach((function(e){return e&&t.cancel(e)})),this._wait_queue.forEach((function(t){return t&&clearTimeout(t)})),this._anit_queue=[],this._wait_queue=[],this._isPlaying=!1,t.cancelById(o.freeze.LookRotationForPlay),t.cancelById(o.freeze.LookTransition),e||this.emit("pause"),this.tours[this.partId].audio&&this.tours[this.partId].audio.stop()},n.prototype.end=function(){var t=this;if(this._anit_queue=[],this._wait_queue=[],this._isPlaying=!1,this.tours[this.partId].audio){var e=this.partId;setTimeout((function(){t.tours[e].audio.stop()}),50)}this._isPlayFrame||(this._isEnd=!0,this.partId=this.tours.length-1,this.frameId=this.tours[this.partId].list.length-1),this.emit("progress",{partId:this.partId,frameId:this.frameId,progress:1}),this.emit("end"),this._isPlayFrame=!1,this.tours[this.partId].audio&&this.tours[this.partId].audio.stop()},n.prototype.selectPart=function(t){if(!isNaN(t)){var e=this.tours[t];return e?(this.partId=t,this.frameId=0,this._isEnd=!1,e):void 0}},n.prototype.getFrame=function(){var t=this.tours[this.partId];if(t)return t.list[this.frameId]},n.prototype.selectFrame=function(t){var r=this;return new Promise((function(o){if(isNaN(t))return o(null);r._isEnd=!1,r.frameId=parseInt(t);var a=r.tours[r.partId].list[r.frameId];if(!a)return o(null);var n=r.app.core.get("Player");if(n.mode==e&&a.enter.mode==e){var i=new THREE.Vector3(0,0,-1).applyQuaternion(a.enter.qua).add(a.enter.pos),s=n.model.panos.get(a.enter.panoId);n.flyToPano({pano:s,lookAtPoint:i},o)}else if(n.mode!=a.enter.mode)if(a.enter.mode==e){var l=n.model.panos.get(a.enter.panoId);n.flyToNewMode({pano:l,quaternion:r.parseVector4(a.enter.qua),mode:a.enter.mode,callback:o})}else n.flyToNewMode({position:r.parseVector3(a.enter.pos),target:r.parseVector3(a.enter.target),quaternion:r.parseVector4(a.enter.qua),mode:a.enter.mode,currentScale:a.enter.currentScale,callback:function(){a.enter.hasOwnProperty("floor")&&r.app.Scene.gotoFloor(a.enter.floor),o()}});else{var u=r.parseVector3(a.enter.pos),p=r.parseVector3(a.enter.target),d=a.enter.currentScale;r.playForRotateForDollAndFloor(u,p,d,a.enter.mode,null,o,a.time)}}))},n.prototype.flyToFirst=function(t,r){var o=this,a=this.app.core.get("Player");if(a.mode==e&&t.enter.mode==e){var n=new THREE.Vector3(0,0,-1).applyQuaternion(t.enter.qua).add(t.enter.pos),i=a.model.panos.get(t.enter.panoId);a.flyToPano({pano:i,lookAtPoint:n},r)}else if(t.enter.mode==e){var s=a.model.panos.get(t.enter.panoId);a.flyToNewMode({pano:s,quaternion:this.parseVector4(t.enter.qua),mode:t.enter.mode,callback:r})}else a.flyToNewMode({position:this.parseVector3(t.enter.pos),target:this.parseVector3(t.enter.target),quaternion:this.parseVector4(t.enter.qua),mode:t.enter.mode,currentScale:t.enter.currentScale,callback:function(){t.enter.hasOwnProperty("floor")&&o.app.Scene.gotoFloor(t.enter.floor),r()}})},n.prototype.playForRotateForPano=function(e,r,a){var n=this.app.core.get("Player"),i=n.cameraControls.activeControl.camera.quaternion;t.start(KanKan.Animate.lerp.quaternion(i,e,function(t,e){if(n.cameraControls.activeControl){var r=new THREE.Vector3(0,0,-1).applyQuaternion(t).add(n.position);n.cameraControls.activeControl.lookAt(r)}this.emit("progress",{partId:this.partId,frameId:this.frameId,progress:e})}.bind(this)),r,(function(){a()}),0,KanKan.Animate.easing[o.flydown.rotationEasing],null,o.freeze.LookRotationForPlay)},n.prototype.playForRotateForDollAndFloor=function(e,a,n,i,s,l,u){var p=this.app.core.get("Player");t.start(KanKan.Animate.lerp.vector(p.cameraControls.activeControl.target,new THREE.Vector3(a.x,a.y,a.z),s),u,null,0,KanKan.Animate.easing[o.flydown.rotationEasing],null,o.freeze.LookRotationForPlay),t.start(KanKan.Animate.lerp.vector(p.cameraControls.activeControl.camera.position,e),u,l,0,KanKan.Animate.easing[o.flydown.rotationEasing],null,o.freeze.LookRotationForPlay),i==r&&p.cameraControls.activeControl.absoluteScale!=n&&t.start(KanKan.Animate.lerp.property(p.cameraControls.activeControl,"absoluteScale",n,function(t){p.cameraControls.activeControl&&(p.cameraControls.activeControl.currentScale=t,"PerspectiveCamera"!=p.cameraControls.activeControl.camera.type&&p.cameraControls.activeControl.updateZoom())}.bind(this)),u,null,0,KanKan.Animate.easing[o.flydown.rotationEasing],null,o.freeze.LookRotationForPlay)},n.prototype.playForFlyToPano=function(t,r,o){var a=this.app.core.get("Player");if(a.mode==e&&t.enter.mode==e){var n=a.model.panos.get(t.enter.panoId);if("fast"==r)a.fastToPano({pano:n,quaternion:this.parseVector4(t.enter.qua),callback:o});else{var i=new THREE.Vector3(0,0,-1).applyQuaternion(t.enter.qua).add(t.enter.pos);a.flyToPano({pano:n,lookAtPoint:i},o)}}},n.prototype.playForFlyToNewMode=function(t,r){var o=this,a=this.app.core.get("Player");if(a.mode==t.enter.mode&&a.mode==e);else if(a.mode!=t.enter.mode)if(t.enter.mode==e){var n=a.model.panos.get(t.enter.panoId);a.flyToNewMode({pano:n,quaternion:t.enter.qua,mode:t.enter.mode,callback:r})}else a.flyToNewMode({position:t.enter.pos,target:t.enter.target,quaternion:t.enter.qua,mode:t.enter.mode,currentScale:t.enter.currentScale,callback:function(){t.enter.hasOwnProperty("floor")&&o.app.Scene.gotoFloor(t.enter.floor),r()}})},n.prototype.playFrame=function(r,o){var a=this;if(o){this.app.core.get("Player").cameraControls.activeControl.camera.quaternion.clone();var n=this.parseVector4(o.enter.qua);if(r.enter.mode==e){if(o.enter.mode==e){if(r.enter.panoId!=o.enter.panoId)return this._wait_queue.push(setTimeout((function(){return a.playForFlyToPano(o,r.transitType,(function(){return a.playNextFrame(!0)}))}),r.time)),void this._anit_queue.push(t.start((function(t){a.emit("progress",{partId:a.partId,frameId:a.frameId,progress:t})}),r.time));this.playForRotateForPano(n,r.time,(function(){return a.playNextFrame(!0)}))}else if(o.enter.mode!=e)return this._wait_queue.push(setTimeout((function(){return a.playForFlyToNewMode(o,(function(){return a.playNextFrame(!0)}))}),r.time)),void this._anit_queue.push(t.start((function(t){a.emit("progress",{partId:a.partId,frameId:a.frameId,progress:t})}),r.time))}else if(r.enter.mode!=e){if(r.enter.mode!=o.enter.mode)return this._wait_queue.push(setTimeout((function(){return a.playForFlyToNewMode(o,(function(){return a.playNextFrame(!0)}))}),r.time)),void this._anit_queue.push(t.start((function(t){a.emit("progress",{partId:a.partId,frameId:a.frameId,progress:t})}),r.time));this.playForRotateForDollAndFloor(new THREE.Vector3(o.enter.pos.x,o.enter.pos.y,o.enter.pos.z),new THREE.Vector3(o.enter.target.x,o.enter.target.y,o.enter.target.z),o.enter.currentScale,r.enter.mode,(function(t,e){return a.emit("progress",{partId:a.partId,frameId:a.frameId,progress:e})}),(function(){return a.playNextFrame(!0)}),r.time)}}else this.playNextFrame(!0)},n.prototype.playNextFrame=function(t){if(this.isPlaying){if(t){if(this._isPlayFrame)return this.end();this.frameId++}var e=this.tours[this.partId].list[this.frameId];if(e)t||this._isPlayFrame||this.tours[this.partId].audio&&this.tours[this.partId].audio.play();else{this.tours[this.partId].audio&&this.tours[this.partId].audio.stop();var r=this.tours[this.partId+1];if(!(r&&r.list&&r.list.length))return this.end();this.partId++,this.frameId=0,e=this.tours[this.partId].list[this.frameId],this.tours[this.partId].audio&&this.tours[this.partId].audio.play()}var o=this.tours[this.partId].list[this.frameId+1];if(!o){var a=this.partId+1;if(!this.tours[a]||!this.tours[a].list||!this.tours[a].list.length)return this.end();if(!(o=this.tours[a].list[0]))return this.end()}this.emit("next",{partId:this.partId,frameId:this.frameId,progress:0}),this.playFrame(e,o)}},n.prototype.parseVector4=function(t){return new THREE.Quaternion(t.x,t.y,t.z,t.w)},n.prototype.parseVector3=function(t){return new THREE.Vector3(t.x,t.y,t.z)},Object.defineProperties(n.prototype,i),n}(KanKan.MITT.Emiter);return function(t,e){void 0===e&&(e={});var r=KanKan.Deferred();return t.Scene.on("loaded",(function(){var o=new a(t,e);o.$name="TourPlayer",o.$load=function(){t.TourManager.install("player",o)},r.resolve(o)})),r}}();
