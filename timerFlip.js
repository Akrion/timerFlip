ko.extenders.timerFlip = function (target, params) {
    var intervalId     = 0,
        seconds        = 0,
        currentSeconds = 0,
        loop           = null,
        currentLoop    = 0,
        onLoopFn       = null,
        onLoopFnParams = null;

    if(_.isObject(params)){
        seconds        = params.seconds;
        loop           = params.loop;
        onLoopFn       = params.onLoopFn;
        onLoopFnParams = params.onLoopFnParams;
    }
    else
        seconds = params;       

    target.tickerCounter = ko.observable(seconds);
    target.tickerRunning = ko.observable(false);
    target.tickerOn = function(){
        target.tickerRunning(true);
        target.tickerCounter(seconds);
        currentSeconds = seconds;
        currentLoop    = loop;
        intervalId = window.setInterval(timerTick, seconds * 100);
    };
    target.tickerOff = function(){
        window.clearInterval(intervalId);
        target.tickerCounter(0); 
        target.tickerRunning(false);
    };

    function timerTick() {
        currentSeconds--;
        if(currentSeconds !== 0){
            target.tickerCounter(currentSeconds);
        }
        else {
            if((loop === 0 || currentLoop !== 0)){   
                if(loop !== 0)
                    currentLoop--;

                if(_.isFunction(onLoopFn)){
                    onLoopFn(onLoopFnParams ? onLoopFnParams : null);
                }
                currentSeconds = seconds;
                target.tickerCounter(currentSeconds);                

                if(loop !== 0 && currentLoop === 0)
                    target.tickerOff();               
            }
            else
                target.tickerOff();
        }
    }
    return target;
};
