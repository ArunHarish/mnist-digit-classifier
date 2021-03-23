"use strict";
const tf = require("@tensorflow/tfjs-node");
const path = require("path");
const MODEL_DIR = path.join("", __dirname, "generated");

const BASE64_ENCODE_PREFIX = "data:image/png;base64,";

// The lambda incoming request handler
exports.handler = async (event) => {
    const { image } = event;
    
    if (!image) {
        throw new Error("Invalid request: Image not found.");  
    };
    
    try {
        // Load the model from the generated directory
        const mnistModel = await tf.node.loadSavedModel(MODEL_DIR);	
        // Convert to buffer and then to array
		const content = Buffer.from(
			                image.replace(BASE64_ENCODE_PREFIX, ""), 
			                "base64"
		                );
		const pngInput = new Uint8Array(content);
		
        // Convert to Tensor using PNG decoder to extract pixel information
		const inputTensorInt32 = tf.node.decodePng(pngInput, 1);
		// Normalising the data and casting its type
		const inputTensorFloat =
				tf.div(
					tf.cast(inputTensorInt32, "float32"),
					255
				);
		// Setting to 4 dimensions
		const inputTensor = tf.expandDims(inputTensorFloat, 0);
        
        // Wait for classification and probabilities of each labels 
		let outputProbability = await mnistModel.predict(inputTensor);
		// Take the class label with highest probability
        let outputPrediction = await tf.argMax(outputProbability, 1);
		// Convert to normal Javascript array from Tensor
        let [prediction] = await outputPrediction.array();
	    
	    // Send the prediction!
	    return {
	        statusCode : 200,
	        digit : prediction,
	    }
    } catch (e) {
    	throw new Error("Invalid request: ML model error.")
    }
};