class TweenPromise {
	constructor(method, tweenArgs) {
		return new Promise((resolve, reject) => {
			const i = tweenArgs.length - 1
			const thenParams = tweenArgs[i].thenParams || null
			delete tweenArgs[i].thenParams
			const onComplete = tweenArgs[i].onComplete || function() {}
			tweenArgs[i].onComplete = function() {
				if (onComplete) onComplete.apply(this, tweenArgs)
				resolve([this, thenParams])
			}
			TweenLite[method].apply(null, tweenArgs)
		})
	}

	static to() {
		return new TweenPromise('to', arguments)
	}

	static from() {
		return new TweenPromise('from', arguments)
	}

	static fromTo() {
		return new TweenPromise('fromTo', arguments)
	}
}

export default TweenPromise
