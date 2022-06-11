// note: this button class does not have an ending ".
// this is because we need to apply styles to cerain buttons

const queries_html = [
    "html beautifier",
    "html prettier",

    "beautify html",
    "prettify html",
]

const queries_css = [
    "css beautifier",
    "css prettier",

    "beautify css",
    "prettify css",
]

const queries_js = [
    "js beautifier",
    "js prettier",
    "javascript beautifier",
    "javascript prettier",

    "beautify js",
    "prettify js",

    "beautify javascript",
    "prettify javascript",
]

class BeautifierPackage {
    type;

    accepts(query) {
        if (query) {
            query = query ? query.toLowerCase() : "";

            if (queries_html.indexOf(query) != -1) {
                this.type = "html";
                return true;
            } else if (queries_css.indexOf(query) != -1) {
                this.type = "html";
                return true;
            } else if (queries_css.indexOf(query) != -1) {
                this.type = "js";
                return true;
            }
        }
        return false;

    }

    async render(query) {
        let type = this.type;
        return new Promise(function (resolve, reject) {
            resolve ({
                html: `
                    <div id="wonoly__package__beautifier__wrapper" class="flex">
                        <div class="w-1/2 h-full p-2 border border-black rounded mr-1">
                            <div class="font-bold text-xl border-b border-black">
                                ${type}
                            </div>
                            <textarea onChange="prettify(event)" class="resize-none	w-full h-52 focus:outline-0 focus:border-none my-2"></textarea>
                        </div>
                        <div class="w-1/2 h-full p-2 border border-black rounded ml-1">
                            <div class="font-bold text-xl border-b border-black">
                                Beautified
                            </div>
                            <textarea readonly id="wonoly__package__beautifier__output" class="resize-none w-full h-52 focus:outline-0 focus:border-none my-2"></textarea>
                        </div>
                    </div>
                `,
                js: `
                    /* js beautifier OWNS THIS CODE */

                    let beautifier_scripts = [
                        "https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.3/beautifier.min.js",
                        "https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.3/beautify-css.min.js",
                        "https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.3/beautify-html.min.js",
                    ]

                    for (let i = 0; i < beautifier_scripts.length; i++) {
                        var script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.src = beautifier_scripts[i];
    
                        document.head.appendChild(script);
                    }

                    /* END OF BEAWTIFIER */

                    function prettify(event) {
                        let value = event.target.value;

                        ${type === "html" ? `
                            document.getElementById("wonoly__package__beautifier__output").value = html_beautify(value);
                        `
                        : type === "js" ? `
                            document.getElementById("wonoly__package__beautifier__output").value = js_beautify(value);
                        `
                        : type === "css"? `
                            document.getElementById("wonoly__package__beautifier__output").value = css_beautify(value);
                        `
                        : ``}
                    }
                `,
                css: ``
            })
        })
    }

    info() {
        return {
            title: "Beautifier",
            description: "Beautify HTML, CSS and JavaScript",
            author: "Mauro Baladés",
            version: "1.0.0",
        }
    }
}

module.exports.default = BeautifierPackage;
