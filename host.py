import http.server
import socketserver
import os
from urllib.parse import urlparse

DIR = "public"
PORT = 8030

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        self.path = parsed_path.path
        
        if not self.path.endswith(".html") and "." not in self.path:
            possible_html = os.path.join(DIR, self.path.lstrip("/") + ".html")
            if os.path.exists(possible_html):
                self.path += ".html"
        
        return super().do_GET()
    
    def translate_path(self, path):
        root = os.path.abspath(DIR)
        path = path.lstrip("/")
        return os.path.join(root, path)

with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"server started at http://0.0.0.0:{PORT} at {DIR}")
    httpd.serve_forever()
