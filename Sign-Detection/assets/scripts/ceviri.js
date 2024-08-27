import * as mainjs from '/assets/scripts/main.js'


const list = [
    {
        text: 'nasılsın',
        file: 'how-are-you-signtime.mp4'
    },
    {
        text: 'üzgünüm',
        file: 'sorry-sign-language.mp4'
    },
    {
        text: 'lütfen',
        file: 'please-sign-language.mp4'
    },
    {
        text: 'seni seviyorum',
        file: 'i-love-you-sign-language.mp4'
    },
    {
        text: 'evet',
        file: 'yes-sign.mp4'
    },
    {
        text: 'hayır',
        file: 'no-sign-language.mp4'
    },
    {
        text: 'anladım',
        file: 'understand-signtime.mp4'
    }
]

$(async () => {
    // let stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    //START SES KAYDETME
    // const audioRecorder = new MediaRecorder(stream);
    const microphone = $("#microphone");
    const microphoneText = $("#text-microphone");
    const video = $('#video')[0]
    video.onplay = function () {
        if (loopList && loopList.length > 0) {
            let htmlText = ''
            const wordList = allText.split(' ')
            wordList.forEach(word => {
                if (word.toLocaleLowerCase('tr') === loopList[0].text.toLocaleLowerCase('tr')) {
                    htmlText += ` <b>${word}</b>`
                }
                else {
                    htmlText += ' ' + word
                }
            });


            $("#all-text").html(htmlText);
            loopList = loopList.splice(1, loopList.length);
        }
    };
    video.onended = function () {
        if (loopList && loopList.length > 0) {
            let source = $('<source>')
            source.attr('src', 'assets/signs/' + loopList[0].file)
            $(video).html(source);
            video.load();
            video.play();
        }
    };
    // let audioChunks = [];

    // audioRecorder.addEventListener("dataavailable", event => {
    //     audioChunks.push(event.data);
    //     console.log('test');
    // });
    // audioRecorder.addEventListener("stop", event => {
    //     const audioBlob = new Blob(audioChunks);
    //     const audioUrl = URL.createObjectURL(audioBlob);
    //     const audio = new Audio(audioUrl);
    //     audio.play();
    //     audioChunks = [];
    // });

    //END SES KAYDETME

    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR'
    recognition.interimResults = true;

    let allText = '';
    let isRecord = false;
    let loopList = [];
    microphone.click(() => {
        if (isRecord) {
            recognition.stop();
        }
        else {
            recognition.start();
        }
    })

    recognition.addEventListener('result', e => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('')

        allText = transcript.toLocaleLowerCase('tr');
    })

    recognition.addEventListener('start', () => {
        isRecord = true;
        microphone.addClass('btn-danger');
        microphone.removeClass('btn-success');
        microphoneText.text("")
    });

    recognition.addEventListener('end', () => {
        isRecord = false;
        microphone.removeClass('btn-danger');
        microphone.addClass('btn-success');
        microphoneText.text("")
        $("#all-text").text(allText);

        let words = allText.split(' ');

        loopList = [];
        for (const key in words) {

            let word = list.find(m => m.text.toLocaleLowerCase('tr') === words[key].toLocaleLowerCase('tr'))
            if (word) {
                loopList.push(word)
            }

        }

        if (loopList && loopList.length > 0) {
            let source = $('<source>')
            source.attr('src', 'assets/signs/' + loopList[0].file)
            $(video).html(source);

            video.load();
            video.play();
        }


    });

})
