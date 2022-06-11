// note: this button class does not have an ending ".
// this is because we need to apply styles to cerain buttons
const BUTTON_CLASS = `style="width: -webkit-fill-available !important;" class="flex items-center justify-center button__primary border border-black hover:border-black hover:bg-gray-50 rounded px-4 py-2 mr-2 mt-2 cursor-pointer ml-[-0.3rem] flex font-bold text-black items-center justify-between`;

class StopWatchPackage {
    accepts(query) {
        if (query) {
            query = query ? query.toLowerCase() : "";

            // TODO: check for timer
            if (query === "stop watch" || query === "stopwatch") {
                this.isStopwatch = true;
                return true;
            } else if (query === "timer") {
                this.isStopwatch = false;
                return true;
            }
        }
        return false;

    }

    async render(query) {
        return new Promise(function (resolve, reject) {
            resolve ({
                html: `
                    <div id="wonoly__package__stopwatch__wrapper">
                        <div class="text-3xl font-bold">
                            <span id="wonoly__package__stopwatch__display">0s</span>
                        </div>
                        <div class="border-t border-black pt-5 flex items-center">
                            <button id="wonoly__package__stopwatch__start" onClick='start()' ${BUTTON_CLASS + '"'}>
                                Start
                            </button>
                            <button id="wonoly__package__stopwatch__pause" onClick='pause()' ${BUTTON_CLASS + " hidden\""}>
                                Pause
                            </button>
                            <button onClick='reset()' ${BUTTON_CLASS + " ml-2\""}>
                                Reset
                            </button>
                        </div>
                    </div>
                `,
                js: `
                    function timeToString(time) {
                        let diffInHrs = time / 3600000;
                        let hh = Math.floor(diffInHrs);

                        let diffInMin = (diffInHrs - hh) * 60;
                        let mm = Math.floor(diffInMin);

                        let diffInSec = (diffInMin - mm) * 60;
                        let ss = Math.floor(diffInSec);

                        let diffInMs = (diffInSec - ss) * 100;
                        let ms = Math.floor(diffInMs);

                        // TODO: add hours?
                        let formattedMM = mm.toString().padStart(2, "0");
                        let formattedSS = ss.toString().padStart(2, "0");
                        let formattedMS = ms.toString().padStart(2, "0");

                        return mm == 0 ?
                            \`\${formattedSS}s \${formattedMS}ms\` :
                            \`\${formattedMM}m \${formattedSS}s \${formattedMS}ms\` ;
                            ;
                    }

                    let startTime;
                    let elapsedTime = 0;
                    let timerInterval;

                    function display(txt) {
                        document.getElementById("wonoly__package__stopwatch__display").innerHTML = txt;
                    }

                    function start() {
                        document.getElementById("wonoly__package__stopwatch__start").classList.add("hidden");
                        document.getElementById("wonoly__package__stopwatch__pause").classList.remove("hidden");

                        startTime = Date.now() - elapsedTime;
                        timerInterval = setInterval(function printTime() {
                        elapsedTime = Date.now() - startTime;
                        display(timeToString(elapsedTime));
                        }, 10);
                    }

                    function pause() {
                        document.getElementById("wonoly__package__stopwatch__pause").classList.add("hidden");
                        document.getElementById("wonoly__package__stopwatch__start").classList.remove("hidden");

                        clearInterval(timerInterval);
                    }

                    function reset() {
                        document.getElementById("wonoly__package__stopwatch__pause").classList.add("hidden");
                        document.getElementById("wonoly__package__stopwatch__start").classList.remove("hidden");

                        clearInterval(timerInterval);
                        display("00:00:00");
                        elapsedTime = 0;
                    }
                `,
                css: ``
            })
        })
    }

    info() {
        return {
            title: "Stopwatch",
            description: "Simple, easy to use stopwatch",
            author: "Mauro Baladés",
            version: "1.0.0",
        }
    }
}

module.exports.default = StopWatchPackage;
