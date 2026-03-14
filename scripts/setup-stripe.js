import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stripe = new Stripe('sk_test_51QnRG2FolkEDHI3TRnBzSTe9lvuJpSguVIg61KJgc8KFXGiMjkSF1dQTbzVkfN7r6uDfPLZwhYy0QDidD9TNnx0I00E0WURhOf');

async function setup() {
    try {
        console.log("Checking for existing products...");
        const products = await stripe.products.list({ limit: 100 });
        let scholarProduct = products.data.find(p => p.name === 'Atheum Scholar');
        let librarianProduct = products.data.find(p => p.name === 'Atheum Librarian');
        let scholarMonthlyId, scholarYearlyId, librarianMonthlyId, librarianYearlyId;

        if (!scholarProduct) {
            console.log("Creating Scholar Product & Prices...");
            scholarProduct = await stripe.products.create({
                name: 'Atheum Scholar',
                description: '20 books limit',
            });
            
            const scholarMonthly = await stripe.prices.create({
                product: scholarProduct.id,
                unit_amount: 800, // $8.00
                currency: 'usd',
                recurring: { interval: 'month' },
            });
            scholarMonthlyId = scholarMonthly.id;

            const scholarYearly = await stripe.prices.create({
                product: scholarProduct.id,
                unit_amount: 7680, // $76.80
                currency: 'usd',
                recurring: { interval: 'year' },
            });
            scholarYearlyId = scholarYearly.id;
        } else {
            console.log("Scholar product exists, fetching prices...");
            const prices = await stripe.prices.list({ product: scholarProduct.id });
            scholarMonthlyId = prices.data.find(p => p.recurring && p.recurring.interval === 'month')?.id;
            scholarYearlyId = prices.data.find(p => p.recurring && p.recurring.interval === 'year')?.id;
        }

        if (!librarianProduct) {
            console.log("Creating Librarian Product & Prices...");
            librarianProduct = await stripe.products.create({
                name: 'Atheum Librarian',
                description: 'Unlimited books',
            });

            const librarianMonthly = await stripe.prices.create({
                product: librarianProduct.id,
                unit_amount: 2400, // $24.00
                currency: 'usd',
                recurring: { interval: 'month' },
            });
            librarianMonthlyId = librarianMonthly.id;

            const librarianYearly = await stripe.prices.create({
                product: librarianProduct.id,
                unit_amount: 23040, // $230.40
                currency: 'usd',
                recurring: { interval: 'year' },
            });
            librarianYearlyId = librarianYearly.id;
        } else {
            console.log("Librarian product exists, fetching prices...");
            const prices = await stripe.prices.list({ product: librarianProduct.id });
            librarianMonthlyId = prices.data.find(p => p.recurring && p.recurring.interval === 'month')?.id;
            librarianYearlyId = prices.data.find(p => p.recurring && p.recurring.interval === 'year')?.id;
        }

        let envVars = `
PUBLIC_STRIPE_PRICE_SCHOLAR_MONTHLY=${scholarMonthlyId}
PUBLIC_STRIPE_PRICE_SCHOLAR_YEARLY=${scholarYearlyId}
PUBLIC_STRIPE_PRICE_LIBRARIAN_MONTHLY=${librarianMonthlyId}
PUBLIC_STRIPE_PRICE_LIBRARIAN_YEARLY=${librarianYearlyId}
`;      
        console.log("Generated Stripe Price IDs:");
        console.log(envVars);

        const envPath = path.join(__dirname, '../.env');
        const currentEnv = fs.readFileSync(envPath, 'utf8');
        if (!currentEnv.includes('PUBLIC_STRIPE_PRICE_SCHOLAR_MONTHLY')) {
            fs.appendFileSync(envPath, envVars);
            console.log("Successfully appended to .env!");
        } else {
            console.log(".env already contains Price IDs. Please verify them against the console output above.");
        }

    } catch (e) {
        console.error("Error setting up stripe:", e);
    }
}

setup();
