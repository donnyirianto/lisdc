const Models = require('../Models/model');  
const logger = require('../utils/logger');
const readData = require('../helpers/readdata');
const dayjs = require('dayjs');
const fs = require('fs');
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
        const tgl_start = dayjs().subtract(2, 'day').format("YYYY-MM-DD")
        const tgl_end = dayjs().format("YYYY-MM-DD")
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
        //,"NPX","NPV","NPL"
        const listjenis = ["NPB","NPR","NPX","NPV","NPL"]
        for(let jenis of listjenis){
            let folder = `/home/donny/project/lisdc/downloads/${kdcab}/${jenis}/`
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder,{ recursive: true });
            }
            const updatedata = await readData.read(browser,kdcab,r.address, jenis)
            .then(async (r)=>{
                if(r.status === "OK" && r.data.length > 0)
                    
                    await Models.insertData(r.data,kdcab,jenis,tgl_start,tgl_end)
                return r.data.length
            })
            .catch((e)=>{
                console.log(e)
                return e
            })
            logger.info({
            status: "OK",
            msg : `${kdcab} - Sukses Update Data ${jenis}: ${updatedata} Rows`
        }) 
        }
             
        await page.close(); 
        
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

const updateRekap = async () => { 
    try {
        await Models.updateRekap()
    } catch (e) {
        console.log(e)   
        return "error"
    }
}

module.exports = {
    getServer,doitBro,sleep,updateRekap
  }
 
