const lastName = document.getElementById("last-name")
const firstName = document.getElementById("first-name")
const department = document.getElementById("options-dep")
const variant = document.getElementById("options-var")
const errorMsg = document.getElementById("error")
const startBtn = document.getElementById("start-btn")
const dbBtn = document.getElementById("db-btn")

let user = {"answers": [], "score": 0}
let numberOfQuestions = 0
let questionNum = 0
let data = {}

startBtn.addEventListener("click", saveUser)
dbBtn.addEventListener("click", displayTableResults)


function displayQuestion(q, op1, op2, op3) {
    let obj = `
    <div class="quiz"> 
        <h2 id="question">${q}</h2> 
        <div class="form"> 
            <button class="btn" id="opt1-btn" onclick="saveRes1()">${op1}</button>
            <button class="btn" id="opt2-btn" onclick="saveRes2()">${op2}</button>
            <button class="btn" id="opt3-btn" onclick="saveRes3()">${op3}</button>
        </div>
    </div>
    `
    document.getElementById("quiz").innerHTML= obj;

}

async function displayResults() {
    const results = await sendResults()
    let obj = `
    <div class = "quiz">
        <h2>Вы закончили тестирование</h1>
        <h2>Количество правильных ответов: ${results.data.score.score}</h2>
        <img src="./images/Be.gif">
    </div>
    `
    document.getElementById("quiz").innerHTML = obj;
}

async function saveUser() {
    const lastNameValue = lastName.value;
    const firstNameValue = firstName.value;
    const departmentValue = department.value;
    const variantValue = variant.value;
    const regex = /^[a-zA-Z]+$/;

    if (!regex.test(lastNameValue)) {
        errorMsg.textContent = "Неправильный ввод фамилий";
        return
    }

    if (!regex.test(firstNameValue)) {
        errorMsg.textContent = "Неправильный ввод имени";
        return
    }

    user.firstName = firstNameValue;
    user.lastName = lastNameValue;
    user.department = departmentValue;
    user.variant = variantValue;
    

    data = await getQuestions();
    questionsDb = data.data.questions
    numberOfQuestions = questionsDb.length
    prepQuestion()
    
}

async function getQuestions() {
    return await axios.get('http://127.0.0.1:8000/questions');
}

async function sendResults() {
    return await axios.post('http://127.0.0.1:8000/add_user', user)
}

async function getAllResults() {
    return await axios.get('http://127.0.0.1:8000/get_users')
}

function prepQuestion() {
    if (questionNum < numberOfQuestions) {      
        let question = questionsDb[questionNum].question
        let option1 = questionsDb[questionNum].options[0]
        let option2 = questionsDb[questionNum].options[1]
        let option3 = questionsDb[questionNum].options[2]
        questionNum += 1
        displayQuestion(question, option1, option2, option3)
    }
    else {
        displayResults()
    }
}

function saveRes1() {
    console.log(questionNum + " -> option 1");
    user.answers.push(1)
    prepQuestion()
}
function saveRes2() {
    console.log(questionNum + " -> option 2");
    user.answers.push(2)
    prepQuestion()
}
function saveRes3() {
    console.log(questionNum + " -> option 3");
    user.answers.push(3)
    prepQuestion()
}

async function displayTableResults( ) {
    let usersData = await getAllResults();
    console.log(usersData.data.users)

    let obj = `
    <table class="styled-table">
        <thead>
            <tr>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Департамент</th>
                <th>Вариант</th>
                <th>Баллы</th>
            </tr>
        </thead>
        <tbody>
    `
    for(let i = 0; i < usersData.data.users.length; i++) {
        obj += '<tr>'   
        obj += `<td> ${usersData.data.users[i]["firstName"]} </td>`
        obj += `<td> ${usersData.data.users[i]["lastName"]} </td>`
        obj += `<td> ${usersData.data.users[i]["department"]} </td>`
        obj += `<td> ${usersData.data.users[i]["variant"]} </td>`
        obj += `<td> ${usersData.data.users[i]["score"]["score"]} </td>`
        obj += '</tr>' 
    }
    obj += `</tbody> </table>`
    document.getElementById('body').innerHTML= obj;

}