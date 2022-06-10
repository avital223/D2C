const addTextToEditors = (data:any) => {
//     new CognitiveSymptoms(), new PsychologicalSymptoms(), new PhysicalSymptoms(), new Emotional(), new Attention(), new FrontalSystems(), new GeneralIntelligence(), new Learning(),
//     new Motoring(), new Opening(), new Speech(), new Visual(), new ListTests()

    const order = [0,1,2,12,9,6,4,11,10,7,5,8,3]
    for( let i=1;i<14;i++){
        const filled = document.getElementById("f"+i.toString()) as HTMLTextAreaElement
        filled.value = data[order[i-1]]
    }
}

const produceDox = (e: { preventDefault: () => void; })=>{
    if( e !== null){
        e.preventDefault();
    }
    
}


window.onload=() => {
    const url = window.location.search;
    const queryStart = url.indexOf("?") + 1
    const queryEnd   = url.indexOf("#") + 1 || url.length + 1
    const query = url.slice(queryStart, queryEnd - 1)
    const queryArr = query.replace(/\+/g, " ").split("&");
    const listRes = queryArr[0].split("=")[1].split(" ")
    const bdi = queryArr[1].split("=")[1]
    const bai = queryArr[2].split("=")[1]
    const cognitive = queryArr[3].split("=")[1]
    const psychological = queryArr[4].split("=")[1]
    const physical = queryArr[5].split("=")[1]
    const body ={
        "name":"{name}",
        "resultsids":listRes,
        "bdi":bdi,
        "bai":bai,
        "cognitive":cognitive,
        "psychological":psychological,
        "physical":physical
    }
    fetch("/report/", {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(addTextToEditors)
    // tslint:disable-next-line:no-console
    .catch(console.log)
    // const save = document.getElementById("save") as HTMLButtonElement
    // save.addEventListener("click",saveReport)
    const produce = document.getElementById("produce") as HTMLButtonElement
    produce.addEventListener("click",produceDox)
}