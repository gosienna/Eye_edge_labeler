

//setup common variable
let file_name;
let width_capture_window = 200;
let height_capture_window = 200;
let raw_imgdata;
let captured_imgdata;
let mask_imgdata;
let width_original_img;
let height_original_img;
let width_img_display = 800; //set fixed width for display
let height_img_display; //modified height for display
let captured = false; //flap to indicate wheather image had been selected
let c = document.getElementById("raw_img")
let ctx = c.getContext('2d');
let captured_c = document.getElementById("captured_img")
let captured_ctx = captured_c.getContext('2d');
let mask_c= document.getElementById("edge_mask");
let mask_ctx = mask_c.getContext('2d');


//triger one: load sample eye image
let raw_img = new Image(); //create image variable as the input
raw_img.src="example_eye_img.jpg";
raw_img.onload = function(){
    width_original_img=this.naturalWidth;
    height_original_img = this.naturalHeight;
    height_img_display = width_img_display * height_original_img / width_original_img; //modified height for display
    //set the size of the image display canvas
    let c = document.getElementById("raw_img")
    let ctx = c.getContext('2d');
    c.width = width_img_display;
    c.height = height_img_display;
    ctx.drawImage(this,0,0,width_original_img,height_original_img,0,0,width_img_display,height_img_display);
    raw_imgdata=ctx.getImageData(0,0,c.width,c.height);

   
  }



//triger two: update image when user upload their own image
let inputElement=document.getElementById('load_img')
inputElement.onchange = function(event) {
                        //get file Filenam
                        processSelectedFiles(this)
                        //reload the img_original
                        raw_img.src = URL.createObjectURL(event.target.files[0]);
                        }

//function to get file name
function processSelectedFiles(fileInput) {
let files = fileInput.files;
file_name=files[0].name;

}

//capture eye: touch screen
c.addEventListener('touchmove', function(event){
    if(captured == false){ //check wheather captured window has been clicked
        let cRect = c.getBoundingClientRect()
        x = Math.round(event.touches[0].clientX - cRect.left)
        y = Math.round(event.touches[0].clientY - cRect.top)
        ctx.putImageData(raw_imgdata,0,0);
        ctx.beginPath();
        ctx.rect(x-width_capture_window/2, y-height_capture_window/2, width_capture_window, height_capture_window);
        ctx.strokeStyle = "#77f022";
        ctx.stroke();

        let s = width_original_img / width_img_display; //ratio between
        captured_ctx.drawImage(raw_img,x*s-s*width_capture_window/2,y*s-s*height_capture_window/2,s*width_capture_window,s*height_capture_window,0,0,512,512);
    }
});

//capture eye: mouse move
c.addEventListener('mousemove', function(event){
    if(captured == false){ //check wheather captured window has been clicked
        let cRect = c.getBoundingClientRect()
        x = Math.round(event.clientX - cRect.left)
        y = Math.round(event.clientY - cRect.top)
        ctx.putImageData(raw_imgdata,0,0);
        ctx.beginPath();
        ctx.rect(x-width_capture_window/2, y-height_capture_window/2, width_capture_window, height_capture_window);
        ctx.strokeStyle = "#77f022";
        ctx.stroke();

        let s = width_original_img / width_img_display; //ratio between
        captured_ctx.drawImage(raw_img,x*s-s*width_capture_window/2,y*s-s*height_capture_window/2,s*width_capture_window,s*height_capture_window,0,0,512,512);
    }
});


c.addEventListener('click', function(event){
    captured = true;
    captured_imgdata = captured_ctx.getImageData(0,0,captured_c.width,captured_c.height);
});
let old_x;
let old_y;

//fill the edge mask with black background
mask_ctx.fillStyle =  "black";
mask_ctx.fillRect(0, 0, 512, 512);
mask_imgdata = mask_ctx.getImageData(0,0,mask_c.width,mask_c.height);

captured_c.addEventListener("touchstart",function(event){
    let cRect = captured_c.getBoundingClientRect()
    old_x = Math.round(event.touches[0].clientX - cRect.left)
    old_y = Math.round(event.touches[0].clientY - cRect.top)
})

