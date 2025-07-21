const form = document.getElementById('plan-form');
const output = document.getElementById('output');
const button = form.querySelector('button');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const tasks = document.getElementById('tasks').value;
    const priority = document.getElementById('priority').value;
    const time = document.getElementById('time').value;

    const prompt = `Na podstawie poniższych danych, ułóż realistyczny plan nauki i zadań w czasie który wypisze uzytkowinik w dostepny czas Uwzględnij priorytety, zadania i przerwy:
- Zadania: ${tasks}
- Priorytet: ${priority}
- Dostępny czas: ${time}
- Styl: spokojny, produktywny`;

    output.textContent = "⏳ Generowanie planu...";
    button.disabled = true;
    button.textContent = "Generowanie...";

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer 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"
            },
            body: JSON.stringify({
                model: "openrouter/auto", // możesz też wpisać gpt-3.5-turbo, mixtral, llama2, claude-3-opus
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            })
        });

        const data = await response.json();
        console.log("Odpowiedź z OpenRouter:", data);

        if (data.choices && data.choices[0]) {
            output.textContent = data.choices[0].message.content;
        } else {
            output.textContent = "❌ Błąd: brak odpowiedzi z modelu.";
        }

    } catch (error) {
        output.textContent = "❌ Błąd połączenia z API.";
        console.error("Błąd:", error);
    } finally {
        button.disabled = false;
        button.textContent = "Wygeneruj plan";
    }

    document.getElementById('loader').style.display = 'block';
    // Po zakończeniu
    document.getElementById('loader').style.display = 'none';

});
