"""
Service for managing room elements.
"""

from typing import List
from core.models import Room, Element


class ElementService:
    """
    Service for managing room elements.
    """

    @staticmethod
    def reset_elements_to_default(room: Room):
        """
        Reset all room elements to a default list.
        """
        for element in room.elements.all():
            element.delete()
        default_elements = [
            Element(
                icon="sentiment.negative", name="", section=0, order=0, is_visible=True
            ),
            Element(
                icon="sentiment.neutral", name="", section=0, order=1, is_visible=True
            ),
            Element(
                icon="sentiment.positive", name="", section=0, order=2, is_visible=True
            ),
            Element(
                icon="completion.no", name="", section=0, order=3, is_visible=False
            ),
            Element(
                icon="completion.yes", name="", section=0, order=4, is_visible=False
            ),
            Element(
                icon="pace.slower", name="Slower", section=1, order=0, is_visible=False
            ),
            Element(
                icon="pace.faster", name="Faster", section=1, order=1, is_visible=False
            ),
            Element(
                icon="link",
                name="Google",
                section=2,
                order=0,
                is_visible=False,
                link="https://google.com/",
            ),
        ]
        for element in default_elements:
            element.room = room
            element.save()

    @staticmethod
    def get_elements_for_room(room: Room) -> List[Element]:
        """
        Get all elements for a room.

        Arguments:
            room: Room -- The room to get elements for

        Returns:
            List[Element] -- A list of all elements in the room
        """
        return Element.objects.filter(room=room).all()

    @staticmethod
    def get_element_by_id_for_room(element_id: int, room: Room) -> Element | None:
        """
        Get an element by its id, only if it belongs to a particular room.

        Arguments:
            element_id: int -- Element ID
            room: Room -- Room that element should belong to

        Returns:
            Element | None -- Element object, or None if it doesn't match or is wrong room
        """
        try:
            element: Element = Element.objects.get(id=element_id)
        except Element.DoesNotExist:
            return None
        if element.room != room:
            return None
        return element

    @staticmethod
    def update_element(element: Element, updates: dict):
        """
        Update an element based on a serialized update dictionary.

        Arguments:
            element: Element -- Element to update
            updates: dict -- Serialized update dictionary
        """
        fields = ["icon", "name", "section", "order", "is_visible", "link"]
        for field in fields:
            if field in updates:
                setattr(element, field, updates[field])
        element.save()

    @staticmethod
    def create_element_from_dict(room: Room, properties: dict) -> Element:
        """
        Create new element based on a dictionary of properties.

        Arguments:
            room: Room -- Room to add element to
            properties: dict -- Dictionary of properties for element
        """
        icon = properties.get("icon")
        name = properties.get("name")
        section = properties.get("section")
        order = properties.get("order")
        is_visible = properties.get("is_visible")
        link = properties.get("link")

        element = Element(
            room=room,
            icon=icon if isinstance(icon, str) else "",
            name=name if isinstance(name, str) else "",
            section=section if isinstance(section, int) else 0,
            order=order if isinstance(order, int) else 0,
            is_visible=is_visible if isinstance(is_visible, bool) else True,
            link=link if isinstance(link, str) else "",
        )
        element.save()
        return element

    @staticmethod
    def delete_element(element: Element):
        """
        Delete an element.

        Arguments:
            element: Element -- Element to delete
        """
        element.delete()
