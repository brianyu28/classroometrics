export interface Element {
    id?: number,
    room_id: number,
    icon: string,
    identifier: string,
    name: string,
    section: number,
    order: number,
    is_visible: boolean,
    link: string,
}

export interface Room {
    id: number,
    identifier: string,
    owner_id: number,
    title: string,
    groups: Element[][],
}
