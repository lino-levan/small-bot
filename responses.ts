import adjList from "https://raw.githubusercontent.com/dariusk/corpora/master/data/words/adjs.json" assert {
  type: "json",
};

export const adjs = adjList.adjs;

export const accepted = [
  "uhh I think I got it",
  "yup",
  "mhm",
  "alright",
  "I did it.",
  "Yes sir :salute:",
  "hehe, don't mind if I do",
  "lol",
  "ok",
  "got it",
  "mhmmmm",
  "sure",
  "okie",
  "okay",
];

export const denied = [
  "not feeling today, sorry",
  "nah",
  "...",
  "do you think I'm stupid?",
  "you're so silly",
  "alright buddy, nice try",
  ":eyebrow_raise:",
  "please read the rules",
  "they GOTTA ban this guy",
  "?????",
  "/kick @you being cringe",
];

export function pickRandom<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)];
}
