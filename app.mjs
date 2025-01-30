import Crawler from "./crawlers/Crawler.mjs";
import Google from "./crawlers/Google.mjs";
import PQueue from "p-queue";
import PagesJaunes from "./crawlers/PagesJaunes.mjs";

const queue = new PQueue({ concurrency: 10 });
const headless = true
const name = "crawler"

const c = new Crawler({ name, headless })
for (const keyword of c.keywords) {

    // const google = new Google({ name: "gmaps_companies", headless })
    // for (const coordonates of google.gmapsCoordonnates) {
    //     queue.add(async () => {
    //         const g = new Google({ name, headless })
    //         await g.crawl(`https://www.google.com/maps/search/${keyword}/${coordonates}/`)
    //         await g?.browser?.close().catch(() => { })
    //         return null
    //     })
    // }

    queue.add(async () => {
        try {
            const pj = new PagesJaunes({ name: 'pj_companies', headless })
            await pj.crawl(`https://www.pagesjaunes.fr/annuaire/region/ile-de-france/${keyword
                .toLowerCase()
                .trim()
                .replace(/[éèêë]/gi, 'e')
                .replace(/[à]/g, 'a')
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')}`).catch(() => { })
            await pj?.browser?.close().catch(() => { })
        } catch (error) {
            return
        }

    })

}

