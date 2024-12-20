let questionObjList = [];
let saveData = {answers: []};
let currentIndex = null;
let answeredIDList = [];
let capsuleCount = 0;

const questionText = document.getElementById("question-text");
const skipButton = document.getElementById("skip-button");
const saveButton = document.getElementById("save-button");
const downloadButton = document.getElementById("download-button");

fetch("./resources/questions.json")
.then(response => {
    if (!response.ok){
        throw new Error("Cannot read the file")
    }
    return response.json();
})
.then(data => {
    questionObjList = data.questions;
    getRandomQuestion();
})
.catch(error => {
    console.error('There was a problem with the fetch operation:', error);
});

const getRandomQuestion = () => {
    currentIndex = Math.floor(Math.random()*100 - 1);
    console.log(answeredIDList)
    while (answeredIDList.some(id => id === currentIndex)) {
        currentIndex = Math.floor(Math.random()*100 - 1);
    }
    questionText.innerText = questionObjList[currentIndex].question;
}

skipButton.addEventListener("click", () => {
    Swal.fire({
        title: 'Info',
        text: 'Puede que esta pregunta vuelva a salir',
        icon: 'info',
        confirmButtonText: 'OK'
    });
    getRandomQuestion();
});

saveButton.addEventListener("click", () => {
    const answerText = document.getElementById("reply");
    const timeCapsule = document.getElementById("timeCapsule");
    const favorite = document.getElementById("favorite");
    const questionCounter = document.getElementById("question-counter");
    const capsuleCounter = document.getElementById("capsule-counter");

    if (!answerText.value){
        Swal.fire({
            title: 'Alert',
            text: 'No se ha encontrado ninguna respuesta',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }

    const date = new Date();
    const answer = {
        id: questionObjList[currentIndex].id,
        date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
        question: questionObjList[currentIndex].question,
        ans: answerText.value,
        timeCapsule: timeCapsule.checked,
        fav: favorite.checked,
    };
    if (timeCapsule.checked) {
        capsuleCount += 1;
    }
    saveData.answers.push(answer);
    answeredIDList.push(questionObjList[currentIndex].id);
    questionCounter.innerText = saveData.answers.length;
    capsuleCounter.innerText = capsuleCount;

    Swal.fire({
        title: 'Success',
        text: 'La respuesta ha sido guardada',
        icon: 'success',
        confirmButtonText: 'OK'
    });

    answerText.value = "";
    timeCapsule.checked = false;
    favorite.checked = false;

    getRandomQuestion();

    console.log(answer);
});

downloadButton.addEventListener("click", () => {
    const jsonData = JSON.stringify(saveData, null, 2);
    
    // Create a Blob with the JSON data
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'answers.json';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
