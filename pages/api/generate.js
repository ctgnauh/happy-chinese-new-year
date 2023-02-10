import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const person = req.body.person || "";
  if (person.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(person),
      temperature: 0.7,
      max_tokens: 140,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(person) {
  const capitalizedPerson =
    person[0].toUpperCase() + person.slice(1).toLowerCase();
  return `生成提供给目标的新年祝福：

目标：父母
新年祝福：新年的钟声悠然响起，飘送着我的祝福，萦绕在您的身边，新年快乐！
目标：亲戚
新年祝福：在新的一年里一家和和睦睦，一年开开心心，一生快快乐乐，一世平平安安，天天精神百倍，月月喜气扬扬，年年财源广进。 春节快乐！
目标：${capitalizedPerson}
新年祝福：`;
}
