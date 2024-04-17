/** 
 * Инициализирует плеер Stories по заданным параметрам
 * 
 * @param {{
 * target: string,
 * slides: Array<{url: string, alt?: string}>,
 * delayPerSlide?: number
 * }} params - параметры инициализации:
 * 
 * 1. target - место инициализации плеер-а, css селектор
 * 2. slides - список слайдов плеер-а
 * 3. delayPerSlide - как долго отображается один слайд
 * 
 * @return {Element|null}
*/


function initPlayer(params) {
    const
        target = document.querySelector(params.target);

    if (target === null || params.slides === undefined) {
        return null;
    }

    let timeLineTimer;
    let
        timeLineChunks = '',
        playerChunks = '';

    let
        isFirst = true;

    for (const slide of params.slides) {
        timeLineChunks += generateTimeLineChunk(isFirst);
        playerChunks += generatePlayerChunk(slide, isFirst);
        isFirst = false;
    }

    target.innerHTML = generatePlayerLayout();

    target.querySelector('.player-chunk-prev').addEventListener('click', switchToPrevChunk);
    target.querySelector('.player-chunk-next').addEventListener('click', switchToNextChunk);
    
    
    
    runChunkSwitching(params.delayPerSlide || 1, 1);

    return target.querySelector('.player');
    
    function generateTimeLineChunk(isFirst) {
        return `<div class="timeline-chunk ${isFirst ? 'timeline-chunk-active' : ''}">
            <div class="timeline-chunk-inner"></div>
        </div>`
    }

    function generatePlayerChunk(slide, isFirst) {
        const style = [];

        if (slide.filter) {
            style.push(`filter: ${slide.filter.join('')}`);
        }

        return `
        <div class="player-chunk ${isFirst ? 'player-chunk-active' : ''}">
            <img src="${slide.url}" alt="${slide.alt || ''}" style="${style.join(';')}">
            ${generateOverLays(slide)}
        </div>`
    }

    function generateOverLays(slide) {
        if (slide.overlays === undefined) {
            return '';
        }

        let
            res = '';

        for (const el of slide.overlays) {
            const classes = el.classes !== undefined ? el.classes.join(' ') : '';

            const styles = (el.styles !== undefined ? Object.entries(el.styles) : [])
                .map((el) => el.join(':'))
                .join(';');

            res += `<div class="player-chunk-overLays ${classes}" style="${styles}">${renderOverLay(el)}</div>`;
        }

        return res;

        function renderOverLay(overLay) {
            if (overLay.type === 'text') {
                return overLay.value;
            }

            if (overLay.type === 'question') {
                return `
                <div class ="question">
                    ${overLay.question}
                
                    <div class="question-answer">
                        <button value="1">${overLay.variants[0] || 'Да'}</button>
                        <button value="2">${overLay.variants[1] || 'Нет'}</button>
                    </div>
                </div>`;
            }

            if (overLay.type === 'img') {
                return `<img src="${overLay.value}" alt="">`;
            }

            return '';
        }
    }

    function generatePlayerLayout() {
        return `
        <div class="player">
            <div class="timeline">${timeLineChunks}</div>

            <div class="player-content-wrapper">
                <div class="player-chunk-switcher player-chunk-prev"></div>
                <div class="player-chunk-switcher player-chunk-next"></div>

                <div class="player-content">${playerChunks}</div>
            </div>
        </div>`
    };

    function moveClass(className, method, pred) {
        const 
            active = target.querySelector('.' + className);
            next = active[method];

        if (pred && !pred(active)) {
            return null;
        }

        if (next) {
            active.classList.remove(className);
            next.classList.add(className);

            return active;
        }

        return null;
    }

    function switchToPrevChunk() {
        moveClass('player-chunk-active', 'previousElementSibling')
        moveClass('timeline-chunk-active', 'previousElementSibling', (el) => {
            const
                inner = el.querySelector('.timeline-chunk-inner'),
                w = parseFloat(inner.style.width) || 0;
        
            el.querySelector('.timeline-chunk-inner').style.width = '';
            return w <= 20;
        });
    }
    function switchToNextChunk() { 
        moveClass('player-chunk-active', 'nextElementSibling');

        const
            el = moveClass('timeline-chunk-active', 'nextElementSibling');
        if (el) {
            el.querySelector('.timeline-chunk-inner').style.width = '';
        }
    };

    function runChunkSwitching(time, step) {
        clearInterval(timeLineTimer)

        timeLineTimer = setInterval(() => {
            const 
                active = target.querySelector('.timeline-chunk-active').querySelector('.timeline-chunk-inner');
            
            const
                w = parseFloat(active.style.width) || 0;
        
            if (w === 100) {
                switchToNextChunk();
                return;
            }
        
            active.style.width = String(w + step) + '%';
        
        }, time * 1000 * step / 100);
    }

    
}
