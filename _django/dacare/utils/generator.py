import random
import string


def generate_verify_code():
    return ''.join(random.choices(string.digits, k=6))


def generate_temp_password():
    chars = string.ascii_letters + string.digits + '!@#$%^&*'
    return ''.join(random.choices(chars, k=12))