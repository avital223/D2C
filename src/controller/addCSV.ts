import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse';

const deleteCSV = (e: { preventDefault: () => void; }, numId: string, id:string) =>{
    if( e !== null){
        e.preventDefault();
    }
    const row = document.getElementById(numId);

    row.parentNode.removeChild(row);
}

const deleteCSVfile =  (e: { preventDefault: () => void; }, numId: string) =>{
    if( e !== null){
        e.preventDefault();
    }
    const row = document.getElementById(numId);

    row.parentNode.removeChild(row);
}

const addCSV = (e: { preventDefault: () => void; }, numId: string, id:string) =>{
    if( e !== null){
        e.preventDefault();
    }
    const formA = document.getElementById("answers_"+numId) as HTMLParagraphElement;
    if(formA.innerHTML === ""){
        let newString = ""
        newString += "<table><tbody>"
        newString += "<tr id='"+numId+"_1'><td><input id='CSV_"+numId+"_1' type='text' class='validate'></td>"
        newString += "<td><button id='deleteCSV_"+numId+"_1' class='btn-small'><i class='material-icons right'>delete</i></button></td></tr></tbody></table>"
        formA.innerHTML = newString
    } else{
        const tableCSVs = Array.from(formA.getElementsByTagName("table") as HTMLCollectionOf<HTMLTableElement>);
        const row = tableCSVs[0].insertRow();
        row.id= numId + "_"+id;
        let newString = ""
        newString += "<td><input id='CSV_"+numId+"_"+id+"' type='text' class='validate'></td>"
        newString += "<td><button id='deleteCSV_"+numId+"_"+id+"' class='btn-small'><i class='material-icons right'>delete</i></button></td>"
        row.innerHTML = newString;
    }
    const button =  document.getElementById("deleteCSV_"+numId+"_"+id) as HTMLButtonElement;
    button.addEventListener("click", (event)=>{deleteCSV(event,numId, id)})
    // update the add new CSV button to add a new CSV with the next id.
    let addQBtn = document.getElementById("addCSV_"+numId) as HTMLButtonElement;
    addQBtn.replaceWith(addQBtn.cloneNode(true));
    addQBtn = document.getElementById("addCSV_"+numId) as HTMLButtonElement;
    const newId = (Number(id) +1).toString()
    addQBtn.addEventListener('click', (event)=>{addCSV(event,numId, newId)} )
}

const addNewCSV = (e: { preventDefault: () => void; }, id:string) =>{
    if( e !== null){
        e.preventDefault();
    }
    const form = document.getElementById("add_CSV") as HTMLFormElement;
    if(form.innerHTML === ""){
        let newString = ""
        newString += "<table id='CSVsTable'><thead><tr><th>CSV</th><th>Answers</th><th>Delete</th><th>Add CSV</th></tr></thead><tbody>"
        newString += "<tr id='1'><td><input id='CSV_1' type='text' class='validate'></td>"
        newString += "<td><p id='answers_1'></p></td>"
        newString += "<td><button id='deleteCSV_1' class='btn-small'><i class='material-icons right'>delete</i></button></td>"
        newString += "<td><button id='addAnswer_1' class='btn-small'><i class='material-icons right'>add</i></button></td></tr></tbody></table>"
        form.innerHTML = newString
    } else{
        const table = document.getElementById("CSVsTable") as HTMLTableElement;
        const row = table.insertRow();
        row.id= id;
        let newString = ""
        newString += "<td><input id='CSV_"+id+"' type='text' class='validate'></td>"
        newString += "<td><p id='answers_"+id+"'></p></td>"
        newString += "<td><button id='deleteCSV_"+id+"' class='btn-small'><i class='material-icons right'>delete</i></button></td>"
        newString += "<td><button id='addAnswer_"+id+"' class='btn-small'><i class='material-icons right'>add</i></button></td>"
        row.innerHTML = newString;
    }
    const button =  document.getElementById("deleteCSV_" +id) as HTMLButtonElement;
    button.addEventListener("click", (event)=>{deleteCSVfile(event, id)})
    const buttonAdd = document.getElementById("addAnswer_"+id) as HTMLButtonElement;
    buttonAdd.addEventListener("click", (event)=>{addAnswer(event, id, "1")})
    // update the add new question button to add a new question with the next id.
    const addQBtn = document.getElementById("addCSV") as HTMLButtonElement;
    addQBtn.replaceWith(addQBtn.cloneNode(true));
    const newAddQBtn = document.getElementById("addCSV") as HTMLButtonElement;
    const newId = (Number(id) +1).toString()
    newAddQBtn.addEventListener('click', (event)=>{addNewCSV(event, newId)} )
}


// const prepareData= () => {
//     const name = document.getElementById("name") as HTMLInputElement;
//     const table = document.getElementById("CSVsTable") as HTMLTableElement;
//     const arrayInputs = Array.from(table.getElementsByTagName("input") as HTMLCollectionOf<HTMLInputElement>)
//     const arrayCSVs  = new Map<string, string>();
//     const arrayAnswers = new Map<string,string[]>()
//     for (const inputType of arrayInputs){
//         if(inputType.id.includes("CSV_")){
//             const id = inputType.id.substring(inputType.id.indexOf("_")+1)
//             arrayCSVs.set(id,inputType.value)
//         }
//         if(inputType.id.includes("answer_")){
//             const id = inputType.id.substring(inputType.id.indexOf("_")+1,inputType.id.lastIndexOf("_") )
//             if (arrayAnswers.get(id) !== undefined){
//                 arrayAnswers.get(id).push(inputType.value)
//             } else {
//                 arrayAnswers.set(id,[inputType.value])
//             }
//         }
//     }
//     const rExp : RegExp = /\d+\-\d+/gi;
//     const CSVs: string[] = []
//     const answers:string[][] = []
//     const categories : number[] = []
//     arrayCSVs.forEach((value: string, key: string) => {
//         if ( arrayAnswers.get(key) !== undefined) {
//             const oldArray = arrayAnswers.get(key) as unknown as string[]
//             if(oldArray.length === 1 && oldArray[0].match(rExp)){
//                 categories.push(1)
//             } else {
//                 categories.push(0)
//             }
//             answers.push(oldArray)
//         } else{
//             categories.push(2)
//         }
//         CSVs.push(value)
//     });
//     const data = {
//         name: name.value,
//         CSV: CSVs,
//         category: categories,
//         answers
//     }
//     return data
// }

const updateCSV = (e: { preventDefault: () => void; }, id:string)=>{
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
    .then((res) => {window.location.href = "/listCSVs"})
    // tslint:disable-next-line:no-console
    .catch((err) => console.log(err));
}


type WorldCity = {
  Cognitive_Domain: string;
  Score: number;
  Performance_Rating: string;
  Norms: string;
  Correction : string;
};
(() => {
  const csvFilePath = path.resolve(__dirname, 'src\data\results_example.csv');

  const headers = ['Cognitive_Domain', 'Score', 'Performance_Rating', 'Norms', 'Correction'];

  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

  parse(fileContent, {
    delimiter: ',',
    columns: headers,
  }, (error, result: WorldCity[]) => {
    if (error) {
      console.error(error);
    }

    console.log("Result", result);
  });
})();