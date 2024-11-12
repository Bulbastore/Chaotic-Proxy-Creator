import { parseTextArea, parseLine } from './parseTextArea.js';

import { loadAssets, mc_regex } from './gatherAssets.js';



let common_config = {};

let type_config = {};



/** Create the Canvas

 * @type {HTMLCanvasElement}

 */

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;



const scale = 2; // use 1 for the standard 250 x 350 card size

let height = 0, width = 0;



/**

 * This provides a device scaling wrapping to the context draw image 

 * @type {(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number) => void} 

 */

function drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh) {

    ctx.drawImage(image, 

        sx, 

        sy, 

        sw,  

        sh,  

        dx * scale, 

        dy * scale, 

        dw * scale, 

        dh * scale

    );

}



/**

 * @type {(text: string, x: number, y: number, maxWidth?: number) => void}

 */

function fillText(text, x, y, maxWidth) {

    if (maxWidth !== undefined) {

        ctx.fillText(text, x * scale, y * scale, maxWidth * scale);

    }

    else {

        ctx.fillText(text, x * scale, y * scale);

    }

}



/**

 * @type {(text: string, x: number, y: number, maxWidth?: number) => void}

 */

function strokeText(text, x, y, maxWidth) {

    if (maxWidth !== undefined) {

        ctx.strokeText(text, x * scale, y * scale, maxWidth * scale);

    }

    else {

        ctx.strokeText(text, x * scale, y * scale);

    }

}



function setFont(size, style, weight) {

    ctx.font = `${weight ? `${weight} ` : ''}${size * scale}px ${style}`;

}



function setCanvas(x, y) {

    width = x;

    height = y;

    canvas.width = width * scale;

    canvas.height = height * scale;

    canvas.style.width = width + 'px';

    canvas.style.height = height + 'px';

}



// Placeholder cardback to show that canvas has been drawn

(() => {

    setCanvas(250, 350);

    const cardback = new Image();

    cardback.onload = (() => {

        drawImage(cardback,

            0, 0, cardback.width, cardback.height,

            0, 0, width, height

        );

    });

    cardback.src = "img/cardback.png";

})();



export function setDownload(el) {

    const image = canvas.toDataURL("image/jpg");

    let name = "chaotic_card.jpg";

    if (common_config.name) {

        name = common_config.name;

        if (common_config.subname) {

            name += `, ${common_config.subname}`;

        }

    }



    el.download = name;

    el.href = image;

}



export function updateCommonConfig(key, value) {

    common_config[key] = value;

}



export async function createCard() {

    console.log("Starting createCard function");

    

    // Reset the old checkboxes values

    (["unique", "legendary", "loyal"]).forEach((value) => {

        delete common_config[value];

    });



    console.log("Gathering form data...");

    // Gather common form data

    const commonFields = [

        'type', 'tribe', 'name', 'subname', 'set', 'rarity', 'subtype',

        'ability', 'flavor', 'artist', 'art'

    ];



    commonFields.forEach(field => {

        const element = document.getElementById(field);

        if (element) {

            common_config[field] = element.value;

        }

    });

    console.log("Common config:", common_config);



    // Handle checkboxes

    ['unique', 'legendary', 'loyal'].forEach(field => {

        const element = document.getElementById(field);

        if (element && element.checked) {

            common_config[field] = true;

        }

    });



    // Handle loyal restriction

    if (common_config.loyal) {

        const loyalRestrict = document.getElementById('loyal_restrict');

        if (loyalRestrict) {

            common_config.loyal_restrict = loyalRestrict.value;

        }

    }



    // Reset type config

    type_config = {};



    // Handle stats for creatures

    if (common_config.type === 'creature') {

        ['energy', 'courage', 'power', 'wisdom', 'speed', 'mc'].forEach(stat => {

            const element = document.getElementById(stat);

            if (element) {

                type_config[stat] = element.value;

            }

        });

    }



    // Handle elements

    ['fire', 'air', 'earth', 'water'].forEach(element => {

        const checkbox = document.getElementById(element);

        if (checkbox && checkbox.checked) {

            type_config[element] = true;

        }

    });



    console.log("About to load assets...");

    console.log("Type config:", type_config);

    

    // Load assets and draw

    const assets = await loadAssets(common_config, type_config);

    console.log("Loaded assets:", assets);

    

    console.log("About to draw card...");

    drawCard(assets);

    console.log("Card drawn");



    return Promise.resolve();

}



