const checkAllSubmit = (e: { preventDefault: () => void; })=>{
    if( e !== null){
        e.preventDefault();
    }
    const checkAll = document.getElementById("c_all") as HTMLInputElement
    const ansList = Array.from(document.getElementsByTagName("input")as HTMLCollectionOf<HTMLInputElement>)
    for( const opt of ansList){
        if(opt.id.startsWith("c_") && opt.id !== "c_all" ){
            opt.checked = checkAll.checked
        }
    }
}

const submitRes = (e: { preventDefault: () => void; }) => {
    if( e !== null){
        e.preventDefault();
    }
    const age = document.getElementById("age") as HTMLParagraphElement;
    const gender = document.getElementById("gender") as HTMLParagraphElement;
    const education = document.getElementById("education") as HTMLParagraphElement;
    const errIn = document.getElementById("error") as HTMLParagraphElement;
    const ansList = Array.from(document.getElementsByTagName("input")as HTMLCollectionOf<HTMLInputElement>)
    if(!errIn.hidden || errIn.innerText ===  ""){
        errIn.textContent = "Error! Trying to submit with invalid hash user!"
        errIn.hidden = false
        age.textContent=""
        gender.textContent=""
        education.textContent=""
        return;
    }
    const results : any[]=[]
    for( const opt of ansList){
        if(opt.id.startsWith("c_") && opt.id !== "c_all" && opt.checked){
            const strId = opt.id.split("_")[1]
            const input = document.getElementById(strId) as HTMLInputElement;
            let resArray
            if(input === null){
                resArray=getCalcArray(strId)
            } else if (input.value !== "") {
                resArray = [parseInt(input.value,10)]
            }
            if(resArray!== undefined){
                results.push({
                    "name":strId,
                    "result":resArray
                })
            }
        }
    }
    if (results.length === 0){
        window.location.href = "/thankYou"
        return;
    }
    const body={
        "age":age.textContent,
        "education":education.textContent,
        "hash":errIn.textContent,
        "gender":gender.textContent==="Female",
        "results":results
    }
    fetch("/fillTests/", {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(()=>window.location.href = "/thankYou")

}

const getInfoOfHash = (e: { preventDefault: () => void; }) => {
    if( e !== null){
        e.preventDefault();
    }
    const hash = document.getElementById("hash") as HTMLInputElement
    const errIn = document.getElementById("error") as HTMLParagraphElement;
    const age = document.getElementById("age") as HTMLParagraphElement;
    const gender = document.getElementById("gender") as HTMLParagraphElement;
    const education = document.getElementById("education") as HTMLParagraphElement;
    const res = Array.from(document.getElementsByTagName("p")as HTMLCollectionOf<HTMLParagraphElement>)
    const checked = Array.from(document.getElementsByTagName("input")as HTMLCollectionOf<HTMLInputElement>)
    for(const r of res){
        if(r.id.indexOf("r_") === 0){
            r.innerText=""
        }
    }
    for(const c of checked){
        if(c.id.indexOf("c_") === 0){
            c.checked=false
        }
    }
    if (hash && errIn){
        fetch("/users/"+hash.value, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json'
            },
        })
        .then(response => response.json())
        .then((patient)=>{
            if(patient.isValid){
                errIn.textContent = "Error! not a valid hash user!"
                errIn.hidden = false
                age.textContent=""
                gender.textContent=""
                education.textContent=""
                return;
            } else {
                errIn.hidden = true
                errIn.textContent = hash.value
                age.textContent = Math.abs(new Date(new Date().getTime()-new Date(patient.dob).getTime()).getUTCFullYear() - 1970).toString()
                gender.textContent = patient.gender?"Female":"Male"
                education.textContent=patient.education
            }
        })
        .catch((err)=>{
            errIn.textContent = "Error! not a valid hash user!"
            errIn.hidden = false
            age.textContent=""
            gender.textContent=""
            education.textContent=""
            return;
        })
    }
}
const getCalcArray = (strId:string)=>{
    const dependencies : any= {
        "WAIS5VCI":["WAIS5SI","WAIS5VC","WAIS5IN","WAIS5CO"],
        "WAIS5PRI":["WAIS5BD","WAIS5MR","WAIS5VP","WAIS5FW","WAIS5PCm"],
        "WAIS5WMI":["WAIS5DS","WAIS5AR","WAIS5LN"],
        "WAIS5PSI":["WAIS5SS","WAIS5CD","WAIS5CA"],
        "WAIS5FSIQ":["WAIS5BD", "WAIS5SI", "WAIS5DS", "WAIS5MR", "WAIS5VC",
        "WAIS5AR", "WAIS5SS", "WAIS5VP", "WAIS5IN", "WAIS5CD", "WAIS5LN", "WAIS5FW", "WAIS5CO", "WAIS5CA", "WAIS5PCm"],
        "StroopColorWords":["StroopWords","StroopColor", "StroopCW"],
        "ACT":["ACT9","ACT18","ACT36"],
        "RFFTER":["RFFTerr","RFFTSD"],
        "DCT":["DCT1","DCT2"],
        "BTest":["BTest1","BTest2"],
        "RAVLTT1to5":["RAVLTT1","RAVLTT2","RAVLTT3","RAVLTT4","RAVLTT5"],
        "TOMM":["TOMM1","TOMM2"]
    }
    const arrRes = []
    for( const i of dependencies[strId]){
        if(i !== "DCT2" && i !== "BTest2"){
            const input = document.getElementById(i) as HTMLInputElement;
            if(input.value){
                    arrRes.push(parseInt(input.value,10))
            } else if(!strId.indexOf("WAIS5")){
                arrRes.push(-1)
            } else {
                return undefined
            }
        } else{
            const input = document.getElementById(i) as HTMLSelectElement
            arrRes.push(input.value)
        }
    }
    return arrRes
}

