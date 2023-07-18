const dayjs = require("dayjs");
const XLSX = require('xlsx'); 
const fs = require('fs');

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
} 
async function waitFile (filename) {

    return new Promise(async (resolve, reject) => {
        if (!fs.existsSync(filename)) {
            await delay(3000);    
            await waitFile(filename);
            resolve();
        }else{
          resolve();
        }

    })   
}

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

const read = async (browser,kdcab,address,jenis)=>{

    const page = await browser.newPage()  

    try {         
        await page.setViewport({
            width: 1920, // replace with your desired width
            height: 1080, // replace with your desired height
          });
        await page.goto(`http://${address}/Warehousing/MONTRANSDATAVIAWEB?log_menu=EXTERNAL%2FEDP&log_title=LAPORAN%20MONITORING%20TRANSFER%20DATA%20VIA%20WEBSERVICE&log_class=MONTRANSDATAVIAWEB`,
        {    
            waitUntil: 'networkidle2'
        });
        await page.waitForTimeout(200)
        await page.waitForSelector("select.selectpicker");
        await page.select('select.selectpicker', jenis);  
        await page.waitForSelector("#startdate"); 
        await page.type("#startdate", `${dayjs().subtract(2, 'day').format("MM")}/${dayjs().subtract(2, 'day').format("DD")}/${dayjs().subtract(2, 'day').format("YYYY")} 00:00:00`);
        await page.waitForSelector("#enddate"); 
        await page.type("#enddate", `${dayjs().format("MM")}/${dayjs().format("DD")}/${dayjs().format("YYYY")} 23:59:59`);
        await page.click("input[type=submit]");
        await page.waitForTimeout(5000)
        await page.goto(`http://${address}/ReportViewerWebForm.aspx`,
        {    
            waitUntil: 'networkidle0'
        });
        await page._client().send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: `./downloads/${kdcab}/${jenis}`,
        })
        await page.click("#ReportViewer1_ctl09_ctl04_ctl00_ButtonImgDown");
        await page.waitForSelector("a.ActiveLink");        
        const links = await page.$$('a.ActiveLink');
        await links[0].click()
        
        const newPath = `/home/donny/project/lisdc/downloads/${kdcab}/${jenis}/LapMonitorTransDataWebS.xlsx`;
        await page.waitForTimeout(20000)
        //await waitFile(newPath);
        // if(jenis =="NPB" || jenis =="NPR"){
        //     await page.waitForTimeout(10000);  
        // }else{
        //     await page.waitForTimeout(5000);  
        // }
        
        
        
        await page.close(); 

        const workbook = XLSX.readFile(newPath);
        const sheetNames = workbook.SheetNames;
        const worksheet = workbook.Sheets[sheetNames[0]];
        let data = XLSX.utils.sheet_to_json(worksheet).filter(r => r.__EMPTY_2 === jenis)
        let hasil =[]
        if(jenis !="NPV"){
            hasil = data.slice(10,2000).map( (i)=>{ return [
                i.__EMPTY,
                i.__EMPTY_7.substring(3,7),
                i.__EMPTY_2,
                i.__EMPTY_3,
                i.__EMPTY_4,
                i.__EMPTY_7,
                i.__EMPTY_9.substring(0,80),
                i.__EMPTY_10.substring(0,80),
                i.__EMPTY_11.substring(0,80),
                i.__EMPTY_12.substring(0,80),
                i.__EMPTY_13,
                i.__EMPTY_14,
                i.__EMPTY_17,
                i.__EMPTY_20,
                i.__EMPTY_21,
                i.__EMPTY_22,
                dayjs().format("YYYY-MM-DD HH:mm:ss")
            ] })
                 
        }else{
            hasil = data.slice(8,2000).map( (i)=>{ return [
                i.__EMPTY,
                i.__EMPTY_7.substring(3,7),
                i.__EMPTY_2,
                i.__EMPTY_3,
                i.__EMPTY_4,
                i.__EMPTY_7,
                i.__EMPTY_9.substring(0,80),
                i.__EMPTY_10.substring(0,80),
                i.__EMPTY_11.substring(0,80),
                i.__EMPTY_12.substring(0,80),
                i.__EMPTY_13,
                i.__EMPTY_15,
                i.__EMPTY_18,
                '',
                '',
                i.__EMPTY_19,
                dayjs().format("YYYY-MM-DD HH:mm:ss")
            ] })
                 
        }
        
        return {
            status: "OK",
            data: hasil
        }
    } catch (e) {
        console.log(`Error Page - Read data : ${e}`)
        return {
            status: "NOK",
            data : `None`
        }
    }
    
}

module.exports = {read}