function setDropShadow(blur = 0, offsetX = 0, offsetY = 0, color = "black") {

    ctx.shadowBlur = blur;

    ctx.shadowOffsetX = offsetX;

    ctx.shadowOffsetY = offsetY;

    ctx.shadowColor = color;

}



function drawCard(assets) {

    console.log("Drawing card with assets:", assets);

    console.log("Current config:", common_config);

    

    // Resets the canvas to prepare for redraw

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setDropShadow();



    if (common_config.type == "location") {

        setCanvas(350, 250);

        

        if (assets.art) {

            drawImage(assets.art,

                0, 0, assets.art.width, assets.art.height,

                35, 34, 306, 137

            );

        }



        if (assets.template) {

            drawImage(assets.template,

                0, 0, assets.template.width, assets.template.height,

                0, 0, width, height

            );

        }



        if (assets.symbol) {

            drawImage(assets.symbol,

                0, 0, assets.symbol.width, assets.symbol.height,

                width - 30, 8, 20, 20

            );

        }

    } else {

        setCanvas(250, 350);



        if (assets.art) {

            if (common_config.type == "mugic") {

                drawImage(assets.art, 

                    0, 0, assets.art.width, assets.art.height,

                    0 , 0, 250, 350);

            } else {

                drawImage(assets.art, 

                    0, 0, assets.art.width, assets.art.height,

                    10.26, 25.3, 228.94, 191.9

                );

            }

        }



        if (assets.template) {

            drawImage(assets.template,

                0, 0, assets.template.width, assets.template.height,

                0, 0, width, height

            );

        }

        if (assets.symbol) {

            drawImage(assets.symbol,

                0, 0, assets.symbol.width, assets.symbol.height,

                width - 34, 10, 20, 20

            );

        }

    }



    // Name and subname

    if (common_config.name) { 

        const name = common_config.upper ? common_config.name.toUpperCase() : common_config.name;

        const offsetX = width / 2 + (common_config.type === "location" ? 4 : 2);

        const maxWidth = common_config.type === "location" ? 272 : 170;



        ctx.fillStyle = "#fff";

        ctx.textAlign = 'center';

        ctx.strokeStyle = "#696969";

        ctx.lineWidth = .5;



        if (common_config.subname) {

            const subname = common_config.upper ? common_config.subname.toUpperCase() : common_config.subname;

            setFont(11.5, 'Eurostile-BoldExtendedTwo');

            setDropShadow(3, 2, 2);

            fillText(name, offsetX, 18, maxWidth);

            setDropShadow();

            strokeText(name, offsetX , 18, maxWidth);

            

            setFont(7, 'Eurostile-BoldExtendedTwo');

            setDropShadow(2, 1, 1);

            fillText(subname, offsetX, 27, maxWidth);

            setDropShadow();

            strokeText(subname, offsetX, 27, maxWidth);

        } else {

            setFont(11.5, 'Eurostile-BoldExtendedTwo', "Bold");

            setDropShadow(3, 2, 2);

            fillText(name, offsetX, 23, maxWidth);

            setDropShadow();

            strokeText(name, offsetX, 23, maxWidth);

        }



        ctx.lineWidth = 1;

        ctx.strokeStyle = "#fff";

    }



    switch (common_config.type) {

        case 'attack':

            drawAttack(assets);

            break;

        case 'battlegear':

            drawBattlegear(assets);

            break;

        case 'creature':

            drawCreature(assets);

            break;

        case 'location':

            drawLocation(assets);

            break;

        case 'mugic':

            drawMugic(assets);

    }

}



const linespace = 10;



