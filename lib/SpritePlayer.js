/**
	@class SpritePlayer
	@param {object} arg
		See the example below to see all of the properties of this object.
	@desc
		SpritePlayer is an image sequence player. This can be used as a stand alone player or can be used with other systems such as {@link CanvasDrawer}.
		<br><br>

		<codeblock>
			// Stand Alone Example:
			var myPlayer = new SpritePlayer ({
				id : 'my-canvas',
				target : 'redAdContainer',
				css : {
					x : 10,
					y : 15,
					width : 160,
					height : 160,
					backgroundColor : '#cccccc'
				},
				source : 'star_160x160_16f',
				sprite : {
					x : 0,
					y : 0,
					frameWidth : 160,
					frameHeight : 160,
					frameNumber : 16,
					//transformOrigin: { x: 0.5, y: 0.5 }
					//scale : 2
				},
				//autoPlay : false,
				loop : 4,
				frame : 0,
				speed:22,
				//freeze : true,

				onComplete:function(){
					FrameRate.unregister ( A, handleTick, 15 )
				}		
			});
		</codeblock>
*/
function SpritePlayer ( arg ){
		
	/* ----------------------------------------------------------------------------------------------- */
	// MARKUP
	if ( arg.target instanceof HTMLCanvasElement ) {
		// is a canvas already
		var S = arg.target;
	} else {
		var S = new UICanvas ( arg );
	}	

	var spriteStyle = {
		x: 0,
		y: 0,
		alpha: 1,
		scale: 1,
		rotation: 0,
		transformOrigin: { x: 0, y: 0 }
	}

	var spriteSetting = {
		frameWidth : 50,
		frameHeight : 50,
		frameNumber : 14,
		speed : 1
	}

	for ( var param in arg.sprite ){
		if ( param in spriteStyle ){
			spriteStyle [ param ] = arg.sprite [ param ];
		}		
		if ( param in spriteSetting ){
			spriteSetting [ param ] = arg.sprite [ param ];
		}
	}

	var graphic = new Graphic.Sprite ( ImageManager.get ( arg.source ), spriteSetting.frameWidth, spriteStyle, spriteSetting );
	
	/* ----------------------------------------------------------------------------------------------- */
	// PRIVATE PROPERTIES
	var _isPlaying = false;
	var _speed = arg.speed || 24;
	var _frame = 0;
	var _total = spriteSetting.frameNumber;	
	var _loopTotal = Infinity;
	var _loopCount = -1;
	var _iterate = false;


	/* ----------------------------------------------------------------------------------------------- */
	// PUBLIC PROPERTIES
	
	/**
		@memberOf SpritePlayer	
		@var {function} onComplete 
		@desc
			A callback for when the Sprite is finished. 
	*/
	S.onComplete = arg.onComplete || function(){};


	/**	
		@memberOf SpritePlayer	
		@var {function} onComplete 
		@desc
			A callback for when the Sprite loops.  
	*/
	S.onLoop = arg.onLoop || function(){};


	/* ----------------------------------------------------------------------------------------------- */
	// GETTER | SETTERS
	Object.defineProperties ( S, {
		
		/**
			@memberOf SpritePlayer	
			@var {Graphic.Sprite} sprite
			@desc
				Direct access to the sprite object, which is used to manipulate the drawing within the canvas.
			@example
				TweenLite.to ( myPlayer.sprite, 3, { x:180, y:240, alpha:.2, scale:1, rotation:270 });
		*/
		sprite : {
			get : function(){
				return graphic.style
			}
		},

		/**	
			@memberOf SpritePlayer	
			@var {boolean} loop
			@desc
				A boolean to toggle if the Sprite will continuously play. 
			@example
				trace( myPlayer.loop );
				myPlayer.loop = true;
		*/
		loop : {
			get : function(){
				
				return graphic.setting.loop
			},
			set : function ( value ){
				var isLoop = value;
				if(typeof(value) === "boolean"){
					_loopTotal = Infinity;
				} else {
					if ( value == -1 ){
						_loopTotal = Infinity;
					} else {
						_loopTotal = value;
					}
					isLoop = true
				}

				trace ( "loop:", value, isLoop, _loopTotal )
				graphic.setting.loop = isLoop;
			}
		},

		/**	
			@memberOf SpritePlayer	
			@var {number} frame
			@desc
				A number representing the current frame displayed.
			@example
				trace ( myPlayer.frame );
				myPlayer.frame = 7;

				// Use this to manually animate the sprite player externally
				FrameRate.register ( this, handleFrameRate, 24 );

				function handleFrameRate(){
					myPlayer.clear()
					myPlayer.frame++
				}
		*/
		frame : {
			get : function(){
				return _frame;
			},
			set : function ( value ){
				_frame = value;
			
				if ( value >= _total ) {
					_frame = 0;
				} else if ( value < 0 ) {
					_frame = _total - 1;
				}
			}
		},

		/**	
			@memberOf SpritePlayer	
			@var {number} speed
			@desc
				A number representing the FrameRate, only applies when used as a stand alone player.
			@example
				trace ( myPlayer.speed );
				myPlayer.speed = 18;

		*/
		speed : {
			get : function(){
				return _speed;
			},
			set : function ( value ){
				S.pause();
				_speed = value;
				S.play();
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
			myPlayer.play();
	*/	
	S.play = function(){
		if ( !_isPlaying ){
			_iterate = false;
			FrameRate.register ( S, handleFrameRate, _speed );
			_isPlaying = true;
		}
	}

	/**	
		@memberOf SpritePlayer	
		@method pause
		@desc
			Pauses the current sprite sheet.
		@example
			myPlayer.pause();
	*/	
	S.pause = function(){
		if ( _isPlaying ){
			FrameRate.unregister ( S, handleFrameRate, _speed );
			_isPlaying = false;
		}		
	}

	/**	
		@memberOf SpritePlayer	
		@method stop
		@desc
			Stops the sprite sheet and resets it to the beginning.
		@example
			myPlayer.stop();
	*/
	S.stop = function(){
		_loopCount = 0;
		_frame = 0;
		S.pause();
	}

	S.clear = function(){
		S.context2d.clearRect ( 0, 0, S.width, S.height )
	}

	/**	
		@memberOf SpritePlayer	
		@method render
		@desc
			Render the current frame on to the canvas.
		@example
			myPlayer.render();
	*/
	S.render = function(){		
	//	trace ( _frame )
		graphic.render( S.context2d, {}, _frame );
	}

	/* ----------------------------------------------------------------------------------------------- */
	// PRIVATE METHODS
	function checkComplete () {		
		if ( _frame == _total - 1 ) {
			trace ( _loopCount, _loopTotal )
			if ( _loopCount >= _loopTotal ){
				S.pause();
				S.onComplete.call(S);			
				S.dispatchEvent( new CustomEvent('complete'));
			}
		} else if ( _frame == 0 ) {
			_loopCount++;
			S.onLoop.call(S);			
			S.dispatchEvent( new CustomEvent('loop'));
		}
	}

	/* ----------------------------------------------------------------------------------------------- */
	// EVENT HANDLERS
	function handleFrameRate ( event ){
		S.clear();
		if ( _iterate ) S.frame++;
		S.render();
		checkComplete();
		_iterate = true;
	}

	/* ----------------------------------------------------------------------------------------------- */
	if ( arg.frame > -1 ){
		S.frame = arg.frame || 0;
	}
	
	S.loop = arg.loop;
	if ( arg.autoPlay ){
		S.play();
	}

	return S;
}
