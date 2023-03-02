const conn = require('../services/db'); 
 

const dataServer = async (a,b) => {
    try{
       
        const rows = await conn.query(`
        SELECT dc_induk,dc_kode,jenis_dc,nama,ip,address,username,pass,reg FROM m_server_lis
        order by dc_induk,dc_kode
        limit ${a},${b};
        `)
        return rows
    }catch(e){
        return "Error"
    }
} 
 
const insertData = async (data) => {
    try{
        
        const queryInsert = `REPLACE INTO m_npdc (tanggal,dc,jenis,toko,namaToko,namafile,jamWeb,jamCsv,jamKirim,jamKonfirm,jamToko,docno,jmlItem,jamBpb,bukti_no,jmlBpb,lastupd) values ?`
        
        await conn.insert(  {sql: queryInsert, values: [data]})
        
        return "Sukses"
    }catch(e){
        console.log(e)
        return "Error"
    }
}
  
module.exports = {
    dataServer,insertData
  }
