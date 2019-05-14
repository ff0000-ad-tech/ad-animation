/**
 * @npmpackage
 * @class TweenPromise
 * @desc
 * 	This module is a simple wrapper for TweenLite to return a Promise rather than using <code>onComplete</code>
 *  and <code>onCompleteParams</code>; instead use <code>.then()</code> with <code>thenParams</code> as an optional
 *  parameter in the <code>vars</code> object. The <code>.then()</code> will have a Array passed through it.
 * 	<table>
 * 		<tr>
 * 			<td>0</td>
 * 			<td>
 * 				The tween object giving access to all properties from TweenLite.<br>
 * 				NOTE: The object is not bound as <code>this</code> as this is not possible with <code>Promise.then()</code>
 * 		</tr>
 * 		<tr>
 * 			<td>1</td>
 * 			<td>
 * 				The arguments array set by <code>thenParams</code>
 * 		</tr>
 *  </table>
 * 	<br>
 * 	NOTE: <code>onComplete</code> and <code>onCompleteParams</code> still work in tandem with <code>.then()</code>
 * 	<br>
 * 	Import from <a href="https://github.com/ff0000-ad-tech/ad-animation">ad-animation</a>
 *
 * @example
 * import { TweenPromise } from 'ad-animation'
 *
 * // simple example to fade out and hide a dom element
 * TweenPromise.to(myComponent, 1, {
 * 	alpha: 0
 * }).then(args => {
 * 	// do stuff here post tween, like hide the element
 * 	myComponent.hide()
 * 	// OR
 * 	// get the tween object and any optional params passed back
 * 	const [tween, params] = args
 * 	// and get the target from the tween object
 * 	tween.target.hide()
 * })
 *
 * // a complex example with multiple dom elements stored in an array
 * const elems = [div, div, div, div]
 * const promisePool = elems.map(elem => {
 * 	return TweenPromise.to(elem, Math.random(), {
 *		rotation: 360,
 *		scale: 0.5,
 *		delay: Math.random()
 *	})
 * })
 * // when all are done, proceed to next animation for all
 * Promise.all(promisePool).then(() => {
 * 	TweenLite.to(elems, 2, {
 * 		scale: 1,
 * 		ease: Sine.easeInOut
 * 	})
 * })
 *
 * // declare tween in one location, such as in a class
 * class MyComponent {
 * 	.....
 * 	play() {
 * 		return TweenPromise.from(this, 1, {
 * 			x: 10,
 * 			ease: Circ.easeOut,
 * 			thenParams: [true]
 * 		})
 * 	}
 * }
 *
 * const myComponent = new MyComponent()
 * myComponent.play().then(args => {
 *  // get the tween object and any optional params passed back
 * 	const [tween, params] = args
 * 	const isSomething = params[0] // true passed from thenParams in class
 * // do stuff after animation
 * })
 */
export default class TweenPromise {
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

	/**
	 * @memberof TweenPromise
	 * @method to
	 * @param target
	 * @param time
	 * @param vars
	 * @desc Wrapper for TweenLite.to, using the same arguments.
	 * @returns {Promise} fulfilled when the tween is complete
	 */
	static to() {
		return new TweenPromise('to', arguments)
	}

	/**
	 * @memberof TweenPromise
	 * @method from
	 * @param target
	 * @param time
	 * @param vars
	 * @desc Wrapper for TweenLite.from, using the same arguments.
	 * @returns {Promise} fulfilled when the tween is complete
	 */
	static from() {
		return new TweenPromise('from', arguments)
	}

	/**
	 * @memberof TweenPromise
	 * @method fromTo
	 * @param target
	 * @param time
	 * @param fromVars
	 * @param toVars
	 * @desc Wrapper for TweenLite.fromTo, using the same arguments.
	 * @returns {Promise} fulfilled when the tween is complete
	 */
	static fromTo() {
		return new TweenPromise('fromTo', arguments)
	}
}
