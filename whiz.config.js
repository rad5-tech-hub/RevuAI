  import {Whiz} from "commitwhiz"


const whizConfig = Whiz.config({
    key:process.env.GEMINI_API_KEY,
    useTextEditor:false,
    autoPush:false,
    autoPushOptions:{
      model:""
    }
})

export default whizConfig

