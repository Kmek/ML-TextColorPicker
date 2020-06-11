// Messing around with ML

/****************** Constants ******************/
const colorInput = document.getElementById("colorInput")
const colorDiv = document.getElementById("colorDiv")
const text = document.getElementById("text")

/****************** ColorInput OnChange ******************/
colorInput.onchange = function() {
	if (trained) {
		let color = colorInput.value
		colorDiv.style.backgroundColor = color

		let prediction = model.predict(tf.tensor([hexToRGB(color)])).dataSync()[0]
		console.log(prediction)

		if (prediction > 0.5)
			text.style.color = "white"
		else 
		text.style.color = "black"		
	}
}

/****************** Get RGB Colors ******************/
// From: https://stackoverflow.com/questions/36697749/html-get-color-in-rgb
function hexToRGB(value) {
	// #XXXXXX -> ["XX", "XX", "XX"]
	value = value.match(/[A-Za-z0-9]{2}/g)

	// ["XX", "XX", "XX"] -> [n, n, n]
	value = value.map(function(v) { return (parseInt(v, 16) / 255) })
	return value	
}

/****************** Machine Learning ******************/
const model = tf.sequential()
// Input Layer
model.add(tf.layers.dense({inputShape: [3], units: 1, activation: 'sigmoid'})) // Has three inputs, for RGB

// Output layer (I think?)
// model.add(tf.layers.dense({units: 1, activation: 'sigmoid'}))

// Make the model
model.compile({loss: 'binaryCrossentropy', optimizer: 'sgd', lr:0.1}) // This might be the wrong type (? unsure)

// Training (0 is black text, 1 is white text)
var trained = false
const trainInput = tf.tensor([hexToRGB("#252323"), hexToRGB("#e29cd9"), hexToRGB("#114f24"), hexToRGB("#7b3821"), hexToRGB("#5a320c"), hexToRGB("#6210d5"), hexToRGB("#75ffd1"), hexToRGB("#a7a349"), hexToRGB("#42eb47")])
const trainOutput = tf.tensor([           [1],                 [0],                 [1],                 [1],                 [1],                 [1],                 [0],                 [0],                 [0]])
model.fit(trainInput, trainOutput, {epochs: 1000}).then(() => {
	trained = true
	text.innerHTML = "Can you read me?"
	console.log("Done training!")
	model.predict(trainInput).print()
})

console.log("Expected Outputs: " + trainOutput.dataSync().join(", "))