$(document).ready(function() {
    const MAX_DIMENSION = 500;
    const BORDER_WIDTH = 2;
    const PADDING_SIZE = 10;
    const AWS_LAMBDA = "https://lx3lihrph7.execute-api.ap-southeast-2.amazonaws.com/default/mnist-digit-classifier";
    let input = $("div#input");
    let output = $("div#output");
    let overlayMessage = $("div#overlay-message");
    let instructionOverlayMessage = $("div#description div#content_wrapper");
    let instructionOverlay = $("div#description div#content");

    let recogniseButton = $("button#recognise");
    let resetButton = $("button#reset");
    let closeButton = $("button#close")
    let expandDescriptionButton = $("a#info");
    
    let canvas = $("canvas#canvas");
    let context = canvas[0].getContext("2d");
    let connectionLost = $("div#connection-lost");
    
    let recognisedState = false;

    let mouseState = {
        mouseDown : false,
        previous : [],
        current : []
    };

    let offset = {
        top : 0,
        left : 0
    };

    function setSize() {
        let width = $(window).width();
        let height = $(window).height();
        let minimumDimension = Math.min(width, height);

        let dimension = Math.min(MAX_DIMENSION, minimumDimension - 
                                    BORDER_WIDTH - PADDING_SIZE);
        
        canvas.width(dimension);
        canvas.height(dimension);
        
        canvas.attr("width", dimension);
        canvas.attr("height", dimension);
        
        // Getting bounding client rect
        let rectangle = input[0].getBoundingClientRect(); 
        
        offset.left = rectangle.left || rectangle.x;
        offset.top = rectangle.top || rectangle.y;

    };

    function drawLine() {
        if (!mouseState.current || !mouseState.previous) {
            return ;
        };

        const [x1, y1] = mouseState.previous;
        const [x2, y2] = mouseState.current;
        const deltaX1 = ~~(x1 - offset.left);
        const deltaY1 = ~~(y1 - offset.top);
        const deltaX2 = ~~(x2 - offset.left);
        const deltaY2 = ~~(y2 - offset.top);


        context.beginPath();
        
        context.moveTo(deltaX1, deltaY1);
        context.lineTo(deltaX2, deltaY2);
        
        context.lineWidth = 10;
        context.strokeStyle = "#000";
        context.stroke();

        context.closePath();

    };

    function onMouseDown(event) {

        let x = event.clientX || event.touches[0].clientX;
        let y = event.clientY || event.touches[0].clientY;
        
        if (recognisedState) {
            clearCanvas();
        };

        overlayMessage.hide();
        mouseState.mouseDown = true;
        mouseState.current = [x, y];
    };
    
    function onMouseUp(event) {
        let x = event.clientX;
        let y = event.clientY;

        mouseState.mouseDown = false;
    };

    
    function onMouseMove(event) {
        let x = event.clientX || event.touches[0].clientX;
        let y = event.clientY || event.touches[0].clientY;

        
        overlayMessage.hide();

        if (mouseState.mouseDown) {
            let current = [x, y];
            mouseState.previous = current;
            drawLine();
            mouseState.current = current;
        };
    };

    function onMouseEnd() {
        mouseState.mouseDown = false;
    };

    function clearCanvas() {
        output.text("");
        context.clearRect(0, 0, canvas.attr("width"), canvas.attr("height"));
        recognisedState = false;
    };

    function invertImageData(dummyCanvas, dummyContext) {
        let { width, height } = dummyCanvas;
        const imageData = dummyContext.getImageData(0, 0, width, height);

        for (let i = 0; i < imageData.data.length; i+=4) {
            // If the transparency is exactly 0 then make it inverted
            if (imageData.data[i + 3] === 0) {
                imageData.data[i + 3] = 255;
            } else {
                // Invert all colour channels, but maintain the alpha channel
                imageData.data[i] = 255 - imageData.data[i];
                imageData.data[i + 1] = 255 - imageData.data[i + 1];
                imageData.data[i + 2] = 255 - imageData.data[i + 2];
            };                            
        };

        dummyContext.putImageData(imageData, 0, 0);

        return dummyCanvas;
    };
    

    function invertBeforeSend(imageCanvas) {
        return new Promise(function(resolve, reject) {
            let width = canvas.attr("width"),
                height = canvas.attr("height");

            const dummyImage = $("<img></img>");
            const dummyCanvas = $("<canvas></canvas>");
            const dummyContext = dummyCanvas[0].getContext("2d");
            // Setting the attributes for the dummy canvas
            dummyCanvas.attr("width", width);
            dummyCanvas.attr("height", height);
            // Setting the attributes for the dummy image
            dummyImage.attr("width", width);
            dummyImage.attr("height", height);
            dummyImage.attr("src", imageCanvas.toDataURL());
            // Load the image
            dummyImage.on("load", function() {
                // Draw the image onto the canvas
                dummyContext.drawImage(dummyImage[0], 0, 0, width, height);
                // Now invert the colour and resolve this promise
                let nextData = invertImageData(dummyCanvas[0], dummyContext);
                resolve(nextData);
            });

            dummyImage.on("error", function() {
                reject("Error while creating a clone image.");
            });

        });
    };

    async function sendContent() {
        try {
            let imageData = await invertBeforeSend(canvas[0]);
            let resizedImageData = await resize(28, 28, imageData);
            $.ajax({
                url : AWS_LAMBDA,
                method : "post",
        		headers: {
        			"x-api-key": "{{KEY_COMES_HERE}}"
        		},
                dataType : "json",
                contentType : "application/json",
                data : JSON.stringify({
                    image : resizedImageData.src
                }),
                timeout : 3000
            }).then(function(data) {
                let { digit } = data;
                // Set the output here
                output.text(digit);
                recognisedState = true;
            }).fail(function() {
                connectionLost.show();
            });
        } catch (e) {
            console.error(e);
        };
    };

    function fadeInDescriptionContent() {
        instructionOverlayMessage.css({
            display : "flex"
        }).hide().fadeIn(400)
    };

    function fadeOutDescriptionContent() {
        instructionOverlayMessage.fadeOut(400);
    };


    input.on("mousedown", onMouseDown);
    input.on("touchstart", onMouseDown);

    input.on("mouseup", onMouseUp);
    input.on("touchend", onMouseUp);
    
    input.on("mouseleave", onMouseEnd);

    input.on("mousemove", onMouseMove);
    input.on("touchmove", onMouseMove);


    instructionOverlay.on("click", event => {
        event.stopPropagation();
    });
    
    instructionOverlayMessage.on("click", fadeOutDescriptionContent);
    closeButton.on("click", fadeOutDescriptionContent);
    recogniseButton.on("click", sendContent);
    resetButton.on("click", clearCanvas);
    expandDescriptionButton.on("click", fadeInDescriptionContent);

    setSize();
    $(window).resize(setSize);
    $(window).on("keydown", event => {
        if (event.keyCode === 27 || event.code === "Escape") {
            fadeOutDescriptionContent();
        }
    })
});
