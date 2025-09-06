import React, { useEffect } from "react";
import { IoPause, IoPlay } from "react-icons/io5";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";

type SessionType = "Focus" | "Break";
const durations = [15, 20, 25, 30, 45, 60];

const Timer: React.FC = () => {
    const [minutes, setMinutes] = React.useState(25);
    const [seconds, setSeconds] = React.useState(0);
    const [isActive, setIsActive] = React.useState(false);
    const [sessionType, setSessionType] = React.useState<SessionType>("Focus");

    const requestNotificationPermission = async () => {
        await Notification.requestPermission();
    };

    const showNotification = (title: string, body: string) => {
        if (Notification.permission === "granted") {
            new Notification(title, { body });
        }
    };

    useEffect(() => {
        requestNotificationPermission();
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            interval = setInterval(() => {
                if (minutes === 0 && seconds === 0) {
                    if (sessionType === "Focus") {
                        showNotification("Pomodoro Timer", "Focus session done! Time for a break.");
                        setSessionType("Break");
                        setMinutes(5);
                        setSeconds(0);
                    } else {
                        showNotification("Pomodoro Timer", "Break session done! Time to focus.");
                        setSessionType("Focus");
                        setMinutes(25);
                        setSeconds(0);
                    }
                } else if (seconds === 0) {
                    setMinutes((prev) => prev - 1);
                    setSeconds(59);
                } else {
                    setSeconds((prev) => prev - 1);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [minutes, seconds, isActive, sessionType]);

    const toggle = () => {
        setIsActive(!isActive);
    };

    const reset = () => {
        setSessionType("Focus");
        setIsActive(false);
        setDuration(25);
    };

    const setDuration = (duration: number) => {
        setSessionType("Focus");
        setIsActive(false);
        setMinutes(duration);
        setSeconds(0);
    }

    const changeDuration = (delta: number) => {
        setMinutes((prev) => prev + delta >= 1 ? prev + delta : 1);
    };

    return (
        <div className={`flex flex-col items-center gap-4 p-4 
                  ${sessionType === "Focus" ? "text-blue-400" : "text-orange-400"}`}>

            {/* Session Type */}
            <h2 className="text-xl font-semibold">{sessionType} Time</h2>

            {/* Timer Circle */}
            <div className="relative flex flex-col items-center justify-center w-48 h-48 rounded-full border-4 
                    border-current">

                {/* Time Display */}
                <span className="text-4xl font-bold">
                    {minutes.toString().padStart(2, "0")}:
                    {seconds.toString().padStart(2, "0")}
                </span>

                {/* Start / Pause Button with Icon */}
                <button
                    className="mt-4 p-3 rounded-full bg-white text-black shadow hover:bg-gray-200 transition"
                    onClick={toggle}
                >
                    {isActive ? <IoPause size={24} /> : <IoPlay size={24} />}
                </button>

                {/* Reset Button */}
                <button
                    className="mt-2 px-4 py-2 rounded-full bg-white text-black shadow hover:bg-gray-200 transition"
                    onClick={reset}
                >
                    Reset
                </button>
            </div>

            <div className="flex gap flex-wrap justify-center">
                <CiCircleMinus className="font-bold self-center" size={45} onClick={() => changeDuration(-1)} />
                <CiCirclePlus className="font-bold self-center" size={45} onClick={() => changeDuration(1)} />
            </div>

            {/* Duration Buttons */}
            <div className="flex gap-2 flex-wrap justify-center">
                {durations.map((d) => (
                    <button
                        key={d}
                        className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 shadow transition"
                        onClick={() => setDuration(d)}
                    >
                        {d} min
                    </button>
                ))}
            </div>
        </div>
    );

}

export default Timer;