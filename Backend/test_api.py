"""
Test script to verify API endpoints
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("\n🔍 Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 200

def test_get_menu():
    """Test get menu endpoint"""
    print("\n🔍 Testing get menu endpoint...")
    response = requests.get(f"{BASE_URL}/menu")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Categories: {len(data.get('categories', []))}")
    assert response.status_code == 200

def test_create_order():
    """Test create order endpoint"""
    print("\n🔍 Testing create order endpoint...")
    
    # First get menu to get item IDs
    menu_response = requests.get(f"{BASE_URL}/menu")
    menu_data = menu_response.json()
    
    if not menu_data.get('categories'):
        print("⚠️  No menu items found. Run init_db.py first.")
        return
    
    # Get first item ID
    first_category = menu_data['categories'][0]
    if not first_category.get('items'):
        print("⚠️  No items in first category.")
        return
    
    item_id = first_category['items'][0]['id']
    
    order_data = {
        "customer_name": "Test Customer",
        "customer_phone": "+1234567890",
        "delivery_address": "123 Test Street",
        "order_type": "delivery",
        "items": [
            {
                "item_id": item_id,
                "quantity": 2
            }
        ]
    }
    
    response = requests.post(
        f"{BASE_URL}/orders",
        json=order_data
    )
    print(f"Status: {response.status_code}")
    if response.status_code == 201:
        data = response.json()
        print(f"Order ID: {data['id']}")
        print(f"Total: ${data['total']}")
        return data['id']
    else:
        print(f"Error: {response.text}")

def test_get_orders():
    """Test get orders endpoint"""
    print("\n🔍 Testing get orders endpoint...")
    response = requests.get(f"{BASE_URL}/orders")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Total orders: {data.get('total', 0)}")
    assert response.status_code == 200

def run_tests():
    """Run all tests"""
    print("🚀 Starting API tests...")
    print(f"Base URL: {BASE_URL}")
    
    try:
        test_health()
        test_get_menu()
        test_get_orders()
        test_create_order()
        
        print("\n✅ All tests passed!")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to server.")
        print("Make sure the server is running on http://localhost:8000")
    except AssertionError as e:
        print(f"\n❌ Test failed: {e}")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")

if __name__ == "__main__":
    run_tests()
