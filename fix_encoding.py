with open('c:\\Users\\pc\\Documents\\khaledshoes\\shoes\\views.py', 'rb') as f:
    content = f.read()

content_str = content.decode('utf-8', errors='replace')
content_str = content_str.replace('G\ufffd"o\ufffdn\ufffd"o\ufffdr\ufffd"o\ufffd', 'Généré')
content_str = content_str.replace('Piov\ufffd"o\ufffd', 'Piové')
content_str = content_str.replace('HttpResponse(html)', 'HttpResponse(html, content_type="text/html; charset=utf-8")')

with open('c:\\Users\\pc\\Documents\\khaledshoes\\shoes\\views.py', 'wb') as f:
    f.write(content_str.encode('utf-8'))
