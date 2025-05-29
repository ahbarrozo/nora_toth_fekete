export interface EventProps {
    id?: number;
    dates: string[];
    location: string;
    name: string;
    link?: string;
}

export interface EventsProps {
    events: EventProps[];
}
