const fillQuestionareUserComapre = (data:any, ending:string) =>{
    const errIn = document.getElementById("error_"+ending) as HTMLParagraphElement;
    if(errIn){
        errIn.hidden = true
    }
    const table = document.getElementById("filling_questionare_"+ending) as HTMLTableElement;
    const arrayCells = Array.from(table.getElementsByTagName("td") as HTMLCollectionOf<HTMLTableCellElement>)
    for ( const cell of arrayCells){
        const index = data.questions.indexOf(cell.textContent)
        if(index > -1){
            const ansCell = cell.parentNode.childNodes[1] as HTMLTableCellElement;
            const ansList = Array.from(ansCell.getElementsByTagName("p")as HTMLCollectionOf<HTMLParagraphElement>)
            const ans = data.answers[index];
            if(ansList.length > 0){
                ansList[0].hidden = false
                if (ansList[0].innerText !== "" && ansList[0].innerText.includes("from range of [")){
                    ansList[0].innerText = ans + " from range of [" + ansList[0].innerText.split("[")[1]
                }  else {
                    ansList[0].innerText = ans
                }
            }
        }
    }
}

const printErrorCompare = (ending: string, errMsg : string)=>{
    const errIn = document.getElementById("error_"+ending) as HTMLParagraphElement;
    if(errIn){
        errIn.textContent = errMsg
        errIn.hidden = false
    }
    const ansList = Array.from(document.getElementsByTagName("p")as HTMLCollectionOf<HTMLParagraphElement>)
    for(const opt of ansList){
        if(opt.id.endsWith(ending) && opt.id !== "error_"+ending){
            if(opt.textContent.includes("from range of [") && opt.textContent.endsWith("]")){
                opt.textContent = opt.textContent.substring(opt.textContent.indexOf("from"))
            } else{
                opt.textContent = ""
            }
            opt.hidden = true
        }
    }
}

const getQuestionareFilledC = (e: { preventDefault: () => void; } , id : string, ending : string, timeStamp:string) =>{
    if(e!== null){
        e.preventDefault()
    }
    const hash = document.getElementById("hash") as HTMLInputElement;
    if (hash && hash.value !== ""){
        fetch("/filled/"+hash.value+"/"+id+"/"+timeStamp, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json'
            },
        })
        .then(response => response.json())
        .then((data)=>{fillQuestionareUserComapre(data, ending)})
        .catch(()=>{
            printErrorCompare(ending, "Could not load the content of this hash user! Try filling from scratch")
        })
    } else{
        printErrorCompare(ending, "Error! not a valid hash user!")
    }
}

const addEventListenersToTimes = (id:string) =>{
    const table1 = document.getElementById("times_1") as HTMLTableElement
    const table2 = document.getElementById("times_2") as HTMLTableElement
    let listTimes = Array.from(table1.getElementsByTagName("td") as HTMLCollectionOf<HTMLTableCellElement>)
    for (const element of listTimes){
        if (element.id.includes("times_filled")){
            const arr = element.id.split("_")
            element.addEventListener("click", (event)=>{getQuestionareFilledC(event, id, "1", arr[3])})
        }
    }
    listTimes = Array.from(table2.getElementsByTagName("td") as HTMLCollectionOf<HTMLTableCellElement>)
    for (const element of listTimes){
        if (element.id.includes("times_filled")){
            const arr = element.id.split("_")
            element.addEventListener("click", (event)=>{getQuestionareFilledC(event, id, "2", arr[3])})
        }
    }
}

const makeList = (data: any, ending:string) =>{
    const formF = document.getElementById("times_"+ending) as HTMLDivElement;
    if(formF){
        let newHTML = ""
        const countAnswers =0
        newHTML += "<table id='times_"+ending+"'><tbody>"
        for (const elem of data){
            newHTML+="<tr><td id='times_filled_"+ending+"_"+elem._id+"'>"
            newHTML+=elem.timestamp
            newHTML+="</td></tr>"
        }
        newHTML+="</tbody></table>"
        formF.innerHTML = newHTML
    }
}
const makeLists = (data:any, id:string) =>{
    if(data.length !== 0){
        makeList(data,"1")
        makeList(data,"2")
        addEventListenersToTimes(id)
    } else {
        printErrorCompare("1", "Could not load the content of this hash user! Try filling from scratch")
    }
}

const generateLists = (e: { preventDefault: () => void; } , id : string) => {
    if(e!== null){
        e.preventDefault()
    }
    const hash = document.getElementById("hash") as HTMLInputElement;
    if (hash && hash.value !== ""){
        fetch("/filled/"+hash.value+"/"+id, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json'
            },
        })
        .then(response => response.json())
        .then((data)=>{makeLists(data, id)})
        .catch(()=>{
            printErrorCompare("1", "Could not load the content of this hash user! Try filling from scratch")
        })
    } else{
        printErrorCompare("1", "Error! not a valid hash user!")
    }
}

const createQuestionareForForm = (data: any, ending : string) => {
    const formF = document.getElementById("fill_questionare_"+ending) as HTMLDivElement;
    const generate = document.getElementById("generate") as HTMLButtonElement;
    if(formF){
        let newHTML = ""
        let countAnswers =0
        newHTML += "<table id='filling_questionare_"+ending+"'><thead><tr><th>Question</th><th>Answer</th></tr></thead><tbody>"
        for (let i=0; i<data.questions.length; i++){
            newHTML+="<tr><td>"
            newHTML+=data.questions[i]
            newHTML+="</td><td>"
            if(data.category[i] === 1){
                const from = Number(data.answers[countAnswers][0].split("-")[0])
                const to = Number(data.answers[countAnswers][0].split("-")[1])
                newHTML+="<p hidden id='a_"+(i+3)+"_"+ending+"'> from range of ["+from+"-"+to+"]</p></td></tr>"
                countAnswers ++
            } else {
                if(data.category[i] === 0){
                    countAnswers ++
                }
                newHTML+="<p hidden id='a_"+(i+3)+"_"+ending+"'></p></td></tr>"
            }
        }
        newHTML+="</tbody></table>"
        formF.innerHTML = newHTML
    }
    if(generate){
        generate.addEventListener("click", (event)=>{generateLists(event, data._id)})
    }

}

const createTwoQuestionare = (data:any) =>{
    const name = document.getElementById("nameQuestionare") as HTMLParagraphElement;
    if (name){
        name.textContent = data.name
    }
    createQuestionareForForm(data, "1")
    createQuestionareForForm(data, "2")
}

window.onload=() => {
    const url = window.location.search;
    const queryStart = url.indexOf("?") + 1
    const queryEnd   = url.indexOf("#") + 1 || url.length + 1
    const query = url.slice(queryStart, queryEnd - 1)
    const id = query.replace(/\+/g, " ").split("&")[0];
    if (query === url || query === ""){
        // tslint:disable-next-line:no-console
        console.log("error")
    }
    fetch("/db/"+id, {
        method: 'GET',
        headers:{
            'Content-Type':'application/json'
        },
    })
    .then(response => response.json())
    .then(createTwoQuestionare)
}