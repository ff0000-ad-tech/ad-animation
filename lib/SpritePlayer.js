/**
	@npmpackage
	@class SpritePlayer
	@param {object} arg
		See the example below to see all of the properties of this object.
	@desc
		Import from <a href="https://github.com/ff0000-ad-tech/ad-animation">ad-animation</a>
		<br>
		<codeblock>
			// importing into an ES6 class
			import { SpritePlayer } from 'ad-animation'
		</codeblock>
		<br><br>

		SpritePlayer is an image sequence player. This can be used as a stand alone player or can be used with other systems such as {@link CanvasDrawer}.
		<br><br>

		<codeblock>
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
*/
import { UICanvas } from 'ad-ui'
import { Graphic } from 'ad-particles'
import { FrameRate } from 'ad-events'
import { ImageManager } from 'ad-control'
import { Styles, Align } from 'ad-view'
import { ObjectUtils } from 'ad-utils'

export default function SpritePlayer(arg) {
	/* ----------------------------------------------------------------------------------------------- */
	// MARKUP
	let spriteSetting = ObjectUtils.defaults(
		arg.sprite,
		{
			frameWidth: 50,
			frameHeight: 50,
			frameNumber: 14,
			speed: 1
		},
		true
	)

	let spriteStyle = ObjectUtils.defaults(
		arg.sprite,
		{
			x: 0,
			y: 0,
			alpha: 1,
			scale: 1,
			rotation: 0,
			transformOrigin: { x: 0, y: 0 }
		},
		true
	)

	let graphic = new Graphic.Sprite(ImageManager.get(arg.source), spriteSetting.frameWidth, spriteStyle, spriteSetting)
	let T
	if (arg.target instanceof HTMLCanvasElement) {
		// is a canvas already
		T = arg.target
	} else {
		var canvasW = arg.css.width
		var canvasH = arg.css.height
		var align = arg.align
		delete arg.align
		arg.css.width = spriteSetting.frameWidth
		arg.css.height = spriteSetting.frameHeight

		T = new UICanvas(arg)
		Styles.setCss(T, { width: canvasW, height: canvasH })
		if (align) Align.set(T, align)
	}

	/* ----------------------------------------------------------------------------------------------- */
	// PRIVATE PROPERTIES
	let _isPlaying = false
	let _speed = arg.speed || 24
	let _frame = 0
	let _total = spriteSetting.frameNumber
	let _endFrame = _total - 1
	let _loopTotal = Infinity
	let _loopCount = -1
	let _iterate = false
	let _isForward = true
	let _targetFrame = undefined

	/* ----------------------------------------------------------------------------------------------- */
	// PUBLIC PROPERTIES

	/**
		@memberOf SpritePlayer
		@var {function} onComplete
		@desc
			A callback for when the Sprite is finished.
	*/
	T.onComplete = arg.onComplete || function() {}

	/**
		@memberOf SpritePlayer
		@var {function} onLoop
		@desc
			A callback for when the Sprite loops. NOTE: this will fire the same time as onComplete on the final loop
	*/
	T.onLoop = arg.onLoop || function() {}

	/* ----------------------------------------------------------------------------------------------- */
	// GETTER | SETTERS
	Object.defineProperties(T, {
		/**
			@memberOf SpritePlayer
			@var {Graphic.Sprite} sprite
			@desc
				Direct access to the sprite object, which is used to manipulate the drawing within the canvas.
			@example
				TweenLite.to(myPlayer.sprite, 3, { x:180, y:240, alpha:.2, scale:1, rotation:270 })
		*/
		sprite: {
			get: function() {
				return graphic.style
			}
		},

		/**
			@memberOf SpritePlayer
			@var {boolean|number} loop
			@desc
				A boolean to toggle if the Sprite will continuously play or a number to set the number of times it will loop.
				NOTE: a number is the count of REPEATS, so setting loop = 2 will play a total of 3 times. 
				Setting loop = 0 is the same as loop = false. Setting loop = -1 is the same as loop = true.
			@example
				console.log(myPlayer.loop)
				myPlayer.loop = true
		*/
		loop: {
			get: function() {
				return graphic.setting.loop
			},
			set: function(value) {
				var isLoop = value
				if (typeof value === 'boolean') {
					_loopTotal = Infinity
				} else {
					if (value == -1) {
						_loopTotal = Infinity
					} else {
						_loopTotal = value
					}
					isLoop = value != 0
				}
				graphic.setting.loop = isLoop
			}
		},

		/**
			@memberOf SpritePlayer
			@var {number} frame
			@desc
				A number representing the current frame displayed. Setting this will jump to that frame and render.
			@example
				console.log(myPlayer.frame)
				myPlayer.frame = 7
		*/
		frame: {
			get: function() {
				return _frame
			},
			set: function(value) {
				_frame = Math.round(value)

				if (value >= _total) {
					_frame = 0
				} else if (value < 0) {
					_frame = _total - 1
				}
				T.render()
			}
		},

		/**	
			@memberOf SpritePlayer	
			@var {number} targetFrame
			@desc
				A number representing the frame the animation should treat as the end frame of the current direction of play.
				This will NOT render or play; it is simply setting the target value.
			@example
				console.log(myPlayer.frame)
				myPlayer.targetFrame = 7
				myPlayer.play()
		*/
		targetFrame: {
			get: function() {
				return _targetFrame
			},
			set: function(value) {
				if (value == undefined || value == null) {
					_targetFrame = undefined
				} else {
					_targetFrame = Math.round(value)

					if (_targetFrame == -1) {
						_targetFrame = _total - 1
					}
				}
			}
		},

		/**
			@memberOf SpritePlayer
			@var {number} speed
			@desc
				A number representing the FrameRate, only applies when used as a stand alone player.
			@example
				console.log(myPlayer.speed)
				myPlayer.speed = 18
		*/
		speed: {
			get: function() {
				return _speed
			},
			set: function(value) {
				T.pause()
				_speed = value
				T.play()
			}
		}
	})

	/* ----------------------------------------------------------------------------------------------- */
	// PUBLIC METHODS
	/**
		@memberOf SpritePlayer
		@method play
		@desc
			Plays the current sprite sheet.
		@example
			myPlayer.play()
	*/

	T.play = function() {
		if (!_isPlaying) {
			_iterate = false
			FrameRate.register(T, handleFrameRate, _speed)
			_isPlaying = true
		}
	}

	/**
		@memberOf SpritePlayer
		@method pause
		@desc
			Pauses the current sprite sheet.
		@example
			myPlayer.pause()
	*/

	T.pause = function() {
		if (_isPlaying) {
			FrameRate.unregister(T, handleFrameRate, _speed)
			_isPlaying = false
			// reset the loop count?
		}
	}

	/**
		@memberOf SpritePlayer
		@method stop
		@desc
			Stops the sprite sheet and resets it to the beginning.
		@example
			myPlayer.stop()
	*/
	T.stop = function() {
		_loopCount = 0
		_frame = 0
		T.pause()
	}

	/**
		@memberOf SpritePlayer
		@method clear
		@desc
			Clears the current frame on to the canvas.
		@example
			myPlayer.clear()
	*/
	T.clear = function() {
		T.context2d.clearRect(0, 0, T.width, T.height)
	}

	/**
		@memberOf SpritePlayer
		@method render
		@desc
			Render the current frame on to the canvas.
		@example
			myPlayer.render()
	*/
	T.render = function() {
		//	console.log( _frame )
		graphic.render(T.context2d, {}, _frame)
	}

	/**
		@memberOf SpritePlayer
		@method reverse
		@desc
			Sets the animation direction to play in reverse
		@example
			myPlayer.reverse()
	*/
	T.reverse = function() {
		_isForward = false
		// reset the loop count?
	}

	/**
		@memberOf SpritePlayer
		@method forward
		@desc
			Sets the animation direction to play forward,the default direction
		@example
			myPlayer.forward()
	*/
	T.forward = function() {
		_isForward = true
		// reset the loop count?
	}

	/* ----------------------------------------------------------------------------------------------- */
	// PRIVATE METHODS
	function checkComplete() {
		let targetEnd = _targetFrame != undefined ? _targetFrame : _isForward ? _endFrame : 0
		if (_frame == targetEnd) {
			_loopCount++
			T.onLoop.call(T)
			T.dispatchEvent(new CustomEvent('loop'))

			if (!T.loop || _loopCount >= _loopTotal) {
				T.pause()
				T.onComplete.call(T)
				T.dispatchEvent(new CustomEvent('complete'))
			}
		}
	}

	/* ----------------------------------------------------------------------------------------------- */
	// EVENT HANDLERS
	function handleFrameRate() {
		T.clear()
		if (_iterate) _isForward ? T.frame++ : T.frame--
		T.render()
		checkComplete()
		_iterate = true
	}

	/* ----------------------------------------------------------------------------------------------- */
	if (arg.frame > -1) {
		T.frame = arg.frame || 0
	}
	if (arg.targetFrame && arg.targetFrame > -1 && arg.targetFrame < _total) {
		T.targetFrame = arg.targetFrame
	}

	T.loop = arg.loop
	if (arg.autoPlay) {
		T.play()
	}

	return T
}
