const validateEmail = (email : string) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

const sendFilled = (_event: MouseEvent, questionareId: string) => {
    const email = document.getElementById("email") as HTMLInputElement;
    if (!email || !validateEmail(email.value)){
        const errIn = document.getElementById("error") as HTMLParagraphElement;
        if(errIn){
            errIn.textContent = "Error! not a valid email!"
            errIn.hidden = false
        }
        return;
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

const createQuestionare = (data: any) => {
    const formF = document.getElementById("fill_questionare") as HTMLDivElement;
    const name = document.getElementById("nameQuestionare") as HTMLParagraphElement;
    if (name){
        name.textContent = data.name
    }
    if(formF){
        // tslint:disable-next-line:no-console
        console.log("error")
        let newHTML = ""
        let countAnswers = 0;
        newHTML += "<table><thead><tr><th>Question</th><th>Answer</th></tr></thead><tbody>"
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
                    for(let j=from;j<to;j++){
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

}

window.onload=() => {
    const url = window.location.search;
    const queryStart = url.indexOf("?") + 1
    const queryEnd   = url.indexOf("#") + 1 || url.length + 1
    const query = url.slice(queryStart, queryEnd - 1)
    const id = query.replace(/\+/g, " ").split("&")[0];
    const save = document.getElementById("send") as HTMLButtonElement;
    if(save){
        save.addEventListener("click",(event)=>{sendFilled(event, id)})
    }
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
