import Crawler from "./Crawler.js";
import Facebook from "./Facebook.js";
import FranceTravail from "./FranceTravail.js";
import Google from "./Google.js";
import Indeed from "./Indeed.js";
import LBA from "./lba.js";
import PagesJaunes from "./PagesJaunes.js";

class SmartCrawler extends Crawler {

    name = "Smart Crawler"

    constructor(config) {
        super(config)
    }

    async crawl(url, options = {}) {

        try {

            const crawler = await this.findCrawler(url)
            await crawler.crawl(url)

        } catch (error) {

            console.log('CrawlerFatalError: '.red, error.message);

        } finally {

            return this.data

        }

    }

    findCrawler(url) {

        if (url.includes('labonnealternance.apprentissage.beta.gouv.fr')) {

            return new LBA()

        } else if (url.includes('indeed.com')) {

            return new Indeed()

        } else if (url.includes('francetravail.fr')) {

            return new FranceTravail()

        } else if (url.includes('pagesjaunes.fr')) {

            return new PagesJaunes()

        } else if (url.includes('google.com')) {

            return new Google()

        } else if (url.includes('facebook.com')) {

            return new Facebook()

        } else {

            return new Crawler()

        }

    }

    generateUrls(url) {

        const crawler = this.findCrawler(url)
        return crawler?.generateUrls(url) || []

    }

}

export default SmartCrawler