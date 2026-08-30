import { useEffect, useRef, useState } from 'react'

export default function Eye() {

    const eyeRef = useRef(null)
    const irisRef = useRef(null)

    const [isBlinking, setIsBlinking] = useState(false);
    const [isMouseOutside, setIsMouseOutside] = useState(false);
    const [isTabHidden, setIsTabHidden] = useState(false);

    const leaveTimeout = useRef(null);
    const closeTimeout = useRef(null);

    const resetIris = () => {
    if (!irisRef.current) return;

    irisRef.current.style.transform =
        "translate(-50%, -50%)";
    };

    useEffect(()=>{
        const handleMouseMove = (e) => {
            const eye = eyeRef.current
            const iris = irisRef.current
          
            if (
                !eye ||
                !iris ||
                isBlinking ||
                isMouseOutside ||
                isTabHidden
            ) {
                return;
            }

            const rect = eye.getBoundingClientRect()

            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2

            const dx = e.clientX - centerX
            const dy = e.clientY - centerY

            const angle = Math.atan2(dy, dx)

            const distance = Math.min(
                Math.sqrt(dx * dx + dy * dy),
                45
            )

            const x = Math.cos(angle) * distance
            const y = Math.sin(angle) * distance

            iris.style.transform = `
                translate(calc(-50% + ${x}px), calc(-50% + ${y}px))
            `
        }

        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    },[isBlinking, isMouseOutside, isTabHidden])

    useEffect(() => {
  let blinkTimeout;
  let openTimeout;

  const blink = () => {
    // Start closing
    setIsBlinking(true);

    // Keep the eye closed for a short moment
    openTimeout = setTimeout(() => {
      setIsBlinking(false);

      // Schedule the next blink
      scheduleNextBlink();
    }, 500);
  };

  const scheduleNextBlink = () => {
    const delay = Math.random() * 5000 + 3000;

    blinkTimeout = setTimeout(blink, delay);
  };

  scheduleNextBlink();

  return () => {
    clearTimeout(blinkTimeout);
    clearTimeout(openTimeout);
  };
}, []);

  useEffect(() => {
  const handleMouseLeave = (event) => {
    const leavingWindow =
      event.clientY <= 0 ||
      event.clientX <= 0 ||
      event.clientX >= window.innerWidth ||
      event.clientY >= window.innerHeight;

    if (!leavingWindow) return;

    clearTimeout(leaveTimeout.current);
    clearTimeout(closeTimeout.current);

    
    leaveTimeout.current = setTimeout(() => {
      resetIris();

      closeTimeout.current = setTimeout(() => {
        setIsMouseOutside(true);
      }, 150);

    }, 1000);
  };

  const handleMouseEnter = () => {
    clearTimeout(leaveTimeout.current);
    clearTimeout(closeTimeout.current);

    setIsMouseOutside(false);
  };

    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

  return () => {
    clearTimeout(leaveTimeout.current);
    clearTimeout(closeTimeout.current);

    document.removeEventListener(
        "mouseleave",
        handleMouseLeave
    );

    document.removeEventListener(
        "mouseenter",
        handleMouseEnter
    );
  };
}, []);

   useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      clearTimeout(leaveTimeout.current);
      clearTimeout(closeTimeout.current);

      resetIris();

      setTimeout(() => {
        setIsTabHidden(true);
      }, 350);
    } else {
      setIsTabHidden(false);
    }
  };

  document.addEventListener(
    "visibilitychange",
    handleVisibilityChange
  );

  return () => {
    document.removeEventListener(
      "visibilitychange",
      handleVisibilityChange
    );
  };
}, []);

  const isClosed = isBlinking || isMouseOutside;

    return (
      <div
        ref={eyeRef}
        className={`eye ${isClosed ? "closed" : ""}`}
    >
        <div
            className="iris"
            ref={irisRef}
        >
            <div className="pupil">
                <div className="eye-highlight" />
            </div>
         </div>
    </div>
    )
}