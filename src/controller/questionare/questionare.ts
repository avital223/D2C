const deleteQuestion = (e: { preventDefault: () => void; }, numId: string) =>{
    if( e !== null){
        e.preventDefault();
    }
    const row = document.getElementById(numId);

    row.parentNode.removeChild(row);
}

const deleteAnswer = (e: { preventDefault: () => void; }, numId: string, id:string) =>{
    if( e !== null){
        e.preventDefault();
    }
    const row = document.getElementById(numId+"_"+id);
    row.parentNode.removeChild(row);
}

const addAnswer = (e: { preventDefault: () => void; }, numId: string, id:string) =>{
    if( e !== null){
        e.preventDefault();
    }
    const formA = document.getElementById("answers_"+numId) as HTMLParagraphElement;
    if(formA.innerHTML === ""){
        let newString = ""
        newString += "<table><tbody>"
        newString += "<tr id='"+numId+"_1'><td><input id='answer_"+numId+"_1' type='text' class='validate'></td>"
        newString += "<td><button  style='background-color: rgb(78, 90, 81);' id='deleteAnswer_"+numId+"_1' class='btn-small'><i class='material-icons right'>delete</i></button></td></tr></tbody></table>"
        formA.innerHTML = newString
    } else{
        const tableAnswers = Array.from(formA.getElementsByTagName("table") as HTMLCollectionOf<HTMLTableElement>);
        const row = tableAnswers[0].insertRow();
        row.id= numId + "_"+id;
        let newString = ""
        newString += "<td><input id='answer_"+numId+"_"+id+"' type='text' class='validate'></td>"
        newString += "<td><button   style='background-color: rgb(78, 90, 81);' id='deleteAnswer_"+numId+"_"+id+"' class='btn-small'><i class='material-icons right'>delete</i></button></td>"
        row.innerHTML = newString;
    }
    const button =  document.getElementById("deleteAnswer_"+numId+"_"+id) as HTMLButtonElement;
    button.addEventListener("click", (event)=>{deleteAnswer(event,numId, id)})
    // update the add new answer button to add a new answer with the next id.
    let addQBtn = document.getElementById("addAnswer_"+numId) as HTMLButtonElement;
    addQBtn.replaceWith(addQBtn.cloneNode(true));
    addQBtn = document.getElementById("addAnswer_"+numId) as HTMLButtonElement;
    const newId = (Number(id) +1).toString()
    addQBtn.addEventListener('click', (event)=>{addAnswer(event,numId, newId)} )
}
const addNewQuestion = (e: { preventDefault: () => void; }, id:string)=>{
    if( e !== null){
        e.preventDefault();
    }
    const form = document.getElementById("fill_questionare") as HTMLFormElement;
    if(form.innerHTML === ""){
        let newString = ""
        newString += "<table id='questionsTable'><thead><tr><th>Question</th><th>Answers</th><th>Delete</th><th>Add Answer</th></tr></thead><tbody>"
        newString += "<tr id='1'><td><input id='question_1' type='text' class='validate'></td>"
        newString += "<td><p id='answers_1'></p></td>"
        newString += "<td><button  style='background-color: rgb(78, 90, 81);' id='deleteQuestion_1' class='btn-small'><i class='material-icons right'>delete</i></button></td>"
        newString += "<td><button  style='background-color: rgb(78, 90, 81);' id='addAnswer_1' class='btn-small'><i class='material-icons right'>add</i></button></td></tr></tbody></table>"
        form.innerHTML = newString
    } else{
        const table = document.getElementById("questionsTable") as HTMLTableElement;
        const row = table.insertRow();
        row.id= id;
        let newString = ""
        newString += "<td><input id='question_"+id+"' type='text' class='validate'></td>"
        newString += "<td><p id='answers_"+id+"'></p></td>"
        newString += "<td><button  style='background-color: rgb(78, 90, 81);' id='deleteQuestion_"+id+"' class='btn-small'><i class='material-icons right'>delete</i></button></td>"
        newString += "<td><button  style='background-color: rgb(78, 90, 81);' id='addAnswer_"+id+"' class='btn-small'><i class='material-icons right'>add</i></button></td>"
        row.innerHTML = newString;
    }
    const button =  document.getElementById("deleteQuestion_"+id) as HTMLButtonElement;
    button.addEventListener("click", (event)=>{deleteQuestion(event, id)})
    const buttonAdd = document.getElementById("addAnswer_"+id) as HTMLButtonElement;
    buttonAdd.addEventListener("click", (event)=>{addAnswer(event, id, "1")})
    // update the add new question button to add a new question with the next id.
    const addQBtn = document.getElementById("addQuestion") as HTMLButtonElement;
    addQBtn.replaceWith(addQBtn.cloneNode(true));
    const newAddQBtn = document.getElementById("addQuestion") as HTMLButtonElement;
    const newId = (Number(id) +1).toString()
    newAddQBtn.addEventListener('click', (event)=>{addNewQuestion(event, newId)} )
}

