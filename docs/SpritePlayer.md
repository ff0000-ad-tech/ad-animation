<a name="SpritePlayer"></a>

## SpritePlayer
**Kind**: global class  
**Npmpackage**:   

* [SpritePlayer](#SpritePlayer)
    * [new SpritePlayer(arg)](#new_SpritePlayer_new)
    * [.onComplete](#SpritePlayer.onComplete) : <code>function</code>
    * [.onLoop](#SpritePlayer.onLoop) : <code>function</code>
    * [.sprite](#SpritePlayer.sprite) : <code>Graphic.Sprite</code>
    * [.loop](#SpritePlayer.loop) : <code>boolean</code> \| <code>number</code>
    * [.frame](#SpritePlayer.frame) : <code>number</code>
    * [.targetFrame](#SpritePlayer.targetFrame) : <code>number</code>
    * [.speed](#SpritePlayer.speed) : <code>number</code>
    * [.play()](#SpritePlayer.play)
    * [.pause()](#SpritePlayer.pause)
    * [.stop()](#SpritePlayer.stop)
    * [.clear()](#SpritePlayer.clear)
    * [.render()](#SpritePlayer.render)
    * [.reverse()](#SpritePlayer.reverse)
    * [.forward()](#SpritePlayer.forward)

<a name="new_SpritePlayer_new"></a>

### new SpritePlayer(arg)
SpritePlayer is an image sequence player. This can be used as a stand alone player or can be used with 
other systems such as [CanvasDrawer](CanvasDrawer).<br><br>
Import from <a href="https://github.com/ff0000-ad-tech/ad-animation">ad-animation</a>


| Param | Type | Description |
| --- | --- | --- |
| arg | <code>object</code> | See the example below to see all of the properties of this object. |

**Example**  
```js
import { SpritePlayer } from 'ad-animation'

// Placed in Main
T.myPlayer = new SpritePlayer({
	id: 'my-sprite-player',
	target: T,
	css: {
		x: 10,
		y: 15,
		width: 160,
		height: 160,
		backgroundColor: '#cccccc'
	},
	source: '_output_128x64_30f',
	sprite: {
		frameWidth: 128,
		frameHeight: 64,
		frameNumber: 30
		//transformOrigin: { x: 0.5, y: 0.5 }
		//scale : 2
	},
	// autoPlay : false,
	loop: false, // 4
	frame: 0,
	speed: 8,
	// targetFrame: 14,
	onComplete: function() {
	},
	onLoop: function() {
	}
})

// in Animation
View.main.myPlayer.play()

// example of roll over/out
Gesture.add(View.main, GestureEvent.OVER, () => {
	const p = View.main.myPlayer
	p.forward()
	p.play()
}

Gesture.add(View.main, GestureEvent.OUT, () => {
	const p = View.main.myPlayer
	p.reverse()
	p.play()
}

// example of using chunks of animation
function playChunk(frame, targetFrame) {
	const p = View.main.myPlayer
	p.frame = frame
	p.targetFrame = targetFrame 
	p.play()
}

playChunk(0, 10) 
playChunk(10, 20)
playChunk(20, null) // set to null will revert to the last frame
</codeblock>
```
<a name="SpritePlayer.onComplete"></a>

### SpritePlayer.onComplete : <code>function</code>
A callback for when the Sprite is finished.

**Kind**: static property of [<code>SpritePlayer</code>](#SpritePlayer)  
<a name="SpritePlayer.onLoop"></a>

### SpritePlayer.onLoop : <code>function</code>
A callback for when the Sprite loops. NOTE: this will fire the same time as onComplete on the final loop

**Kind**: static property of [<code>SpritePlayer</code>](#SpritePlayer)  
<a name="SpritePlayer.sprite"></a>

### SpritePlayer.sprite : <code>Graphic.Sprite</code>
Direct access to the sprite object, which is used to manipulate the drawing within the canvas.

**Kind**: static property of [<code>SpritePlayer</code>](#SpritePlayer)  
**Example**  
```js
TweenLite.to(myPlayer.sprite, 3, { x:180, y:240, alpha:.2, scale:1, rotation:270 })
```
<a name="SpritePlayer.loop"></a>

### SpritePlayer.loop : <code>boolean</code> \| <code>number</code>
A boolean to toggle if the Sprite will continuously play or a number to set the number of times it will loop.
	NOTE: a number is the count of REPEATS, so setting loop = 2 will play a total of 3 times.
	Setting loop = 0 is the same as loop = false. Setting loop = -1 is the same as loop = true.

**Kind**: static property of [<code>SpritePlayer</code>](#SpritePlayer)  
**Example**  
```js
console.log(myPlayer.loop)
myPlayer.loop = true
```
<a name="SpritePlayer.frame"></a>

### SpritePlayer.frame : <code>number</code>
A number representing the current frame displayed. Setting this will jump to that frame and render.

**Kind**: static property of [<code>SpritePlayer</code>](#SpritePlayer)  
**Example**  
```js
console.log(myPlayer.frame)
myPlayer.frame = 7
```
<a name="SpritePlayer.targetFrame"></a>

### SpritePlayer.targetFrame : <code>number</code>
A number representing the frame the animation should treat as the end frame of the current direction of play.
	This will NOT render or play; it is simply setting the target value.

**Kind**: static property of [<code>SpritePlayer</code>](#SpritePlayer)  
**Example**  
```js
console.log(myPlayer.frame)
myPlayer.targetFrame = 7
myPlayer.play()
```
<a name="SpritePlayer.speed"></a>

### SpritePlayer.speed : <code>number</code>
A number representing the FrameRate, only applies when used as a stand alone player.

**Kind**: static property of [<code>SpritePlayer</code>](#SpritePlayer)  
**Example**  
```js
console.log(myPlayer.speed)
myPlayer.speed = 18
```
<a name="SpritePlayer.play"></a>

### SpritePlayer.play()
Plays the current sprite sheet.

**Kind**: static method of [<code>SpritePlayer</code>](#SpritePlayer)  
**Example**  
```js
myPlayer.play()
```
<a name="SpritePlayer.pause"></a>

### SpritePlayer.pause()
Pauses the current sprite sheet.

**Kind**: static method of [<code>SpritePlayer</code>](#SpritePlayer)  
**Example**  
```js
myPlayer.pause()
```
<a name="SpritePlayer.stop"></a>

### SpritePlayer.stop()
Stops the sprite sheet and resets it to the beginning.

**Kind**: static method of [<code>SpritePlayer</code>](#SpritePlayer)  
**Example**  
```js
myPlayer.stop()
```
<a name="SpritePlayer.clear"></a>

### SpritePlayer.clear()
Clears the current frame on to the canvas.

**Kind**: static method of [<code>SpritePlayer</code>](#SpritePlayer)  
**Example**  
```js
myPlayer.clear()
```
<a name="SpritePlayer.render"></a>

### SpritePlayer.render()
Render the current frame on to the canvas.

**Kind**: static method of [<code>SpritePlayer</code>](#SpritePlayer)  
**Example**  
```js
myPlayer.render()
```
<a name="SpritePlayer.reverse"></a>

### SpritePlayer.reverse()
Sets the animation direction to play in reverse

**Kind**: static method of [<code>SpritePlayer</code>](#SpritePlayer)  
**Example**  
```js
myPlayer.reverse()
```
<a name="SpritePlayer.forward"></a>

### SpritePlayer.forward()
Sets the animation direction to play forward,the default direction

**Kind**: static method of [<code>SpritePlayer</code>](#SpritePlayer)  
**Example**  
```js
myPlayer.forward()
```