function drawTextArea(assets, offsetX, offsetY, maxX, maxY) {

    console.log("Drawing text area with:");

    console.log("- Offset:", { x: offsetX, y: offsetY });

    console.log("- Max dimensions:", { x: maxX, y: maxY });

    console.log("- Text content:", {

        ability: common_config.ability,

        flavor: common_config.flavor,

        artist: common_config.artist

    });

    

    setDropShadow();

     

    let flavorHeight = 0;

    let sections = [];

    let ull = "";



    ctx.textBaseline = "top";



    if (common_config.flavor) {

        setFont(9, 'Arial', 'italic');

        ctx.fillStyle = '#FFFFFF';  // Changed to white

        ctx.textAlign = 'left';



        const { lines } = parseTextArea(ctx, common_config.flavor, maxX, scale, false)

            .reduce((p, c) => ({ lines: [...p.lines, ...c.lines], icons : [] }));



        flavorHeight = ((lines.length) * linespace);



        const flavorTop = (offsetY + maxY) - flavorHeight;

        lines.forEach((line, i) => {

            fillText(line, offsetX, flavorTop + (i * linespace));

        });

    }



    if (common_config.unique || common_config.loyal || common_config.legendary) {

        const { unique, loyal, legendary, loyal_restrict } = common_config;

        

        if (legendary) {

            ull = "Legendary";

            if (loyal) {

                ull += ", ";

            }

        }

        else if (unique) {

            ull = "Unique";

            if (loyal) {

                ull += ", ";

            }

        }



        if (loyal) {

            ull += "Loyal";

            if (loyal_restrict) {

                ull += ` - ${loyal_restrict}`;

            }

        }

    }



    if (common_config.ability) {

        if (common_config.type == "location") {

            setFont(8.5, 'Arial', 'bold');

        }

        else {

            setFont(10.3, 'Arial');

        }

        sections = parseTextArea(ctx, common_config.ability, maxX, scale);

    }

    

    if (sections.length > 0 || ull != "") {

        let textSpace = 0;

        if (ull != "") {

            textSpace += linespace + 2;

        }

        if (sections.length > 0) {

            sections.forEach(({ lines }) => {

                textSpace += linespace * lines.length;

                if (lines.includes("bw_bar")) {

                    textSpace += 14 - linespace;

                }

            });

        }



        const total_sections = sections.length + (ull != "" ? 1 : 0);

        let space = (((maxY - flavorHeight) - textSpace) / ( 1 + total_sections)); 

        if (space < 0) space = 0;



        if (common_config.type == "location") {

            setFont(8.5, 'Arial', 'bold');

        }

        else {

            setFont(10.3, 'Arial');

        }

        ctx.fillStyle = '#FFFFFF';  // Changed to white

        ctx.textAlign = 'left';



        let lineOffset = drawIconText(assets, sections, offsetX, offsetY, space);



        setFont(10, 'Arial', 'bold');

        ctx.fillStyle = '#FFFFFF';  // Changed to white

        ctx.textAlign = 'left';



        if (ull != "") {

            lineOffset += space;

            fillText(ull, offsetX, lineOffset);

        }

    }



    ctx.textBaseline = "alphabetic";

}



