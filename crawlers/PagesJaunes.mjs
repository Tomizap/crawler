import mongoose from "mongoose";
import Crawler from "./Crawler.mjs";

class PagesJaunes extends Crawler {

    constructor(config) {
        super(config)
    }

    name = "PagesJaunes"

    async acceptCookies() {
        try {
            await this.page.waitForSelector('#didomi-notice-agree-button')
            await this.page.click('#didomi-notice-agree-button')
        } catch (error) { return }
    }

    async crawl(url) {

        this.type = 'companies'
        if (url) await this.lunch(url)

        await this.acceptCookies()

        if (url.includes('/annuaire/region') || url.includes('/annuaire/chercherlespros')) {

            await this.crawlCompaniesPage()

        } else if (url.includes('/pros/')) {

            await this.crawlCompanyPage()

        }

    }

    async crawlCompaniesPage(url) {

        if (url) await this.lunch(url)

        await this.acceptCookies()

        try {

            await this.page.waitForSelector('ul.bi-list li.bi-generic')
            const lis = await this.page.$$('ul.bi-list li.bi-generic')

            for (const li of lis) {

                try {
                    await li.waitForSelector('.btn_tel', { timeout: 3000 })
                    await li.$('.btn_tel').then(el => el.click())

                    // this.sleep(3000)
                    let item = {
                        links: {
                            pagejaunes: await li.$eval("a.bi-denomination", el => 'https://www.pagesjaunes.fr' + el.getAttribute('href')).catch(() => { }),
                        },
                        name: await li.$eval("h3", el => el.textContent.trim()).catch(() => { }),
                        sector: await li.$eval(".bi-activity-unit", el => el.textContent.trim().replace(/[\s\t\n]+\+\d+$/i, "")).catch(() => { }),
                        phone: await li.$eval(".bi-fantomas-display .annonceur", el => el.textContent.trim().replace(/\s/gi, '')).catch(() => { }),
                    }
                    let location = {
                        address: await li.$eval(".bi-address ", el => el.textContent.replace('Voir le plan', '').trim()).catch(() => { }),
                    }
                    console.log('location', location);
                    item = await this.searchEmail(item)
                    this.data.push(item)
                    location = await mongoose.model('locations').add(location)
                    item.location = location._id
                    console.log('item', item);
                    await mongoose.model('companies').add(item)
                    this.log('+1 item'.green)
                    await this.sleep(1000)

                } catch { continue }

            }

        } catch (error) {

            throw new Error(error.message)

        }

    }

    // async crawlCompanyPage(url) {

    //     if (url) await this.lunch(url)
    //         await this.page.waitForSelector('.bi-denomination')
    //         await this.page.click('.bi-denomination')
    //     let item = {

    //     }    

    // }

    async crawlCompanies(url) {

        if (url) await this.lunch(url)

        for (let index = 0; index < 10; index++) {

            try {

                await this.crawlCompaniesPage()

                await this.sleep(5000)
                await this.page.click('a#pagination-next')
                await this.sleep(5000)

            } catch (error) {
                console.log(error);
                break
            }

        }

    }

}

export default PagesJaunes