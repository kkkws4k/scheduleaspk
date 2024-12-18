const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Настройка для обработки JSON
app.use(express.json());

// Статическое обслуживание файлов
app.use(express.static(path.join(__dirname, 'public')));

// Чтение расписания
app.get('/schedule.json', (req, res) => {
    const schedulePath = path.join(__dirname, 'public', 'schedule.json');
    fs.readFile(schedulePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Не удалось загрузить расписание' });
        }
        res.json(JSON.parse(data));
    });
});

// Обработка добавления нового расписания
app.post('/add-schedule', (req, res) => {
    const { group, lesson } = req.body;
    const schedulePath = path.join(__dirname, 'public', 'schedule.json');

    fs.readFile(schedulePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка при чтении файла расписания' });
        }

        const scheduleData = JSON.parse(data);

        // Добавление нового урока в расписание группы
        if (!scheduleData[group]) {
            scheduleData[group] = [];
        }
        scheduleData[group].push(lesson);

        // Сохранение обновленного расписания
        fs.writeFile(schedulePath, JSON.stringify(scheduleData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка при сохранении расписания' });
            }
            res.status(200).json({ message: 'Расписание успешно обновлено' });
        });
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

