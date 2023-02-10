import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [personInput, setPersonInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ person: personInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      // setPersonInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>祝福生成器</title>
        <link rel="icon" href="/fu.png" />
      </Head>

      <main className={styles.main}>
        <img src="/fu.png" className={styles.icon} />
        <h3>祝福生成器</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="person"
            placeholder="输入一个人名"
            value={personInput}
            onChange={(e) => setPersonInput(e.target.value)}
          />
          <input type="submit" value="生成" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
