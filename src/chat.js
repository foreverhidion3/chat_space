import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './chat.css'
import Dancing from './Dancing_Monkey/Dancing.js';

const socket = io('https://server-chat-space.onrender.com'); // Update the URL to match your server URL

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [userColor, setUserColor] = useState(null); // State to store the user's color

  useEffect(() => {
    // Establish Socket.IO connection when the component mounts
    const socket = io('https://server-chat-space.onrender.com');

    const randomColor = getRandomLightColor();
    setUserColor(randomColor);
    console.log('User color:', randomColor);

    // Listen for incoming messages
    socket.on('chat message', (msg) => {
      console.log('Received message:', msg); // Log the received message
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array ensures this effect runs only once

  const handleSendMessage = (e) => {
  e.preventDefault();
  console.log('Sending message:', message); // Log the message being sent
  console.log('User color:', userColor); // Log the user's color
  socket.emit('chat message', { message, userColor }); // Send message and user color
  setMessage('');
};

  // Function to generate a random light color
const getRandomLightColor = () => {
  const letters = '89ABCDEF'.split(''); // Expanded range of letters
  let color = '#';
  for (let i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
};


  return (
    
     
      <div className="main">
      <Dancing />
        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoComplete="off"
            className= 'input' 
          />
          <button className='send' type="submit">Send</button>
        </form>
        <div className="text_return">
          {messages.map((msg, index) => (
            <li key={index} style={{ color: msg.userColor }}>
              {msg.message}
            </li>
          ))}
        </div>
      </div>
   
  );
}

export default Chat;









//works
// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';
// import './chat.css'
// import Dancing from './Dancing_Monkey/Dancing.js';

// const socket = io('http://localhost:3001'); // Update the URL to match your server URL

// function Chat() {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');
//   const [userColor, setUserColor] = useState(null); // State to store the user's color

//   useEffect(() => {
//     // Establish Socket.IO connection when the component mounts
//     const socket = io('http://localhost:3001');

//     const randomColor = getRandomLightColor();
//     setUserColor(randomColor);
//     console.log('User color:', randomColor);

//     // Listen for incoming messages
//     socket.on('chat message', (msg) => {
//       console.log('Received message:', msg); // Log the received message
//       setMessages((prevMessages) => [...prevMessages, msg]);
//     });

//     // Clean up the socket connection on component unmount
//     return () => {
//       socket.disconnect();
//     };
//   }, []); // Empty dependency array ensures this effect runs only once

//   const handleSendMessage = (e) => {
//   e.preventDefault();
//   console.log('Sending message:', message); // Log the message being sent
//   console.log('User color:', userColor); // Log the user's color
//   socket.emit('chat message', { message, userColor }); // Send message and user color
//   setMessage('');
// };

//   // Function to generate a random light color
// const getRandomLightColor = () => {
//   const letters = '89ABCDEF'.split(''); // Expanded range of letters
//   let color = '#';
//   for (let i = 0; i < 6; i++ ) {
//     color += letters[Math.floor(Math.random() * letters.length)];
//   }
//   return color;
// };


//   return (
//     <>
//       <Dancing />
//       <div className="main">
//         <form onSubmit={handleSendMessage}>
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             autoComplete="off"
//             className= 'input' 
//           />
//           <button className='send' type="submit">Send</button>
//         </form>
//         <ul>
//           {messages.map((msg, index) => (
//             <li key={index} style={{ color: msg.userColor }}>
//               {msg.message}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </>
//   );
// }

// export default Chat;
