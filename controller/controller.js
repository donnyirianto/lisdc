const Models = require('../Models/model');  
const logger = require('../utils/logger');
const path = require('path');
const downloadPath = path.resolve('../download');

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
} 
const getServer = async () => {
    try{  

        const result = await Models.dataServer()      
        return result
    
    }catch(e){
        console.log(e)
        return "Error"
    }
}   
 
const doitBro = async (browser,r) => { 
    const kdcab = r.dc_kode
   
	logger.info("Start : " + kdcab )  
	const page = await browser.newPage()
    try {  
        
        await page.setDefaultNavigationTimeout(0); 
        await page._client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: '/home/donny/' 
        });
        await page.goto(`http://${r.address}`,{
            waitUntil: 'networkidle0'
        });
        
        await page.waitForSelector("[name='username']"); 
        await page.type("[name='username']", `${r.username}`);
        await page.keyboard.down("Tab");
        await page.keyboard.type( `${r.pass}`);  
        
        await page.click("button[type=submit]");  
        await page.waitForNavigation({
            waitUntil: 'networkidle2',
          });  
        
        await page.goto(`http://${r.address}/Warehousing/MONTRANSDATAVIAWEB?log_menu=EXTERNAL%2FEDP&log_title=LAPORAN%20MONITORING%20TRANSFER%20DATA%20VIA%20WEBSERVICE&log_class=MONTRANSDATAVIAWEB`,
        {    
            waitUntil: 'networkidle0'
        });
        
        await page.select('select.selectpicker', 'NPB');        
        await page.waitForTimeout(100)
        await page.waitForSelector("#startdate"); 
        await page.type("#startdate", `02/24/2023 00:00:00`);
        await page.waitForTimeout(100)
        await page.waitForSelector("#enddate"); 
        await page.type("#enddate", `02/24/2023 00:00:00`);
        await page.waitForTimeout(1000)
          
        //   await page.keyboard.down("Tab");
        //   await page.waitFor(1000)
        //   await page.keyboard.down("25");await page.keyboard.down("25")
        //   await page.keyboard.press("Enter")
        await page.click("input[type=submit]");
        await page.waitForTimeout(2000)
        await page.goto(`http://${r.address}/ReportViewerWebForm.aspx`,
        {    
            waitUntil: 'networkidle0'
        });
       
        await page.waitForSelector("#ReportViewer1_ctl09_ctl04_ctl00_ButtonImgDown");
        await page.click("#ReportViewer1_ctl09_ctl04_ctl00_ButtonImgDown");
        await page.keyboard.press("Enter")
        await page.waitForTimeout(20000)
        logger.info("Sukses") 

        logger.info("Finish : " +kdcab)
		await page.close();		 
    } catch (error) {
      //console.log("ERror : " +kdcab)  
      console.warn("Error : " + error )     
	  await page.close();		
    
    }  
}
 

module.exports = {
    getServer,doitBro,sleep
  }
 