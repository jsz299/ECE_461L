def encrypt(inputText, n, d):
    reversedText = inputText[::-1]
    if n < 1:
        return reversedText

    encryptedText = ""

    for char in reversedText:
        if d == 1:
            shifted_char = chr((ord(char) - 32 + n) % 95 + 32)
        elif d == -1:
            shifted_char = chr((ord(char) - 32 - n) % 95 + 32)
        else:
            shifted_char = char
        encryptedText += shifted_char

    return encryptedText


def decrypt(encryptedText, n, d):
    decryptedText = ""

    # Iterate over each character in the encrypted text
    for char in encryptedText:
        if d == 1:  # If the original shift was to the right, we now shift left
            shifted_char = chr((ord(char) - 32 - n) % 95 + 32)
        elif d == -1:  # If the original shift was to the left, we now shift right
            shifted_char = chr((ord(char) - 32 + n) % 95 + 32)
        else:
            # If d is not 1 or -1, return the character as is (no shift applied)
            shifted_char = char

        # Append the shifted character to the result string
        decryptedText += shifted_char

    # Reverse the result to get the original text
    return decryptedText[::-1]
