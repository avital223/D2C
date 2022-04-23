const validateEmail = (email : string) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const fillQuestionareUser = (data: any) => {
    const errIn = document.getElementById("error") as HTMLParagraphElement;
    if(errIn){
        errIn.hidden = true
    }
    const table = document.getElementById("filling_questionare") as HTMLTableElement;
    const arrayCells = Array.from(table.getElementsByTagName("td") as HTMLCollectionOf<HTMLTableCellElement>)
    for ( const cell of arrayCells){
        const index = data.questions.indexOf(cell.textContent)
        if(index > -1){
            const ansCell = cell.parentNode.childNodes[1] as HTMLTableCellElement;
            const ansList = Array.from(ansCell.getElementsByTagName("input")as HTMLCollectionOf<HTMLInputElement>)
            const ans = data.answers[index];
            if (ansList.length === 1){
                ansList[0].value = ans
            } else {
                for( const opt of ansList){
                    if(opt.value === ans){
                        opt.checked = true
                    }
                }
            }
        }
    }
    updateSaveButton(data.questionareId, data._id)
}

const updateSaveButton = (id: string, filledId: string) => {
    const save = document.getElementById("send") as HTMLButtonElement;
    save.replaceWith(save.cloneNode(true));
    const saveNew = document.getElementById("send") as HTMLButtonElement;
    if(saveNew){
        saveNew.addEventListener("click",(event)=>{sendFilled(event, id, filledId)})
    }
}

const printError = (button: boolean, id: string, errMsg : string)=>{
    const errIn = document.getElementById("error") as HTMLParagraphElement;
    if(errIn && button){
        errIn.textContent = errMsg
        errIn.hidden = false
    }
    updateSaveButton(id, "None")
    const ansList = Array.from(document.getElementsByTagName("input")as HTMLCollectionOf<HTMLInputElement>)
    for( const opt of ansList){
        if(opt.type === "radio"){
            opt.checked = false
        } else {
            if (opt.type === "text"){
                opt.value = ""
            }
        }
    }
}

const getQuestionareFilled = (e: { preventDefault: () => void; } , id : string, button : boolean) => {
    if( e !== null){
        e.preventDefault();
    }
    const email = document.getElementById("email") as HTMLInputElement;
    if (email && validateEmail(email.value)){
        fetch("/filled/"+email.value+"/"+id, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json'
            },
        })
        .then(response => response.json())
        .then(fillQuestionareUser)
        .catch(()=>{
            printError(button, id, "Could not load the content of this email! Try filling from scratch")
        })
    } else{
        printError(button, id, "Error! not a valid email!")
    }
}

const sendFilled = (_event: MouseEvent, questionareId: string, oldId: string) => {
    _event.preventDefault()
    const email = document.getElementById("email") as HTMLInputElement;
    const errIn = document.getElementById("error") as HTMLParagraphElement;
    if (!email || !validateEmail(email.value)){
        if(errIn){
            errIn.textContent = "Error! not a valid email!"
            errIn.hidden = false
        }
        return
    } else {
        if(errIn){
            errIn.hidden = true
        }
    }
    const arrayInputs = Array.from(document.getElementsByTagName("td") as HTMLCollectionOf<HTMLTableCellElement>)
    const arrayQuestions  = new Map<string, string>();
    const arrayAnswers  = new Map<string, string>();
    for (const inputType of arrayInputs){
        if(inputType.id.includes("q_")){
            const id = inputType.id.substring(inputType.id.indexOf("_")+1)
            arrayQuestions.set(id,inputType.textContent)
        }
        if(inputType.id.includes("a_")){
            const id = inputType.id.substring(inputType.id.indexOf("_")+1)
            const answerInputs = Array.from(inputType.getElementsByTagName("input") as HTMLCollectionOf<HTMLInputElement>)
            // if the answer is a open chaice
            if(answerInputs.length === 1){
                arrayAnswers.set(id,answerInputs[0].value)
            } else {
                // if the answer is a multiple choice
                for (const choice of answerInputs){
                    if(choice.type === 'radio' && choice.checked){
                        arrayAnswers.set(id,choice.value);
                    }
                }
            }

        }
    }
    const questionsS: string[] = []
    const answers:string[] = []
    arrayQuestions.forEach((value: string, key: string) => {
        questionsS.push(value)
        if ( arrayAnswers.get(key) !== undefined) {
            answers.push(arrayAnswers.get(key))
        } else {
            answers.push("None")
        }
    });
    // "email", "questionareId", "questions","answers"
    const data = {
        email: email.value,
        questionareId,
        questions: questionsS,
        answers
    }
    if(oldId !== "None"){
        fetch("/filled/"+oldId, {
            method: 'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data),
        })
        .then((res) => {window.location.href = "/listQuestionare"})
        // tslint:disable-next-line:no-console
        .catch((err) => console.log(err));
    } else {
        fetch("/filled/", {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data),
        })
        .then((res) => {window.location.href = "/listQuestionare"})
        // tslint:disable-next-line:no-console
        .catch((err) => console.log(err));
    }
}

const createQuestionare = (data: any) => {
    const formF = document.getElementById("fill_questionare") as HTMLDivElement;
    const name = document.getElementById("nameQuestionare") as HTMLParagraphElement;
    const generate = document.getElementById("generate") as HTMLButtonElement;
    if (name){
        name.textContent = data.name
    }
    if(formF){
        let newHTML = ""
        let countAnswers = 0;
        newHTML += "<table id='filling_questionare'><thead><tr><th>Question</th><th>Answer</th></tr></thead><tbody>"
        for (let i=0; i<data.questions.length; i++){
            newHTML+="<tr><td id='q_"+i+"'>"
            newHTML+=data.questions[i]
            newHTML+="</td><td id='a_"+i+"'>"
            if(data.category[i] === 2){
                newHTML+="<input type='text' id='ai_"+i+"' ref='answer'></td></tr>"
            } else{
                if(data.category[i]===0){
                    const answerArray = data.answers[countAnswers]
                    for(let j=0;j<answerArray.length;j++){
                        newHTML+="<p><label><input type='radio' name='q_"+i+"' id='"+j+"' value='"+answerArray[j]+"'>"
                        newHTML+="<span>"+answerArray[j]+"</span></label></p>"

                    }
                    newHTML+="</td></tr>"
                }else{
                    // category == 1
                    const from = Number(data.answers[countAnswers][0].split("-")[0])
                    const to = Number(data.answers[countAnswers][0].split("-")[1])
                    for(let j=from;j<=to;j++){
                        newHTML+="<p><label><input type='radio' name='q_"+i+"' id='"+j+"' value='"+j+"'>"
                        newHTML+="<span>"+j+"</span></label></p>"
                    }
                    newHTML+="</td></tr>"
                }
                countAnswers ++
            }
        }
        newHTML+="</tbody></table>"
        formF.innerHTML = newHTML
    }
    if(generate){
        generate.addEventListener("click", (event)=>{getQuestionareFilled(event, data._id, true)})
    } else {
        getQuestionareFilled(null, data._id, false)
    }

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
    .then(createQuestionare)
}