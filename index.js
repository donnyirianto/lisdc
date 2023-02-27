const cron = require('node-cron');
const logger = require('./utils/logger');
const { exec } = require("child_process");
const Controller = require('./controller/controller');
const dayjs = require("dayjs"); 
const puppeteer = require("puppeteer");
let taskRunning = true 
  
const myPromise = async(a,b)=>{
  const server = await Controller.getServer(a,b)  
 
  const allPromises = [];

  for (let r of server.slice(0,10)) {
      const promise = new Promise(async (res, rej) => {
        act(r)                   
      });
      allPromises.push(promise);
  }; 
  
  const outcomes = await Promise.allSettled(allPromises);
  const succeeded = outcomes.filter(o => o.status === "fulfilled");
  
  const hasil = succeeded.map(f => f.value);

  console.log(hasil)
}

const act = async (r)=>{
  const browser = await puppeteer.launch({headless : true, 
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  })
  
  const pid = browser.process().pid;

  await Controller.doitBro(browser,r) 
  
  await browser.close();
  exec('kill -9 ' + pid, (error, stdout, stderr) => {});  
}

logger.info("[SERVICE START] Service Cek PBRO Region 4 : " + dayjs().format("YYYY-MM-DD HH:mm:ss") );
//cron.schedule('*/1 * * * *', async() => { 
( async() => {   
  if (taskRunning) { 
      taskRunning = false    
      try {  
		      taskRunning = false                        
          logger.info("Memulai Menjalankan Pengecekan LISDC :: " +  dayjs().format("YYYY-MM-DD HH:mm:ss"))
            
          await myPromise(0,5)
          await myPromise(5,5)
          await myPromise(10,5)
          await myPromise(15,5)
          await myPromise(20,5)
          await myPromise(25,5)
          await myPromise(30,5)
          await myPromise(35,5)
          await myPromise(40,5)
          await myPromise(45,5)
          await myPromise(50,5)
          await myPromise(55,5)
          await myPromise(60,5)
          await myPromise(65,5)
          await myPromise(70,5)
          await myPromise(75,5)
          await myPromise(80,5)
          await myPromise(85,5)
          await myPromise(90,5)
          await myPromise(95,5)
          await myPromise(100,6)
            
          logger.info("[END] Pengecekan LISDC : " +  dayjs().format("YYYY-MM-DD HH:mm:ss") )
          taskRunning = true
      } catch (err) {
          taskRunning = true
          logger.emerg(err);
      }
  }

})();
