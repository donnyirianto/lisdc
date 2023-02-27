const Models = require('../Models/model');  
const logger = require('../utils/logger');
const readData = require('../helpers/readdata');
const dayjs = require('dayjs');


const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
} 
const getServer = async (a,b) => {
    try{  

        const result = await Models.dataServer(a,b)      
        return result
    
    }catch(e){
        logger.warn(e)
        return "Error"
    }
}   
 
const doitBro = async (browser,r) => { 
    
    const kdcab = r.dc_kode  
	const page = await browser.newPage()
    try {   
        await page.setViewport({
            width: 1920, // replace with your desired width
            height: 1080, // replace with your desired height
          });
        await page.setDefaultNavigationTimeout(0); 
        await page.goto(`http://${r.address}`,{
            waitUntil: 'networkidle0'
        });
        
        await page.waitForSelector("[name='username']"); 
        await page.type("[name='username']", `${r.username}`);
        await page.keyboard.down("Tab");
        await page.keyboard.type( `${r.pass}`);  
        
        await page.click("button[type=submit]");  
        await page.waitForTimeout(500)
        
        const NPB = await readData.read(browser,r.address, "NPB").then(r=>{return r.status === "OK" ? r.data : []}).catch(()=>{return []})
        const NPR = await readData.read(browser,r.address, "NPR").then(r=>{return r.status === "OK" ? r.data : []}).catch(()=>{return []})
        const NPX = await readData.read(browser,r.address, "NPX").then(r=>{return r.status === "OK" ? r.data : []}).catch(()=>{return []})
        const NPV = await readData.read(browser,r.address, "NPV").then(r=>{return r.status === "OK" ? r.data : []}).catch(()=>{return []})
        const ALOKASI = await readData.read(browser,r.address, "NPL").then(r=>{return r.status === "OK" ? r.data : []}).catch(()=>{return []})
        
        let dataLis = NPB.concat(NPR,NPV,NPX,ALOKASI)

        dataLis = dataLis.map((r)=>{
            return [
                dayjs(r.tanggal).format("YYYY-MM-DD"),
                kdcab,
                r.jenis, 
                r.toko,
                r.namaToko,
                r.namafile,
                r.jamWeb,
                r.jamCsv.substr(0,80),
                r.jamKirim.substr(0,80),
                r.jamKonfirm.substr(0,80),
                r.jamToko,
                (typeof r.docno === "undefined") ? '' : r.docno,
                (typeof r.jmlItem === "undefined") ? '' : r.jmlItem,
                r.jamBpb,
                (typeof r.bukti_no === "undefined") ? '' : r.bukti_no,
                (typeof r.jmlBpb === "undefined") ? '' : r.jmlBpb,
                dayjs().format("YYYY-MM-DD HH:mm:ss")
            ]
        })
        await page.close();

        await Models.insertData(dataLis)
        logger.info({
            status: "OK",
            msg : `${kdcab} - Sukses Update Data`
        })
        return {
            status: "OK",
            msg : `${kdcab} - Sukses Update Data`
        }
    } catch (error) {
        logger.warn({
            status: "NOK",
            msg : `${kdcab} - Gagal :: ${error}`
        })
        await page.close();		
        return {
            status: "NOK",
            msg : `${kdcab} - Gagal :: ${error}`
        }
    }  
}
 

module.exports = {
    getServer,doitBro,sleep
  }
 