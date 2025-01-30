import 'colors'
import process from 'node:process'
import { randomUUID } from "crypto";
import PQueue from 'p-queue';

// mongoose
import mongoose from "mongoose";
await mongoose.connect(process.env.MONGO_URI + process.env.MONGO_DB)
    .then(() => console.log('mongo connected'.green, process.env.MONGO_DB))
import '@tomizap/mongoose-model'

// puppeteer
import puppeteer from "puppeteer-extra"
import { executablePath } from "puppeteer"
import UserAgent from "user-agents";
import StealthPlugin from "puppeteer-extra-plugin-stealth"
puppeteer.use(StealthPlugin())

class Crawler {

    queue = new PQueue({ concurrency: 5 })
    headless = false
    data = []

    keywords = [
        // --- Déménagement
        // "déménagement",
        // "déménageur",
        // "transport de meubles",
        // "garde-meubles",
        // "déménagement international",
        // "services de relocation",
        // "location de camion de déménagement",
        // "transport",
        // "logistique",
        // --- formation
        "formation",
        "centre de formation",
        "organisme de formation",
        "cfa",
        "lycée",
        "formation professionnelle",
        "ecole",
        "université",
        // --- Automobile
        "voiture",
        "garage",
        "automobile",
        "concessionnaire",
        "vente de voitures",
        "garage automobile",
        "entretien automobile",
        "réparation automobile",
        "pièces détachées",
        "auto école",
        "permis de conduire",
        "assurance auto",
        "location de voitures",
        // --- Immobilier
        "immobilier",
        "agence immobilière",
        "achat immobilier",
        "vente de biens",
        "location immobilière",
        "gestion locative",
        "syndic de copropriété",
        "estimation immobilière",
        // --- Conseil et services
        "conseils",
        "consultant",
        "cabinet",
        "agence",
        "agence evenementielle",
        // --- finance
        "comptable",
        'banque',
        'assurance',
        "gestion de patrimoine",
        // --- Loisirs et divertissement
        "musée",
        "tourisme",
        "voyage",
        "animation",
        "recyclage",
        "loisir",
        "parc d'attractions",
        "cinéma",
        "centre de loisirs",
        "salle de jeux",
        "laser game",
        "paintball",
        "escape game",
        "salle d'escalade",
        "salle de sport",
        // --- Marketing et commerce
        "marketing",
        "communication",
        "publicité",
        "stratégie marketing",
        "prospection",
        "vente",
        "commerce",
        "e-commerce",
        "distribution",
        // --- Restauration et boissons
        "restaurant",
        "bar",
        "brasserie",
        "créperie",
        "café",
        "pizzeria",
        "food truck",
        "traiteur",
        "bistro",
        "cave à vin",
        'hotel',
        "café",
        "bar",
        "hotels",
        'traiteur',
        // --- BTP
        'énergie renouvelable',
        "panneau solaire",
        "panneau photovolataïque",
        "pompe à chaleur",
        "bureau d'étude",
        "climatisation",
        "energie",
        "station essence",
        "plomberie",
        "électricien",
        "vmc",
        // --- magasin
        'magasin',
        'boutique',
        "animalerie",
        'épicerie',
        'destockage',
        "cbd",
        "boulangerie",
        "pâtisserie",
        "chocolaterie",
        "droguerie",
        "pressing"
    ]
    states = {
        loggedin: false
    }
    regexPathCaptcha = [

    ]
    regexExcludeEmail = [
        // common
        'dpo',
        'test',
        'privacy',
        'noreply',
        'no-reply',
        'dataprotection',
        'olivier',
        'complaints',
        'rgpd',
        "donneespersonnelles",
        "donnees-personnelles",
        "@dfa.gov.ph",
        ".gouv.fr",
        "diplomates@",
        'exemple',
        "undefined",
        "contact@demenagements-perrois.com",
        // specific
        "contact@luxecodemenagement.com",
        'info@bpmgroup.fr',
        'digitalsupport.fr@audi.de',
        'bmwmini@neubauer.fr',
        'support@ovh.com',
        'cs.fra@cac.mercedes-benz.com',
        'gregory.wentz@citroen.com',
        'daniel.magalhaes@vaubanmotors.fr',
        'contact@carizy.com',
        'info@jaquauto.com',
        'village@neubauer.fr',
        'ladefense@horizon.fr',
        'contact@sca14.com',
        'marketing@rousseau-automobile.fr',
        'csr@messenger-inquirer.com',
        '40toyota-chambourcy@vaubanmotors.fr',
        'superu.lechesnay.locationu@systeme-u.fr',
        'contact@neubauer.fr',
        "ford@neubauer.fr",
        "contact@fairplayauto.com",
        'homolog@jaguarlandrover.com',
        'contact@abvv.fr',
        "paris@stellantis.com",
        "service-client@bmw.fr",
        'ouest@stellantis.com',
        'direction@aramisauto.com',
        "contact@garage-groult.fr",
        "conseil@maf",
        "contact@lot-of-cars.com",
        "contact@charles-pozzi.fr",
        "nos-ateliers-volkswagencontact@fairplayauto.com",
        "condor.automobiles@orange.fr",
        "youcar95@gmail.com",
        "alexandre.chazel@renault.com",
        "france@honda-eu.com",
        "pyrenees@suzuki-paris.fr",
        "lagarenne@orange.fr",
        "service-marketing@groupejb.com",
        "thomas.mottin@rousseau-automobile.fr",
        "garage.leon-olivier@wanadoo.fr",
        "emmanuel.dr@go2roues.com",
        "gilles.gleyze@renault.com",
        "support@zecarrossery.fr",
        "autosvilliers.sport@orange.fr",
        "fernao.silveira@stellantis.com",
        "contact@garage-gouet.com",
        "automobile.dacia@daciagroup.com",
        "opel.nanterre@trujas.carwest.fr",
        "contact@heipoa.com",
        "contact@japauto.com",
        "shop-mini@horizon.fr",
        "client@rfarennes.peugeot",
        "contact-saintquentin@amc-pieces.fr",
        "matteo@drive-automobiles.fr",
        "contact@bugatti-paris.fr",
        "contact@bauerparis.fr",
        "espace-marceau@wanadoo.fr",
        "commerce.nanterre@kote-ouest.fr",
        "crcfr@ford.com.porter",
        "auto.centre45@outlook.fr",
        "atelier-epernay@ttr-auto.fr",
        "aaco06@wanadoo.fr",
        "info@fiat-lgca.com",
        "contact@sml-automobile.com",
        "gilles.gleyze@renault.com",
        "contact@entreprise-mb-auto.fr",
        "contact@loueruneauto.fr",
        "contact@zlauto.fr",
        "olivier.crance@car-lovers.com",
        "cmmotors01100@gmail.com",
        "contact@melydenautoparis.com",
        "contact@la-conciergerie-auto.com",
        "contact@rabot-auto.fr",
        "peugeotgbc@wanadoo.fr",
        "shahbaazkhatri@falconautomobiles.in",
        "garagecretaz@gmail.com",
        "contact@champ-auto.com",
        "contact@infonet.fr",
        "contact@avs-sa.com",
        "info@karmania-auto",
        "contact@vaneau.fr",
        "garagecretaz@gmail.com",
        "jepostule@renault-trucks.com",
        "mediateur@mediateur-mobilians.fr",
        "contact@garageacd.com",
        "support@cars.com",
        "contact@ophtalmonotredame.tn",
        "amgauto28@hotmail.com",
        "admin@german-retrofit.com",
        "contact@actionscooter.fr",
        "mct@mct-groupe.com",
        "contact@rsrentbox.com",
        "contact@bigdem.fr",
        "contact@scsdemenagement.fr",
        "contact@richardevents.fr",
        "speedlivraisonidf@gmail.com",
        "contact@ltdem.fr",
        "contact@bhgroupe.fr",
        "jedemenage@demenagements-jumeau.fr",
        "contact@groupewilliamb.fr",
        "essonne@lagachemobility.com",
        "contact@demenagerseul.com",
        "info@baillydem.com",
        "marcbelmas@aol.com",
        "contact@nornes.fr",
        "contact@france-armor.com",
        "contact@imove-demenagement.fr",
        "contact@fidess-demenagement.fr",
        "contact@2sage-alba.com",
        "dvd-demenagement@paris.fr",
        "contact@demenager-pas-cher.com",
        "contact@helpianos-transport.com",
        "contact@demenageurs-bretons.fr",
        "contact@bhgroupe.fr",
        "lyon@baillydem.com",
        "contact@sc2t.fr",
        "contact@huetintl.com",
        "agence45@rberton.com",
        "contact@lepetitdemenageur.fr",
        'urbanisme@velizy-villacoublay.fr',
    ]

