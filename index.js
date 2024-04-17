initPlayer({
    target: '.my-player',
    slides: [
        {
            url: 'img/1644933261_71-kartinkin-net-p-kartinki-milikh-kotikov-79.jpg',
            alt: 'slide1',

            filter: ['contrast(110%)', 'blur(2px)'],

            overlays: [
                {
                    type: 'text',
                    value: 'привет',

                    classes: ['watercolor'],

                    styles: {
                        color: 'orange',
                        'font-size': '24px',
                    
                        top: '60%',
                        left: '30%',

                        'transform': 'rotate(-10deg)'
                    }
                },

                {
                    type: 'question',
                    question: 'работает?',

                    variants: [
                        'Да',
                        'Нет'
                    ],

                    styles: {
                        top: '20%',
                        left: '10%',
                    }
                }
            ]
        },


        {url: 'img/cat-animals-1268723.jpg'},
        {url: 'img/cat-animals-1268723.jpg'},
    ],
    delayPerSlide: 5
});