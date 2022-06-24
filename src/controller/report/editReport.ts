const addTextToEditors = (data:any) => {
    fetch("/users/"+data.hash, {
        method: 'GET',
        headers:{
            'Content-Type':'application/json'
        },
    })
    .then(response => response.json())
    .then((res)=>{
        const dob = new Date(res.dob).getTime()
        const age =(Math.abs(new Date(new Date().getTime()-dob).getUTCFullYear() - 1970)).toString()
        let p = document.getElementById("age") as HTMLParagraphElement
        p.textContent= age
        p = document.getElementById("dob") as HTMLParagraphElement
        p.textContent= res.dob.toString().split("T")[0]
        p = document.getElementById("date") as HTMLParagraphElement
        p.textContent= data.time as string
        p = document.getElementById("Cdate") as HTMLParagraphElement
        p.textContent= new Date().toString().split("T")[0]
    });
    //     new CognitiveSymptoms(), new PsychologicalSymptoms(), new PhysicalSymptoms(), new Emotional(), new Attention(), new FrontalSystems(), new GeneralIntelligence(), new Learning(),
    //     new Motoring(), new Opening(), new Speech(), new Visual(), new ListTests(), new Table(), hash
    const order = [0,1,2,12,9,6,4,11,10,7,5,8,3]
    for( let i=1;i<14;i++){
        const filled = document.getElementById("f"+i.toString()) as HTMLTextAreaElement
        filled.value = data.par[order[i-1]]
    }
    const table = document.getElementById("appendex") as HTMLTableElement
    const body = document.createElement('tbody')
    body.innerHTML = data.par[13]
    table.appendChild(body)
}

const produceDox = (e: { preventDefault: () => void; })=>{
    if( e !== null){
        e.preventDefault();
    }
    const report = document.getElementById("report") as HTMLElement
    const copy = report.cloneNode(true) as HTMLElement
    const textareaElements = Array.from(copy.getElementsByTagName("textarea") as  HTMLCollectionOf<HTMLTextAreaElement>)
    for(const textarea of textareaElements){
        const content = textarea.value.replaceAll("\n","<br></br>")
        const p = document.createElement("p")
        p.innerHTML = content
        textarea.replaceWith(p)
    }
    const body={
        "html":copy.innerHTML
    }
    fetch("/report/save", {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(res=>res.blob())
    .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', "report.docx");
        document.body.appendChild(link);
        link.click();
    })
    .catch((error) => {
        alert(error);
    })
}


window.onload=() => {
    const url = window.location.search;
    const textareaElements = Array.from(document.getElementsByTagName("textarea") as  HTMLCollectionOf<HTMLTextAreaElement>)
    for(const t of textareaElements){
        t.rows = 20
    }
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
    const produce = document.getElementById("produce") as HTMLButtonElement
    produce.addEventListener("click",produceDox)
}