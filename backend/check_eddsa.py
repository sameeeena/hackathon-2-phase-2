import httpx
from jose import jwt, jwk
from jose.constants import ALGORITHMS
import json

def check_eddsa_support():
    print("Checking EdDSA support...")
    try:
        # Check if EdDSA is in available algorithms
        if ALGORITHMS.EdDSA in jwt.ALGORITHMS.SUPPORTED:
            print("SUCCESS: EdDSA is supported by python-jose.")
        else:
            print("FAILURE: EdDSA is NOT supported by python-jose. Install 'cryptography'.")
            
        try:
            from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey
            print("SUCCESS: cryptography Ed25519 is available.")
        except ImportError:
            print("FAILURE: cryptography library not installed or Ed25519 not available.")

    except Exception as e:
        print(f"Error checking support: {e}")

def check_jwks_connection():
    url = "http://localhost:3000/api/auth/jwks"
    print(f"\nChecking JWKS connection to {url}...")
    try:
        response = httpx.get(url, timeout=5.0)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print("JWKS Data received:")
            print(json.dumps(data, indent=2))
            
            # Try to construct a key
            if "keys" in data and len(data["keys"]) > 0:
                key_data = data["keys"][0]
                try:
                    key = jwk.construct(key_data, algorithm=ALGORITHMS.EdDSA)
                    print("SUCCESS: Successfully constructed JWK from response.")
                except Exception as e:
                    print(f"FAILURE: Could not construct JWK: {e}")
        else:
            print("FAILURE: Non-200 response from JWKS endpoint.")
    except Exception as e:
        print(f"FAILURE: Could not connect to JWKS endpoint: {e}")

if __name__ == "__main__":
    check_eddsa_support()
    check_jwks_connection()