function drawIconText(assets, sections, offsetX, offsetY, space = 0) {

    const drawQueue = [];

    let lineOffset = offsetY;

    let brainwashed = NaN;



    sections.forEach(({ lines, icons }) => {

        lineOffset += space;

        for (let i = 0; i < lines.length; i++) {

            const line = lines[i];

            let line_icons = icons.filter(icon => (icon.line === i));

            if (line == "" && line_icons.length == 0) continue;



            if (line != "") {

                if (line === "bw_bar") {

                    if (Object.prototype.hasOwnProperty.call(assets, "bw_bar")) {

                        const asset = assets["bw_bar"];

                        drawQueue.push(drawImage.bind(this, asset, 

                            0, 0, asset.width, asset.height,

                            offsetX, lineOffset, 172, 14

                        ));

                    }

                    lineOffset += 14;

                    brainwashed = lineOffset;

                    continue;

                } 

                else {

                    drawQueue.push(fillText.bind(this, line, offsetX, lineOffset));

                }

            }

            line_icons.forEach((icon) => {

                if (Object.prototype.hasOwnProperty.call(assets, icon.icon)) {

                    const asset = assets[icon.icon];

                    drawQueue.push(drawImage.bind(this, asset, 

                        0, 0, 0, asset.width, asset.height,

                        offsetX + icon.offset + .5, lineOffset - 1, 12, 12

                    ));

                }

            });

            lineOffset += linespace;

        }

    });



    if (!Number.isNaN(brainwashed)) {

        const fillStyle = ctx.fillStyle;

        ctx.fillStyle = "rgb(220 221 223 / 90%)";

        ctx.beginPath();

        ctx.roundRect(

            offsetX * scale, brainwashed * scale, 

            172 * scale, (lineOffset - brainwashed + space) * scale, 

            [0, 0, 3, 3]

        );

        ctx.fill();

        ctx.fillStyle = fillStyle;

    }



    drawQueue.forEach((draw) => draw());



    return lineOffset;

}



function artistLine(offsetX, offsetY) {

    if (common_config.artist) {

        setDropShadow();

        if (common_config.type == "location") {

            setFont(6.75, 'Arial', 'bold');

        }

        else {

            setFont(8, 'Arial', 'bold');

        }

        ctx.fillStyle = '#FFFFFF';  // Changed to white

        ctx.textAlign = 'left';  



        fillText(`Art: ${common_config.artist}`, offsetX, offsetY);

    }

}



function typeLine(type, offsetX, offsetY) {

    setFont(7.5, 'Eurostile-Bold', 'italic');

    ctx.fillStyle = '#ffffff';

    ctx.textAlign = 'left';

    ctx.shadowBlur = .1;

    ctx.shadowOffsetX = .5;

    ctx.shadowOffsetY = .5;

    ctx.shadowColor = "#696969";



    const tribe = (() => {

        if (!type_config.tribe) return "";

        switch (type_config.tribe.toLowerCase()) {

            case "danian": return " Danian";

            case "overworld": return " OverWorld";

            case "mipedian": return " Mipedian";

            case "underworld": return " UnderWorld";

            case "m'arrillian": return " M'arrillian";

            default: return "";

        }

    })();



    if (common_config.past || common_config.subtype || tribe) {

        type += " -";

    }

    if (common_config.past) {

        type += " Past";

    }

    if (tribe) {

        type += tribe;

    }

    if (common_config.subtype) {

        type += ` ${common_config.subtype}`;

    }

    

    fillText(type, offsetX, offsetY);

}



function drawAttack(assets) {

    setDropShadow();



    if (assets.fireattack) {

        drawImage(assets.fireattack, 

            0, 0, assets.fireattack.width, assets.fireattack.height,

            0, 0, width, height

        );

    }

    if (assets.airattack) {

        drawImage(assets.airattack, 

            0, 0, assets.airattack.width, assets.airattack.height,

            0, 0, width, height

        );

    }

    if (assets.earthattack) {

        drawImage(assets.earthattack, 

            0, 0, assets.earthattack.width, assets.earthattack.height,

            0, 0, width, height

        );

    }

    if (assets.waterattack) {

        drawImage(assets.waterattack, 

            0, 0, assets.waterattack.width, assets.waterattack.height,

            -1, -1, width, height

        );

    }



    /* Build Points */

    setFont(18, 'Arial', 'bold');

    ctx.textAlign = 'center';

    ctx.fillStyle = '#000000';



    if (type_config.bp) {

        fillText(type_config.bp, 20, 25);    

    }



    /* Element damage values */

    setFont(10, 'Eurostile-BoldExtendedTwo', 'bold');

    ctx.fillStyle = '#000000';

    ctx.textAlign = 'center';



    if (type_config.firedamage) {

        fillText(type_config.firedamage, 96, 242);

    }



    if (type_config.airdamage) {

        fillText(type_config.airdamage, 139, 242);

    }    



    if (type_config.earthdamage) {

        fillText(type_config.earthdamage, 181, 242);

    }



    if (type_config.waterdamage) {

        fillText(type_config.waterdamage, 224, 242);

    }



    /* Base Damage */

    setFont(22, 'Eurostile-BoldExtendedTwo', 'bold');

    ctx.fillStyle = '#000000';

    ctx.textAlign = 'center';



    if (type_config.basedamage) {

        fillText(type_config.basedamage, 39, 247);

    }



    drawTextArea(assets, 20, 252, 219, 64);

    artistLine(60, 333);

    typeLine("Attack", 19, 220);

}



