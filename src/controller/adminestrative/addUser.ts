const printErrorUser = ( errMsg : string)=>{
    const errIn = document.getElementById("error") as HTMLParagraphElement;
    if (!errIn){
        return;
    }
    errIn.hidden = false;
    errIn.textContent = errMsg
}


const addNewUser = (e: { preventDefault: () => void; }) => {
    if( e !== null){
        e.preventDefault();
    }
    const email = document.getElementById("email") as HTMLInputElement
    const dob = document.getElementById("dob") as HTMLInputElement
    const education = document.getElementById("education") as HTMLInputElement
    const genderm = Array.from(document.querySelectorAll('input[name="gender"]') as NodeListOf<HTMLInputElement>);
    let gender
    if(genderm[0].value === "male"){
        if(genderm[0].checked){
            gender = false
        } else if (genderm[1].checked){
            gender = true
        }
    } else {
        if(genderm[0].checked){
            gender = true
        } else if (genderm[1].checked){
            gender = false
        }
    }
    if (gender === undefined){
        printErrorUser("No Gender specified!")
        return;
    }
    if (dob.value === ""){
        printErrorUser("No Date of Birth specified!")
        return;
    }
    if (education.value === ""){
        printErrorUser("No Number of education years specified!")
        return;
    }
    const body={
        "gender":gender,
        "education":education.value,
        "dob":dob.value,
        "email":email.value
    }
    fetch("/users/", {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(response => response.text())
    .then((data)=>{printErrorUser("The user that was added is with the hash: "+data)})
    .then(()=>{const btn =  document.getElementById("send") as HTMLButtonElement;
                btn.disabled = true})
}
window.onload=() => {
    const add = document.getElementById("send") as HTMLButtonElement;
    add.addEventListener("click", addNewUser)
}
