const PI =  '3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679'
            '8214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196' +
            '4428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273' +
            '724587006606315588174881520920962829254091715364367892590360011330530548820466521384146951941511609' +
            '433057270365759591953092186117381932611793105118548074462379962749567351885752724891227938183011949' +
            '129833673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405' +
            '132000568127145263560827785771342757789609173637178721468440901224953430146549585371050792279689258' +
            '923542019956112129021960864034418159813629774771309960518707211349999998372978049951059731732816096' +
            '318595024459455346908302642522308253344685035261931188171010003137838752886587533208381420617177669' +
            '147303598253490428755468731159562863882353787593751957781857780532171226806613001927876611195909216' +
            '4201989';

const PI_length = PI.length - 2

class PiPackage {
    accepts(query) {

        if (query) {
            query = query ? query.toLowerCase() : "";
            return query.substring(0, 2) === "pi" || query.substring(query.length - 3, query - 1) === "pi"
        }

    }

    async render(query) {
        let decimal;
        try {
            decimal =
                /^(?:pi|π)?\s*(?:to|first)?\s*(?<decimal>\d+)\s*(?:(?:decimal|digit)s?)?\s*(?:of\s+(?:pi|π))?$/i.exec(query).groups.decimal;
        } catch (_) {
            decimal = 5;
        }

        if (decimal < 1 || decimal >= PI_length) return null;

        return new Promise(function (resolve, reject) {
            resolve ({
                html: `
                    <div class="text-2xl border-b border-black mb-2 font-bold">
                        PI
                    </div>
                    <div class="mb-2 font-bold">
                        ${PI.substring(0, decimal)}
                    </div>
                    <div style="opacity: .7;" class="font-bold">
                        Showing first ${decimal} digits of PI
                    </div>
                `,
                js: ``,
                css: ``
            })
        })
    }

    info() {
        return {
            title: "PI",
            description: "",
            author: "Mauro Baladés",
            version: "1.0.0",
        }
    }
}

module.exports.default = PiPackage;

