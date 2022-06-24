const deleteUser = (_event: MouseEvent, id: string)=>{
    _event.preventDefault();
    fetch("/users/"+id, {
        method: 'DELETE',
        headers:{
            'Content-Type':'application/json'
        },
    })
    .then(()=>{
        window.location.reload();
    })
    // tslint:disable-next-line:no-console
    .catch((err) => console.log(err));
}

const addDeleteFunctions =(arrayIds : string[])=>{
    for( const id of arrayIds){
        const dButton = document.getElementById("d_"+id) as HTMLButtonElement;
        dButton.addEventListener("click", (event)=>{deleteUser(event, id)})
    }
}

const loadUsers = (data: any) => {
    const form = document.getElementById("List") as HTMLDivElement;
    if(Object.keys(data).length === 0){
        form.innerHTML = "<p> No Patients yet! </p>"
    } else{
        const today = new Date().getTime()
        const arrayIds = []
        let innerString = ""
        innerString += "<table><thead><tr><th 'font-size=25px'>Hash of the Patient</th><th>Date of Birth</th><th>Current Age</th><th>Enucation</th><th>Gender</th><th></th></tr></thead><tbody>"
        for( const patient of data){
            const dob = new Date(patient.dob).getTime()
            const str = patient.dob as string
            const ageDate = new Date(today-dob);
            const genderstr = patient.gender?"Female":"Male"
            innerString += "<tr><td><p id='"+patient._id+"'>"+patient._id+"</p></td>"
            innerString += "<td><p>"+str.replaceAll("-","/").split("T")[0]+"</p></td>"
            innerString += "<td><p>"+(Math.abs(ageDate.getUTCFullYear() - 1970)).toString()+"</p></td>"
            innerString += "<td><p>"+patient.education+"</p></td>"
            innerString += "<td><p>"+genderstr+"</p></td>"
            innerString+="<td><button id='d_"+patient._id+"' class='btn-small' style='background-color: rgb(78, 90, 81);'><i class='material-icons right'>delete</i>Delete</button></td></tr>"
            arrayIds.push(patient._id)
        }
        innerString += "</tbody></table>"
        form.innerHTML=innerString
        addDeleteFunctions(arrayIds)
    }
}

window.onload=() => {
    const email = document.getElementById("email") as HTMLInputElement;
    let emailstr = ""
    if(email && email.value!=="all"){
        emailstr=+"mine/"+email.value;
    }
    fetch("/users/"+emailstr, {
        method: 'GET',
        headers:{
            'Content-Type':'application/json'
        },
    })
    .then(response => response.json())
    .then(loadUsers)
    // tslint:disable-next-line:no-console
    .catch((err) => console.log(err));

}