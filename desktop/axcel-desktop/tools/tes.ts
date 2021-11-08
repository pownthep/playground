import { Piper } from "@pownthep/axcel-core/lib/cjs/pipe";
import fs from "fs";

const array = [
  "C:\\Users\\pownthep\\Downloads\\DEMO.mp4-0-156853051",
  "C:\\Users\\pownthep\\Downloads\\DEMO.mp4-156853052-313706103",
  "C:\\Users\\pownthep\\Downloads\\DEMO.mp4-313706104-470559155",
  "C:\\Users\\pownthep\\Downloads\\DEMO.mp4-470559156-627412207",
  "C:\\Users\\pownthep\\Downloads\\DEMO.mp4-627412208-784265259",
  "C:\\Users\\pownthep\\Downloads\\DEMO.mp4-784265260-941118311",
  "C:\\Users\\pownthep\\Downloads\\DEMO.mp4-941118312-1097971363",
  "C:\\Users\\pownthep\\Downloads\\DEMO.mp4-1097971364-1254824420",
];
const writer = fs.createWriteStream("./DEMO.mp4");
const piper = new Piper(array, writer);
piper.combine();
