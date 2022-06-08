const printErrorReport = (button: boolean, errMsg : string)=>{
    const errIn = document.getElementById("error") as HTMLParagraphElement;
    if(errIn && button){
        errIn.textContent = errMsg
        errIn.hidden = false
    } else if(errIn) {
        errIn.hidden = true
    }
    const ansList = Array.from(document.getElementsByTagName("input")as HTMLCollectionOf<HTMLInputElement>)
    for( const opt of ansList){
        if(opt.type === "radio" || opt.type=== "checkbox"){
            opt.checked = false
        } else {
            if (opt.type === "text"){
                opt.value = ""
            }
        }
    }
}

const sendToProduceReport = (e: { preventDefault: () => void; })=>{
    if(e!== null){
        e.preventDefault()
    }
    const listResults = []
    let bdi = ""
    let bai = ""
    let cognitive = ""
    let psychological = ""
    let physiological = ""
    const additional = []
    const statisticalTests = document.getElementById("times_tests") as HTMLTableElement
    const ansList = Array.from(statisticalTests.getElementsByTagName("input")as HTMLCollectionOf<HTMLInputElement>)
    for( const opt of ansList){
        if(opt.id.startsWith("c_") && opt.checked){
            listResults.push(opt.id.split("_")[1])
        }
    }
    const questionare = Array.from(document.getElementsByTagName("td")as HTMLCollectionOf<HTMLTableCellElement>)
    for( const opt of questionare){
        if(opt.id.startsWith("n_")){
            const name = opt.innerText
            const table = document.getElementById("times_"+opt.id.split("_")[1])
            const times = Array.from(table.getElementsByTagName("input") as HTMLCollectionOf<HTMLInputElement>)
            for(const choice of times){
                if(choice.type === 'radio' && choice.checked){
                    switch(name){
                        case "BDI-II":
                            bdi=choice.id as string
                            break
                        case "Beck Anxiety Inventory":
                            bai=choice.id as string
                            break
                        case "Psychological Questionnaire":
                            psychological=choice.id as string
                            break
                        case "Physiological Questionnaire":
                            physiological=choice.id as string
                            break
                        case "Cognitive Questionnare":
                            cognitive=choice.id as string
                            break
                        default:
                            additional.push(choice.id as string)
                    }
                    break;
                }
            }
        }
    }
    if(bdi===""||bai===""||cognitive===""||physiological===""||psychological===""||listResults.length===0){
        printErrorReport(true,"At least one option of each column (from BDI-II, Beck Anxiety Inventory, Psychological Questionnaire, Physiological Questionnaire, Cognitive Questionnare, Tests Results) must be choosen")
    }
    else{
        let herf = "/produced?list="+listResults.join("+")+"&bdi="+bdi+"&bai="+bai+"&cognitive="+cognitive+"&physiological="+physiological+"&psychological="+psychological
        if(additional.length > 0){
            herf+="&additional="+additional.join("+")
        }
        window.location.href = herf
    }
}

const fillListsOfAll=(data:any)=>{
    const table = document.getElementById("all") as HTMLTableElement
    if(data.length === 0){
        printErrorReport(true,"No Questionares with the spesified Hash")
    } else {
        printErrorReport(false,"")
    }
    const arrayCells = Array.from(table.getElementsByTagName("td") as HTMLCollectionOf<HTMLTableCellElement>)
    for( const cell of arrayCells){
        if(cell.id.indexOf("l_")===0){
            const questionareID = cell.id.split("_")[1]
            let newHTML = ""
            newHTML += "<table id='times_"+questionareID+"'><tbody>"
            for (const elem of data){
                if (elem.questionareId === questionareID){
                    newHTML+="<tr><td id='times_filled_"+elem.questionareId +"_"+elem._id+"'>"
                    newHTML+="<p><label><input type='radio' name='t_"+elem.questionareId+"' id='"+elem._id+"' value='"+elem.timestamp+"'>"
                    newHTML+="<span>"+elem.timestamp+"</span></label></p>"
                    newHTML+="</td></tr>"
                }
            }
            newHTML+="</tbody></table>"
            cell.innerHTML = newHTML
        }
    }
}

const fillListsOfTests=(data:any, hashID:string)=>{
    if(data.length === 0){
        printErrorReport(true,"No Statistical Tests with the spesified Hash")
    } else {
        printErrorReport(false,"")
    }
    fetch("/filled/"+hashID, {
        method: 'GET',
        headers:{
            'Content-Type':'application/json'
        },
    })
    .then(response => response.json())
    .then(fillListsOfAll)
    const formF = document.getElementById("tests") as HTMLTableCellElement
    if(formF){
        let newHTML = ""
        newHTML += "<table id='times_tests'><tbody>"
        for (const elem of data){
            newHTML+="<tr><td>"
            newHTML+="<p><label><input type='checkbox'  id='c_"+elem._id+"'>"
            newHTML+="<span></span></label>"+elem.timestamp+"</p>"
            newHTML+="</td></tr>"
        }
        newHTML+="</tbody></table>"
        formF.innerHTML = newHTML
    }
}
const createTable=(data:any)=>{
    let str ="<table id='all'><thead><td>Tests Results</td>"
    for(const questionate of data){
        str +="<td id='n_"+questionate._id+"'>"+questionate.name+"</td>"
    }
    str+="</thead><tbody><td id='tests'></td>"
    for(const questionate of data){
        str +="<td id='l_"+questionate._id+"'></td>"
    }
    str+="</tbody></table>"
    const form =  document.getElementById("chooseTable") as HTMLInputElement
    if (form){
        form.innerHTML=str
    }
}
const uploadAllFilled = (e: { preventDefault: () => void; })=>{
    if(e!== null){
        e.preventDefault()
    }
    const hash =  document.getElementById("hash") as HTMLInputElement
    if (hash){
        const hashID = hash.value
        fetch("/fillTests/"+hashID, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json'
            },
        })
        .then(response => response.json())
        .then((data)=>{fillListsOfTests(data,hashID)})
    }
}

window.onload=() => {
    const upload = document.getElementById("generate") as HTMLButtonElement;
    upload.addEventListener("click",uploadAllFilled)
    const send = document.getElementById("send") as HTMLButtonElement;
    send.addEventListener("click",sendToProduceReport)
    const form = document.getElementById("chooseTable") as HTMLDivElement;
    if(form){
        fetch("/db/", {
            method: 'GET',
            headers:{
                'Content-Type':'application/json'
            },
        })
        .then(response => response.json())
        .then(createTable)
        .catch((err)=>{printErrorReport(true,err.message)})
    }
}