    constructor(config = {}) {
        if (config.headless) this.headless = config.headless
        this.name = config.name || ('crawler-' + randomUUID())
        return this
    }

    async captcha() {

        // google
        // this.regexPathCaptcha.push('/sorry')

        // check regexPathCaptcha
        const url = this.page.url()
        // console.log('captcha url', url);
        const re = await this.regexPathCaptcha.find(re => url.includes(re))
        if (re) throw new Error('captcha impossible: '.red + re)

    }

    log(...messages) { console.log('[CRAWLER]', ...messages) }

    async lunch(url) {
        if (this.browser) await this.browser.close()
        this.browser = await puppeteer.launch({
            headless: this.headless,
            executablePath: executablePath(),
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-webrtc',
                // '--disable-extensions',
                '--enable-automation'
            ],
            defaultViewport: { width: 1366, height: 768 },
            ignoreHTTPSErrors: true,
        });
        this.page = await this.browser.newPage();
        await this.page.setUserAgent(
            new UserAgent({ deviceCategory: 'desktop' }).toString()
        )
        await this.page.setExtraHTTPHeaders({
            //     'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            //     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            //     'Accept-Encoding': 'gzip, deflate, br',
            //     'Referer': 'https://www.google.com/',
            //     'Connection': 'keep-alive',
            //     'Cache-Control': 'max-age=0',
            // 'Upgrade-Insecure-Requests': '1',
            'DNT': '1',
            //     'Sec-Fetch-Site': 'same-origin',
            //     'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-User': '?1',
            //     'Sec-Fetch-Dest': 'document',
        });
        if (url) await this.page.goto(url)
        await this.captcha()
        return this
    }

    async subCrawler(cb = async (sb) => { sb }) {
        const subCrawler = new Crawler({ headless: true })
        try {
            await cb(subCrawler)
        } catch (error) {
            console.log("SubCrawlerError: ".red, error.message);
        }
        await subCrawler?.browser?.close()
    }

    async searchEmail(item) {
        return item;
        // await this.subCrawler(async (subCrawler) => {
        //     await subCrawler.lunch('https://www.google.com/search?' + new URLSearchParams({ q: 'contact email ' + item.name }))
        //     if (await subCrawler.page.waitForSelector('body #search', { timeout: 10000 }).catch(() => null) === null) {
        //         this.log('google search no loaded'.red)
        //         return
        //     }
        //     const email = await subCrawler.page.$eval(
        //         'body #search',
        //         body => (body.textContent.match(/[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/gi) ?? [null])[0]
        //     )
        //     if (
        //         email !== null &&
        //         this.regexExcludeEmail.every(re => !email.includes(re))
        //     ) item.email = email

        // })
        // if (item.email && this.data.filter(d => d?.email == item.email).length > 2)
        //     this.log(`${item.email} too much recurrent`.red)
        // return item
    }

    async multiCrawlers(options = {}, cbs = [async (sb) => sb]) {
        await Promise.all(cbs.map(async cb => {
            const crawler = await new this(options)
            cb(crawler)
                .then(async () => {
                    await crawler?.browser?.close().catch(() => { })
                })
            return
        }))
    }

    async multiPages(urls = [], cb = async (page) => page) {
        for (const url of urls) {
            try {
                const page = await this.browser.newPage()
                await this.sleepRandom()
                await page.goto(url)
                this.queue.add(() => {
                    cb(page)
                        .then(async () => {
                            await page.close().catch(() => { })
                        })
                })
            } catch (error) {
                this.log('MultiPageItemError'.red, error?.message || error)
            }
        }
    }

    async sleep(time = 3000) {
        return await new Promise((resolve) => {
            setTimeout(() => { resolve() }, time)
        })
    }

    async sleepRandom(min = 1000, max = 3000) {
        const ms = Math.floor(Math.random() * (max - min + 1)) + min;
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async typeHuman(text, selector) {
        for (let char of text) {
            if (Math.random() < 0.05) {  // 5% chance of a typing mistake
                await this.page.type(selector, String.fromCharCode(Math.random() * 26 + 97)); // Type a random letter
                await this.sleepRandom(100, 300); // Pause before fixing the mistake
                await this.page.keyboard.press('Backspace'); // Delete the wrong character
            }
            await this.page.type(selector, char); // Type the correct character
            await this.sleepRandom(100, 300); // Pause between characters
        }
    }

    async scroll(selector, x, y) {
        const element = await this.page.$(selector);
        await this.page.evaluate(el => {
            el.scrollBy(y, y || Math.floor(Math.random() * 100 + 50)); // Scroll by a random amount
        }, element);
        await this.sleepRandom(500, 1000); // Pause after scrolling
    }

}

export default Crawler