import { BASE_URL } from '../configs';

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "translate",
        title: "Traduzir (Westron AI)",
        contexts: ["selection"], 
    });
});


chrome.contextMenus.onClicked.addListener((info, tab) => {

    if (info.menuItemId === "translate") {
        const selectedText = info.selectionText;

        chrome.storage.local.get("apiKey", (data) => {
            const apiKey = data.apiKey;
            console.log(apiKey)
            if (apiKey) {
                translateText(selectedText, apiKey);
            } else {

            }
        });
    }
});


async function translateText(text, apiKey) {

    const url = `${BASE_URL}/translate?token=${apiKey}`
    console.log("URL da API:", url);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify({
                texto_ingles: text,
            }),
        });
        console.log(response)


        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}. Detalhes: ${errorText}`);
        }

        const data = await response.json();
        console.log("Dados da resposta:", data);


        if (data['tradução'] && data['tradução'].texto_portugues) {
            const translatedText = data['tradução'].texto_portugues;
            console.log(`Tradução: ${translatedText}`);

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "replaceText",
                    translatedText: translatedText,
                });
            });
        } else {
            console.error('Erro: Tradução não encontrada nos dados retornados.');
        }
    } catch (error) {
        console.error('Erro ao acessar a API de tradução:', error);
    }
}
