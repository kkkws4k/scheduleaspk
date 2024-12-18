const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;
const DATA_FILE = 'schedule.json';

app.use(cors());
app.use(bodyParser.json());

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}), 'utf8');
}

app.get('/schedule', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Ошибка чтения файла' });

        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка парсинга JSON' });
        }
    });
});

app.post('/schedule', (req, res) => {
    const newData = req.body;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Ошибка чтения файла' });

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (error) {
            return res.status(500).json({ error: 'Ошибка парсинга JSON' });
        }

        if (!jsonData[newData.group]) jsonData[newData.group] = [];
        jsonData[newData.group].push({
            пара: newData.lessonNumber,
            время: newData.time,
            преподаватель: newData.teacher,
            предмет: newData.subject,
            кабинет: newData.room
        });

        fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Ошибка записи файла' });
            res.json({ message: 'Данные успешно добавлены' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});