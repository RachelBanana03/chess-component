import { ChessSymbols as CSym } from "./Chess";

import moveSfxFile from "../sounds/move-self.mp3";
import captureSfxFile from "../sounds/capture.mp3";
import castleSfxFile from "../sounds/castle.mp3";
import checkSfxFile from "../sounds/check.mp3";
import checkmateSfxFile from "../sounds/checkmate.mp3";
import promoteSfxFile from "../sounds/promote.mp3";

const moveSfx = new Audio(moveSfxFile);
const captureSfx = new Audio(captureSfxFile);
const castleSfx = new Audio(castleSfxFile);
const checkSfx = new Audio(checkSfxFile);
const checkmateSfx = new Audio(checkmateSfxFile);
const promoteSfx = new Audio(promoteSfxFile);

function playAudio(audio) {
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
}

function playMoveSfx(moveSymbol) {
    switch (moveSymbol) {
        case CSym.CAN_PROMOTE:
            break;
        case CSym.CHECKMATE:
            playAudio(checkmateSfx);
            break;
        case CSym.CHECK:
            playAudio(checkSfx);
            break;
        case CSym.PROMOTE:
            playAudio(promoteSfx);
            break;
        case CSym.CASTLE:
            playAudio(castleSfx);
            break;
        case CSym.CAPTURE:
        case CSym.EN_PASSANT:
            playAudio(captureSfx);
            break;
        default:
            playAudio(moveSfx);
    }
}

export { playAudio, playMoveSfx };