from ..models.order import OrderStatus


def format_welcome_message(restaurant_name: str, menu_url: str) -> str:
    """Format welcome message for new customers"""
    return f"""Welcome to {restaurant_name} 🍽️
Tap to view our menu: {menu_url}"""


def format_order_confirmation(order_id: str) -> str:
    """Format order confirmation message"""
    # Extract last 4 characters of UUID for display
    order_number = order_id[-4:].upper()
    return f"""Your order (#{order_number}) has been received.
You'll get updates here 🚀"""


def format_status_update(status: OrderStatus) -> str:
    """Format order status update message"""
    messages = {
        OrderStatus.ACCEPTED: "Your order has been accepted! 🎉",
        OrderStatus.COOKING: "Your food is being cooked 🍳",
        OrderStatus.ON_THE_WAY: "Rider is on the way 🚴‍♂️",
        OrderStatus.DELIVERED: "Order delivered ✔️ Enjoy!",
        OrderStatus.CANCELLED: "Your order has been cancelled. Please contact us for details."
    }
    return messages.get(status, f"Order status updated to: {status.value}")


def format_order_summary(customer_name: str, items: list, total: float, order_type: str) -> str:
    """Format order summary for internal use"""
    items_text = "\n".join([f"- {item['name']} x{item['quantity']}" for item in items])
    return f"""New Order from {customer_name}
Type: {order_type.upper()}
Items:
{items_text}
Total: ${total:.2f}"""
