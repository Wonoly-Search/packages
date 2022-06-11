
var express = require('express')
var cors = require('cors')
var app = express()

const HTML_TEMPLATE = (query, answer) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Instant answers</title>

        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
        <form action="/test">
            <input type="text" name="q" class="border border-black p-1 m-2" value="${query}" placeholder="Enter your testing query">
            <button type="submit" class="border border-black p-1">Submit</button>
        </form>
        <div class="py-5 w-full bg-white border-b bg-gray-100 border-black flex" id="instant__answer__wrapper">
            <div class="stick_out_hover ml-40 w-690 border border-black p-5 rounded bg-white">
                ${answer?.html}
            </div>
        </div>
        <style>
            ${answer?.css}

            .button__primary,
            .stick_out_hover {
                transition: 0.2s;
            }
            
            .normal_result:hover {
                box-shadow: -0.5rem 0.5rem 0 rgba(0, 0, 0, 1) !important;
                transform: translate(0.5rem, -0.5rem);
            }
            
            .stick_out_hover:hover {
                box-shadow: -0.3rem 0.3rem 0 rgba(0, 0, 0, 1) !important;
                transform: translate(0.2rem, -0.2rem);
            }
            
            .button__primary:hover {
                box-shadow: -0.2rem 0.2rem 0 rgba(0, 0, 0, 1) !important;
                transform: translate(0.1rem, -0.1rem);
            }

            .w-690 {
                width: 690px;
            }
        </style>
        <script>
            ${answer?.js}
        </script>

        <div class="text-3xl font-bold mt-5 mx-5">Wonoly Package Testing Server</div>
    </body>
    </html>
`

const PORT = process.env.PORT || 3000;
const packages = [
    require(`./packages/beautifier.js`).default,
    require(`./packages/stopwatch.js`).default,
    require(`./packages/math.js`).default,
    require(`./packages/emoji.js`).default,
];

app.use(cors())
app.get('/', async function (req, res) {
    let query = req.query.q;

    if (!query) {
        res.status(404).send("ERROR: Query parameter not inserted");
        return;
    }

    for (const pkg of packages) {
        const pkg_instance = new pkg();

        if (pkg_instance.accepts(query)) {
            pkg_instance.render(query).then((data) => {
                res.json({
                    render: {...data},
                    info: pkg_instance.info()
                });

                res.end()
            })

            return;
        }
    }

    res.status(404).json({})
})

app.get('/test', async function (req, res) {
    let query = req.query.q;

    if (!query) {
        res.send(HTML_TEMPLATE(query))
        return;
    }

    for (const pkg of packages) {
        const pkg_instance = new pkg();

        if (pkg_instance.accepts(query)) {
            let r = await pkg_instance.render(query);
            if (typeof r !== "undefined") {
                res.send(HTML_TEMPLATE(query, r))
                res.end();
                return;
            }
        }
    }

    if (!(res.headersSent)) {
        res.send(HTML_TEMPLATE(query));
    }
})

app.listen(PORT, function () {
    console.log(`Wonoly's search engine packages API listening on port ${PORT}`)
})
