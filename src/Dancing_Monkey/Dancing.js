//Bouncing and More...
import React, { useState, useEffect, useRef } from 'react';
import './Dancing.css';
import monkey_no_background_img from '../images/Space_Monkey_No_Background.svg';
import banana_img from '../images/banana_img_3.svg';
import GoBananas from './GO_BANANAS';

//Use debounce technique to handle double banana issue. Use it with new state const [isAddingBanana, setIsAddingBanana] = useState(false); 
//use debounce right before the return
//debounce will also prevent banana-spaming aka "going bananas"

const useDebounce = (callback, delay) => {
  //Create a reference to store the timer ID for the debounce
  const timeoutRef = useRef(null);
  //Return a new debounced function that wraps the original callback
  return (...args) => {
    //Clear the previous timer (if any) whenever the debounced function is called
    clearTimeout(timeoutRef.current);
    //Start a new timer using the setTimeout function
    //The timer will execute the callback after the specified delay
    timeoutRef.current = setTimeout(() => {
      //Invoke the original callback with the provided arguments
      callback(...args);
    }, delay);
  };
};

const Dancing = () => {

  //set states
  const [monkey, setMonkey] = useState({ x: 100, y: 20 });
  const monkeySpeed = .1
  const [driftDirection, setDriftDirection] = useState({ x: 1, y: 1 });
  const [xDirection, setXDirection] = useState(1);
  const [yDirection, setYDirection] = useState(1);
  const [injured, setInjured] = useState(false);
  const [injuredX, setInjuredX] = useState(0);
  const [injuredY, setInjuredY] = useState(0);
  const [bananas, setBananas] = useState([]);
  //Declare showBananas state
  const [showBananas, setShowBananas] = useState(false); 
  //New state to track adding banana status
  const [isAddingBanana, setIsAddingBanana] = useState(false); 
  //React handles state updates asynchronously. When the addBanana function is called, it updates the bananas state by appending a new banana to the existing array of bananas. However, if the state update for bananas is not completed before the next addBanana function is called, it can result in adding two bananas in quick succession.
  //This can happen because React batches state updates to improve performance. If multiple state updates are triggered within the same event loop, React batches them together and performs the updates in one go. However, if the bananas state update from the first addBanana function is not yet complete when the next addBanana function is called, it will be using the old state of bananas, leading to the addition of two bananas.
  //By introducing the isAddingBanana variable and the necessary checks, we can control the timing of adding bananas and ensure that a new banana is added only after the previous one has finished bouncing. This will prevent the issue of adding two bananas at a time.
  //However, don't forget, even with this new state I will have to add the debounce technique.
  //Go bananas
  const [showClearButton, setShowClearButton] = useState(false);

  const containerRef = useRef(null);
  const animationFrameMonkeyRef = useRef(null);
  const monkeyRef = useRef(null);
  //Add bananaRef
  const bananaRef = useRef(null);
  //Add animationFrameBananaRef 
  const animationFrameBananaRef = useRef(null);

  //GO BANANAS
  const handleGoBananasClick = () => {
    //Remove all the bananas and the monkey from the array
    setBananas([]);
    setShowBananas(false);

    //Add the spinning monkey to the array
    setBananas((prevBananas) => [
      ...prevBananas,
      {
        x: 10, //Initial position of the spinning monkey
        y: 200,
        xDirection: 1,
        yDirection: 1,
        isSpinning: true, //Add a flag to identify the spinning monkey
      },
    ]);

    //Generate 100 bouncing bananas and add them to the array
    for (let i = 0; i < 100; i++) {
      const initialXDirection = Math.random() < 0.5 ? 1 : -1;
      const initialYDirection = Math.random() < 0.5 ? 1 : -1;
      setBananas((prevBananas) => [
        ...prevBananas,
        {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          xDirection: initialXDirection,
          yDirection: initialYDirection,
        },
      ]);
    }
    setShowBananas(true);
    setShowClearButton(true); // Show the "Clear Bananas" button after generating bananas
  

    // Update the "showBananas" state to true
    setShowBananas(true);
  };

  //clear banana madness
  const handleClearBananasClick = () => {
    setBananas([]);
    setShowBananas(false);
    //Set showClearButton to false after clearing the bananas
    setShowClearButton(false);
  };

  //add banana
  const addBanana = (x, y) => {
    if (!isAddingBanana && bananas.length < 100) {
      // Generate random initial direction for the banana
      const initialXDirection = Math.random() < 0.5 ? 1 : -1;
      const initialYDirection = Math.random() < 0.5 ? 1 : -1;

      //set the starting position of the banana relative to the monkey
      //Half of the monkey's width
      const bananaStartX = x + monkeyRef.current.width / 4;
      //Half of the monkey's height
      //Does this look good at all sizes? 
      const bananaStartY = y + monkeyRef.current.height / 2; 

      setBananas((prevBananas) => [
        ...prevBananas,
        {
          x: bananaStartX,
          y: bananaStartY,
          xDirection: initialXDirection,
          yDirection: initialYDirection,
        },
      ]);
      setShowBananas(true);
    }
  };

  //animate monkey
  useEffect(() => {
      const moveMonkey = () => {
          const containerWidth = containerRef.current.clientWidth;
          const containerHeight = containerRef.current.clientHeight;
          const monkeyWidth = monkeyRef.current.width;
          const monkeyHeight = monkeyRef.current.height;
          
          setMonkey((prevPosition) => {
              let newX = prevPosition.x + driftDirection.x * monkeySpeed;
              let newY = prevPosition.y + driftDirection.y * monkeySpeed;

              let newDriftDirection = { ...driftDirection };

              if (newX >= containerWidth - monkeyWidth || newX <= 0) {
                  newDriftDirection.x *= -1; // Reverse X direction
                  newX = Math.max(0, Math.min(containerWidth - monkeyWidth, newX));
              }
              if (newY >= containerHeight - monkeyHeight || newY <= 0) {
                  newDriftDirection.y *= -1; // Reverse Y direction
                  newY = Math.max(0, Math.min(containerHeight - monkeyHeight, newY));
              }

              setDriftDirection(newDriftDirection); // Update the drift direction

              return { x: newX, y: newY };
          });

          animationFrameMonkeyRef.current = requestAnimationFrame(moveMonkey);
      };

      animationFrameMonkeyRef.current = requestAnimationFrame(moveMonkey);

      return () => cancelAnimationFrame(animationFrameMonkeyRef.current);
  }, [driftDirection, monkeySpeed, setMonkey, containerRef]);

  


  //animate banana
  useEffect(() => {
    //console.log for bananas array
    console.log("Bananas:", bananas);
    const animateBananas = () => {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const bananaWidth = bananaRef.current.width;
      const bananaHeight = bananaRef.current.height;
      const bananaSpeed = .2;

      setBananas((prevBananas) =>
        prevBananas.map((banana) => ({
          ...banana,
          x: banana.x + banana.xDirection * bananaSpeed,
          y: banana.y + banana.yDirection * bananaSpeed,
          xDirection:
            banana.x + banana.xDirection * bananaSpeed >= containerWidth - bananaWidth ||
            banana.x + banana.xDirection * bananaSpeed <= 0
              ? banana.xDirection * -1
              : banana.xDirection,
          yDirection:
            banana.y + banana.yDirection * bananaSpeed >= containerHeight - bananaHeight ||
            banana.y + banana.yDirection * bananaSpeed <= 0
              ? banana.yDirection * -1
              : banana.yDirection,
        }))
      );

      animationFrameBananaRef.current = requestAnimationFrame(animateBananas);
    };

    if (showBananas && bananas.length > 0) {
      animationFrameBananaRef.current = requestAnimationFrame(animateBananas);
    }

    return () => cancelAnimationFrame(animationFrameBananaRef.current);
  }, [showBananas, bananas]);

  //is injured? drop banana
  useEffect(() => {
    //console.log for isAddingBanana state
    console.log("Is Adding Banana:", isAddingBanana);
    if (injured) {
      setShowBananas(true); 
  
      const resetInjured = setTimeout(() => {
        setInjured(false);
        //Reset adding banana status 
        setIsAddingBanana(false);
        //Add banana near the monkey when it gets injured 
        addBanana(injuredX, injuredY);
        //Delay in milliseconds before resetting injured state 
      }, 500); 
  
      return () => clearTimeout(resetInjured);
    } else {
      //Reset adding banana status when the monkey is not injured
      setIsAddingBanana(false); 
    }
  }, [injured, injuredX, injuredY]);

  //debounce to use later
  const addBananaWithDebounce = useDebounce(addBanana, 500);

  return (
    <div className='page_body'>
      <div className='dancing_monkey_container' ref={containerRef}>
        <GoBananas
          onGoBananasClick={handleGoBananasClick}
          showClearButton={showClearButton}
          onClearBananasClick={handleClearBananasClick}
        />
        {showBananas &&
          bananas.map((banana, index) => (
            <img
              key={index}
              src={banana_img}
              alt='banana'
              className='banana_img'
              style={{ transform: `translate(${banana.x}px, ${banana.y}px)` }}
              ref={bananaRef}
            />
          ))}
        <img
          ref={monkeyRef}
          src={monkey_no_background_img}
          alt='dancing_monkey'
          id='dancing_monkey_img'
          className={injured ? 'injured_monkey' : ''}
          style={{ transform: `translate(${monkey.x}px, ${monkey.y}px)` }}
          onClick={() => {
            if (bananas.length < 10 && !isAddingBanana) {
              setInjured(true);
              setInjuredX(monkey.x);
              setInjuredY(monkey.y);
              setIsAddingBanana(true);
              addBananaWithDebounce(monkey.x, monkey.y);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Dancing;




























// //Monkey is bouncing and only bouncing
// import React, { useState, useEffect, useRef } from 'react';
// import './Dancing.css';
// import monkey_no_background_img from '../../images/Space_Monkey_No_Background.svg';

// const Dancing = () => {
//   const [x, setX] = useState(10);
//   const [y, setY] = useState(200);
//   const [xDirection, setXDirection] = useState(1);
//   const [yDirection, setYDirection] = useState(1);

//   const imageRef = useRef(null);
//   const containerRef = useRef(null);
//   const animationFrameRef = useRef(null);

//   useEffect(() => {
//     const animate = () => {
//       const containerWidth = containerRef.current.clientWidth;
//       const containerHeight = containerRef.current.clientHeight;
//       const monkeyWidth = imageRef.current.width;
//       const monkeyHeight = imageRef.current.height;
//       const speed = .4; 

//       console.log('x:', x);
//       console.log('y:', y);
//       console.log('xDirection:', xDirection);
//       console.log('yDirection:', yDirection);

//       setX((prevX) => {
//         const nextX = prevX + xDirection * speed;
//         if (nextX >= containerWidth - monkeyWidth || nextX <= 0) {
//           setXDirection((prevDirection) => prevDirection * -1);
//         }
//         return nextX;
//       });

//       setY((prevY) => {
//         const nextY = prevY + yDirection * speed;
//         if (nextY >= containerHeight - monkeyHeight || nextY <= 0) {
//           setYDirection((prevDirection) => prevDirection * -1);
//         }
//         return nextY;
//       });

//       animationFrameRef.current = requestAnimationFrame(animate);
//     };

//     // Start the animation loop on mount
//     animationFrameRef.current = requestAnimationFrame(animate);

//     // Clean up the animation frame when unmount
//     return () => cancelAnimationFrame(animationFrameRef.current);
//   }, [x, y, xDirection, yDirection]);

//   return (
//     <div className='page_body'>
//       <div className='dancing_monkey_container' ref={containerRef}>
//         <img
//           ref={imageRef}
//           src={monkey_no_background_img}
//           alt='dancing_monkey'
//           id='dancing_monkey_img'
//           style={{ transform: `translate(${x}px, ${y}px)` }}
//         />
//       </div>
//     </div>
//   );
// };

// export default Dancing;

















































//Monkey is Bouncing
// import React, { useState, useEffect, useRef } from 'react';
// import './Dancing.css';
// import monkey_no_background_img from '../../images/Space_Monkey_No_Background.svg';

// const Dancing = () => {
//   const [x, setX] = useState(0);
//   const [y, setY] = useState(0);
//   const [xDirection, setXDirection] = useState(1);
//   const [yDirection, setYDirection] = useState(1);

//   const imageRef = useRef(null);
//   const containerRef = useRef(null);
//   const animationFrameRef = useRef(null);

//   useEffect(() => {
//     const animate = () => {
//       const containerWidth = containerRef.current.clientWidth;
//       const containerHeight = containerRef.current.clientHeight;
//       const monkeyWidth = imageRef.current.width;
//       const monkeyHeight = imageRef.current.height;
//       const speed = 2; // Adjust the speed for smoother motion

//       console.log('x:', x);
//       console.log('y:', y);
//       console.log('xDirection:', xDirection);
//       console.log('yDirection:', yDirection);

//       setX((prevX) => {
//         const nextX = prevX + xDirection * speed;
//         if (nextX >= containerWidth - monkeyWidth || nextX <= 0) {
//           setXDirection((prevDirection) => prevDirection * -1);
//         }
//         return nextX;
//       });

//       setY((prevY) => {
//         const nextY = prevY + yDirection * speed;
//         if (nextY >= containerHeight - monkeyHeight || nextY <= 0) {
//           setYDirection((prevDirection) => prevDirection * -1);
//         }
//         return nextY;
//       });

//       animationFrameRef.current = requestAnimationFrame(animate);
//     };

//     // Start the animation loop on mount
//     animationFrameRef.current = requestAnimationFrame(animate);

//     // Clean up the animation frame when unmount
//     return () => cancelAnimationFrame(animationFrameRef.current);
//   }, [x, y, xDirection, yDirection]);

//   return (
//     <div className='page_body'>
//       <div className='dancing_monkey_container' ref={containerRef}>
//         <img
//           ref={imageRef}
//           src={monkey_no_background_img}
//           alt='dancing_monkey'
//           id='dancing_monkey_img'
//           style={{ transform: `translate(${x}px, ${y}px)` }}
//         />
//       </div>
//     </div>
//   );
// };

// export default Dancing;





























// ok, now the monkeytravels to the bottom of the container...then, he moves to the right util he exists the container and disappears...please fix that so that the monkey bounces around the container.

// import React, { useState, useEffect, useRef } from 'react';
// import './Dancing.css';
// import monkey_no_background_img from '../images/Space_Monkey_No_Background.png';

// const Dancing = () => {
//   const [x, setX] = useState(0);
//   const [y, setY] = useState(0);
//   const [xDirection, setXDirection] = useState(1);
//   const [yDirection, setYDirection] = useState(1);

//   const imageRef = useRef(null);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const animate = () => {
//       const containerWidth = containerRef.current.clientWidth;
//       const containerHeight = containerRef.current.clientHeight;
//       const monkeyWidth = imageRef.current.width;
//       const monkeyHeight = imageRef.current.height;
//       const speed = 1.5; // Adjust the speed for smoother motion

//       setX((prevX) => {
//         const nextX = prevX + xDirection * speed;
//         if (nextX >= containerWidth - monkeyWidth || nextX <= 0) {
//           setXDirection((prevDirection) => prevDirection * -1);
//         }
//         return nextX;
//       });

//       setY((prevY) => {
//         const nextY = prevY + yDirection * speed;
//         if (nextY >= containerHeight - monkeyHeight || nextY <= 0) {
//           setYDirection((prevDirection) => prevDirection * -1);
//         }
//         return nextY;
//       });

//       requestAnimationFrame(animate);
//     };

//     // Start the animation loop when the component mounts
//     const animationFrame = requestAnimationFrame(animate);

//     // Clean up the animation frame when the component unmounts
//     return () => cancelAnimationFrame(animationFrame);
//   }, [xDirection, yDirection]);

//   return (
//     <div className='page_body'>
//       <div className='dancing_monkey_container' ref={containerRef}>
//         <img
//           ref={imageRef}
//           src={monkey_no_background_img}
//           alt='dancing_monkey'
//           id='dancing_monkey_img'
//           style={{ transform: `translate(${x}px, ${y}px)` }}
//         />
//       </div>
//     </div>
//   );
// };

// export default Dancing;











































// One direction animation
// import React, { useEffect, useState, useRef } from 'react';
// import './Dancing.css';
// import monkey_no_background_img from '../images/Space_Monkey_No_Background.png';

// const Dancing = () => {
//   const [x, setX] = useState(0);
//   const [y, setY] = useState(0);
//   const [xDirection, setXDirection] = useState(1);
//   const [yDirection, setYDirection] = useState(1);

//   const imageRef = useRef(null);

//   const containerRef = useRef(null); // Reference to the container element

//   const animate = () => {
//     const containerWidth = containerRef.current.clientWidth;
//     const containerHeight = containerRef.current.clientHeight;
//     const monkeyWidth = imageRef.current.width;
//     const monkeyHeight = imageRef.current.height;
//     const speed = 1.5; // Adjust the speed for smoother motion
//     const damping = 0.8; // Adjust the damping for smoother bouncing
  
//     setX((prevX) => {
//       let nextX = prevX + xDirection * speed;
//       if (nextX >= containerWidth - monkeyWidth || nextX <= 0) {
//         setXDirection((prevDirection) => prevDirection * -1 * damping);
//         nextX = prevX + xDirection * speed * damping;
//       }
//       return Math.max(0, Math.min(nextX, containerWidth - monkeyWidth));
//     });
  
//     setY((prevY) => {
//       let nextY = prevY + yDirection * speed;
//       if (nextY >= containerHeight - monkeyHeight || nextY <= 0) {
//         setYDirection((prevDirection) => prevDirection * -1 * damping);
//         nextY = prevY + yDirection * speed * damping;
//       }
//       return Math.max(0, Math.min(nextY, containerHeight - monkeyHeight));
//     });
    
//     requestAnimationFrame(animate);
//   };

//   // Start the animation loop when the component mounts
//   useEffect(() => {
//     requestAnimationFrame(animate);
//   }, []);

//   return (
//     <div className='page_body'>
//       <div className='dancing_monkey_container' ref={containerRef}>
//         <img
//           ref={imageRef}
//           src={monkey_no_background_img}
//           alt='dancing_monkey'
//           id='dancing_monkey_img'
//           style={{ transform: `translate(${x}px, ${y}px)` }}
//         />
//       </div>
//     </div>
//   );
// };

// export default Dancing;
