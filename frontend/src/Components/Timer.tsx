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
	const endTimeRef = React.useRef<number | null>(null);

	const requestNotificationPermission = async () => {
		if (!("Notification" in window)) {
			console.warn("This browser does not support desktop notifications.");
			return;
		}

		try {
			const permission = await Notification.requestPermission();
			if (permission === "granted") {
				console.log("Notification permission granted.");
			} else if (permission === "denied") {
				console.warn("Notification permission denied.");
			}
		} catch (error) {
			console.error("Error requesting notification permission:", error);
		}
	};

	const showNotification = (title: string, body: string) => {
		if (!("Notification" in window)) return;

		if (Notification.permission === "granted") {
			try {
				new Notification(title, { body });
			} catch (error) {
				console.error("Failed to show notification:", error);
			}
		}
	};

	useEffect(() => {
		requestNotificationPermission();
	}, []);

	useEffect(() => {
		let interval: NodeJS.Timeout;

		if (isActive) {
			if (!endTimeRef.current) {
				endTimeRef.current = Date.now() + (minutes * 60 + seconds) * 1000;
			}

			interval = setInterval(() => {
				const remaining = Math.max(0, endTimeRef.current! - Date.now());
				const newMinutes = Math.floor(remaining / 1000 / 60);
				const newSeconds = Math.floor((remaining / 1000) % 60);

				setMinutes(newMinutes);
				setSeconds(newSeconds);

				if (remaining === 0) {
					clearInterval(interval);
					endTimeRef.current = null;

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
				}
			}, 200);
		}

		return () => clearInterval(interval);
	}, [minutes, seconds, isActive, sessionType]);

	const toggle = () => {
		if (isActive) {
			endTimeRef.current = null;
		}
		setIsActive(!isActive);
	};

	const reset = () => {
		setSessionType("Focus");
		setIsActive(false);
		setMinutes(25);
		setSeconds(0);
		endTimeRef.current = null;
	};

	const setDuration = (duration: number) => {
		setSessionType("Focus");
		setMinutes(duration);
		setSeconds(0);
		if (isActive) {
			endTimeRef.current = Date.now() + duration * 60 * 1000;
		} else {
			endTimeRef.current = null;
		}
	};

	const changeDuration = (delta: number) => {
		const totalSeconds = minutes * 60 + seconds + delta * 60;
		if (totalSeconds <= 0) return;

		const newMinutes = Math.floor(totalSeconds / 60);
		const newSeconds = totalSeconds % 60;

		setMinutes(newMinutes);
		setSeconds(newSeconds);

		if (isActive && endTimeRef.current) {
			endTimeRef.current += delta * 60 * 1000;
		}
	};

	return (
		<div className={`inline-flex flex-col items-center gap-4 p-4 rounded-2xl border-4 shadow-md
                  ${sessionType === "Focus" ? "border-blue-400 text-blue-400" : "border-orange-400 text-orange-400"}`}>

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
				<CiCircleMinus className="font-bold self-center cursor-pointer" size={45} onClick={() => changeDuration(-1)} />
				<CiCirclePlus className="font-bold self-center cursor-pointer" size={45} onClick={() => changeDuration(1)} />
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