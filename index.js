
var express = require('express')
var cors = require('cors')
var app = express()

const PORT = process.env.PORT || 3000;
const packages = [
    require(`./packages/stopwatch.js`).default,
    require(`./packages/math.js`).default,
    require(`./packages/emoji.js`).default,
];

app.use(cors())
app.get('/', function (req, res) {
    let query = req.query.q;

    if (!query) {
        res.status(404).send("ERROR: Query parameter not inserted");
        return;
    }

    (async function() {
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

        res.status(404)
    })()
})

app.listen(PORT, function () {
    console.log(`Wonoly's search engine packages API listening on port ${PORT}`)
})
