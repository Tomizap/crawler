import mongoose from "mongoose";
import Crawler from "./Crawler.mjs";

class Google extends Crawler {

    constructor(config) {
        super(config)
    }

    name = "Google"

    async acceptCookies() {
        try {
            await this.page.waitForSelector('form[action="https://consent.google.com/save"]')
            await this.page.click('form[action="https://consent.google.com/save"]')
            await this.page.waitForNavigation()
        } catch (error) {
            console.log('GoogleCaptchaError: '.red, error);
        }
    }

    // gmaps

    gmapsCoordonnates = [
        // 92
        "@48.9318518,2.2701032,14.11z",
        '@48.9075178,2.2246663,14.11z',
        "@48.8777486,2.1826391,14.11z",
        "@48.8509359,2.1580572,14.11z",
        "@48.8287029,2.1627357,14.11z",
        "@48.8371489,2.2329985,15.08z",
        "@48.8594025,2.2374468,15.08z",
        "@48.8745827,2.2496012,15.08z",
        "@48.8223446,2.2636282,14.83z",
        "@48.8208943,2.1781589,14.32z",
        "@48.7996594,2.2396648,14.06z",
        "@48.7828585,2.2665461,14.3z",
        // 95
        "@48.9537098,2.2077876,14z",
        "@48.9803168,2.2083139,13.75z",
        "@48.9820393,2.3093697,14.24z",
        "@48.9888135,2.3905464,13.82z",
        "@49.019309,2.1568614,13.52z",
        "@49.0452589,2.1286051,13.77z",
        '@49.0403893,2.0349855,13.02z',
        "@49.0317079,2.4416332,13.51z",
        "@49.0825868,2.5167732,14.01z",
        // 75
        "@48.878011,2.3228988,13.62z",
        "@48.84427,2.3019585,13.62z",
        // 94
        "@48.7933228,2.3579641,13.5z",
        "@48.8281674,2.4447864,13.5z",
        "@48.7919419,2.4588276,14z",
        "@48.7535003,2.4081388,13.5z",
        "@48.7669015,2.5152989,13.7z",
        //93
        "@48.8603737,2.5244344,14z",
        "@48.8693235,2.4289927,14.5z",
        "@48.8756577,2.503552,14z",
        "@48.9056838,2.452975,13.25z",
        "@48.9313981,2.3482474,13.5z",
        "@48.9380848,2.4774396,13.75z",
        "@48.9467466,2.521995,14z",
    ]

    async crawl(url) {

        await this.lunch(url)

        await this.acceptCookies(this.page)

        if (url.includes('/maps/search/')) {

            this.type = 'companies'
            await this.crawlGmap()

        }

    }

    async crawlGmap() {

        await this.page.waitForSelector('div[role="feed"]')
        for (let index = 0; index < 20; index++) {
            await this.sleepRandom()
            await this.page.evaluate(async () => {
                document.querySelector('div[role="feed"]').scrollBy(0, 10000);
            })
            if ((await this.page.$('[role="feed"] p.fontBodyMedium')) !== null) break
        }

        const hrefs = await this.page.$$eval('[role="feed"] a.hfpxzc', (page) => page.map(page => page.href))
        this.log(hrefs.length, 'google maps companies to scrap');
        this.data = []

        await this.multiPages(hrefs, async (page) => {
            try {
                if (await page.waitForSelector('[role="main"] [data-item-id="address"]', { timeout: 10000 }).catch(() => null) === null) {
                    this.log('no gmap address'.red)
                    return
                }
                const mainTag = await page.$$('[role="main"]').then(ms => ms[-1] || ms[0])
                let item = {
                    name: await mainTag.$eval('h1', el => el.textContent),
                    phone: await mainTag.$eval('[data-tooltip="Copier le numéro de téléphone"] .fontBodyMedium', el => el.textContent.replace(/[a-zA-Z\s\.\-]/gi, '')).catch(err => { }),
                    links: {
                        website: await mainTag.$eval('[data-item-id="authority"] .fontBodyMedium', el => el.textContent).catch(err => { }),
                    },
                    sector: await mainTag.$eval('button.DkEaL', el => el.textContent).catch(() => { }),
                }
                let location = {
                    address: await mainTag.$eval('[data-item-id="address"] .fontBodyMedium', el => el.textContent).catch(err => { })
                }
                item = await this.searchEmail(item)
                this.data.push(item)
                location = await mongoose.model('locations').add(location)
                item.location = location._id
                console.log('item', item);
                await mongoose.model('companies').add(item)
                this.log('+1 item'.green)
            } catch (error) {
                this.log("CrawlGmapPlaceError".red, error?.message || error);
            }
            return
        })

        // this.log('crawlGmap ended !'.green);
        // return this.data
        return

    }

}

export default Google