const puppeteer = require('puppeteer');

(async () => {
    const resetTerminal = '\x1B[2J\x1B[0f';
    const browser = await puppeteer.launch({
        args: [process.argv[2]],
        timeout: 0
    });
    const pages = await browser.pages();
    const page = pages[0];

    const selExperience = '#rblType_0';
    await page.waitForSelector(selExperience);
    await page.click(selExperience);
    await page.click('#lnkContinue');

    process.stdout.write('logging in...' + resetTerminal);
    await page.type('#txtLoginEmail', process.argv[3]);
    await page.type('#txtLoginPassword', process.argv[4]);
    await page.click('#lnkLoginCand');

    const selViewAllApplications = '#ContentPlaceHolder1_A3';
    await page.waitForSelector(selViewAllApplications);
    process.stdout.write('Authorized' + resetTerminal);
    await page.click(selViewAllApplications);
    await page.waitForSelector('#article > div.listing-outer > div > ul > li > span.headerH3');

    //extract data
    const selPosition = '#ContentPlaceHolder1_rptJobs_lblJoblnk_0';
    const selStatus = '#ContentPlaceHolder1_rptJobs_lblAppStatus_0';
    let data = await page.evaluate((posSelector, statusSelector) => {
        let pos = document.querySelector(posSelector).innerText;
        let status = document.querySelector(statusSelector).innerText;
        let dat = pos + ' -> ' + status;
        return dat;
    }, selPosition, selStatus);

    process.stdout.write(data);

    browser.close();
})();
