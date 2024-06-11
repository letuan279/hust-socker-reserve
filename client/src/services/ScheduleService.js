import Http from './api'
const BaseUrl=`http://localhost:3000/api`
class SCheduleService{
    getBooking=async ()=>{
        try{
            const url=`${BaseUrl}/booking`
            return await Http.get(url);
        }catch(err){
            console.log("[get all post]",err)
            return null;
        }
        
    }

    
}

export default  new SCheduleService()