function drawBattlegear(assets) {

    drawTextArea(assets, 21.2, 225, 234.4 - 21.2, 316 - 225);

    artistLine(60, 333);

    typeLine("Battlegear", 19, 220);

}



function drawCreature(assets) {

    setDropShadow();



    if (assets.firecreature) {

        drawImage(assets.firecreature, 

            0, 0, assets.firecreature.width, assets.firecreature.height,

            0, 0, width, height

        );

    }

    if (assets.aircreature) {

        drawImage(assets.aircreature,

            0, 0, assets.aircreature.width, assets.aircreature.height,

            0, 0, width, height

        );

    }

    if (assets.earthcreature) {

        drawImage(assets.earthcreature,

            0, 0, assets.earthcreature.width, assets.earthcreature.height,

            0, 0, width, height

        );

    }

    if (assets.watercreature) {

        drawImage(assets.watercreature,

            0, 0, assets.watercreature.width, assets.watercreature.height,

            0, 0, width, height

        );

    }



    /* Mugic Ability */

    setFont(18, 'Eurostile-Bold', 'Bold');

    ctx.fillStyle = '#FFFFFF';

    ctx.textAlign = 'left';



    if (type_config.mc) {

        fillText(type_config.mc, 18, 333);

    }



    /* Energy */

    setFont(19, 'Arial', 'Bold');

    ctx.fillStyle = '#FFFFFF';

    ctx.textAlign = 'center';

    

    if (type_config.energy) {

        fillText(type_config.energy, 216, 336);

    }



    /* Disciplines */

    setFont(10, 'Arial', 'Bold');

    ctx.fillStyle = '#FFFFFF';

    ctx.textAlign = 'right';



    if (type_config.courage) {

        fillText(type_config.courage, 33, 232);

    }   

    if (type_config.power) {

        fillText(type_config.power, 33, 257);

    }

    if (type_config.wisdom) {

        fillText(type_config.wisdom, 33, 281);

    }

    if (type_config.speed) {

        fillText(type_config.speed, 33, 305);

    }



    drawTextArea(assets, 43, 221, 172, 89);

    artistLine(47, 332);

    typeLine("Creature", 45, 219);

}



function drawLocation(assets) {

    setDropShadow();



    setFont(8.5, 'Arial', 'bold');

    ctx.fillStyle = '#FFFFFF';

    ctx.textAlign = 'left';

    ctx.textBaseline = "top";



    const init = parseLine(ctx, `Initiative: ${type_config.initiative}`, 280, scale);

    drawIconText(assets, [init], 41, 188);

    drawTextArea(assets, 41, 196, 300, 47);

    typeLine("Location", 39, 183);

}



function drawMugic(assets) {

    if (type_config.cost) {

        let offsetX = 18; 

        let offsetY = 230;



        ctx.textAlign = 'left';

        ctx.textBaseline = "top";

        const icons = type_config.cost.replaceAll(mc_regex, "mc_$1 ").trim().split(" ");



        icons.forEach((icon) => {

            if (Object.prototype.hasOwnProperty.call(assets, icon)) {

                const asset = assets[icon];

                drawImage(asset, 

                    0, 0, asset.width, asset.height,

                    offsetX, offsetY, 15, 15

                );

                offsetX += 15;

            }

        });

    }



    drawTextArea(assets, 18, 245, 234.4 - 12, 316 - 245);

    artistLine(60, 333);

    typeLine("Mugic", 13, 225);

}