import { ALCHEMY_NODE_KEY_ETHEREUM_MAINNET, ALCHEMY_NODE_KEY_POLYGON_MAINNET } from "$lib/boilerplate/js/env";
import { content, visibility } from "$lib/boilerplate/js/stores/alert";
import erc20Abi from "$lib/boilerplate/abi/erc-20.json";
import { BigNumber } from "bignumber.js";

export const networkNameByChainId = {
  "1": "ethereum",
  "139": "polygon",
};

export const alchemyNodeKeyByChainId = {
  1: "https://eth-mainnet.g.alchemy.com/v2/" + ALCHEMY_NODE_KEY_ETHEREUM_MAINNET,
  137: "https://polygon-mainnet.g.alchemy.com/v2/" + ALCHEMY_NODE_KEY_POLYGON_MAINNET,
};

export const socketByChainId = {
  137: "wss://polygon-mainnet.g.alchemy.com/v2/" + ALCHEMY_NODE_KEY_ETHEREUM_MAINNET,
};

export function abbreviate(word, before, after) {
    word = word.substr(0, before) + "..." + word.substr(word.length - after);
    return word;
}





export async function getGasPrice(alchemyNode) {
    const speedFactor = 1.2; // TODO: change to one for production
    const suggestedGasPrice = await alchemyNode.eth.getGasPrice(function(e, r) {return r;})
    const gasPrice = parseInt(suggestedGasPrice) * speedFactor;
    return Math.round(gasPrice);
}
export function _round(number, decimalPlaces) {
    if (number !== 0 && number !== "n/a" && number !== '∞') {
        // Use BigNumber for rounding
        const bn = new BigNumber(number);
        return bn.toFixed(decimalPlaces, BigNumber.ROUND_DOWN);
    }
    return number;
}