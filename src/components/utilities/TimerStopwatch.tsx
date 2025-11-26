import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";
import { toast } from "sonner";

const TimerStopwatch = () => {
  // Timer state
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerTime, setTimerTime] = useState(0);
  const [timerFinished, setTimerFinished] = useState(false);

  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchActive, setStopwatchActive] = useState(false);

  const timerRef = useRef<NodeJS.Timeout>();
  const stopwatchRef = useRef<NodeJS.Timeout>();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Pleasant soft ding audio
    audioRef.current = new Audio(
      "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YRAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg"
    );
  }, []);

  /** TIMER EFFECT */
  useEffect(() => {
    if (timerActive && timerTime > 0) {
      timerRef.current = setInterval(() => {
        setTimerTime((t) => {
          if (t <= 1) {
            // Timer finished
            setTimerActive(false);
            setTimerFinished(true);

            if (audioRef.current) {
              audioRef.current.loop = true;
              audioRef.current.play();
            }

            toast.success("Timer finished!");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, timerTime]);

  /** STOPWATCH EFFECT */
  useEffect(() => {
    if (stopwatchActive) {
      stopwatchRef.current = setInterval(() => {
        setStopwatchTime((t) => t + 10);
      }, 10);
    } else {
      clearInterval(stopwatchRef.current);
    }
    return () => clearInterval(stopwatchRef.current);
  }, [stopwatchActive]);

  /** TIMER ACTIONS */
  const startTimer = () => {
    const totalSeconds = timerMinutes * 60 + timerSeconds;
    if (totalSeconds === 0) {
      toast.error("Please set a time");
      return;
    }
    setTimerTime(totalSeconds);
    setTimerFinished(false);
    setTimerActive(true);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimerFinished(false);
    setTimerTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.loop = false;
    }
  };

  const snoozeTimer = () => {
    const snoozeSeconds = 5 * 60; // 5 minutes
    const newTime = snoozeSeconds;

    setTimerTime(newTime);
    setTimerFinished(false);
    setTimerActive(true);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.loop = false;
    }

    toast.success("Snoozed for 5 minutes!");
  };

  /** STOPWATCH RESET */
  const resetStopwatch = () => {
    setStopwatchActive(false);
    setStopwatchTime(0);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const formatStopwatch = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const mm = Math.floor((ms % 1000) / 10);
    return `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}.${mm.toString().padStart(2, "0")}`;
  };

  return (
    <Tabs defaultValue="timer" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-muted/50">
        <TabsTrigger value="timer">Timer</TabsTrigger>
        <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
      </TabsList>

      {/* TIMER */}
      <TabsContent value="timer" className="space-y-4">
        <div className="text-center py-8">
          <div className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            {timerActive || timerFinished
              ? formatTime(timerTime)
              : formatTime(timerMinutes * 60 + timerSeconds)}
          </div>

          {/* Inputs only when not running */}
          {!timerActive && !timerFinished && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <Label>Minutes</Label>
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={timerMinutes}
                  onChange={(e) => setTimerMinutes(Number(e.target.value))}
                  className="bg-muted/50 text-center text-lg"
                />
              </div>
              <div>
                <Label>Seconds</Label>
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={timerSeconds}
                  onChange={(e) => setTimerSeconds(Number(e.target.value))}
                  className="bg-muted/50 text-center text-lg"
                />
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-3 justify-center">
            {/* Start/Pause */}
            <Button
              onClick={timerActive ? () => setTimerActive(false) : startTimer}
              className="bg-gradient-primary hover:opacity-90"
              size="lg"
            >
              {timerActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>

            {/* Snooze button only when timer finished */}
            {timerFinished && (
              <Button
                onClick={snoozeTimer}
                className="bg-blue-500 text-white hover:bg-blue-600"
                size="lg"
              >
                Snooze 5 min
              </Button>
            )}

            {/* Reset */}
            <Button onClick={resetTimer} variant="outline" size="lg">
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </TabsContent>

      {/* STOPWATCH */}
      <TabsContent value="stopwatch" className="space-y-4">
        <div className="text-center py-8">
          <div className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-8">
            {formatStopwatch(stopwatchTime)}
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => setStopwatchActive(!stopwatchActive)}
              className="bg-gradient-primary hover:opacity-90"
              size="lg"
            >
              {stopwatchActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>

            <Button onClick={resetStopwatch} variant="outline" size="lg">
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default TimerStopwatch;
