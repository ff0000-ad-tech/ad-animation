// VERSION : May 11, 2015 4:00 PM
// TODO - return both x and y updates
//		- snap to value on end
//		- current time?
//		- change in time?
//		- distance covered?
//		- pre-calculate and collect all distances, similar to carousel
var Momentum = function(arg) {
	arg = arg || {}
	this.onUpdate = arg.onUpdate || null
	this.onComplete = arg.onComplete || null
	this.friction = arg.friction || 0

	this.time = 0
	this.velocity = 0
	this.velocityInital = 0
	this.velocityMax = 25
	this.distance = 0
	this.displacement = 0 // the amount changed since last frame
	this.isMoving = false

	this._startTime
	this._prevDis = 0
	this._accel

	// pre-bind method : scope maintained for access in FrameRate
	this._settle = this._settle.bind(this)
}

Momentum.prototype = {
	// a multiplier for expanding the distance of a throw; should not change.
	_DIST_MULTI: 100,

	start: function(velocity) {
		if (velocity === 0) return
		// grab the settle variables
		//console.log( '_______:: FINISH ::_______' );
		if (velocity > this.velocityMax) {
			velocity = this.velocityMax
			//console.log( ' - velocity OVER ' + velocity );
		} else if (velocity < -this.velocityMax) {
			velocity = -this.velocityMax
			//console.log( ' - velocity UNDER ' + velocity );
		}

		this.velocity = velocity
		this.velocityInital = velocity
		console.log(' - velocity: ' + this.velocity)

		this._accel = this._applyFriction()
		if (velocity > 0) {
			this._accel *= -1
		}
		//console.log( ' - this._accel:', this._accel );

		this.distance = velocity * velocity / (2 * Math.abs(this._accel))
		this.distance *= this._DIST_MULTI
		//console.log( ' - this.distance:', this.distance );

		this.time = Math.abs(velocity / this._accel)
		//console.log( ' - this.time:', this.time );

		this._startTime = Date.now()
		//console.log( ' - this._startTime:', this._startTime );

		this._prevDis = 0

		FrameRate.register(this, this._settle)
		this.isMoving = true
	},

	stop: function() {
		this.isMoving = false
		FrameRate.unregister(this, this._settle)
	},

	_settle: function() {
		var time_local = (Date.now() - this._startTime) / 1000
		this.velocity = this.velocityInital + this._accel * time_local
		if (time_local >= this.time) {
			this.stop()
			// set final values
			this.velocity = 0
			//this.displacement = this.distance - this._prevDis;
			//TODO - broken find last little displcement
			//console.log( this.distance, this._prevDis );
			return
		} else {
			var dis_at_time = this.velocityInital * time_local + 0.5 * this._accel * time_local * time_local
			dis_at_time *= this._DIST_MULTI
			this.displacement = dis_at_time - this._prevDis
			this._prevDis = dis_at_time
		}

		//console.log( time_local, velocityCurrent.toFixed(4), dis_at_time.toFixed(4), this.displacement.toFixed(4) );

		this.onUpdate(this)
		//console.log( time_local.toFixed(4), dis_at_time.toFixed(4), velocityCurrent.toFixed(4) );

		if (!this.isMoving && this.onComplete) {
			this.onComplete(this)
		}
	},

	_applyFriction: function() {
		// acceleration sweet spot is between 10 and 50
		return this.friction * (50 - 10) + 10
	}
}

export default Momentum
