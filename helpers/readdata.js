const dayjs = require("dayjs");

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const read = async (browser,kdcab,address,jenis)=>{
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
        await page.type("#startdate", `${dayjs().subtract(1, 'day').format("MM")}/${dayjs().subtract(1, 'day').format("DD")}/${dayjs().subtract(1, 'day').format("YYYY")} 00:00:00`);
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
                
                return {
                    tanggal,jenis, toko,namaToko,namafile,jamWeb,
                    jamCsv,jamKirim,jamKonfirm,jamToko,
                    docno,jmlItem,jamBpb,bukti_no,jmlBpb
                };
            })
        });
        let dataSource = []
        for(let i = 2; i < 100; i += 1){            
            try {                
                await page.waitForSelector("span#ReportViewer1_ctl09_ctl00_Next_ctl00_ctl00")
                await sleep(1000)
                await page.click("span#ReportViewer1_ctl09_ctl00_Next_ctl00_ctl00")   
                await sleep(1000)
                const dataPerPage = await page.evaluate(() => {
                    const x = document.querySelectorAll('table')[27]
                    const trs = Array.from(x.querySelectorAll('table tr'))
                    return trs.slice(6).map(tr => {
                        const dataNodeList = tr.querySelectorAll('td');
                        const dataArray = Array.from(dataNodeList);
                        const [tanggal,jenis, toko,namaToko,namafile,jamWeb,jamCsv,jamKirim,jamKonfirm,jamToko,docno,jmlItem,jamBpb,bukti_no,jmlBpb] = dataArray.map(td => td.textContent.replace(/;/g, ''));
                        
                        return {
                            tanggal,jenis, toko,namaToko,namafile,jamWeb,jamCsv,jamKirim,jamKonfirm,jamToko,
                            docno,jmlItem,jamBpb,bukti_no,jmlBpb
                        };
                    })
                });   
                dataSource = [...dataSource, ...dataPerPage];
                await sleep(500)               
            } catch (e) {      
                break;
            } 
        }
        await page.close(); 
        let hasil = [...dataLis, ...dataSource]
            hasil = hasil.map((r)=>{
                return [
                    r.tanggal,
                    kdcab,
                    r.jenis, 
                    r.toko,
                    r.namaToko,
                    r.namafile,
                    r.jamWeb,
                    r.jamCsv.substring(0,80),
                    r.jamKirim.substring(0,80),
                    r.jamKonfirm.substring(0,80),
                    r.jamToko,
                    (typeof r.docno === "undefined") ? '' : r.docno,
                    (typeof r.jmlItem === "undefined") ? '' : r.jmlItem,
                    r.jamBpb,
                    (typeof r.bukti_no === "undefined") ? '' : r.bukti_no,
                    (typeof r.jmlBpb === "undefined") ? '' : r.jmlBpb,
                    dayjs().format("YYYY-MM-DD HH:mm:ss")
                ]
            })            
        return {
            status: "OK",
            data: hasil
        }
    } catch (e) {
        return {
            status: "NOK",
            data : `None`
        }
    }
    
}

module.exports = {read}