const prepareData= () => {
    const name = document.getElementById("name") as HTMLInputElement;
    const table = document.getElementById("questionsTable") as HTMLTableElement;
    const arrayInputs = Array.from(table.getElementsByTagName("input") as HTMLCollectionOf<HTMLInputElement>)
    const arrayQuestions  = new Map<string, string>();
    const arrayAnswers = new Map<string,string[]>()
    for (const inputType of arrayInputs){
        if(inputType.id.includes("question_")){
            const id = inputType.id.substring(inputType.id.indexOf("_")+1)
            arrayQuestions.set(id,inputType.value)
        }
        if(inputType.id.includes("answer_")){
            const id = inputType.id.substring(inputType.id.indexOf("_")+1,inputType.id.lastIndexOf("_") )
            if (arrayAnswers.get(id) !== undefined){
                arrayAnswers.get(id).push(inputType.value)
            } else {
                arrayAnswers.set(id,[inputType.value])
            }
        }
    }
    const rExp : RegExp = /\d+\-\d+/gi;
    const questionsS: string[] = []
    const answers:string[][] = []
    const categories : number[] = []
    arrayQuestions.forEach((value: string, key: string) => {
        if ( arrayAnswers.get(key) !== undefined) {
            const oldArray = arrayAnswers.get(key) as unknown as string[]
            if(oldArray.length === 1 && oldArray[0].match(rExp)){
                categories.push(1)
            } else {
                categories.push(0)
            }
            answers.push(oldArray)
        } else{
            categories.push(2)
        }
        questionsS.push(value)
    });
    const data = {
        name: name.value,
        questions: questionsS,
        category: categories,
        answers
    }
    return data
}

const sendQuestionare = (e: { preventDefault: () => void; })=>{
    if( e !== null){
        e.preventDefault();
    }
    const data = prepareData();
    fetch("/db/", {
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

const updateQuestionare = (e: { preventDefault: () => void; }, id:string)=>{
    if( e !== null){
        e.preventDefault();
    }
    const data = prepareData();
    fetch("/db/"+id, {
        method: 'PUT',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data),
    })
    .then((res) => {window.location.href = "/listQuestionare"})
    // tslint:disable-next-line:no-console
    .catch((err) => console.log(err));

}

const constructWindow = (questionare: any) =>{
    const nameFiend = document.getElementById("name") as HTMLInputElement;
    nameFiend.value = questionare.name;
    let counter = 0
    for(let i=1; i<= questionare.questions.length; i++){
        addNewQuestion(null, i.toString())
        if(questionare.category[i-1]!==2){
            const answers = questionare.answers[counter]
            for(let j=1; j<= answers.length; j++){
                addAnswer(null, i.toString(), j.toString())
                const answer = document.getElementById("answer_"+i.toString()+"_"+j.toString()) as HTMLInputElement
                if(answer){
                    answer.value = answers[j-1]
                }
            }
            counter ++;
        }
        const question = document.getElementById("question_"+i.toString()) as HTMLInputElement
        if(question){
            question.value = questionare.questions[i-1]
        }
    }
}

window.onload=() => {

    if(window.location.pathname.includes("editQuestionare")) {
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
        .then(constructWindow)
        .then (()=>{
            const addBtn = document.getElementById("send") as HTMLButtonElement;
            if(addBtn){
                addBtn.addEventListener('click', (event)=>{updateQuestionare(event, id)});
            }
        })
        // tslint:disable-next-line:no-console
        .catch((err) => console.log(err));
    } else {
        const addBtn = document.getElementById("send") as HTMLButtonElement;
        const addQBtn = document.getElementById("addQuestion") as HTMLButtonElement;
        if(addBtn && addQBtn){
            addBtn.addEventListener('click',sendQuestionare);
            addQBtn.addEventListener('click', (event)=>{addNewQuestion(event, "1")})
        }
    }
}