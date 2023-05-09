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
        //await sleep(1000)
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' }); 

        const links = await page.$$eval('a', elements =>
            elements.map(el => el.textContent.trim())
        );
        //console.log(links)
        if(links.length === 0){
            logger.warn({
                status: "NOK",
                msg : `${kdcab} - Gagal Login ke Web LISDC / Meminta Reset Password`
            })
            await page.waitForSelector("[name='newpassword']"); 
            await page.type("[name='newpassword']", `2022@EDP`);
            await page.keyboard.down("Tab");
            await page.keyboard.type( `2022@EDP`);  
            
            await page.click("input[type=submit]"); 
            await page.waitForSelector("[name='username']");  
            logger.warn({
                status: "NOK",
                msg : `${kdcab} - Berhasil Update Password Password`
            })
            // await sleep(1000)
            //await page.waitForNavigation();

            // await page.waitForSelector("[name='username']"); 
            // await page.type("[name='username']", `${r.username}`);
            // await page.keyboard.down("Tab");
            // await page.keyboard.type( `${r.pass}`);  
            
            // await page.click("button[type=submit]");  
            // await page.waitForSelector("a");
        }else{
            
            //console.log("close disini")
            //,"NPR","NPX","NPV","NPL"
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
 
