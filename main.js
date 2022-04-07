

//setup common variable
let width_capture_window = 200;
let height_capture_window = 200;
let raw_imgdata;
let captured_imgdata;
let width_original_img;
let height_original_img;
let width_img_display = 800; //set fixed width for display
let height_img_display; //modified height for display
let captured = false; //flap to indicate wheather image had been selected



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
inputElement.onchange = function() {
                        //get file Filenam
                        processSelectedFiles(this)
                        //reload the img_original
                        img_original.src = URL.createObjectURL(event.target.files[0]);
                        }

//function to get file name
function processSelectedFiles(fileInput) {
var files = fileInput.files;
file_name=files[0].name;

}

//set up eventlistener to set up capture window size
let c = document.getElementById("raw_img")
c.addEventListener('touchmove', function(event){
    if(captured == false){ //check wheather captured window has been clicked
        let c = document.getElementById("raw_img")
        let ctx = c.getContext('2d');
        let cRect = c.getBoundingClientRect()
        x = Math.round(event.touches[0].clientX - cRect.left)
        y = Math.round(event.touches[0].clientY - cRect.top)
        ctx.putImageData(raw_imgdata,0,0);
        ctx.beginPath();
        ctx.rect(x-width_capture_window/2, y-height_capture_window/2, width_capture_window, height_capture_window);
        ctx.strokeStyle = "#77f022";
        ctx.stroke();

        let s = width_original_img / width_img_display; //ratio between
        let captured_c = document.getElementById("captured_img")
        let captured_ctx = captured_c.getContext('2d');
        captured_ctx.drawImage(raw_img,x*s-s*width_capture_window/2,y*s-s*height_capture_window/2,s*width_capture_window,s*height_capture_window,0,0,512,512);
    }
});

c.addEventListener('click', function(event){
    captured = true;
    let captured_c = document.getElementById("captured_img")
    let captured_ctx = captured_c.getContext('2d');
    captured_imgdata = captured_ctx.getImageData(0,0,captured_c.width,captured_c.height);
});

//set up eventlistener to capture touch screen location

let captured_c = document.getElementById("captured_img")
captured_c.addEventListener('touchmove', function(event){

    let cRect = captured_c.getBoundingClientRect()
    x = Math.round(event.touches[0].clientX - cRect.left)
    y = Math.round(event.touches[0].clientY - cRect.top)
    let captured_ctx = captured_c.getContext('2d');
    captured_ctx.putImageData(captured_imgdata,0,0);
    captured_ctx.moveTo(x,y);
    captured_ctx.lineTo(x+10+2,y+10-2);
    captured_ctx.lineTo(x+10-2,y+10+2);
    captured_ctx.fillStyle = "#77f022";
    captured_ctx.fill();
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
