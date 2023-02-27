const dayjs = require("dayjs");

const read = async (browser,address,jenis)=>{
    try {
        
        const page = await browser.newPage()   
        await page.setViewport({
            width: 1920, // replace with your desired width
            height: 1080, // replace with your desired height
          });
        await page.goto(`http://${address}/Warehousing/MONTRANSDATAVIAWEB?log_menu=EXTERNAL%2FEDP&log_title=LAPORAN%20MONITORING%20TRANSFER%20DATA%20VIA%20WEBSERVICE&log_class=MONTRANSDATAVIAWEB`,
        {    
            waitUntil: 'networkidle0'
        });
        await page.waitForTimeout(200)
        await page.waitForSelector("select.selectpicker");
        await page.select('select.selectpicker', jenis);  
        await page.waitForSelector("#startdate"); 
        await page.type("#startdate", `${dayjs().format("MM")}/${dayjs().format("DD")}/${dayjs().format("YYYY")} 00:00:00`);
        await page.waitForSelector("#enddate"); 
        await page.type("#enddate", `${dayjs().format("MM")}/${dayjs().format("DD")}/${dayjs().format("YYYY")} 23:59:59`);
        await page.click("input[type=submit]");
        await page.waitForTimeout(200)
        await page.goto(`http://${address}/ReportViewerWebForm.aspx`,
        {    
            waitUntil: 'networkidle0'
        });
    
        const dataLis = await page.evaluate(() => {
            
            const x = document.querySelectorAll('table')[27]
            const trs = Array.from(x.querySelectorAll('table tr'))
            return trs.slice(6).map(tr => {
                const dataNodeList = tr.querySelectorAll('td');
                const dataArray = Array.from(dataNodeList);
                const [tanggal,jenis, toko,namaToko,namafile,jamWeb,jamCsv,jamKirim,jamKonfirm,jamToko,docno,jmlItem,jamBpb,bukti_no,jmlBpb] = dataArray.map(td => td.textContent.replace(/;/g, ''));
                //tangal : tanggal.replace(new RegExp(/-/g), "/"),
                return {
                    tangal : tanggal.replace(new RegExp(/-/g), "/"),
                    jenis, toko,namaToko,namafile,jamWeb,jamCsv,jamKirim,jamKonfirm,jamToko,
                    docno,jmlItem,jamBpb,bukti_no,jmlBpb
                };
            })
        });  
        return {
            status: "OK",
            data: dataLis
        }
    } catch (e) {
        return {
            status: "NOK",
            data : `None`
        }
    }
    
}

module.exports = {read}