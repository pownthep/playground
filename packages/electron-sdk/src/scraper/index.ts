import fetch from "node-fetch";
import { parse } from "node-html-parser";

export default class Nyaa {
  public static async search(q: string) {
    try {
      const res = await fetch(`https://nyaa.si/?q=${q.replaceAll(" ", "+")}&s=seeders&o=desc`);
      const text = await res.text();
      const root = parse(text);
      const rows = root.querySelector("tbody").querySelectorAll("tr");
      const data = rows.map((row) => {
        const tds = row.querySelectorAll("td");
        const title = tds[1].querySelectorAll("a")[1]
          ? tds[1].querySelectorAll("a")[1].rawText
          : tds[1].querySelectorAll("a")[0].rawText;
        const magnetUri = tds[2].querySelectorAll("a")[1].getAttribute("href");
        const size = tds[3].rawText;
        const date = tds[4].rawText;
        const seeds = tds[5].rawText;
        const leechs = tds[6].rawText;
        const completed = tds[7].rawText;

        return {
          title,
          magnetUri,
          size,
          date,
          seeds,
          leechs,
          completed,
        };
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  }
}
