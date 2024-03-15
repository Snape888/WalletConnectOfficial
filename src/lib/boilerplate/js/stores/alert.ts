import { writable } from "svelte/store";

export const content = writable({"title": "title", "description": "description"});
export const visibility = writable("none");