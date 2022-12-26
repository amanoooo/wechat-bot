import axios from 'axios'





const token = process.env.TOKEN || '1'

export async function fetchAnswer(question: string) {
    const response = await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/completions',
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: {
            model: "text-davinci-003",
            prompt: question,
            temperature: 0,
            max_tokens: 100
        }
    });

    console.log('receive', response.data);
    
}


async function main() {
    fetchAnswer("你是谁")
}

main()