const listOfTests = (data: any) => {
    const form = document.getElementById("List") as HTMLDivElement;
    if(Object.keys(data).length === 0){
        form.innerHTML = "<p> No test yet! </p>"
    } else{
        const arrayIds = []
        let innerString = ""
        innerString += "<table><thead><tr><th>Name of test</th><th></th><th></th><th></th></tr></thead><tbody>"
        for( const test of data){
            innerString += "<tr><td><p id='"+test._id+"'>"+test.name+"</p></td>"
            innerString+="<td>text id='d_"+test._id+"' class='btn-small'><i class='material-icons right'>delete</i>Delete</text></td>"
            innerString+="<td><textid='c_"+test._id+"' class='btn-small'><i class='material-icons right'>compare</i>Compare</text></td>"
            innerString+="<td><text id='u_"+test._id+"' class='btn-small'><i class='material-icons right'>edit</i>Edit</text></td></tr>"
            arrayIds.push(test._id)
        }
        innerString += "</table>"
        form.innerHTML=innerString
        addDeleteAndUpadteFunctions(arrayIds)
    }
}

const fillTests = (e: { preventDefault: () => void; })=>{
    if( e !== null){
        e.preventDefault();
    }
    const body = getContentCSV()
    fetch("/fillTests", {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(body)
    })
    .then((res) => {window.location.href = "/fillTests"})
    // tslint:disable-next-line:no-console
    .catch((err) => console.log(err));
}


window.onload=() => {
    const button = document.getElementById("fillTests") as HTMLDivElement;
    if(button){
        button.addEventListener("click", fillTests)
        fetch("/fillTests/", {
            method: 'GET',
            headers:{
                'Content-Type':'application/json'
            },
        })
        .then(response => response.json())
        .then(loadList)
        // tslint:disable-next-line:no-console
        .catch((err) => console.log(err));
    }
}
