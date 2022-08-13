from core.models import Room, Element

class ElementService:

    @staticmethod
    def reset_elements_to_default(room: Room):
        """
        Reset all room elements to a default list.
        """
        for element in room.elements.all():
            element.delete()
        default_elements = [
            Element(icon="sentiment.negative", identifier="sentiment.negative", name="", section=0, order=0, is_visible=True),
            Element(icon="sentiment.neutral", identifier="sentiment.neutral", name="", section=0, order=1, is_visible=True),
            Element(icon="sentiment.positive", identifier="sentiment.positive", name="", section=0, order=2, is_visible=True),

            Element(icon="completion.no", identifier="completion.no", name="", section=0, order=3, is_visible=False),
            Element(icon="completion.yes", identifier="completion.yes", name="", section=0, order=4, is_visible=False),

            Element(icon="pace.slower", identifier="pace.slower", name="Slower", section=1, order=0, is_visible=False),
            Element(icon="pace.faster", identifier="pace.faster", name="Faster", section=1, order=1, is_visible=False),

            Element(icon="link", identifier="link.google", name="Google", section=2, order=0, is_visible=False, link="https://google.com/"),
        ]
        for element in default_elements:
            element.room = room
            element.save()
