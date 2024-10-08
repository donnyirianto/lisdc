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
    console.log(kdcab)
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
        await sleep(3000)
        //Sini
        
        // const links = await page.$$eval('a', elements =>
        //     elements.map(el => el.textContent.trim())
        // );

        // if(links.length === 0){
        //     logger.warn({
        //         status: "NOK",
        //         msg : `${kdcab} - Gagal Login ke Web LISDC / Meminta Reset Password`
        //     })
        //     await page.waitForSelector("[name='newpassword']"); 
        //     await page.type("[name='newpassword']", `2022@EDP`);
        //     await page.keyboard.down("Tab");
        //     await page.keyboard.type( `2022@EDP`);  
            
        //     await page.click("input[type=submit]"); 
        //     await sleep(3000)
        //     //await page.waitForSelector("[name='username']");  
        //     logger.warn({
        //         status: "NOK",
        //         msg : `${kdcab} - Berhasil Update Password Password`
        //     })
        //     await page.waitForSelector("[name='username']"); 
        //     await page.type("[name='username']", `${r.username}`);
        //     await page.keyboard.down("Tab");
        //     await page.keyboard.type( `${r.pass}`);  
            
        //     await page.click("button[type=submit]");  
        //     await page.waitForSelector("a");
        // }
        // // // else{ 
        // //     //"NPB","NPR","NPT","NPX","NPV","NPL"
        // //,
        const listjenis = ["NPB","NPR","NPT","NPX","NPV","NPL"]
        for(let jenis of listjenis){
            let folder = `/home/donny/project/lisdc/downloads/${kdcab}/${jenis}/`
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder,{ recursive: true });
            }
            const updatedata = await readData.read(browser,kdcab,r.address, jenis)
            .then(async (r)=>{
                if(r.status === "OK" && r.data.length > 0)
                    await Models.insertData(r.data,kdcab,jenis)
                return r.data.length
            })
            .catch((e)=>{
                
                return e
            })
            logger.info({
                status: "OK",
                msg : `${kdcab} - Sukses Update Data ${jenis}: ${updatedata} Rows`
            }) 
        }
 
        // // }
        await page.close();
        return {
            status: "OK",
            msg : `${kdcab} - Sukses Update Data`
        }
    } catch (error) {
        await page.close();
        logger.warn({
            status: "NOK",
            msg : `${kdcab} - Gagal :: ${error}`
        })
        
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
           
        return "error"
    }
}

module.exports = {
    getServer,doitBro,sleep,updateRekap
  }
 
