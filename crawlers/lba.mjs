import Crawler from "./Crawler.js";

class LBA extends Crawler {

    constructor(config) {
        super(config)
    }

    name = "La bonne alternance"

    async crawl(url) {

        await this.lunch(url)

        if (url.includes('beta.gouv.fr/recherche-apprentissage')) {

            this.type = 'jobs'

            if (url.includes('page=fiche')) {

                await this.crawlJob()

            } else {

                await this.crawlJobs()

            }

        }
        return this.data

    }

    async crawlJobs() {

        await this.page.waitForSelector('a.chakra-link.matcha')
        const items = await this.page.$$eval('a.chakra-link.matcha', links => { return links.map(l => { return { links: { website: l.href } } }) })
        console.log(`${items.length} items found`);
        const chunks = this.chunkArray(items, 20)
        for (const chunk of chunks) {
            console.log(`chunk ${chunks.indexOf(chunk) + 1}/${chunk.length}`);
            await Promise.all(
                chunk.map(async (item) => {
                    const page = await this.browser.newPage()
                    const { width, height } = await this.page.evaluate(() => ({
                        width: window.screen.width,
                        height: window.screen.height
                    }));
                    await page.setViewport({ width, height });
                    async function scrap() {
                        await page.goto(item.links.website).then(async () => {
                            await page.waitForSelector('#itemDetailColumn h1').then(async () => {
                                item.name = await page.$eval('#itemDetailColumn h1', el => el.textContent)
                                item.location = await page.$eval('#itemDetailColumn h1 + div', el => el.textContent)
                                await page.waitForSelector('#itemDetailColumn .css-x7s3fi').then(async () => {
                                    item.description = await page.$eval('#itemDetailColumn > .css-x7s3fi', el => el.innerHTML
                                        .toString()
                                        .replace(/<br\.*\/?>/gi, "\n")  // Replace <br> with newline
                                        .replace(/<p>\.*<\/p>/gi, "\n") // Replace clo.ing and opening <p> with newline
                                        .replace(/<div>\.*<\/div>/gi, "\n") // Replace closing and opening <div> with newline
                                        .replace(/<span>\.*<\/span>/gi, "\n") // Replace closing and opening <div> with newline
                                        .replace(/<[^>]*>/g, "")
                                        .trim()
                                    )
                                }).catch(err => { })
                            }).catch(async err => await scrap())
                        }).catch(async err => await scrap())
                    }
                    await scrap()
                    page.close()
                    // await this.save(item)
                    console.log('item', item);
                    return item
                })
            )
            // this.data = this.data.concat(await Promise.all(data))
        }

    }

    async crawlJob() {

    }

}

export default LBA