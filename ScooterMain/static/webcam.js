var myVideoStream = document.getElementById('myVideo')     // make it a global variable
var myStoredInterval = 0


// const startRiding = () => {
//     getVideo()
//     takeAuto()
// }

function getVideo(){
  navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  navigator.getMedia({video: true, audio: false},

    function(stream) {
      myVideoStream.srcObject = stream
      myVideoStream.play();
  },

   function(error) {
     alert('webcam not working');
  });
}

function takeSnapshot() {
    console.log('사진 전송!')
    const myCanvasElement = document.getElementById('myCanvas');
    const myCTX = myCanvasElement.getContext('2d');
    myCTX.drawImage(myVideoStream, 0, 0, myCanvasElement.width, myCanvasElement.height);
}

function takeAuto() {
    takeSnapshot() // get snapshot right away then wait and repeat
    clearInterval(myStoredInterval)
    myStoredInterval = setInterval(function(){
       takeSnapshot()
        const $canvas = document.getElementById('myCanvas');
        console.log($canvas)
        const imgDataUrl = $canvas.toDataURL('image/png');

        const blobBin = atob(imgDataUrl.split(',')[1]);	// base64 데이터 디코딩
        const array = [];
        for (let i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
        }
        const file = new Blob([new Uint8Array(array)], {type: 'image/png'});	// Blob 생성
        const formdata = new FormData();	// formData 생성
        formdata.append("file", file);	// file data 추가
        $.ajax({
            type : 'post',
            url : '/ride',
            data : formdata,
            processData : false,	// data 파라미터 강제 string 변환 방지!!
            contentType : false,	// application/x-www-form-urlencoded; 방지!!
            success : function (data) {
                console.log(data)
                if (data.available === "0") {
                    exitRiding2()
                }
            },
        })
   }, 5000);
}

function exitRiding2() {
    alert('탑승 종료')
    location.href = "/"
}
