import zipfile
import re
import sys
import os

def get_docx_text(path):
    try:
        if not os.path.exists(path):
            return "File not found"
        with zipfile.ZipFile(path) as document:
            xml_content = document.read('word/document.xml').decode('utf-8')
            # Simple regex to strip tags, might need refinement for spacing
            text = re.sub('<w:p[^>]*>', '\n', xml_content) # Newlines for paragraphs
            text = re.sub('<[^<]+?>', '', text)
            return text
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    files = ["1. Case Study -Context.docx", "2. Case Study - Complement.docx", "3. Case Study - Some needs.docx"]
    for f in files:
        print(f"--- {f} ---")
        print(get_docx_text(f))
        print("\n")
