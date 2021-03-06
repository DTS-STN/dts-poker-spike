/*import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
var W3CWebSocket = require('websocket').w3cwebsocket;


export default function Home() {

  var client = new W3CWebSocket('wss://70v6q0ruz1.execute-api.us-west-2.amazonaws.com/Prod');
  client.onopen = function() {
    console.log('WebSocket Client Connected');

    var test = { action: "sendmessage", data: "hello world" };
    client.send(JSON.stringify(test));
};

client.onclose = function() {
    console.log('echo-protocol Client Closed');
};

client.onmessage = function(e) {
    if (typeof e.data === 'string') {
        console.log("Received: '" + e.data + "'");
    }
};

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}*/
import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export default function WebSocketDemo(){
  //Public API that will echo messages sent to it back to the client
  const [socketUrl, setSocketUrl] = useState('wss://70v6q0ruz1.execute-api.us-west-2.amazonaws.com/Prod');
  const [messageHistory, setMessageHistory] = useState([]);

  const {
    sendMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl, {
    onOpen: () => {
      console.log('opened');
      console.log("Sending user id");
      sendMessage(JSON.stringify({ action: "sendmessage", data: {event: "open_connect", userId: "eduranperez@ucdavis.edu"} }))
    },
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory(prev => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const handleClickChangeSocketUrl = useCallback(() =>
    setSocketUrl('wss://70v6q0ruz1.execute-api.us-west-2.amazonaws.com/Prod'), []);

  const handleClickSendMessage = useCallback(() =>
    sendMessage(JSON.stringify({ action: "sendmessage", data: {message: "hello world", userId: "eduranperez@ucdavis.edu"} })), []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div>
      <button
        onClick={handleClickChangeSocketUrl}
      >
        Click Me to change Socket Url
      </button>
      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Click Me to send 'Hello'
      </button>
      <span>The WebSocket is currently {connectionStatus}</span>
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      <ul>
        {messageHistory
          .map((message, idx) => <span key={idx}>{message ? message.data : null}</span>)}
      </ul>
    </div>
  );
};