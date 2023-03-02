const Models = require('../Models/model');  
const logger = require('../utils/logger');
const readData = require('../helpers/readdata');

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
        
        //const allPromises = [];
        //,"NPR","NPX","NPV","NPL"
        const selectLisNP = ["NPB","NPR","NPX","NPV","NPL"]
        for (let u of selectLisNP) {
            // const promise = new Promise(async (res, rej) => {
                await readData.read(browser,kdcab,r.address, u)
                .then(async (r)=>{
                    if(r.status === "OK" && r.data.length > 0)
                        await Models.insertData(r.data)
                    return "OK"
                })
                .catch(()=>{return "NOK"})
            //});
            //allPromises.push(promise);
        }; 
        
        //await Promise.allSettled(allPromises);
        await page.close(); 

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
 