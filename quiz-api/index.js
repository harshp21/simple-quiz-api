const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

app.use(bodyParser.json());


let questions = [];

app.get("/", (req, res) => {
    res.json({
        message: 'success'
    })
})

app.post('/question', (req, res) => {
    if (req.body.question) {
        let id = questions.length + 1;
        req.body.id = id;
        req.body.options = [];
        questions.push(req.body);
        res.json({
            message: 'success'
        })
    } else {
        res.status(400).json({
            message: 'Invalid Data format'
        })
    }
    console.log(questions);
})


app.post('/option/:question_id', (req, res) => {
    let questionId = req.params.question_id;
    let questionIndex = questions.findIndex(elem => elem.id == questionId);
    if (req.body.option && questionIndex !== -1) {
        let id = questions[questionIndex].options.length + 1;
        req.body.id = id;
        questions[questionIndex].options.push(req.body);
        res.json({
            message: 'success'
        })
    } else {
        res.status(400).json({
            message: 'Invalid Data format'
        })
    }
})

app.get('/questions', (req, res) => {
    if (questions.length > 0) {
        let quiz = questions.map(elem => {
            return {
                id: elem.id,
                question: elem.question,
                options: elem.options.map(elem => {
                    return {
                        id: elem.id,
                        option: elem.option
                    };
                })
            }
        })
        res.json({
            message: 'success',
            data: quiz
        })
    } else {
        res.status(400).json({
            message: "Questions not available"
        })
    }
})

app.get('/answer/:questionId/:optionId', (req, res) => {
    let question = questions.find(elem => elem.id == req.params.questionId);
    if (question) {
        let option = question.options.find(elem => elem.id == req.params.optionId);
        console.log(option);
        if (option) {
            res.json({
                message: 'success',
                data: {
                    isCorrect: option.isCorrect,
                }
            })
        } else {
            res.status(400).json({
                message: 'Requested option not available'
            })
        }
    } else {
        res.status(400).json({
            message: 'Requested Question not available'
        })
    }
})


app.listen(port);