const calcTest = (e: { preventDefault: () => void; }, strId:string) => {
    if( e !== null){
        e.preventDefault();
    }
    const age = document.getElementById("age") as HTMLParagraphElement;
    const gender = document.getElementById("gender") as HTMLParagraphElement;
    const education = document.getElementById("education") as HTMLParagraphElement;
    const res = document.getElementById("r_"+strId) as HTMLParagraphElement;
    const check = document.getElementById("c_"+strId) as HTMLInputElement;
    const input = document.getElementById(strId) as HTMLInputElement;
    if(!age || age.innerText === ""){
        res.innerText="No Hash User Spesified!"
        return;
    }
    let resArray;
    if(input === null){
        resArray=getCalcArray(strId)
    } else {
        resArray = [parseInt(input.value,10)]
    }
    const body={
        age:parseInt(age.innerText,10),
        gender: gender.innerText === "Female",
        education:parseInt(education.innerText,10),
        result: resArray
    }
    fetch("/stat/"+strId, {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(body),
    })
    .then(response => response.json())
    .then((results)=>{
        res.innerText=results.res.toString()+", "+results.precentage.toString()+"% ile, "+results.raiting
        check.checked=true
    })
    .catch((err)=>{
        res.innerText="Something Went Wrong!"
        check.checked=false
    })

}

window.onload=() => {
    const btn = document.getElementById("generate") as HTMLButtonElement
    btn.addEventListener("click",getInfoOfHash)
    const submit1 = document.getElementById("submit1") as HTMLButtonElement
    submit1.addEventListener("click",submitRes)
    const submit2 = document.getElementById("submit2") as HTMLButtonElement
    submit2.addEventListener("click",submitRes)
    const calc = Array.from(document.getElementsByTagName("button")as HTMLCollectionOf<HTMLButtonElement>)
    for(const b of calc){
        if(b.id.indexOf("b_") === 0){
            b.addEventListener("click",(e)=>calcTest(e, b.id.split("_")[1]))
        }
    }
    const checkAll = document.getElementById("c_all") as HTMLInputElement
    checkAll.addEventListener("change", checkAllSubmit)
}