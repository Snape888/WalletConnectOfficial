import { ALCHEMY_NODE_KEY_ETHEREUM_MAINNET, ALCHEMY_NODE_KEY_POLYGON_MAINNET } from "$lib/boilerplate/js/env";
import { chainId, user } from "$lib/boilerplate/js/stores/wallet";
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



export function txCanBeInitiated(lastTxAddedToRegister) {
    let _chainId;
    let unsubscribe = chainId.subscribe(value => {
        _chainId = value;
    });
    unsubscribe();
    let _user;
    unsubscribe = user.subscribe(value => {
        _user = value;
    });
    unsubscribe();
    if (_user == "0x0000000000000000000000000000000000000000") {
        content.set({"title": "Wallet not connected", "description": "Start by connecting your wallet in order to use Cat-in-a-Box's functionalities."});
        visibility.set("block");
        return false;
    }
    else if (!networkNameByChainId.hasOwnProperty(_chainId)) {
        content.set({"title": "Wrong network", "description": "This network is not supported."});
        visibility.set("block");
        return false;
    }
    /*else if (lastTxAddedToRegister == false) {
        content.set({"title": "Pending transaction", "description": "Please wait a moment until the previous transaction has been sent."});
        visibility.set("block");
        return false;
    }*/
    return true;
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