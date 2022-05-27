const fillQuestionareUserComapre = (data:any, ending:string) =>{
    const errIn = document.getElementById("error_"+ending) as HTMLParagraphElement;
    if(errIn){
        errIn.hidden = true
    }
    const table = document.getElementById("filling_questionare_"+ending) as HTMLTableElement;
    const arrayCells = Array.from(table.getElementsByTagName("td") as HTMLCollectionOf<HTMLTableCellElement>)
    // tslint:disable-next-line:no-console
    console.log(data)
    for ( const cell of arrayCells){
        const index = data.questions.indexOf(cell.textContent)
        if(index > -1){
            const ansCell = cell.parentNode.childNodes[1] as HTMLTableCellElement;
            const ansList = Array.from(ansCell.getElementsByTagName("p")as HTMLCollectionOf<HTMLParagraphElement>)
            const ans = data.answers[index];
            if(ansList.length > 0 && ans !== "None"){
                ansList[0].hidden = false
                if (ansList[0].innerText !== ""){
                    ansList[0].innerText = ans + " " + ansList[0].innerText
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
    for( const opt of ansList){
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

const getQuestionareFilledC = (e: { preventDefault: () => void; } , id : string, ending : string) =>{
    if(e!== null){
        e.preventDefault()
    }
    const hash = document.getElementById("hash_"+ending) as HTMLInputElement;
    if (hash && hash.value !== ""){
        fetch("/filled/"+hash.value+"/"+id, {
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

const generateLists = (e: { preventDefault: () => void; } , id : string) => {

}

const createQuestionareForForm = (data: any, ending : string) => {
    const formF = document.getElementById("fill_questionare_"+ending) as HTMLDivElement;
    const generate = document.getElementById("generate_"+ending) as HTMLButtonElement;
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
        generate.addEventListener("click", (event)=>{getQuestionareFilledC(event, data._id, ending)})
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