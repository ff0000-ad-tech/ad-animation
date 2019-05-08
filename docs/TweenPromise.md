<a name="TweenPromise"></a>

## TweenPromise
**Kind**: global class  
**Npmpackage**:   

* [TweenPromise](#TweenPromise)
    * [new TweenPromise()](#new_TweenPromise_new)
    * [.to(target, time, vars)](#TweenPromise.to) ⇒ <code>Promise</code>
    * [.from(target, time, vars)](#TweenPromise.from) ⇒ <code>Promise</code>
    * [.fromTo(target, time, fromVars, toVars)](#TweenPromise.fromTo) ⇒ <code>Promise</code>

<a name="new_TweenPromise_new"></a>

### new TweenPromise()
This module is a simple wrapper for <code>TweenLite</code> to return a <code>Promise</code> rather than using
 <code>onComplete</code> and <code>onCompleteParams</code>; instead use <code>.then()</code> with
 <code>thenParams</code> as an optional parameter in the <code>vars</code> object. The <code>.then()</code> will
 have a Array passed through it:
 <br>
 <code>.then(args => { ... })</code>
	<table>
		<tr>
			<td>0</td>
			<td>
				The tween object giving access to all properties from TweenLite.<br>
				NOTE: The object is not bound as <code>this</code> as this is not possible with <code>Promise.then()</code>
		</tr>
		<tr>
			<td>1</td>
			<td>
				The arguments Array set by <code>thenParams</code>
		</tr>
 </table>
	<br>
	NOTE: <code>onComplete</code> and <code>onCompleteParams</code> still work in tandem with <code>.then()</code>
	<br>
	Import from <a href="https://github.com/ff0000-ad-tech/ad-animation">ad-animation</a>

**Example**  
```js
import { TweenPromise } from 'ad-animation'

// simple example to fade out and hide a dom element
TweenPromise.to(myComponent, 1, {
	alpha: 0
}).then(args => {
	// do stuff here post tween, like hide the element
	myComponent.hide()
	// OR
	// get the tween object and any optional params passed back
	const [tween, params] = args
	// and get the target from the tween object
	tween.target.hide()
})

// a complex example with multiple dom elements stored in an array
const elems = [div, div, div, div]
const promisePool = elems.map(elem => {
	return TweenPromise.to(elem, Math.random(), {
		rotation: 360,
		scale: 0.5,
		delay: Math.random()
	})
})
// when all are done, proceed to next animation for all
Promise.all(promisePool).then(() => {
	TweenLite.to(elems, 2, {
		scale: 1,
		ease: Sine.easeInOut
	})
})

// declare tween in one location, such as in a class
class MyComponent {
	.....
	play() {
		return TweenPromise.from(this, 1, {
			x: 10,
			ease: Circ.easeOut,
			thenParams: [true]
		})
	}
}

const myComponent = new MyComponent()
myComponent.play().then(args => {
	// get the tween object and any optional params passed back
	const [tween, params] = args
	const isSomething = params[0] // true passed from thenParams in class
	// do stuff after animation
})
```
<a name="TweenPromise.to"></a>

### TweenPromise.to(target, time, vars) ⇒ <code>Promise</code>
Wrapper for TweenLite.to, using the same arguments.

**Kind**: static method of [<code>TweenPromise</code>](#TweenPromise)  
**Returns**: <code>Promise</code> - fulfilled when the tween is complete  

| Param | Description |
| --- | --- |
| target | The element to animate |
| time | The time on the tween |
| vars | All options {@see greensock} |

**Properties**

| Name | Description |
| --- | --- |
| thenParams | Optional property of the <code>vars</code> object: values to be passed through <code>.then()</code> 	as an Array. |

<a name="TweenPromise.from"></a>

### TweenPromise.from(target, time, vars) ⇒ <code>Promise</code>
Wrapper for TweenLite.from, using the same arguments.

**Kind**: static method of [<code>TweenPromise</code>](#TweenPromise)  
**Returns**: <code>Promise</code> - fulfilled when the tween is complete  

| Param | Description |
| --- | --- |
| target | The element to animate |
| time | The time on the tween |
| vars | All options {@see greensock} |

**Properties**

| Name | Description |
| --- | --- |
| thenParams | Optional property of the <code>vars</code> object: values to be passed through <code>.then()</code> 	as an Array. |

<a name="TweenPromise.fromTo"></a>

### TweenPromise.fromTo(target, time, fromVars, toVars) ⇒ <code>Promise</code>
Wrapper for TweenLite.fromTo, using the same arguments.

**Kind**: static method of [<code>TweenPromise</code>](#TweenPromise)  
**Returns**: <code>Promise</code> - fulfilled when the tween is complete  

| Param | Description |
| --- | --- |
| target | The element to animate |
| time | The time on the tween |
| fromVars | All options {@see greensock} |
| toVars | All options {@see greensock} |

**Properties**

| Name | Description |
| --- | --- |
| thenParams | Optional property of the <code>toVars</code> object: values to be passed through <code>.then()</code> 	as an Array. |

