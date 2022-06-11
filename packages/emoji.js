const emojiRegex = require('emoji-regex');

const { EmojiAPI } = require("emoji-api");
const emoji_data = new EmojiAPI();

class EmojiPackage {
    accepts(query) {
        const regex = emojiRegex();
        if (query.match(regex)) {
          return true;
        }
        return false;

    }

    async render(query) {
        const regex = emojiRegex();
        // get only emoji from the query
        const emoji = query.match(regex)[0];

        const emoji_details = await emoji_data.get(emoji).catch(error => ({error}));

        if (
          !(
            emoji_details.emoji &&
            emoji_details.name &&
            emoji_details.unicode &&
            emoji_details.description &&
            emoji_details.images
          )
        ) {
          return null;
        }
      
        const vendorList = ["Apple", "Microsoft", "Google", "Twitter", "Facebook", "Messenger"];
      
        let images_list = emoji_details.images.filter((data) => {
          if (data.url && data.vendor) return data;
        });

        return new Promise(function (resolve, reject) {
            return resolve ({
                html: `
                    <div id="wonoly__package__emoji__wrapper">
                        <div>
                            ${
                                emoji_details.emoji && emoji_details.name
                                    ? `
                                        <h2 style="font-size: 22px;">${emoji_details.emoji} ${emoji_details.name} ${emoji_details.unicode ? `(${emoji_details.unicode})` : ``}</h2>
                                        `
                                    : ``
                            }
                            ${
                                emoji_details.description &&
                                `<p class="border-b border-black pb-2 mt-2">${emoji_details.description}</p>`
                            }
                            ${
                                images_list &&
                                `<div style="margin-top: 20px;" class="flex justify-between">${images_list
                                    .map((image, index) =>
                                    image.url && image.vendor && vendorList.includes(image.vendor)
                                        ? `<div key="${index}" class="mx-2 flex items-center justify-center flex-col">
                                                <img class="emoji-image" src=${image.url} alt=${image.vendor}  width="30" height="40">
                                                <figcaption class="img-caption">${image.vendor}</figcaption>
                                            </div>`
                                        : ``
                                    )
                                    .join("")}
                                </div>`
                            }
                        </div>
                    </div>
                `,
                js: ``,
                css: ``
            })
        })
    }

    info() {
        return {
            title: "Emoji Information",
            description: "An emoji reference dialog which documents the meaning and common usage of an emoji with preview images of different social media.",
            author: "Mauro Baladés",
            version: "1.0.0",
        }
    }
}

module.exports.default = EmojiPackage;
