const sendQuestionare = (e: { preventDefault: () => void; })=>{
    e.preventDefault();
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
    // tslint:disable-next-line:no-console
    console.log(data)
    fetch("/db/", {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data),
    })
    // tslint:disable-next-line:no-console
    .then((res) => {window.location.href = "/listQuestionare"})
    // tslint:disable-next-line:no-console
    .catch((err) => console.log(err));
}

const deleteQuestion = (e: { preventDefault: () => void; }, numId: string) =>{
    e.preventDefault();
    const row = document.getElementById(numId);

    row.parentNode.removeChild(row);
}

const deleteAnswer = (e: { preventDefault: () => void; }, numId: string, id:string) =>{
    e.preventDefault();
    const row = document.getElementById(numId+"_"+id);
    row.parentNode.removeChild(row);
}

const addAnswer = (e: { preventDefault: () => void; }, numId: string, id:string) =>{
    e.preventDefault();
    // tslint:disable-next-line:no-console
    console.log(numId, id)
    const formA = document.getElementById("answers_"+numId) as HTMLParagraphElement;
    if(formA.innerHTML === ""){
        let newString = ""
        newString += "<table><tbody>"
        newString += "<tr id='"+numId+"_1'><td><input id='answer_"+numId+"_1' type='text' class='validate'></td>"
        newString += "<td><button id='deleteAnswer_"+numId+"_1' class='btn-small'><i class='material-icons right'>delete</i></button></td></tr></tbody></table>"
        formA.innerHTML = newString
    } else{
        const tableAnswers = Array.from(formA.getElementsByTagName("table") as HTMLCollectionOf<HTMLTableElement>);
        const row = tableAnswers[0].insertRow();
        row.id= numId + "_"+id;
        let newString = ""
        newString += "<td><input id='answer_"+numId+"_"+id+"' type='text' class='validate'></td>"
        newString += "<td><button id='deleteAnswer_"+numId+"_"+id+"' class='btn-small'><i class='material-icons right'>delete</i></button></td>"
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
    e.preventDefault();
    const form = document.getElementById("fill_questionare") as HTMLFormElement;
    if(form.innerHTML === ""){
        let newString = ""
        newString += "<table id='questionsTable'><thead><tr><th>Question</th><th>Answers</th><th>Delete</th><th>Add Answer</th></tr></thead><tbody>"
        newString += "<tr id='1'><td><input id='question_1' type='text' class='validate'></td>"
        newString += "<td><p id='answers_1'></p></td>"
        newString += "<td><button id='deleteQuestion_1' class='btn-small'><i class='material-icons right'>delete</i></button></td>"
        newString += "<td><button id='addAnswer_1' class='btn-small'><i class='material-icons right'>add</i></button></td></tr></tbody></table>"
        form.innerHTML = newString
    } else{
        const table = document.getElementById("questionsTable") as HTMLTableElement;
        const row = table.insertRow();
        row.id= id;
        let newString = ""
        newString += "<td><input id='question_"+id+"' type='text' class='validate'></td>"
        newString += "<td><p id='answers_"+id+"'></p></td>"
        newString += "<td><button id='deleteQuestion_"+id+"' class='btn-small'><i class='material-icons right'>delete</i></button></td>"
        newString += "<td><button id='addAnswer_"+id+"' class='btn-small'><i class='material-icons right'>add</i></button></td>"
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
window.onload=() => {
    const addBtn = document.getElementById("send") as HTMLButtonElement;
    const addQBtn = document.getElementById("addQuestion") as HTMLButtonElement;
    if(addBtn && addQBtn){
        addBtn.addEventListener('click',sendQuestionare);
        addQBtn.addEventListener('click', (event)=>{addNewQuestion(event, "1")})
    }

}