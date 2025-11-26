import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Date formatting helper
const formatDate = (date: Date, formatStr: string): string => {
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    if (formatStr === "PPPP") {
        return `${days[date.getDay()]}, ${
            months[date.getMonth()]
        } ${date.getDate()}, ${date.getFullYear()}`;
    }
    if (formatStr === "PPP") {
        return `${
            months[date.getMonth()]
        } ${date.getDate()}, ${date.getFullYear()}`;
    }
    return date.toDateString();
};

export default function CalendarWithNotes() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [noteDialogOpen, setNoteDialogOpen] = useState(false);
    const [noteText, setNoteText] = useState("");

    // Load notes from sessionStorage on mount
    useEffect(() => {
        const stored = sessionStorage.getItem("calendarNotes");
        if (stored) {
            try {
                setNotes(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse notes:", e);
            }
        }
    }, []);

    // Save notes to sessionStorage
    const saveNotesToStorage = (updatedNotes: Record<string, string>) => {
        sessionStorage.setItem("calendarNotes", JSON.stringify(updatedNotes));
    };

    // Open dialog & load existing note
    const openNoteDialog = (selectedDate: Date) => {
        setDate(selectedDate);
        const key = selectedDate.toDateString();
        setNoteText(notes[key] || "");
        setNoteDialogOpen(true);
    };

    // Save note
    const handleSaveNote = () => {
        if (!date) return;
        const key = date.toDateString();

        const updatedNotes = {
            ...notes,
            [key]: noteText.trim(),
        };

        setNotes(updatedNotes);
        saveNotesToStorage(updatedNotes);
        setNoteDialogOpen(false);
    };

    // Custom day renderer
    const customDayContent = (day: Date) => {
        const key = day.toDateString();
        const hasNote = !!notes[key];
        const isToday = key === new Date().toDateString();
        const isSelected = date && key === date.toDateString();

        return (
            <div
                className={`relative w-full h-full flex flex-col p-2 rounded-md cursor-pointer transition-colors ${
                    isToday
                        ? "bg-primary text-primary-foreground font-bold"
                        : ""
                } ${
                    isSelected && !isToday
                        ? "bg-accent text-accent-foreground"
                        : ""
                } hover:bg-accent/50`}
                onClick={(e) => {
                    setDate(day)
                }}
            >
                <div className="text-sm font-medium mb-1">{day.getDate()}</div>

                {hasNote && (
                    <div
                        className={`text-[9px] px-1.5 py-0.5 rounded line-clamp-2 border-l-2 ${
                            isToday
                                ? "bg-primary-foreground/20 text-primary-foreground border-primary-foreground"
                                : "bg-primary/20 text-primary border-primary"
                        }`}
                    >
                        {notes[key]}
                    </div>
                )}
            </div>
        );
    };return <div>
     <div className="max-w-4xl mx-auto">
                <Card className="bg-gradient-card shadow-card border-border/50">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <CalendarDays className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">Calendar</CardTitle>
                        </div>
                        <CardDescription>
                            Add & view notes for any date. Today's date is
                            highlighted.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-4">
                            {/* Calendar */}
                            <div className="flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="rounded-xl border bg-card w-full"
                                    classNames={{
                                        months: "w-full",
                                        month: "w-full space-y-4",

                                        caption:
                                            "flex justify-center pt-1 relative items-center",
                                        caption_label: "text-sm font-medium",
                                        nav: "space-x-1 flex items-center",
                                        nav_button:
                                            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                                        nav_button_previous: "absolute left-1",
                                        nav_button_next: "absolute right-1",

                                        table: "w-full border-collapse",

                                        /* HEADER ROW WITH FULL COLUMN BORDERS */
                                        head_row:
                                            "grid grid-cols-7 border-t border-l border-r border-border",
                                        head_cell:
                                            "text-muted-foreground text-center font-medium py-2 border-b border-r border-border last:border-r-0",

                                        /* WEEK ROWS WITH FULL COLUMN BORDERS */
                                        row: "grid grid-cols-7 border-l border-r border-border",

                                        /* EACH CELL HAS TOP + RIGHT BORDER (LEFT BORDER inherited from row) */
                                        cell: "relative p-0 text-center text-sm h-24 flex items-start justify-start border-t border-r border-border last:border-r-0",

                                        day: "h-full w-full p-0 font-normal aria-selected:opacity-100",
                                        day_selected:
                                            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                        day_today:
                                            "bg-accent text-accent-foreground",
                                        day_outside: "opacity-50",
                                        day_disabled: "opacity-50",
                                        day_range_middle:
                                            "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                        day_hidden: "invisible",
                                    }}
                                    components={{
                                        Day: ({ date: dayDate }) =>
                                            customDayContent(dayDate),
                                    }}
                                />
                            </div>

                            {/* Selected Date Summary */}
                            {date && (
                                <div className="p-4 bg-primary/10 rounded-lg">
                                    <div className="text-sm text-muted-foreground mb-1">
                                        Selected Date
                                    </div>
                                    <div className="text-xl font-bold text-foreground">
                                        {formatDate(date, "PPPP")}
                                    </div>

                                    {/* Show saved note */}
                                    {notes[date.toDateString()] && (
                                        <div className="mt-3 bg-card p-3 rounded-lg text-sm text-foreground border">
                                            <span className="font-semibold">
                                                Note:{" "}
                                            </span>
                                            {notes[date.toDateString()]}
                                        </div>
                                    )}

                                    <Button
                                        variant="outline"
                                        className="mt-3"
                                        onClick={() => openNoteDialog(date)}
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        {notes[date.toDateString()]
                                            ? "Edit Note"
                                            : "Add Note"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Note Dialog */}
            <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {date && notes[date.toDateString()]
                                ? "Edit Note"
                                : "Add Note"}
                            {date && ` - ${formatDate(date, "PPP")}`}
                        </DialogTitle>
                        <DialogDescription>
                            Add or update your note for this date
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="note">Note</Label>
                            <Textarea
                                id="note"
                                placeholder="Write your note..."
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                className="mt-2 min-h-[120px]"
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setNoteDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleSaveNote}>Save Note</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            
</div>
}