//draw edge: touch screen
captured_c.addEventListener('touchmove', function(event){

    let cRect = captured_c.getBoundingClientRect()
    x = Math.round(event.touches[0].clientX - cRect.left)
    y = Math.round(event.touches[0].clientY - cRect.top)
    //draw on captured image
    captured_ctx.putImageData(captured_imgdata,0,0);
    captured_ctx.beginPath();
    captured_ctx.moveTo(old_x , old_y);
    captured_ctx.lineTo(x,y);
    captured_ctx.closePath();
    captured_ctx.strokeStyle = "#77f022";
    captured_ctx.stroke();
    captured_imgdata = captured_ctx.getImageData(0,0,captured_c.width,captured_c.height);//update image

    //draw on edge mask
    //mask_ctx.putImageData(mask_imgdata,0,0);
    mask_ctx.beginPath();
    mask_ctx.moveTo(old_x , old_y);
    mask_ctx.lineTo(x,y);
    mask_ctx.closePath();
    mask_ctx.strokeStyle = "white";
    mask_ctx.stroke();
    mask_imgdata = mask_ctx.getImageData(0,0,mask_c.width,mask_c.height);//update image
    
    //update point location
    old_x = x;
    old_y = y;
});


//draw edge: mouse down and move

captured_c.addEventListener("mousedown",function(event){
    let cRect = captured_c.getBoundingClientRect()
    old_x = Math.round(event.clientX - cRect.left)
    old_y = Math.round(event.clientY - cRect.top)
})


function mouseMoveFunction(event) {
    let cRect = captured_c.getBoundingClientRect()
    x = Math.round(event.clientX - cRect.left)
    y = Math.round(event.clientY - cRect.top)
    //draw on captured image
    captured_ctx.putImageData(captured_imgdata,0,0);
    captured_ctx.beginPath();
    captured_ctx.moveTo(old_x , old_y);
    captured_ctx.lineTo(x,y);
    captured_ctx.closePath();
    captured_ctx.strokeStyle = "#77f022";
    captured_ctx.stroke();
    captured_imgdata = captured_ctx.getImageData(0,0,captured_c.width,captured_c.height);//update image

    //draw on edge mask
    //mask_ctx.putImageData(mask_imgdata,0,0);
    mask_ctx.beginPath();
    mask_ctx.moveTo(old_x , old_y);
    mask_ctx.lineTo(x,y);
    mask_ctx.closePath();
    mask_ctx.strokeStyle = "white";
    mask_ctx.stroke();
    mask_imgdata = mask_ctx.getImageData(0,0,mask_c.width,mask_c.height);//update image
    
    //update point location
    old_x = x;
    old_y = y;
}

captured_c.addEventListener("mousedown", function(e){ 
    this.addEventListener("mousemove", mouseMoveFunction);
});

captured_c.addEventListener("mouseup", function(e){
    this.removeEventListener("mousemove", mouseMoveFunction);
});




//other functions
function window_increase(){
    width_capture_window=width_capture_window*1.1;
    height_capture_window=height_capture_window*1.1;
}

function window_decrease(){
    width_capture_window=width_capture_window*0.9;
    height_capture_window=height_capture_window*0.9;
}

function redo_capture(){
    captured = false;
    //clear edge mask
    mask_ctx.fillStyle =  "black";
    mask_ctx.fillRect(0, 0, 512, 512);
    mask_imgdata = mask_ctx.getImageData(0,0,mask_c.width,mask_c.height);

}

function save(){
    let link = document.createElement('a');
    //download mask
    link.download = file_name+"_mask.png";
    link.href = mask_c.toDataURL()
    link.click();
    //download captured eye
    link.download = file_name+"_captured.png";
    link.href = captured_c.toDataURL()
    link.click();
    link.delete;
  }


//prevent the scrolling effect of touching 
function preventDefault(e){
    e.preventDefault();
}
function fix_page(){
    document.body.addEventListener('touchmove', preventDefault, { passive: false });
}

function free_page(){
    document.body.removeEventListener('touchmove', preventDefault, { passive: true });
}
