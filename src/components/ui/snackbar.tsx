"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

type Event = {
    id: number;
    title: string;
    category: string;
    date: string;
    time: string;
    location: string;
    description: string;
    image: string;
    attendees?: number | null;
    featured?: boolean;
};

interface SnackbarProps {
    event: Event;
}

export default function Snackbar({ event }: SnackbarProps) {
    const [open, setOpen] = useState<boolean>(true);
    const [isClosing, setIsClosing] = useState<boolean>(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => setOpen(false), 300);
    };

    const handleRegister = () => {
        console.log(`Registered for: ${event.title}`);

        // Open the URL in a new tab
        window.open("https://forms.gle/wKDSxzc9jmQknyBS7", "_blank");

        // Keep the snackbar behavior
        setOpen(true);
        setTimeout(() => {
            setIsClosing(true);
            setTimeout(() => setOpen(false), 300);
        }, 4000);
    };

    return (
        <div className="relative">
            {open && (
                <Card
                    className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-lg bg-white text-black transition-all duration-300 ease-in-out
                        ${isClosing ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0 animate-slide-in"}
                    `}
                >
                    {/* Close Button */}
                    <Button
                        onClick={handleClose}
                        className="absolute top-2 right-2 w-7 h-7 p-0 text-gray-500 bg-transparent hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110 sm:top-3 sm:right-3 sm:w-8 sm:h-8"
                    >
                        <X size={16} />
                    </Button>

                    <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 p-0 w-full">
                        {/* Event Image */}
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-24 h-24 sm:w-40 sm:h-28 object-contain rounded-md sm:rounded-lg flex-shrink-0 mx-auto sm:mx-0"
                        />


                        {/* Event Info */}
                        <div className="flex flex-col justify-between flex-1 w-full">
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold">{event.title}</h3>
                                <p className="text-sm mt-1 sm:mt-2 line-clamp-3">{event.description}</p>
                            </div>

                            {/* Register Button */}

                            <Button
                                onClick={handleRegister}
                                className="mt-2 sm:mt-3 px-3 py-2 sm:px-4 sm:py-1.5 rounded-xl bg-black text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105 w-full sm:w-auto text-sm"
                            >
                                Register Now
                            </Button>

                        </div>
                    </CardContent>
                </Card>
            )}

            <style>{`
                @keyframes slide-in {
                    from { opacity: 0; transform: translateY(20px);}
                    to { opacity: 1; transform: translateY(0);}
                }
                .animate-slide-in { animation: slide-in 0.3s ease-out; }
            `}</style>
        </div>
    );
}
