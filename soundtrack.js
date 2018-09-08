$(function () {
    var audioPlaying = false
    let audio = $("<AUDIO>");
    audio.attr("src", "./Mariachi.mp3")
    $(document).hover(function () {
        if (audioPlaying === false) {
            audioPlaying = true
            audio[0].play()
        }
        // else{
        //     audioPlaying=false
        //     audio[0].pause()
        // }
    })
})